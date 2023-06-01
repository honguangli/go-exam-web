// 试卷试题
export type PaperQuestion = {
  id: number; // int
  paper_id: number; // int
  origin_id: number; // int
  subject_id: number; // int
  name: string; // string
  type: number; // int
  content: string; // string
  tips: string; // string
  analysis: string; // string
  difficulty: number; // int
  knowledge_ids: string; // string
  score: number; // int
  update_time: number; // int
  memo: string; // string
};
