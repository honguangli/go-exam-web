import { $t } from "@/plugins/i18n";

export default {
  path: "/exam",
  name: "考试管理",
  meta: {
    icon: "informationLine",
    title: $t("menus.lghExam"),
    rank: 3
  },
  children: [
    {
      path: "/paper",
      name: "paper",
      component: () => import("@/views/subject/index.vue"),
      meta: {
        title: $t("menus.lghPaper")
      }
    },
    {
      path: "/plan",
      name: "plan",
      component: () => import("@/views/knowledge/index.vue"),
      meta: {
        title: $t("menus.lghPlan")
      }
    }
  ]
} as RouteConfigsTable;
