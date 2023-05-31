import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 发布考试计划 参数
export interface PublishPlanParam {
  id: number; // int
}

// 发布考试计划 响应
export type PublishPlanResponse = {};

// 发布考试计划
export const PublishPlan = (param: PublishPlanParam) => {
  return http.request<ResponseBody>("post", Api.Plan.Publish, {
    data: genParam(param)
  });
};
