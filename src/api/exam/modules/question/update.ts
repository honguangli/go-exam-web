import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新试题 参数
export interface UpdateQuestionParam {
  id: number; // int
  subject_id: number; // int
  name: string; // string
  type: number; // int
  content: string; // string
  tips: string; // string
  analysis: string; // string
  difficulty: number; // int
  knowledge_ids: string; // string
  score: number; // int
  status: number; // int
  memo: string; // string
}

// 更新试题 响应
export type UpdateQuestionResponse = {};

// 更新试题
export const UpdateQuestion = (param: UpdateQuestionParam) => {
  return http.request<ResponseBody>("post", Api.Question.Update, {
    data: genParam(param)
  });
};
