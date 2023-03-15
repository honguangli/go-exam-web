import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建考试计划 参数
export interface CreatePlanParam {
  name: string; // string
  paper_id: number; // int
  start_time: number; // int
  end_time: number; // int
  duration: number; // int
  publish_time: number; // int
  status: number; // int
  query_grade: number; // int
  memo: string; // string
}

// 创建考试计划 响应
export interface CreatePlanResponse {
  id: number;
}

// 创建考试计划
export const CreatePlan = (param: CreatePlanParam) => {
  return http.request<ResponseBody>("post", Api.Plan.Create, {
    data: genParam(param)
  });
};
