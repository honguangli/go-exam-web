import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除考试计划 参数
export interface DeletePlanParam {
  id?: number;
  list?: Array<number>;
}

// 删除考试计划 响应
export interface DeletePlanResponse {
  num: number;
}

// 删除考试计划
export const DeletePlan = (param: DeletePlanParam) => {
  return http.request<ResponseBody>("post", Api.Plan.Delete, {
    data: genParam(param)
  });
};
