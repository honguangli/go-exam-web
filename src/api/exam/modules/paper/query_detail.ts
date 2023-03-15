import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Paper } from "../../models/paper";

// 查询试卷详情 参数
export interface QueryPaperDetailParam {
  id: number;
}

// 查询试卷详情 响应
export interface QueryPaperDetailResponse {
  detail: Paper;
}

// 查询试卷详情
export const QueryPaperDetail = (param: QueryPaperDetailParam) => {
  return http.request<ResponseBody>("post", Api.Paper.QueryDetail, {
    data: genParam(param)
  });
};
