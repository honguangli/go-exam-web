// 试卷
export type Paper = {
  id: number; // int
  name: string; // string
  score: number; // int
  pass_score: number; // int
  difficulty: number; // int
  status: number; // int
  create_time: number; // int
  update_time: number; // int
  memo: string; // string
};

// 状态
export enum PaperStatus {
  Draft,
  Release
}

// 格式化状态文本
export const formatPaperStatusText = (v: PaperStatus) => {
  switch (v) {
    case PaperStatus.Draft:
      return "未发布";
    case PaperStatus.Release:
      return "已发布";
    default:
      return "异常";
  }
};

// 获取状态标签
export const getPaperStatusTagType = (v: PaperStatus) => {
  switch (v) {
    case PaperStatus.Draft:
      return "";
    case PaperStatus.Release:
      return "success";
    default:
      return "warning";
  }
};
