import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除考试班级 参数
export interface DeletePlanClassParam {
  id?: number;
  list?: Array<number>;
}

// 删除考试班级 响应
export interface DeletePlanClassResponse {
  num: number;
}

// 删除考试班级
export const DeletePlanClass = (param: DeletePlanClassParam) => {
  return http.request<ResponseBody>("post", Api.Plan.DeleteClass, {
    data: genParam(param)
  });
};
