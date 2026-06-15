import ArticleHeader from "./quartz/components/ArticleHeader"

const header = [ArticleHeader()]

export const layoutOverrides = {
  defaults: {
    beforeBody: header,
  },
  byPageType: {
    content: {
      beforeBody: header,
    },
  },
}
