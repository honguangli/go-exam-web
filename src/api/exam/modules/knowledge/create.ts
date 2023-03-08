import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建知识点 参数
export interface CreateKnowledgeParam {
  name: string;
  desc: string;
}

// 创建知识点 响应
export interface CreateKnowledgeResponse {
  id: number;
}

// 创建知识点
export const CreateKnowledge = (param: CreateKnowledgeParam) => {
  return http.request<ResponseBody>("post", Api.Knowledge.Create, {
    data: genParam(param)
  });
};
