import type { ResponseDocument } from "@devographics/types";
import {
  EditionMetadata,
  SectionMetadata,
  QuestionMetadata,
  DbPaths,
  SurveyStatusEnum,
} from "@devographics/types";
import { isAbsoluteUrl } from "~/lib/utils";
import { LocaleDef } from "~/i18n/typings";
import { reverseSurveyParamsLookup } from "./data";

/*

Note: we currently need to prefix all paths with the edition id

TODO: In the future, get rid of this prefix, and replace formPaths with rawPaths?

*/
export const getFormPaths = ({
  edition,
  question,
}: {
  edition: EditionMetadata;
  question: QuestionMetadata;
}): DbPaths => {
  const paths: { [key in keyof DbPaths]: string } = {};
  if (question.rawPaths) {
    (Object.keys(question.rawPaths) as Array<keyof DbPaths>).forEach((key) => {
      const path = question?.rawPaths?.[key];
      if (path) {
        paths[key] = `${edition.id}__${path}`;
      }
    });
  }
  return paths;
};

/**
 * Get the main survey image,
 * handling legacy scenario of a relative image path
 *
 * @param edition
 * @returns A relative or absolute URL of the main survey image
 */
export const getSurveyImageUrl = (edition: EditionMetadata) => {
  const { imageUrl } = edition;
  if (!imageUrl) return;
  let finalImageUrl = isAbsoluteUrl(imageUrl)
    ? imageUrl
    : // legacy behaviour
      `/surveys/${imageUrl}`;

  return finalImageUrl;
};

export const getEditionTitle = ({
  edition,
  sectionTitle,
}: {
  edition: EditionMetadata;
  sectionTitle?: string;
}) => {
  const { year, survey } = edition;
  const { name } = survey!;
  let title = `${name} ${year}`;
  if (sectionTitle) {
    title += `: ${sectionTitle}`;
  }
  return title;
};

export function getEditionSectionPath({
  edition,
  locale,
  forceReadOnly,
  response,
  page,
  number,
}: {
  // we only need basic info about the survey
  edition: EditionMetadata;
  /** [state-of-js, 2022] */
  locale: LocaleDef;
  // forceReadOnly (no response needed in this case)
  forceReadOnly?: boolean;
  // section
  // TODO: why sometimes we have "id" vs "_id"? (_id coming from Mongo, id from Vulcan probably)
  response?: Partial<Pick<ResponseDocument, "_id">>;
  number?: any;
  page?: "thanks";
}) {
  const { surveySlug, editionSlug } = reverseSurveyParamsLookup({
    surveyId: edition.survey.id,
    editionId: edition.id,
  });
  const pathSegments = [locale.id, "survey", surveySlug, editionSlug];
  // survey home
  const readOnly =
    forceReadOnly ||
    !edition.status ||
    [SurveyStatusEnum.CLOSED].includes(edition.status);

  if (readOnly) {
    const readOnlySegment = "read-only";
    pathSegments.push(readOnlySegment);
  } else {
    if (!response) throw new Error("Undefined response");
    const responseSegment = response._id;
    if (!responseSegment) {
      console.log(response);
      throw new Error(
        "Response object has no id or _id. We may have failed to load your response from server."
      );
    }
    pathSegments.push(responseSegment);
  }
  const suffixSegment = page || number || 1;
  pathSegments.push(suffixSegment);
  const path = pathSegments.join("/");
  return `/${path}`;
}

export const getSectionKey = (section: SectionMetadata, keyType = "title") =>
  `sections.${section.intlId || section.id}.${keyType}`;

export function getEditionHomePath({
  edition,
  locale,
}: {
  edition: EditionMetadata;
  locale: LocaleDef;
}) {
  const { surveySlug, editionSlug } = reverseSurveyParamsLookup({
    surveyId: edition.survey.id,
    editionId: edition.id,
  });
  const prefixSegment = "survey";
  return "/" + [locale.id, prefixSegment, surveySlug, editionSlug].join("/");
}

export const getEditionQuestions = (edition: EditionMetadata) =>
  edition.sections.map((s) => s.questions).flat();