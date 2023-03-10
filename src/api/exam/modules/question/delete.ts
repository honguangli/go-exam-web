import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除试题 参数
export interface DeleteQuestionParam {
  id?: number;
  list?: Array<number>;
}

// 删除试题 响应
export interface DeleteQuestionResponse {
  num: number;
}

// 删除试题
export const DeleteQuestion = (param: DeleteQuestionParam) => {
  return http.request<ResponseBody>("post", Api.Question.Delete, {
    data: genParam(param)
  });
};
