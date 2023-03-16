import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { ClassUser } from "../../models/class_user";

// 查询班级考生列表 参数
export interface QueryClassUserListParam {
  class_id: number;
  limit: number;
  offset: number;
}

// 查询班级考生列表 响应
export interface QueryClassUserListResponse {
  list: Array<ClassUser>;
  total: number;
}

// 查询班级考生列表
export const QueryClassUserList = (param: QueryClassUserListParam) => {
  return http.request<ResponseBody>("post", Api.Class.QueryUserList, {
    data: genParam(param)
  });
};
