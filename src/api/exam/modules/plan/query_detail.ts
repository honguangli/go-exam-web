import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Plan } from "../../models/plan";

// 查询考试计划详情 参数
export interface QueryPlanDetailParam {
  id: number;
}

// 查询考试计划详情 响应
export interface QueryPlanDetailResponse {
  detail: Plan;
}

// 查询考试计划详情
export const QueryPlanDetail = (param: QueryPlanDetailParam) => {
  return http.request<ResponseBody>("post", Api.Plan.QueryDetail, {
    data: genParam(param)
  });
};
