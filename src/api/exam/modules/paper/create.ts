import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建试卷 参数
export interface CreatePaperParam {
  name: string; // string
  score: number; // int
  pass_score: number; // int
  difficulty: number; // int
  status: number; // int
  memo: string; // string
}

// 创建试卷 响应
export interface CreatePaperResponse {
  id: number;
}

// 创建试卷
export const CreatePaper = (param: CreatePaperParam) => {
  return http.request<ResponseBody>("post", Api.Paper.Create, {
    data: genParam(param)
  });
};
