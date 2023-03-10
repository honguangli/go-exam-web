import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { handleResponse } from "@/api/exam/client/client";
import {
  Permission,
  PermissionStatus,
  PermissionMetaShowLine,
  PermissionMetaShowParent,
  PermissionMetaKeepAlive,
  PermissionMetaIframeLoading,
  PermissionMetaHiddenTag,
  PermissionType,
  formatPermissionTypeText,
  getPermissionTypeTagType,
  formatPermissionStatusText,
  getPermissionStatusTagType,
  transformTreeNode
} from "@/api/exam/models/permission";
import {
  QueryPermissionAll,
  QueryPermissionAllResponse
} from "@/api/exam/modules/permission/query_all";
import { CreatePermission } from "@/api/exam/modules/permission/create";
import { UpdatePermission } from "@/api/exam/modules/permission/update";
import { DeletePermission } from "@/api/exam/modules/permission/delete";

export function useHook() {
  // 筛选表单
  const searchForm = reactive({
    type: "",
    status: "",
    path: "",
    name: "",
    meta_title: ""
  });
  // 表格数据
  const dataList = ref([]);
  // 树形选项
  const dataTree = ref([]);
  // 表格加载状态
  const loading = ref(true);
  // 表格分页
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  // 表格列
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "权限名称",
      prop: "meta_title",
      headerAlign: "center",
      align: "left",
      minWidth: 150
    },
    {
      label: "ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "权限代码",
      prop: "code",
      minWidth: 150
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 150,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getPermissionTypeTagType(row.type)}
          effect="plain"
        >
          {formatPermissionTypeText(row.type)}
        </el-tag>
      )
    },
    {
      label: "路由地址",
      prop: "path",
      minWidth: 150
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 150,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getPermissionStatusTagType(row.status)}
          effect="plain"
        >
          {formatPermissionStatusText(row.status)}
        </el-tag>
      )
    },
    {
      label: "排序",
      prop: "meta_rank",
      minWidth: 100
    },
    {
      label: "备注",
      prop: "memo",
      minWidth: 200
    },
    {
      label: "操作",
      fixed: "right",
      width: 220,
      slot: "operation"
    }
  ];

  // 编辑对话框
  const editDialogTitle = ref("新增权限");
  const editDialogVisible = ref(false);

  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editFormType: Ref<"create" | "edit"> = ref("create");
  const editForm = reactive({
    id: 0,
    type: PermissionType.Menu,
    pid: 0,
    code: "",
    status: PermissionStatus.Enable,
    path: "",
    name: "",
    component: "",
    redirect: "",
    meta_title: "",
    meta_icon: "",
    meta_extra_icon: "",
    meta_show_link: PermissionMetaShowLine.Enable,
    meta_show_parent: PermissionMetaShowParent.Enable,
    meta_keep_alive: PermissionMetaKeepAlive.Disable,
    meta_frame_src: "",
    meta_frame_loading: PermissionMetaIframeLoading.Enable,
    meta_hidden_tag: PermissionMetaHiddenTag.Disable,
    meta_rank: 0,
    memo: ""
  });
  const editFormRule = reactive<FormRules>({
    type: [
      {
        required: true,
        message: "请选择权限类型",
        trigger: "blur"
      }
    ],
    pid: [
      {
        required: true,
        message: "请选择上级权限",
        trigger: "blur"
      },
      {
        validator: (rule, value) => {
          if (value === editForm.id) {
            return new Error("请选择正确的上一级权限");
          }
          return true;
        }
      }
    ],
    code: [
      {
        validator: (rule, value) => {
          if (
            value.length === 0 &&
            [
              PermissionType.Component,
              PermissionType.Op,
              PermissionType.Button,
              PermissionType.Data
            ].includes(editForm.type)
          ) {
            return new Error("请填写权限代码");
          }
          return true;
        }
      },
      {
        pattern: /^\w{2,18}$/,
        message: "请输入2~18位由数字、26个英文字母或者下划线组成的权限代码",
        trigger: "blur"
      }
    ],
    status: [
      {
        required: true,
        message: "请选择权限状态",
        trigger: "blur"
      }
    ],
    path: [
      {
        required: true,
        message: "请填写路由地址",
        trigger: "blur"
      },
      {
        max: 1024,
        message: "请输入不超过1024个字符的路由地址",
        trigger: "blur"
      }
    ],
    name: [
      {
        max: 50,
        message: "请输入不超过50个字符的路由名称",
        trigger: "blur"
      }
    ],
    component: [
      {
        max: 255,
        message: "请输入不超过255个字符的路由组件",
        trigger: "blur"
      }
    ],
    redirect: [
      {
        max: 1024,
        message: "请输入不超过1024个字符的重定向地址",
        trigger: "blur"
      }
    ],
    meta_title: [
      {
        required: true,
        max: 50,
        message: "请输入权限名称",
        trigger: "blur"
      }
    ],
    meta_icon: [],
    meta_extra_icon: [],
    meta_show_link: [
      {
        required: true,
        message: "请选择是否显示",
        trigger: "blur"
      }
    ],
    meta_show_parent: [
      {
        required: true,
        message: "请选择是否显示",
        trigger: "blur"
      }
    ],
    meta_keep_alive: [
      {
        required: true,
        message: "请选择是否开启缓存",
        trigger: "blur"
      }
    ],
    meta_frame_src: [
      {
        max: 1024,
        message: "请输入不超过1024个字符的重定向地址",
        trigger: "blur"
      }
    ],
    meta_frame_loading: [
      {
        required: true,
        message: "请选择是否加载动画",
        trigger: "blur"
      }
    ],
    meta_hidden_tag: [
      {
        required: true,
        message: "请选择是否显示标签页",
        trigger: "blur"
      }
    ],
    meta_rank: [
      {
        required: true,
        message: "请选择排序",
        trigger: "blur"
      },
      {
        type: "integer",
        min: 1,
        max: 999999,
        message: "请输入1~999999之间的正整数",
        trigger: "blur"
      }
    ],
    memo: [
      {
        required: false,
        max: 255,
        message: "请输入备注",
        trigger: "blur"
      }
    ]
  });

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  // 弹出编辑对话框
  function showEditDialog(editType: "create" | "edit", row?: Permission) {
    editFormType.value = editType;
    if (editFormType.value === "edit") {
      editDialogTitle.value = "编辑权限";
      editForm.id = row?.id;
      editForm.type = row?.type;
      editForm.pid = row?.pid;
      editForm.code = row?.code;
      editForm.status = row?.status;
      editForm.path = row?.path;
      editForm.name = row?.name;
      editForm.component = row?.component;
      editForm.redirect = row?.redirect;
      editForm.meta_title = row?.meta_title;
      editForm.meta_icon = row?.meta_icon;
      editForm.meta_extra_icon = row?.meta_extra_icon;
      editForm.meta_show_link = row?.meta_show_link;
      editForm.meta_show_parent = row?.meta_show_parent;
      editForm.meta_keep_alive = row?.meta_keep_alive;
      editForm.meta_frame_src = row?.meta_frame_src;
      editForm.meta_frame_loading = row?.meta_frame_loading;
      editForm.meta_hidden_tag = row?.meta_hidden_tag;
      editForm.meta_rank = row?.meta_rank;
      editForm.memo = row?.memo;
    } else {
      editDialogTitle.value = "新增权限";
      editForm.id = 0;
      editForm.type = PermissionType.Menu;
      editForm.pid = 0;
      editForm.code = "";
      editForm.status = PermissionStatus.Enable;
      editForm.path = "";
      editForm.name = "";
      editForm.component = "";
      editForm.redirect = "";
      editForm.meta_title = "";
      editForm.meta_icon = "";
      editForm.meta_extra_icon = "";
      editForm.meta_show_link = PermissionMetaShowLine.Enable;
      editForm.meta_show_parent = PermissionMetaShowParent.Enable;
      editForm.meta_keep_alive = PermissionMetaKeepAlive.Disable;
      editForm.meta_frame_src = "";
      editForm.meta_frame_loading = PermissionMetaIframeLoading.Enable;
      editForm.meta_hidden_tag = PermissionMetaHiddenTag.Disable;
      editForm.meta_rank = 0;
      editForm.memo = "";
    }
    editDialogVisible.value = true;
  }

  // 创建/更新信息
  function submitEditForm() {
    editFormRef.value.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreatePermission({
          type: editForm.type,
          pid: editForm.pid,
          code: editForm.code,
          status: editForm.status,
          path: editForm.path,
          name: editForm.name,
          component: editForm.component,
          redirect: editForm.redirect,
          meta_title: editForm.meta_title,
          meta_icon: editForm.meta_icon,
          meta_extra_icon: editForm.meta_extra_icon,
          meta_show_link: editForm.meta_show_link,
          meta_show_parent: editForm.meta_show_parent,
          meta_keep_alive: editForm.meta_keep_alive,
          meta_frame_src: editForm.meta_frame_src,
          meta_frame_loading: editForm.meta_frame_loading,
          meta_hidden_tag: editForm.meta_hidden_tag,
          meta_rank: editForm.meta_rank,
          memo: editForm.memo
        })
          .then(res => {
            handleResponse(res, () => {
              message(res.msg, {
                type: "success"
              });
              editDialogVisible.value = false;
              onSearch();
            });
          })
          .catch(err => {
            console.log(err);
            message("操作失败", {
              type: "error"
            });
          });
        return;
      }

      // 更新
      UpdatePermission({
        id: editForm.id,
        type: editForm.type,
        pid: editForm.pid,
        code: editForm.code,
        status: editForm.status,
        path: editForm.path,
        name: editForm.name,
        component: editForm.component,
        redirect: editForm.redirect,
        meta_title: editForm.meta_title,
        meta_icon: editForm.meta_icon,
        meta_extra_icon: editForm.meta_extra_icon,
        meta_show_link: editForm.meta_show_link,
        meta_show_parent: editForm.meta_show_parent,
        meta_keep_alive: editForm.meta_keep_alive,
        meta_frame_src: editForm.meta_frame_src,
        meta_frame_loading: editForm.meta_frame_loading,
        meta_hidden_tag: editForm.meta_hidden_tag,
        meta_rank: editForm.meta_rank,
        memo: editForm.memo
      })
        .then(res => {
          handleResponse(res, () => {
            message(res.msg, {
              type: "success"
            });
            editDialogVisible.value = false;
            onSearch();
          });
        })
        .catch(err => {
          console.log(err);
          message("操作失败", {
            type: "error"
          });
        });
    });
  }

  function handleDelete(row: Permission) {
    // 删除
    DeletePermission({
      id: row.id
    })
      .then(res => {
        handleResponse(res, () => {
          message(res.msg, {
            type: "success"
          });
          onSearch();
        });
      })
      .catch(err => {
        console.log(err);
        message("操作失败", {
          type: "error"
        });
      });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: any) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const res = await QueryPermissionAll({});
    handleResponse(res, (data: QueryPermissionAllResponse) => {
      const trees = transformTreeNode(data.list);
      dataList.value = trees;
      dataTree.value = [
        {
          id: 0,
          meta_title: "无"
        },
        ...trees
      ];

      pagination.total = data.total;
      loading.value = false;
    });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    dataTree,
    pagination,
    editDialogTitle,
    editDialogVisible,
    editFormRef,
    editForm,
    editFormType,
    editFormRule,
    buttonClass,
    onSearch,
    resetForm,
    showEditDialog,
    submitEditForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
