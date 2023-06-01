import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Grade } from "../../models/grade";
import { PaperQuestion } from "../../models/paper_question";
import { PaperQuestionOption } from "../../models/paper_question_option";

// 开始考试 参数
export interface StartExamParam {
  id: number;
  user_name: string;
}

// 开始考试 响应
export interface StartExamResponse {
  detail: Grade;
  question_list: Array<PaperQuestion>;
  option_list: Array<PaperQuestionOption>;
}

// 开始考试
export const StartExam = (param: StartExamParam) => {
  return http.request<ResponseBody>("post", Api.Exam.Start, {
    data: genParam(param)
  });
};
