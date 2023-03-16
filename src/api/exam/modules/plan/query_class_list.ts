import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { PlanClass } from "../../models/plan_class";

// 查询考试班级列表 参数
export interface QueryPlanClassListParam {
  plan_id: number;
  limit: number;
  offset: number;
}

// 查询考试班级列表 响应
export interface QueryPlanClassListResponse {
  list: Array<PlanClass>;
  total: number;
}

// 查询考试班级列表
export const QueryPlanClassList = (param: QueryPlanClassListParam) => {
  return http.request<ResponseBody>("post", Api.Plan.QueryClassList, {
    data: genParam(param)
  });
};
