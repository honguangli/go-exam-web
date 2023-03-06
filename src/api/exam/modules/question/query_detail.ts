import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Question } from "../../models/question";

// 查询试题详情 参数
export interface QueryQuestionDetailParam {
  id: number;
}

// 查询试题详情 响应
export interface QueryQuestionDetailResponse {
  detail: Question;
}

// 查询试题详情
export const QueryQuestionDetail = (param: QueryQuestionDetailParam) => {
  return http.request<ResponseBody>("post", Api.Question.QueryDetail, {
    data: genParam(param)
  });
};
