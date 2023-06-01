// 答题卡项目
export type AnswerItem = {
  id: number; // int
  answer_id: number; // int
  question_id: number; // int
  option_ids: string; // int
  content: string; // string
  check: number; // int
  score: number; // int
  memo: string; // string
};

// 状态
export enum AnswerItemCheck {
  UnCheck, // 未评分
  Checked // 已评分
}
