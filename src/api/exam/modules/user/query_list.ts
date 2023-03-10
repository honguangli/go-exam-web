import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { User } from "../../models/user";

// 查询用户列表 参数
export interface QueryUserListParam {
  name?: string;
  type: number;
  status: number;
  limit: number;
  offset: number;
}

// 查询用户列表 响应
export interface QueryUserListResponse {
  list: Array<User>;
  total: number;
}

// 查询用户列表
export const QueryUserList = (param: QueryUserListParam) => {
  return http.request<ResponseBody>("post", Api.User.QueryList, {
    data: genParam(param)
  });
};
