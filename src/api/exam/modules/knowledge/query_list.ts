import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Knowledge } from "../../models/knowledge";

// 查询知识点列表 参数
export interface QueryKnowledgeListParam {
  name?: string;
  type?: number;
  limit: number;
  offset: number;
}

// 查询知识点列表 响应
export interface QueryKnowledgeListResponse {
  list: Array<Knowledge>;
  total: number;
}

// 查询知识点列表
export const QueryKnowledgeList = (param: QueryKnowledgeListParam) => {
  return http.request<ResponseBody>("post", Api.Knowledge.QueryList, {
    data: genParam(param)
  });
};
