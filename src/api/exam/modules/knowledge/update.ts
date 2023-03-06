import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新知识点信息 参数
export interface UpdateKnowledgeParam {
  name: string; // string
  desc: string; // string
}

// 更新知识点信息 响应
export interface UpdateKnowledgeResponse {}

// 更新知识点信息
export const UpdateKnowledge = (param: UpdateKnowledgeParam) => {
  return http.request<ResponseBody>("post", Api.Knowledge.Update, {
    data: genParam(param)
  });
};
