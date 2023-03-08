import { $t } from "@/plugins/i18n";

export default {
  path: "/sys",
  name: "sys",
  meta: {
    icon: "informationLine",
    title: $t("menus.lghUser"),
    rank: 6
  },
  children: [
    {
      path: "/sys/permission",
      name: "sysPermission",
      component: () => import("@/views/subject/index.vue"),
      meta: {
        title: $t("menus.lghPermission")
      }
    },
    {
      path: "/sys/role",
      name: "sysRole",
      component: () => import("@/views/knowledge/index.vue"),
      meta: {
        title: $t("menus.lghRole")
      }
    },
    {
      path: "/sys/user",
      name: "sysUser",
      component: () => import("@/views/user/index.vue"),
      meta: {
        title: $t("menus.lghUser")
      }
    },
    {
      path: "/sys/teacher",
      name: "sysTeacher",
      component: () => import("@/views/teacher/index.vue"),
      meta: {
        title: $t("menus.lghTeacher")
      }
    },
    {
      path: "/sys/student",
      name: "sysStudent",
      component: () => import("@/views/student/index.vue"),
      meta: {
        title: $t("menus.lghStudent")
      }
    },
    {
      path: "/sys/class",
      name: "sysClass",
      component: () => import("@/views/question/index.vue"),
      meta: {
        title: $t("menus.lghClass")
      }
    }
  ]
} as RouteConfigsTable;
