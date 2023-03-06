import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Class } from "../../models/class";

// 查询班级详情 参数
export interface QueryClassDetailParam {
  id: number;
}

// 查询班级详情 响应
export interface QueryClassDetailResponse {
  detail: Class;
}

// 查询班级详情
export const QueryClassDetail = (param: QueryClassDetailParam) => {
  return http.request<ResponseBody>("post", Api.Class.QueryDetail, {
    data: genParam(param)
  });
};
