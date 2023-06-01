// 试卷试题选项
export type PaperQuestionOption = {
  id: number; // int
  paper_id: number; // int
  question_id: number; // int
  tag: string; // string
  content: string; // string
  is_right: number; // int
  memo: string; // string
};
