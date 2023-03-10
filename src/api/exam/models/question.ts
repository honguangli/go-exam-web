// 试题
export type Question = {
  id: number; // int
  subject_id: number; // int
  name: string; // string
  type: number; // int
  content: string; // string
  tips: string; // string
  analysis: string; // string
  difficulty: number; // int
  knowledge_ids: string; // string
  score: number; // int
  status: number; // int
  create_time: number; // int
  update_time: number; // int
  memo: string; // string
};

// 类型
export enum QuestionType {
  ChoiceSingle = 1, // 单选题
  ChoiceMulti = 2, // 多选题
  Judge = 3, // 判断题
  BlankSingle = 4, // 填空题
  BlankMulti = 5, // 多项填空题
  AnswerSingle = 6, // 简答题
  AnswerMulti = 7, // 多项简答题
  FileSingle = 8, // 文件题
  FileMulti = 9 // 多项文件题
}

// 状态
export enum QuestionStatus {
  Disable,
  Enable
}
