// 前缀
const prefix = "/exam/api";

// 科目
const Subject = {
  QueryList: prefix + "/subject/list",
  QueryDetail: prefix + "/subject/detail",
  Update: prefix + "/subject/update",
  Delete: prefix + "/subject/delete"
};

// 知识点
const Knowledge = {
  QueryList: prefix + "/knowledge/list",
  QueryDetail: prefix + "/knowledge/detail",
  Update: prefix + "/knowledge/update",
  Delete: prefix + "/knowledge/delete"
};

// 试题
const Question = {
  QueryList: prefix + "/question/list",
  QueryDetail: prefix + "/question/detail",
  Update: prefix + "/question/update",
  Delete: prefix + "/question/delete"
};

// 班级
const Class = {
  QueryList: prefix + "/class/list",
  QueryDetail: prefix + "/class/detail",
  Update: prefix + "/class/update",
  Delete: prefix + "/class/delete"
};

export default {
  Subject,
  Knowledge,
  Question,
  Class
};
