// 前缀
const prefix = "/exam/api";

// 科目
const Subject = {
  QueryList: prefix + "/subject/list",
  QueryDetail: prefix + "/subject/detail",
  Create: prefix + "/subject/create",
  Update: prefix + "/subject/update",
  Delete: prefix + "/subject/delete"
};

// 知识点
const Knowledge = {
  QueryList: prefix + "/knowledge/list",
  QueryDetail: prefix + "/knowledge/detail",
  Create: prefix + "/knowledge/create",
  Update: prefix + "/knowledge/update",
  Delete: prefix + "/knowledge/delete"
};

// 试题
const Question = {
  QueryList: prefix + "/question/list",
  QueryDetail: prefix + "/question/detail",
  Create: prefix + "/question/create",
  Update: prefix + "/question/update",
  Delete: prefix + "/question/delete"
};

// 试卷
const Paper = {
  QueryList: prefix + "/paper/list",
  QueryDetail: prefix + "/paper/detail",
  Create: prefix + "/paper/create",
  Update: prefix + "/paper/update",
  Delete: prefix + "/paper/delete"
};

// 考试计划
const Plan = {
  QueryList: prefix + "/plan/list",
  QueryDetail: prefix + "/plan/detail",
  Create: prefix + "/plan/create",
  Update: prefix + "/plan/update",
  Delete: prefix + "/plan/delete"
};

// 权限
const Permission = {
  QueryList: prefix + "/permission/list",
  QueryAll: prefix + "/permission/all",
  QueryDetail: prefix + "/permission/detail",
  Create: prefix + "/permission/create",
  Update: prefix + "/permission/update",
  Delete: prefix + "/permission/delete"
};

// 角色
const Role = {
  QueryList: prefix + "/role/list",
  QueryAll: prefix + "/role/all",
  QueryDetail: prefix + "/role/detail",
  Create: prefix + "/role/create",
  Update: prefix + "/role/update",
  Delete: prefix + "/role/delete",
  QueryPermissionList: prefix + "/role/permission/list",
  AuthPermission: prefix + "/role/permission/auth"
};

// 用户
const User = {
  QueryList: prefix + "/user/list",
  QueryDetail: prefix + "/user/detail",
  Create: prefix + "/user/create",
  Update: prefix + "/user/update",
  Delete: prefix + "/user/delete",
  UpdateType: prefix + "/user/update_type",
  UpdatePassword: prefix + "/user/update_password",
  QueryRoleList: prefix + "/user/role/list",
  AuthRole: prefix + "/user/role/auth"
};

// 班级
const Class = {
  QueryList: prefix + "/class/list",
  QueryDetail: prefix + "/class/detail",
  Create: prefix + "/class/create",
  Update: prefix + "/class/update",
  UpdateUser: prefix + "/class/user",
  Delete: prefix + "/class/delete"
};

export default {
  Subject,
  Knowledge,
  Question,
  Paper,
  Plan,
  Permission,
  Role,
  User,
  Class
};
