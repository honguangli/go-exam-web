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
  paper_name: string; // string
};

// 状态
export enum PlanStatus {
  Draft,
  Running,
  Cancel,
  End
}

// 格式化状态文本
export const formatPlanStatusText = (v: PlanStatus) => {
  switch (v) {
    case PlanStatus.Draft:
      return "未发布";
    case PlanStatus.Running:
      return "已发布";
    case PlanStatus.Cancel:
      return "已取消";
    case PlanStatus.End:
      return "已结束";
    default:
      return "异常";
  }
};

// 获取状态标签
export const getPlanStatusTagType = (v: PlanStatus) => {
  switch (v) {
    case PlanStatus.Draft:
      return "";
    case PlanStatus.Running:
      return "primary";
    case PlanStatus.Cancel:
      return "info";
    case PlanStatus.End:
      return "success";
    default:
      return "warning";
  }
};
