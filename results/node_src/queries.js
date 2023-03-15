const _ = require('lodash')

export const getLocalesQuery = (localeIds, contexts, loadStrings = true) => {
    const args = []
    if (localeIds.length > 0) {
        args.push(`localeIds: [${localeIds.map(id => `"${id}"`).join(',')}]`)
    }
    if (contexts.length > 0) {
        args.push(`contexts: [${contexts.join(', ')}]`)
    }

    const argumentsString = args.length > 0 ? `(${args.join(', ')})` : ''

    return `
query {
    internalAPI {
        locales${argumentsString} {
            completion
            id
            label
            ${
                loadStrings
                    ? `strings {
                key
                t
                tHtml
                tClean
                context
                isFallback
            }`
                    : ''
            }
            translators
        }
    }
}
`
}

export const getMetadataQuery = ({ surveyId, editionId }) => {
    return `
query {
    dataAPI {
        ${surveyId} {
            _metadata {
                domain
                id
                name
            }
            ${editionId} {
                _metadata {
                    id
                    year
                    status
                    started_at
                    ended_at
                    questions_url
                    results_url
                    image_url
                    favicon_url
                    social_image_url
                    sections {
                        id
                        questions {
                        entity {
                            name
                            nameClean
                            nameHtml
                        }
                        options {
                            entity {
                            name
                            nameClean
                            nameHtml
                            }
                            id
                        }
                        id
                        }
                    }
                }
            }
        }
    }
}`
}

export const getDefaultQuery = ({ surveyId, editionId, sectionId, questionId }) => `
query ${editionId}${_.capitalize(questionId)}Query {
    surveys {
      ${surveyId} {
        ${editionId} {
          ${sectionId} {
            ${questionId} {
              id
              responses {
                current_edition {
                  completion {
                    count
                    percentage_survey
                    total
                  }
                  editionId
                  buckets {
                    count
                    id
                    percentage_question
                    percentage_survey
                  }
                }
              }
            }
          }
        }
      }
    }
  }`
