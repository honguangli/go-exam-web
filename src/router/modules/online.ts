// import { $t } from "@/plugins/i18n";

export default {
  path: "/online",
  name: "在线考试",
  meta: {
    icon: "menu",
    title: "在线考试",
    rank: 600
  },
  children: [
    {
      path: "/onlinesubject",
      name: "online_subject",
      component: () => import("@/views/online/subject/index.vue"),
      meta: {
        title: "待考科目",
        showLink: true,
        showParent: true
      }
    },
    {
      path: "/onlineexam",
      name: "online_exam",
      component: () => import("@/views/online/exam/index.vue"),
      meta: {
        title: "在线考试",
        showLink: false,
        showParent: true,
        hiddenTag: false
      }
    },
    {
      path: "/onlinegrade",
      name: "online_grade",
      component: () => import("@/views/online/grade/index.vue"),
      meta: {
        title: "查询成绩",
        showLink: true,
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
