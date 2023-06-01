import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { AnswerItem } from "../../models/answer_item";

// 提交答题卡 参数
export interface SubmitExamParam {
  id: number;
  user_name: string;
  answers: Array<AnswerItem>;
}

// 提交答题卡 响应
// export interface SubmitExamResponse {}

// 提交答题卡
export const SubmitExam = (param: SubmitExamParam) => {
  return http.request<ResponseBody>("post", Api.Exam.Submit, {
    data: genParam(param)
  });
};
