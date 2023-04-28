import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建试卷 参数
export interface GenPaperParam {
  name: string;
  subject_id: number;
  knowledge_ids: string;
  score: number;
  pass_score: number;
  difficulty: number;
  choice_single_num: number;
  choice_single_score: number;
  choice_multi_num: number;
  choice_multi_score: number;
  judge_num: number;
  judge_score: number;
  blank_single_num: number;
  blank_single_score: number;
  blank_multi_num: number;
  blank_multi_score: number;
  answer_single_num: number;
  answer_single_score: number;
  answer_multi_num: number;
  answer_multi_score: number;
  memo: string;
}

// 创建试卷 响应
export interface GenPaperResponse {
  id: number;
}

// 创建试卷
export const GenPaper = (param: GenPaperParam) => {
  return http.request<ResponseBody>("post", Api.Paper.Gen, {
    data: genParam(param)
  });
};
