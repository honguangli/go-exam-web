import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建试题 参数
export interface CreateQuestionParam {
  question: {
    subject_id: number; // int
    name: string; // string
    type: number; // int
    content: string; // string
    tips: string; // string
    analysis: string; // string
    difficulty: number; // int
    knowledge_ids: string; // string
    score: number; // int
    memo: string; // string
  };
  options: Array<{
    question_id: number; // int
    tag: string; // string
    content: string; // string
    is_right: number; // int
    memo: string; // string
  }>;
}

// 创建试题 响应
export interface CreateQuestionResponse {
  id: number;
}

// 创建试题
export const CreateQuestion = (param: CreateQuestionParam) => {
  return http.request<ResponseBody>("post", Api.Question.Create, {
    data: genParam(param)
  });
};
