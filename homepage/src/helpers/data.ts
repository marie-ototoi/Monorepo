import getQuery from '../data/query'

export const dataFetcher = {
    data: {},
    _init: async function () {
        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: getQuery(import.meta.env.SURVEY)
            })
        })

        const json = await response.json()
        if (json.errors) {
            throw new Error(json.errors[0].message)
        }
        // const { surveys, locales } = json.data

        this.data = json.data

        // json.data.locales.map(locale => ({ params: { localeId: locale.id }, props: { locale, locales, surveys } }))
    },
    async getData() {
        if (!this.data) await this._init()
        return this.data
    }
    // async getLocales() {
    //   if (!this.cache.locales) await this._init()
    //   return this.cache.locales;
    // },
    // async getSurveys() {
    //  if (!this.cache.surveys) await this._init()
    //  return this.cache.surveys
    // },
    // async getSurvey(id) {
    //   if (!this.cache.surveys) await this._init();
    //   const survey = this.cache.surveys.find(id);
    // }
}