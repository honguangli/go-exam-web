// 试题
export type QuestionOption = {
  id: number; // int
  question_id: number; // int
  tag: string; // string
  content: string; // string
  is_right: number; // int
  memo: string; // string
};

// 是否正确
export enum QuestionOptionResult {
  Wrong,
  Right
}
