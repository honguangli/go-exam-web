import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { handleResponse } from "@/api/exam/client/client";
import {
  Role,
  RoleStatus,
  formatRoleStatusText,
  getRoleStatusTagType
} from "@/api/exam/models/role";
import {
  QueryRoleList,
  QueryRoleListResponse
} from "@/api/exam/modules/role/query_list";
import { CreateRole } from "@/api/exam/modules/role/create";
import { UpdateRole } from "@/api/exam/modules/role/update";
import { DeleteRole } from "@/api/exam/modules/role/delete";
import {
  formatPermissionStatusText,
  formatPermissionTypeText,
  getPermissionStatusTagType,
  getPermissionTypeTagType,
  Permission,
  transformTreeNode
} from "@/api/exam/models/permission";
import {
  QueryPermissionAll,
  QueryPermissionAllResponse
} from "@/api/exam/modules/permission/query_all";
import { AuthRolePermission } from "@/api/exam/modules/role/auth_permission";
import {
  QueryRolePermissionList,
  QueryRolePermissionListResponse
} from "@/api/exam/modules/role/query_permission_list";
import { RolePermissionRel } from "@/api/exam/models/role_permission_rel";

export function useQuestion() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    code: "",
    status: ""
  });
  // 表格数据
  const dataList = ref<Role[]>([]);
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
      hide: ({ checkList }: { checkList: string[] }) =>
        !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }: { checkList: string[] }) =>
        !checkList.includes("序号列")
    },
    {
      label: "ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "角色名称",
      prop: "name",
      minWidth: 150
    },
    {
      label: "角色代码",
      prop: "code",
      minWidth: 150
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 150,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getRoleStatusTagType(row.status)}
          effect="plain"
        >
          {formatRoleStatusText(row.status)}
        </el-tag>
      )
    },
    {
      label: "排序",
      prop: "seq",
      minWidth: 150
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

  // 权限表格
  const permissionTableRef = ref();
  // 权限表格数据
  const permissionDataList: Ref<Array<Permission>> = ref([]);
  // 表格加载状态
  const permissionLoading = ref(true);
  // 表格列
  const permissionColumns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }: { checkList: string[] }) =>
        !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }: { checkList: string[] }) =>
        !checkList.includes("序号列")
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
    }
  ];

  // 编辑对话框
  const editDialogTitle = ref("新增角色");
  const editDialogVisible = ref(false);

  // 授权对话框
  const authDialogTitle = ref("授权");
  const authDialogVisible = ref(false);
  const authRoleID = ref(0);

  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editFormType: Ref<"create" | "edit"> = ref("create");
  const editForm = reactive({
    id: 0,
    name: "",
    code: "",
    seq: 1000,
    status: RoleStatus.Enable,
    memo: ""
  });
  const editFormRule = reactive<FormRules>({
    name: [
      {
        required: true,
        max: 50,
        message: "请输入角色名称",
        trigger: "blur"
      }
    ],
    code: [
      {
        required: true,
        max: 50,
        message: "请输入角色代码",
        trigger: "blur"
      }
    ],
    status: [
      {
        required: true,
        message: "请选择角色状态",
        trigger: "blur"
      }
    ],
    seq: [
      {
        required: true,
        message: "请选择角色排序",
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
  function showEditDialog(editType: "create" | "edit", row?: Role) {
    editFormType.value = editType;
    if (editFormType.value === "edit" && row) {
      editDialogTitle.value = "编辑角色";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.code = row?.code;
      editForm.status = row?.status;
      editForm.seq = row?.seq;
      editForm.memo = row?.memo;
    } else {
      editDialogTitle.value = "新增角色";
      editForm.id = 0;
      editForm.name = "";
      editForm.code = "";
      editForm.status = RoleStatus.Enable;
      editForm.seq = 1000;
      editForm.memo = "";
    }
    editDialogVisible.value = true;
  }

  // 弹出授权对话框
  function showAuthDialog(row: Role) {
    onSearchPermission();
    authRoleID.value = row.id;
    authDialogVisible.value = true;
  }

  // 创建/更新信息
  function submitEditForm() {
    editFormRef.value?.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreateRole({
          name: editForm.name,
          code: editForm.code,
          seq: editForm.seq,
          status: editForm.status,
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
      UpdateRole({
        id: editForm.id,
        name: editForm.name,
        code: editForm.code,
        seq: editForm.seq,
        status: editForm.status,
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

  function handleDelete(row: Role) {
    // 删除
    DeleteRole({
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

  function handleSelectionChange(val: Role[]) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const res = await QueryRoleList({
      name: searchForm.name,
      code: searchForm.code,
      status: searchForm.status === "" ? -1 : parseInt(searchForm.status),
      sort: "seq",
      desc: "asc",
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryRoleListResponse) => {
      dataList.value = data.list;
      pagination.total = data.total;
      loading.value = false;
    });
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  async function onSearchPermission() {
    permissionLoading.value = true;
    const res = await QueryPermissionAll({});
    handleResponse(res, (data: QueryPermissionAllResponse) => {
      const trees = transformTreeNode(data.list);
      permissionDataList.value = trees;
    });

    const auth = await QueryRolePermissionList({
      role_id: authRoleID.value
    });
    handleResponse(auth, (data: QueryRolePermissionListResponse) => {
      selected(permissionDataList.value, data.list);
      permissionLoading.value = false;
    });
  }

  function selected(data: Array<Permission>, auth: Array<RolePermissionRel>) {
    data.forEach(item => {
      permissionTableRef.value?.getTableRef().toggleRowSelection(
        item,
        auth.some(rel => {
          return rel.permission_id === item.id;
        })
      );
      if (item.children && item.children.length > 0) {
        selected(item.children, auth);
      }
    });
  }

  // 授权
  function submitAuth() {
    const list = permissionTableRef.value
      ?.getTableRef()
      .getSelectionRows()
      .map((item: Permission) => {
        return item.id;
      });

    // 授权
    AuthRolePermission({
      id: authRoleID.value,
      permission_list: list
    })
      .then(res => {
        handleResponse(res, () => {
          message(res.msg, {
            type: "success"
          });
          authDialogVisible.value = false;
        });
      })
      .catch(err => {
        console.log(err);
        message("操作失败", {
          type: "error"
        });
      });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    permissionTableRef,
    permissionDataList,
    permissionLoading,
    permissionColumns,
    editDialogTitle,
    editDialogVisible,
    authDialogTitle,
    authDialogVisible,
    editFormRef,
    editForm,
    editFormType,
    editFormRule,
    buttonClass,
    onSearch,
    onSearchPermission,
    resetForm,
    showEditDialog,
    showAuthDialog,
    submitEditForm,
    submitAuth,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
