// 成绩
export type Grade = {
  id: number; // int
  plan_id: number; // int
  paper_id: number; // int
  user_id: number; // int
  score: number; // int
  objective_score: number; // int
  subjective_score: number; // int
  status: number; // int
  start_time: number; // int
  end_time: number; // int
  duration: number; // int
  memo: string; // string
  plan_name: string; // string
  plan_start_time: number; // int
  plan_end_time: number; // int
  plan_duration: number; // int
  plan_status: number; // int
  plan_query_grade: number; // int
  paper_name: string; // string
  paper_subject_id: number; // int
  paper_knowledge_ids: string; // string
  paper_score: number; // int
  paper_pass_score: number; // int
  user_name: string; // string
  user_true_name: string; // string
  user_mobile: string; // string
  user_email: string; // string
  user_status: number; // int
};

// 状态
export enum GradeStatus {
  Default = 0, // 待参加考试
  UnSubmit = 1, // 待交卷
  Submit = 2, // 已交卷待评分
  Marking = 3, // 部分评分
  Marded = 4, // 评分完成
  Cancel = 5 // 考试取消
}

// 格式化状态文本
export const formatGradeStatusText = (v: GradeStatus) => {
  switch (v) {
    case GradeStatus.Default:
      return "待参加考试";
    case GradeStatus.UnSubmit:
      return "待交卷";
    case GradeStatus.Submit:
      return "已交卷待评分";
    case GradeStatus.Marking:
      return "部分评分";
    case GradeStatus.Marded:
      return "评分完成";
    case GradeStatus.Cancel:
      return "考试取消";
    default:
      return "异常";
  }
};
