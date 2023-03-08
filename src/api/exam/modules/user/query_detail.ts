import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { User } from "../../models/user";

// 查询用户详情 参数
export interface QueryUserDetailParam {
  id: number;
}

// 查询用户详情 响应
export interface QueryUserDetailResponse {
  detail: User;
}

// 查询用户详情
export const QueryUserDetail = (param: QueryUserDetailParam) => {
  return http.request<ResponseBody>("post", Api.User.QueryDetail, {
    data: genParam(param)
  });
};
