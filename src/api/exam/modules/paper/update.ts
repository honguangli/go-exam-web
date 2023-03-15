import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新试卷 参数
export interface UpdatePaperParam {
  id: number; // int
  name: string; // string
  status: number; // int
  memo: string; // string
}

// 更新试卷 响应
export type UpdatePaperResponse = {};

// 更新试卷
export const UpdatePaper = (param: UpdatePaperParam) => {
  return http.request<ResponseBody>("post", Api.Paper.Update, {
    data: genParam(param)
  });
};
