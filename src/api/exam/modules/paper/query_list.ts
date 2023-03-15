import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Paper } from "../../models/paper";

// 查询试卷列表 参数
export interface QueryPaperListParam {
  name?: string;
  status: number;
  limit: number;
  offset: number;
}

// 查询试卷列表 响应
export interface QueryPaperListResponse {
  list: Array<Paper>;
  total: number;
}

// 查询试卷列表
export const QueryPaperList = (param: QueryPaperListParam) => {
  return http.request<ResponseBody>("post", Api.Paper.QueryList, {
    data: genParam(param)
  });
};
