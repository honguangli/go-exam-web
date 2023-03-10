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
      component: () => import("@/views/sys/permission/index.vue"),
      meta: {
        title: $t("menus.lghPermission"),
        showLink: true,
        showParent: true
      }
    },
    {
      path: "/sys/role",
      name: "sysRole",
      component: () => import("@/views/sys/role/index.vue"),
      meta: {
        title: $t("menus.lghRole"),
        showLink: true
      }
    },
    {
      path: "/sys/user",
      name: "sysUser",
      component: () => import("@/views/sys/user/index.vue"),
      meta: {
        title: $t("menus.lghUser"),
        showLink: true
      }
    },
    {
      path: "/sys/teacher",
      name: "sysTeacher",
      component: () => import("@/views/sys/teacher/index.vue"),
      meta: {
        title: $t("menus.lghTeacher"),
        showLink: true
      }
    },
    {
      path: "/sys/student",
      name: "sysStudent",
      component: () => import("@/views/sys/student/index.vue"),
      meta: {
        title: $t("menus.lghStudent"),
        showLink: true
      }
    },
    {
      path: "/sys/class",
      name: "sysClass",
      component: () => import("@/views/sys/class/index.vue"),
      meta: {
        title: $t("menus.lghClass"),
        showLink: true
      }
    }
  ]
} as RouteConfigsTable;
