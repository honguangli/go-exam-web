import { $t } from "@/plugins/i18n";

export default {
  path: "/question",
  name: "题库管理",
  meta: {
    icon: "informationLine",
    title: $t("menus.hsExam"),
    rank: 1
  },
  children: [
    {
      path: "/list",
      name: "试题管理",
      component: () => import("@/views/question/index.vue"),
      meta: {
        title: $t("menus.hsQuestion")
      }
    },
    {
      path: "/list2",
      name: "试题管理2",
      component: () => import("@/views/question/index.vue"),
      meta: {
        title: $t("menus.hsQuestion")
      }
    }
  ]
} as RouteConfigsTable;
