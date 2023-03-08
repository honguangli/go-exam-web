import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新知识点信息 参数
export interface UpdateKnowledgeParam {
  id: number;
  name: string;
  desc: string;
}

// 更新知识点信息 响应
export type UpdateKnowledgeResponse = {};

// 更新知识点信息
export const UpdateKnowledge = (param: UpdateKnowledgeParam) => {
  return http.request<ResponseBody>("post", Api.Knowledge.Update, {
    data: genParam(param)
  });
};
