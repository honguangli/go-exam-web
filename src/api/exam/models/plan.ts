// 考试计划
export type Plan = {
  id: number; // int
  name: string; // string
  paper_id: number; // int
  start_time: number; // int
  end_time: number; // int
  duration: number; // int
  publish_time: number; // int
  status: number; // int
  query_grade: number; // int
  create_time: number; // int
  update_time: number; // int
  memo: string; // string
};

// 状态
export enum PlanStatus {
  Draft,
  Running,
  Cancel,
  End
}
