// 权限表
export type Permission = {
  id: number; // int
  type: number; // int
  pid: number; // int
  code: string; // string
  status: number; // int
  path: string; // string
  name: string; // string
  component: string; // string
  redirect: string; // string
  meta_title: string; // string
  meta_icon: string; // string
  meta_extra_icon: string; // string
  meta_show_link: number; // int
  meta_show_parent: number; // int
  meta_keep_alive: number; // int
  meta_frame_src: string; // string
  meta_frame_loading: number; // int
  meta_hidden_tag: number; // int
  meta_rank: number; // int
  create_time: number; // int
  update_time: number; // int
  memo: string; // string
  children: Array<Permission>; // 自定义
};

// 类型
export enum PermissionType {
  Menu = 1, // 菜单权限
  Page = 2, // 页面权限
  Component = 3, // 组件权限
  Op = 4, // 操作权限
  Button = 5, // 按钮权限
  Data = 6 // 数据权限
}

// 状态
export enum PermissionStatus {
  Disable,
  Enable
}

// 是否显示
export enum PermissionMetaShowLine {
  Disable, // 隐藏
  Enable // 显示
}

// 是否显示父级菜单
export enum PermissionMetaShowParent {
  Disable, // 隐藏
  Enable // 显示
}

// 是否缓存
export enum PermissionMetaKeepAlive {
  Disable, // 关闭
  Enable // 开启
}

// 是否开启iframe首次加载动画
export enum PermissionMetaIframeLoading {
  Disable, // 关闭
  Enable // 开启
}

// 是否不添加信息到标签页
export enum PermissionMetaHiddenTag {
  Disable, // 添加
  Enable // 不添加
}

// 格式化类型文本
export const formatPermissionTypeText = (v: PermissionType) => {
  switch (v) {
    case PermissionType.Menu:
      return "菜单权限";
    case PermissionType.Page:
      return "页面权限";
    case PermissionType.Component:
      return "组件权限";
    case PermissionType.Op:
      return "操作权限";
    case PermissionType.Button:
      return "按钮权限";
    case PermissionType.Data:
      return "数据权限";
    default:
      return "异常";
  }
};

// 获取类型标签
export const getPermissionTypeTagType = (v: PermissionType) => {
  switch (v) {
    case PermissionType.Menu:
      return "";
    case PermissionType.Page:
      return "";
    case PermissionType.Component:
      return "success";
    case PermissionType.Op:
      return "success";
    case PermissionType.Button:
      return "success";
    case PermissionType.Data:
      return "warning";
    default:
      return "danger";
  }
};

// 格式化状态文本
export const formatPermissionStatusText = (v: PermissionStatus) => {
  switch (v) {
    case PermissionStatus.Disable:
      return "禁用";
    case PermissionStatus.Enable:
      return "正常";
    default:
      return "异常";
  }
};

// 获取状态标签
export const getPermissionStatusTagType = (v: PermissionStatus) => {
  switch (v) {
    case PermissionStatus.Disable:
      return "danger";
    case PermissionStatus.Enable:
      return "success";
    default:
      return "warning";
  }
};

// 权限树结构
type Node = {
  isChild: boolean; // 是否子节点
  current: Permission; // 当前节点
  parents: Array<number>; // 父节点id（包含所有上级节点）
};

// 转换权限树
export const transformTreeNode = (data: Array<Permission>) => {
  const pm: Record<number, Node> = {};
  data.forEach(item => {
    item.children = new Array<Permission>();
    pm[item.id] = {
      isChild: false,
      current: item,
      parents: []
    };
  });

  // 添加子节点
  Object.values(pm).forEach(item => {
    // 若父节点为当前节点自身时，当前节点将作为顶级节点
    // 若父节点不存在时，当前节点将作为顶级节点
    // 若父节点与当前节点循环引用时，当前节点将作为顶级节点
    if (
      item.current.id != item.current.pid &&
      pm[item.current.pid] &&
      !pm[item.current.pid].parents.some(e => e === item.current.id)
    ) {
      item.isChild = true;
      item.parents.push(item.current.pid, ...pm[item.current.pid].parents);
      pm[item.current.pid].current.children.push(item.current);
    }
  });

  // 顶级节点
  const trees = new Array<Permission>();

  // 排序
  Object.values(pm).forEach(item => {
    item.current.children.sort(function (a, b) {
      return a.meta_rank - b.meta_rank;
    });
    if (!item.isChild) {
      trees.push(item.current);
    }
  });

  return trees;
};
