import { $t } from "@/plugins/i18n";

export default {
  path: "/exam",
  name: "考试管理",
  meta: {
    icon: "menu",
    title: $t("menus.lghExam"),
    rank: 300
  },
  children: [
    {
      path: "/exam/plan",
      name: "plan",
      component: () => import("@/views/plan/index.vue"),
      meta: {
        title: $t("menus.lghPlanList"),
        showLink: true,
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
