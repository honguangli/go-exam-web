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

// 权限
const Permission = {
  QueryList: prefix + "/permission/list",
  QueryDetail: prefix + "/permission/detail",
  Create: prefix + "/permission/create",
  Update: prefix + "/permission/update",
  Delete: prefix + "/permission/delete"
};

// 角色
const Role = {
  QueryList: prefix + "/role/list",
  QueryDetail: prefix + "/role/detail",
  Create: prefix + "/role/create",
  Update: prefix + "/role/update",
  UpdatePermission: prefix + "/role/permission",
  Delete: prefix + "/role/delete"
};

// 用户
const User = {
  QueryList: prefix + "/user/list",
  QueryDetail: prefix + "/user/detail",
  Create: prefix + "/user/create",
  Update: prefix + "/user/update",
  UpdateRole: prefix + "/user/role",
  Delete: prefix + "/user/delete"
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
  Permission,
  Role,
  User,
  Class
};
