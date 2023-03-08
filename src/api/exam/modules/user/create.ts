import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { UserStatus, UserType } from "../../models/user";

// 创建用户 参数
export interface CreateUserParam {
  name: string; // string
  password: string; // string
  type: UserType; // int
  true_name: string; // string
  mobile: string; // string
  email: string; // string
  status: UserStatus; // int
  memo: string; // string
}

// 创建用户 响应
export interface CreateUserResponse {
  id: number;
}

// 创建用户
export const CreateUser = (param: CreateUserParam) => {
  return http.request<ResponseBody>("post", Api.User.Create, {
    data: genParam(param)
  });
};
