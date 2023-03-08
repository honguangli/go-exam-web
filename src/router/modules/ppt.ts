import { ppt } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/ppt",
  redirect: "/ppt/index",
  meta: {
    icon: "ppt",
    title: "PPT",
    showLink: false,
    rank: ppt
  },
  children: [
    {
      path: "/ppt/index",
      name: "FramePpt",
      component: IFrame,
      meta: {
        title: "PPT",
        frameSrc: "https://pipipi-pikachu.github.io/PPTist/",
        frameLoading: false
      }
    }
  ]
} as RouteConfigsTable;
