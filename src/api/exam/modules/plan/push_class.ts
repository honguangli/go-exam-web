import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 添加考试班级 参数
export interface PushPlanClassParam {
  plan_id: number;
  class_list: Array<number>;
}

// 添加考试班级 响应
export interface PushPlanClassResponse {
  num: number;
}

// 添加考试班级
export const PushPlanClass = (param: PushPlanClassParam) => {
  return http.request<ResponseBody>("post", Api.Plan.PushClass, {
    data: genParam(param)
  });
};
