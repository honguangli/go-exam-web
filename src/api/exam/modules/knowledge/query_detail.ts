import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Knowledge } from "../../models/knowledge";

// 查询知识点详情 参数
export interface QueryKnowledgeDetailParam {
  id: number;
}

// 查询知识点详情 响应
export interface QueryKnowledgeDetailResponse {
  detail: Knowledge;
}

// 查询知识点详情
export const QueryKnowledgeDetail = (param: QueryKnowledgeDetailParam) => {
  return http.request<ResponseBody>("post", Api.Knowledge.QueryDetail, {
    data: genParam(param)
  });
};
