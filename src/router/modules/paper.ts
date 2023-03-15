import { $t } from "@/plugins/i18n";

export default {
  path: "/paper",
  name: "试卷管理",
  meta: {
    icon: "menu",
    title: $t("menus.lghPaper"),
    rank: 200
  },
  children: [
    {
      path: "/paper/list",
      name: "paper",
      component: () => import("@/views/paper/index.vue"),
      meta: {
        title: $t("menus.lghPaperList"),
        showLink: true,
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
