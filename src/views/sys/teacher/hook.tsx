import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { handleResponse } from "@/api/exam/client/client";
import {
  formatUserStatusText,
  getUserStatusTagType,
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
import { UpdateUserPassword } from "@/api/exam/modules/user/update_password";

export function useQuestion() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    type: "",
    status: ""
  });
  // 表格数据
  const dataList = ref<User[]>([]);
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
      label: "用户名",
      prop: "name",
      minWidth: 150
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

  // 编辑对话框
  const editDialogTitle = ref("新增用户");
  const editDialogVisible = ref(false);

  // 修改密码对话框
  const editPasswordDialogTitle = ref("修改密码");
  const editPasswordDialogVisible = ref(false);

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
    if (editFormType.value === "edit" && row) {
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

  // 弹出修改密码对话框
  function showEditPasswordDialog(row: User) {
    editPasswordDialogVisible.value = true;
    editPasswordForm.id = row?.id;
    editPasswordForm.name = row?.name;
    editPasswordForm.password = "";
    editPasswordForm.confirm_password = "";
  }

  // 创建用户/更新用户信息
  function submitEditForm() {
    editFormRef.value?.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreateUser({
          name: editForm.name,
          password: md5(editForm.password).toString(),
          type: UserType.Teacher,
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

  // 修改密码
  function submitPasswordEditForm() {
    editPasswordFormRef.value?.validate((valid, fields) => {
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

  function handleSelectionChange(val: User[]) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const res = await QueryUserList({
      name: searchForm.name,
      type: UserType.Teacher,
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

  const resetForm = (formEl: FormInstance | undefined) => {
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
    pagination,
    editDialogTitle,
    editDialogVisible,
    editPasswordDialogTitle,
    editPasswordDialogVisible,
    editFormRef,
    editForm,
    editFormType,
    editFormRule,
    editPasswordFormRef,
    editPasswordForm,
    editPasswordFormRule,
    buttonClass,
    onSearch,
    resetForm,
    showEditDialog,
    showEditPasswordDialog,
    submitEditForm,
    submitPasswordEditForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
