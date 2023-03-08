// 权限表
export type Permission = {
  id: number; // int
  type: number; // int
  pid: number; // int
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
