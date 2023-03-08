import { $t } from "@/plugins/i18n";

export default {
  path: "/data",
  name: "题库管理",
  meta: {
    icon: "informationLine",
    title: $t("menus.lghExamDB"),
    rank: 1
  },
  children: [
    {
      path: "/subject",
      name: "subject",
      component: () => import("@/views/subject/index.vue"),
      meta: {
        title: $t("menus.lghSubject")
      }
    },
    {
      path: "/knowledge",
      name: "knowledge",
      component: () => import("@/views/knowledge/index.vue"),
      meta: {
        title: $t("menus.lghKnowledge")
      }
    },
    {
      path: "/question",
      name: "question",
      component: () => import("@/views/question/index.vue"),
      meta: {
        title: $t("menus.lghQuestion")
      }
    }
  ]
} as RouteConfigsTable;
