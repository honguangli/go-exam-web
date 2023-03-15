import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除试卷 参数
export interface DeletePaperParam {
  id?: number;
  list?: Array<number>;
}

// 删除试卷 响应
export interface DeletePaperResponse {
  num: number;
}

// 删除试卷
export const DeletePaper = (param: DeletePaperParam) => {
  return http.request<ResponseBody>("post", Api.Paper.Delete, {
    data: genParam(param)
  });
};
