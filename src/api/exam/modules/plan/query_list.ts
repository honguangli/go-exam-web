import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Plan } from "../../models/plan";

// 查询考试计划列表 参数
export interface QueryPlanListParam {
  name?: string;
  status: number;
  limit: number;
  offset: number;
}

// 查询考试计划列表 响应
export interface QueryPlanListResponse {
  list: Array<Plan>;
  total: number;
}

// 查询考试计划列表
export const QueryPlanList = (param: QueryPlanListParam) => {
  return http.request<ResponseBody>("post", Api.Plan.QueryList, {
    data: genParam(param)
  });
};
