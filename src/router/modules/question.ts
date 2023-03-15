import { $t } from "@/plugins/i18n";

export default {
  path: "/data",
  name: "题库管理",
  meta: {
    icon: "menu",
    title: $t("menus.lghExamDB"),
    rank: 100
  },
  children: [
    {
      path: "/subject",
      name: "subject",
      component: () => import("@/views/subject/index.vue"),
      meta: {
        title: $t("menus.lghSubject"),
        showLink: true,
        showParent: true
      }
    },
    {
      path: "/knowledge",
      name: "knowledge",
      component: () => import("@/views/knowledge/index.vue"),
      meta: {
        title: $t("menus.lghKnowledge"),
        showLink: true,
        showParent: true
      }
    },
    {
      path: "/question",
      name: "question",
      component: () => import("@/views/question/index.vue"),
      meta: {
        title: $t("menus.lghQuestion"),
        showLink: true,
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
