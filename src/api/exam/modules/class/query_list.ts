import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Class, ClassStatus } from "../../models/class";

// 查询班级列表 参数
export interface QueryClassListParam {
  name?: string;
  status?: ClassStatus;
  limit: number;
  offset: number;
}

// 查询班级列表 响应
export interface QueryClassListResponse {
  list: Array<Class>;
  total: number;
}

// 查询班级列表
export const QueryClassList = (param: QueryClassListParam) => {
  return http.request<ResponseBody>("post", Api.Class.QueryList, {
    data: genParam(param)
  });
};
