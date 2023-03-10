// 班级
export type Class = {
  id: number; // int
  name: string; // string
  status: ClassStatus; // int
  desc: string; // string
};

// 状态
export enum ClassStatus {
  Disable, // 禁用
  Enable // 正常
}

// 格式化状态文本
export const formatClassStatusText = (v: ClassStatus) => {
  switch (v) {
    case ClassStatus.Disable:
      return "禁用";
    case ClassStatus.Enable:
      return "正常";
    default:
      return "异常";
  }
};

// 获取状态标签
export const getClassStatusTagType = (v: ClassStatus) => {
  switch (v) {
    case ClassStatus.Disable:
      return "danger";
    case ClassStatus.Enable:
      return "success";
    default:
      return "warning";
  }
};
