import ArticleHeader from "./quartz/components/ArticleHeader"
import ActivityHeatmap from "./quartz/components/ActivityHeatmap"
import Graph from "./.quartz/plugins/graph/src/components/Graph"
import TableOfContents from "./.quartz/plugins/table-of-contents/src/components/TableOfContents"
import Backlinks from "./.quartz/plugins/backlinks/src/components/Backlinks"

const header = [ArticleHeader()]
const heatmap = ActivityHeatmap()
const beforeBody = header

const rightSidebar = [heatmap, Graph(), TableOfContents(), Backlinks()]

export const layoutOverrides = {
  defaults: {
    beforeBody,
    right: rightSidebar,
  },
  byPageType: {
    content: {
      beforeBody,
      right: rightSidebar,
    },
    folder: {
      beforeBody,
    },
  },
}
