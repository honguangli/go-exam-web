import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新考试计划 参数
export interface UpdatePlanParam {
  id: number; // int
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

// 更新考试计划 响应
export type UpdatePlanResponse = {};

// 更新考试计划
export const UpdatePlan = (param: UpdatePlanParam) => {
  return http.request<ResponseBody>("post", Api.Plan.Update, {
    data: genParam(param)
  });
};
