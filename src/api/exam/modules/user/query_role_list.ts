import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { UserRoleRel } from "../../models/user_role_rel";

// 查询用户角色 参数
export interface QueryUserRoleListParam {
  user_id: number;
}

// 查询用户角色 响应
export interface QueryUserRoleListResponse {
  list: Array<UserRoleRel>;
  total: number;
}

// 查询用户角色
export const QueryUserRoleList = (param: QueryUserRoleListParam) => {
  return http.request<ResponseBody>("post", Api.User.QueryRoleList, {
    data: genParam(param)
  });
};
