import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 发布试卷 参数
export interface PublishPaperParam {
  id: number; // int
}

// 发布试卷 响应
export type PublishPaperResponse = {};

// 发布试卷
export const PublishPaper = (param: PublishPaperParam) => {
  return http.request<ResponseBody>("post", Api.Paper.Publish, {
    data: genParam(param)
  });
};
