import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { handleResponse } from "@/api/exam/client/client";
import {
  formatUserStatusText,
  formatUserTypeText,
  getUserStatusTagType,
  getUserTypeTagType,
  User,
  UserStatus,
  UserType
} from "@/api/exam/models/user";
import {
  QueryUserList,
  QueryUserListResponse
} from "@/api/exam/modules/user/query_list";
import { CreateUser } from "@/api/exam/modules/user/create";
import { UpdateUser } from "@/api/exam/modules/user/update";
import { DeleteUser } from "@/api/exam/modules/user/delete";
import md5 from "crypto-js/md5";
import { UpdateUserType } from "@/api/exam/modules/user/update_type";
import { UpdateUserPassword } from "@/api/exam/modules/user/update_password";
import {
  QueryRoleAll,
  QueryRoleAllResponse
} from "@/api/exam/modules/role/query_all";
import {
  QueryUserRoleList,
  QueryUserRoleListResponse
} from "@/api/exam/modules/user/query_role_list";
import { UserRoleRel } from "@/api/exam/models/user_role_rel";
import {
  formatRoleStatusText,
  getRoleStatusTagType,
  Role
} from "@/api/exam/models/role";
import { AuthUserRole } from "@/api/exam/modules/user/auth_role";

export function useQuestion() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    type: "",
    status: ""
  });
  // 表格数据
  const dataList = ref([]);
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
      label: "ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "用户名",
      prop: "name",
      minWidth: 150
    },
    {
      label: "账号类型",
      prop: "type",
      minWidth: 150,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getUserTypeTagType(row.type)}
          effect="plain"
        >
          {formatUserTypeText(row.type)}
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
          type={getUserStatusTagType(row.status)}
          effect="plain"
        >
          {formatUserStatusText(row.status)}
        </el-tag>
      )
    },
    {
      label: "手机号",
      prop: "mobile",
      minWidth: 150
    },
    {
      label: "邮箱",
      prop: "email",
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

  // 角色表格
  const roleTableRef = ref();
  // 角色表格数据
  const roleDataList: Ref<Array<Role>> = ref([]);
  // 角色加载状态
  const roleLoading = ref(true);
  // 角色表格列
  const roleColumns: TableColumnList = [
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
    }
  ];

  // 编辑对话框
  const editDialogTitle = ref("新增用户");
  const editDialogVisible = ref(false);

  // 变更类型对话框
  const editTypeDialogTitle = ref("变更账号类型");
  const editTypeDialogVisible = ref(false);

  // 修改密码对话框
  const editPasswordDialogTitle = ref("修改密码");
  const editPasswordDialogVisible = ref(false);

  // 授权对话框
  const authDialogTitle = ref("授权");
  const authDialogVisible = ref(false);
  const authUserID = ref(0);

  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editFormType: Ref<"create" | "edit"> = ref("create");
  const editForm = reactive({
    id: 0,
    name: "",
    password: "",
    confirm_password: "",
    type: UserType.Student,
    true_name: "",
    mobile: "",
    email: "",
    status: UserStatus.Enable,
    memo: ""
  });
  const editFormRule = reactive<FormRules>({
    name: [
      {
        required: true,
        max: 50,
        message: "请输入用户名",
        trigger: "blur"
      }
    ],
    password: [
      {
        required: true,
        max: 50,
        message: "请输入密码",
        trigger: "blur"
      },
      {
        pattern: /^\w{6,18}$/,
        message: "请输入6~18位由数字、26个英文字母或者下划线组成的密码",
        trigger: "blur"
      }
    ],
    confirm_password: [
      {
        required: true,
        max: 50,
        message: "请再次输入密码",
        trigger: "blur"
      },
      {
        validator: (rule, value) => {
          if (value !== editForm.password) {
            return new Error("两次输入密码不一致");
          }
          return true;
        }
      }
    ],
    type: [
      {
        required: true,
        message: "请选择账号类型",
        trigger: "blur"
      }
    ],
    status: [
      {
        required: true,
        message: "请选择账号状态",
        trigger: "blur"
      }
    ],
    true_name: [
      {
        required: false,
        max: 50,
        message: "请输入用户真实姓名",
        trigger: "blur"
      }
    ],
    mobile: [
      {
        required: false,
        max: 20,
        message: "请输入用户手机号",
        trigger: "blur"
      }
    ],
    email: [
      {
        required: false,
        max: 50,
        message: "请输入邮箱地址",
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

  // 变更类型表单
  const editTypeFormRef = ref<FormInstance>();
  const editTypeForm = reactive({
    id: 0,
    name: "",
    type: UserType.Student
  });
  const editTypeFormRule = reactive<FormRules>({
    type: [
      {
        required: true,
        message: "请选择账号类型",
        trigger: "blur"
      }
    ]
  });

  // 修改密码表单
  const editPasswordFormRef = ref<FormInstance>();
  const editPasswordForm = reactive({
    id: 0,
    name: "",
    password: "",
    confirm_password: ""
  });
  const editPasswordFormRule = reactive<FormRules>({
    password: [
      {
        required: true,
        max: 50,
        message: "请输入密码",
        trigger: "blur"
      },
      {
        pattern: /^\w{6,18}$/,
        message: "请输入6~18位由数字、26个英文字母或者下划线组成的密码",
        trigger: "blur"
      }
    ],
    confirm_password: [
      {
        required: true,
        max: 50,
        message: "请再次输入密码",
        trigger: "blur"
      },
      {
        validator: (rule, value) => {
          if (value !== editPasswordForm.password) {
            return new Error("两次输入密码不一致");
          }
          return true;
        }
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
  function showEditDialog(editType: "create" | "edit", row?: User) {
    editFormType.value = editType;
    if (editFormType.value === "edit") {
      editDialogTitle.value = "编辑用户";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.password = "";
      editForm.confirm_password = "";
      editForm.type = row?.type;
      editForm.true_name = row?.true_name;
      editForm.mobile = row?.mobile;
      editForm.email = row?.email;
      editForm.status = row?.status;
      editForm.memo = row?.memo;
    } else {
      editDialogTitle.value = "新增用户";
      editForm.id = 0;
      editForm.name = "";
      editForm.password = "";
      editForm.confirm_password = "";
      editForm.type = UserType.Student;
      editForm.true_name = "";
      editForm.mobile = "";
      editForm.email = "";
      editForm.status = UserStatus.Enable;
      editForm.memo = "";
    }
    editDialogVisible.value = true;
  }

  // 弹出变更账号类型对话框
  function showEditTypeDialog(row: User) {
    editTypeDialogVisible.value = true;
    editTypeForm.id = row?.id;
    editTypeForm.name = row?.name;
    editTypeForm.type = row?.type;
  }

  // 弹出修改密码对话框
  function showEditPasswordDialog(row: User) {
    editPasswordDialogVisible.value = true;
    editPasswordForm.id = row?.id;
    editPasswordForm.name = row?.name;
    editPasswordForm.password = "";
    editPasswordForm.confirm_password = "";
  }

  // 弹出授权对话框
  function showAuthDialog(row: Role) {
    console.log("showAuthDialog", row);
    onSearchRole();
    authUserID.value = row.id;
    authDialogVisible.value = true;
  }

  // 创建用户/更新用户信息
  function submitEditForm() {
    editFormRef.value.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreateUser({
          name: editForm.name,
          password: md5(editForm.password).toString(),
          type: editForm.type,
          true_name: editForm.true_name,
          mobile: editForm.mobile,
          email: editForm.email,
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
      UpdateUser({
        id: editForm.id,
        name: editForm.name,
        true_name: editForm.true_name,
        mobile: editForm.mobile,
        email: editForm.email,
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

  // 更新账号类型
  function submitTypeEditForm() {
    editTypeFormRef.value.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      // 更新
      UpdateUserType({
        id: editTypeForm.id,
        type: editTypeForm.type
      })
        .then(res => {
          handleResponse(res, () => {
            message(res.msg, {
              type: "success"
            });
            editTypeDialogVisible.value = false;
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

  // 修改密码
  function submitPasswordEditForm() {
    editPasswordFormRef.value.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }
      console.log("修改密码", editPasswordForm);

      // 更新
      UpdateUserPassword({
        id: editPasswordForm.id,
        password: md5(editPasswordForm.password).toString()
      })
        .then(res => {
          handleResponse(res, () => {
            message(res.msg, {
              type: "success"
            });
            editPasswordDialogVisible.value = false;
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

  function handleDelete(row: User) {
    // 删除
    DeleteUser({
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
    const res = await QueryUserList({
      name: searchForm.name,
      type: searchForm.type === "" ? -1 : parseInt(searchForm.type),
      status: searchForm.status === "" ? -1 : parseInt(searchForm.status),
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryUserListResponse) => {
      dataList.value = data.list;
      pagination.total = data.total;
      loading.value = false;
    });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  async function onSearchRole() {
    roleLoading.value = true;
    const res = await QueryRoleAll({});
    handleResponse(res, (data: QueryRoleAllResponse) => {
      roleDataList.value = data.list;
    });

    const auth = await QueryUserRoleList({
      user_id: authUserID.value
    });
    handleResponse(auth, (data: QueryUserRoleListResponse) => {
      selected(roleDataList.value, data.list);
      roleLoading.value = false;
    });
  }

  function selected(data: Array<Role>, auth: Array<UserRoleRel>) {
    data.forEach(item => {
      roleTableRef.value?.getTableRef().toggleRowSelection(
        item,
        auth.some(rel => {
          return rel.role_id === item.id;
        })
      );
    });
  }

  // 授权
  function submitAuth() {
    const list = roleTableRef.value
      ?.getTableRef()
      .getSelectionRows()
      .map(item => {
        return item.id;
      });

    // 授权
    AuthUserRole({
      id: authUserID.value,
      role_list: list
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
    roleTableRef,
    roleDataList,
    roleLoading,
    roleColumns,
    editDialogTitle,
    editDialogVisible,
    editTypeDialogTitle,
    editTypeDialogVisible,
    editPasswordDialogTitle,
    editPasswordDialogVisible,
    authDialogTitle,
    authDialogVisible,
    editFormRef,
    editForm,
    editFormType,
    editFormRule,
    editTypeFormRef,
    editTypeForm,
    editTypeFormRule,
    editPasswordFormRef,
    editPasswordForm,
    editPasswordFormRule,
    buttonClass,
    onSearch,
    onSearchRole,
    resetForm,
    showEditDialog,
    showEditTypeDialog,
    showEditPasswordDialog,
    showAuthDialog,
    submitEditForm,
    submitTypeEditForm,
    submitPasswordEditForm,
    submitAuth,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
