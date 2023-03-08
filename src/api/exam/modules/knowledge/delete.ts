import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除知识点 参数
export interface DeleteKnowledgeParam {
  id?: number;
  list?: Array<number>;
}

// 删除知识点 响应
export interface DeleteKnowledgeResponse {
  num: number;
}

// 删除知识点
export const DeleteKnowledge = (param: DeleteKnowledgeParam) => {
  return http.request<ResponseBody>("post", Api.Knowledge.Delete, {
    data: genParam(param)
  });
};
