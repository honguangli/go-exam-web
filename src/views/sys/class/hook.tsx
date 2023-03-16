import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { handleResponse, ResponseBody } from "@/api/exam/client/client";
import {
  Class,
  ClassStatus,
  formatClassStatusText,
  getClassStatusTagType
} from "@/api/exam/models/class";
import {
  QueryClassList,
  QueryClassListResponse
} from "@/api/exam/modules/class/query_list";
import { CreateClass } from "@/api/exam/modules/class/create";
import { UpdateClass } from "@/api/exam/modules/class/update";
import { DeleteClass } from "@/api/exam/modules/class/delete";
import {
  formatUserStatusText,
  getUserStatusTagType,
  User,
  UserType
} from "@/api/exam/models/user";
import { ClassUser } from "@/api/exam/models/class_user";
import {
  QueryClassUserList,
  QueryClassUserListResponse
} from "@/api/exam/modules/class/query_user_list";
import { DeleteClassUser } from "@/api/exam/modules/class/delete_user";
import { PushClassUser } from "@/api/exam/modules/class/push_user";
import {
  QueryUserList,
  QueryUserListResponse
} from "@/api/exam/modules/user/query_list";

export function useQuestion() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    status: ""
  });
  // 表格数据
  const dataList: Ref<Array<Class>> = ref([]);
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
      label: "班级名称",
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
          type={getClassStatusTagType(row.status)}
          effect="plain"
        >
          {formatClassStatusText(row.status)}
        </el-tag>
      )
    },
    {
      label: "备注",
      prop: "desc",
      minWidth: 200
    },
    {
      label: "操作",
      fixed: "right",
      width: 260,
      slot: "operation"
    }
  ];

  // 考生表格
  const userListTableRef = ref();
  // 表格数据
  const userListDataList: Ref<Array<ClassUser>> = ref([]);
  // 表格加载状态
  const userListLoading = ref(true);
  // 表格分页
  const userListPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  // 表格列
  const userListColumns: TableColumnList = [
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
      label: "考生账号",
      prop: "user_name",
      minWidth: 150
    },
    {
      label: "考生姓名",
      prop: "user_true_name",
      minWidth: 150
    }
  ];

  // 添加考生表格
  const pushUserTableRef = ref();
  // 表格数据
  const pushUserDataList: Ref<Array<User>> = ref([]);
  // 表格加载状态
  const pushUserLoading = ref(true);
  // 表格分页
  const pushUserPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  // 表格列
  const pushUserColumns: TableColumnList = [
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
      label: "考生账号",
      prop: "name",
      minWidth: 150
    },
    {
      label: "考生姓名",
      prop: "true_name",
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
  const editDialogTitle = ref("新增班级");
  const editDialogVisible = ref(false);

  // 考生列表对话框
  const userListDialogTitle = ref("考生列表");
  const userListDialogVisible = ref(false);
  const userListClassID = ref(0);

  // 添加考生对话框
  const pushUserDialogTitle = ref("添加考生");
  const pushUserDialogVisible = ref(false);

  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editFormType: Ref<"create" | "edit"> = ref("create");
  const editForm = reactive({
    id: 0,
    name: "",
    status: ClassStatus.Enable,
    desc: ""
  });
  const editFormRule = reactive<FormRules>({
    name: [
      {
        required: true,
        max: 50,
        message: "请输入班级名称",
        trigger: "blur"
      }
    ],
    status: [
      {
        required: true,
        message: "请选择班级状态",
        trigger: "blur"
      }
    ],
    desc: [
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
  function showEditDialog(editType: "create" | "edit", row?: Class) {
    editFormType.value = editType;
    if (editFormType.value === "edit" && row) {
      editDialogTitle.value = "编辑班级";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.status = row?.status;
      editForm.desc = row?.desc;
    } else {
      editDialogTitle.value = "新增班级";
      editForm.id = 0;
      editForm.name = "";
      editForm.status = ClassStatus.Enable;
      editForm.desc = "";
    }
    editDialogVisible.value = true;
  }

  // 弹出班级用户对话框
  function showUserListDialog(row: Class) {
    userListClassID.value = row.id;
    onSearchClassUser();
    userListDialogVisible.value = true;
  }

  // 弹出添加用户对话框
  function showPushUserDialog() {
    onSearchStudentList();
    pushUserDialogVisible.value = true;
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
        CreateClass({
          name: editForm.name,
          status: editForm.status,
          desc: editForm.desc
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
      UpdateClass({
        id: editForm.id,
        name: editForm.name,
        status: editForm.status,
        desc: editForm.desc
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

  function handleDelete(row: Class) {
    // 删除
    DeleteClass({
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
    const res = await QueryClassList({
      name: searchForm.name,
      status: searchForm.status === "" ? -1 : parseInt(searchForm.status),
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryClassListResponse) => {
      dataList.value = data.list;
      pagination.total = data.total;
      loading.value = false;
    });
  }

  function handleUserListSizeChange(val: number) {
    userListPagination.pageSize = val;
    onSearchClassUser();
  }

  function handleUserListCurrentChange(val: any) {
    userListPagination.currentPage = val;
    onSearchClassUser();
  }

  // 查询班级考生列表
  async function onSearchClassUser() {
    userListLoading.value = true;
    const res = await QueryClassUserList({
      class_id: userListClassID.value,
      limit: userListPagination.pageSize,
      offset: (userListPagination.currentPage - 1) * userListPagination.pageSize
    });
    handleResponse(res, (data: QueryClassUserListResponse) => {
      userListDataList.value = data.list;
      userListPagination.total = data.total;
      userListLoading.value = false;
    });
  }

  // 删除班级考生
  function submitDeleteUser() {
    const list = userListTableRef.value
      ?.getTableRef()
      .getSelectionRows()
      .map((item: ClassUser) => {
        return item.id;
      });

    if (list.length === 0) {
      message("请选择考生", {
        type: "error"
      });
      return;
    }

    // 删除班级考生
    DeleteClassUser({
      list: list
    })
      .then((res: ResponseBody) => {
        handleResponse(res, () => {
          message(res.msg, {
            type: "success"
          });
          onSearchClassUser();
        });
      })
      .catch(err => {
        console.log(err);
        message("操作失败", {
          type: "error"
        });
      });
  }

  function handlePushUserSizeChange(val: number) {
    onSearchStudentList.pageSize = val;
    onSearchClassUser();
  }

  function handlePushUserCurrentChange(val: any) {
    pushUserPagination.currentPage = val;
    onSearchStudentList();
  }

  // 查询系统考生列表
  async function onSearchStudentList() {
    pushUserLoading.value = true;
    const res = await QueryUserList({
      type: UserType.Student,
      status: 0,
      limit: pushUserPagination.pageSize,
      offset: (pushUserPagination.currentPage - 1) * pushUserPagination.pageSize
    });
    handleResponse(res, (data: QueryUserListResponse) => {
      pushUserDataList.value = data.list;
      pushUserPagination.total = data.total;
      pushUserLoading.value = false;
    });
  }

  // 添加班级考生
  function submitPushUser() {
    const list: Array<number> = pushUserTableRef.value
      ?.getTableRef()
      .getSelectionRows()
      .map((item: ClassUser) => {
        return item.id;
      });

    if (list.length === 0) {
      message("请选择考生", {
        type: "error"
      });
      return;
    }

    // 添加班级考生
    PushClassUser({
      class_id: userListClassID.value,
      user_list: list
    })
      .then((res: ResponseBody) => {
        handleResponse(res, () => {
          message(res.msg, {
            type: "success"
          });
          onSearchClassUser();
        });
      })
      .catch(err => {
        console.log(err);
        message("操作失败", {
          type: "error"
        });
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
    userListTableRef,
    userListDataList,
    userListLoading,
    userListPagination,
    userListColumns,
    pushUserTableRef,
    pushUserDataList,
    pushUserLoading,
    pushUserPagination,
    pushUserColumns,
    editDialogTitle,
    editDialogVisible,
    userListDialogTitle,
    userListDialogVisible,
    pushUserDialogTitle,
    pushUserDialogVisible,
    editFormRef,
    editForm,
    editFormType,
    editFormRule,
    buttonClass,
    onSearch,
    onSearchClassUser,
    onSearchStudentList,
    resetForm,
    showEditDialog,
    showUserListDialog,
    showPushUserDialog,
    submitEditForm,
    submitDeleteUser,
    submitPushUser,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleUserListSizeChange,
    handleUserListCurrentChange,
    handlePushUserSizeChange,
    handlePushUserCurrentChange
  };
}
