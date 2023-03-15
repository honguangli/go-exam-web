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
