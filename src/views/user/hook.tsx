import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted } from "vue";
import { handleResponse } from "@/api/exam/client/client";
import { User, UserStatus, UserType } from "@/api/exam/models/user";
import {
  QueryUserList,
  QueryUserListResponse
} from "@/api/exam/modules/user/query_list";
import { CreateUser } from "@/api/exam/modules/user/create";
import { UpdateUser } from "@/api/exam/modules/user/update";
import { DeleteUser } from "@/api/exam/modules/user/delete";
import { FormInstance, FormRules } from "element-plus";

export function useQuestion() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    type: ""
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
      label: "类型",
      prop: "type",
      minWidth: 150
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
      width: 180,
      slot: "operation"
    }
  ];

  // 编辑对话框
  const editDialogVisible = ref(false);
  const editDialogTitle = ref("新增用户");
  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editForm = reactive({
    id: 0,
    name: "",
    password: "",
    type: UserType.Student,
    true_name: "",
    mobile: "",
    email: "",
    status: UserStatus.Disable,
    memo: ""
  });
  const editRule = reactive<FormRules>({
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

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function showEditDialog(type: "create" | "edit", row?: User) {
    if (type === "edit") {
      editDialogVisible.value = true;
      editDialogTitle.value = "编辑用户";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.password = row?.password;
      editForm.type = row?.type;
      editForm.true_name = row?.true_name;
      editForm.mobile = row?.mobile;
      editForm.email = row?.email;
      editForm.status = row?.status;
      editForm.memo = row?.memo;
    } else {
      editDialogVisible.value = true;
      editDialogTitle.value = "新增用户";
    }
  }

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
          password: editForm.password,
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
              editForm.id = 0;
              editForm.name = "";
              editForm.password = "";
              editForm.type = UserType.Student;
              editForm.true_name = "";
              editForm.mobile = "";
              editForm.email = "";
              editForm.status = UserStatus.Disable;
              editForm.memo = "";
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
        password: editForm.password,
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
            editForm.id = 0;
            editForm.name = "";
            editForm.password = "";
            editForm.type = UserType.Student;
            editForm.true_name = "";
            editForm.mobile = "";
            editForm.email = "";
            editForm.status = UserStatus.Disable;
            editForm.memo = "";
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

  onMounted(() => {
    onSearch();
  });

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    editDialogVisible,
    editDialogTitle,
    editFormRef,
    editForm,
    editRule,
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
