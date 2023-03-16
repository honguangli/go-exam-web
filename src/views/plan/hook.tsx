import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { handleResponse, ResponseBody } from "@/api/exam/client/client";
import {
  QueryPlanList,
  QueryPlanListResponse
} from "@/api/exam/modules/plan/query_list";
import { CreatePlan } from "@/api/exam/modules/plan/create";
import {
  formatPlanStatusText,
  getPlanStatusTagType,
  Plan,
  PlanStatus
} from "@/api/exam/models/plan";
import { UpdatePlan } from "@/api/exam/modules/plan/update";
import { DeletePlan } from "@/api/exam/modules/plan/delete";
import { FormInstance, FormRules } from "element-plus";
import {
  QueryPlanClassList,
  QueryPlanClassListResponse
} from "../../api/exam/modules/plan/query_class_list";
import { PlanClass } from "@/api/exam/models/plan_class";
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
import { PushPlanClass } from "@/api/exam/modules/plan/push_class";
import { DeletePlanClass } from "@/api/exam/modules/plan/delete_class";
import { dayjs } from "@/utils/dayjs";

export function useHook() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    type: ""
  });
  // 表格数据
  const dataList: Ref<Array<Plan>> = ref([]);
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
      hide: ({ checkList }: { checkList: Array<string> }) =>
        !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }: { checkList: Array<string> }) =>
        !checkList.includes("序号列")
    },
    {
      label: "ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "考试名称",
      prop: "name",
      minWidth: 200
    },
    {
      label: "考试时间",
      prop: "",
      minWidth: 250,
      formatter: ({ start_time, end_time }) =>
        dayjs.unix(start_time).format("YYYY-MM-DD HH:mm:ss") +
        " 至 " +
        dayjs.unix(end_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "考试时长",
      prop: "duration",
      minWidth: 150,
      formatter: ({ duration }) => {
        if (duration / 60 >= 2) {
          return Math.floor(duration / 60) + "小时" + (duration % 60) + "分钟";
        } else {
          return duration + "分钟";
        }
      }
    },
    {
      label: "发布时间",
      prop: "publish_time",
      minWidth: 200,
      formatter: ({ publish_time }) => {
        if (publish_time <= 0) {
          return "-";
        }
        return dayjs.unix(publish_time).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 150,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getPlanStatusTagType(row.status)}
          effect="plain"
        >
          {formatPlanStatusText(row.status)}
        </el-tag>
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 260,
      slot: "operation"
    }
  ];

  // 班级表格
  const classListTableRef = ref();
  // 表格数据
  const classListDataList: Ref<Array<PlanClass>> = ref([]);
  // 表格加载状态
  const classListLoading = ref(true);
  // 表格分页
  const classListPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  // 表格列
  const classListColumns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }: { checkList: Array<string> }) =>
        !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }: { checkList: Array<string> }) =>
        !checkList.includes("序号列")
    },
    {
      label: "ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "班级名称",
      prop: "class_name",
      minWidth: 150
    }
  ];

  // 添加班级表格
  const pushClassTableRef = ref();
  // 表格数据
  const pushClassDataList: Ref<Array<Class>> = ref([]);
  // 表格加载状态
  const pushClassLoading = ref(true);
  // 表格分页
  const pushClassPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  // 表格列
  const pushClassColumns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }: { checkList: Array<string> }) =>
        !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }: { checkList: Array<string> }) =>
        !checkList.includes("序号列")
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
    }
  ];

  // 编辑对话框
  const editDialogVisible = ref(false);
  const editDialogTitle = ref("新增考试计划");
  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editForm = reactive({
    id: 0,
    name: "",
    paper_id: 0,
    start_time: 0,
    end_time: 0,
    duration: 0,
    publish_time: 0,
    status: PlanStatus.Draft,
    query_grade: 0,
    memo: ""
  });
  const editRule = reactive<FormRules>({
    name: [
      {
        required: true,
        max: 50,
        message: "请输入不超过50字符的知识点名称",
        trigger: "blur"
      }
    ],
    desc: [
      {
        required: false,
        max: 255,
        message: "请输入知识点说明",
        trigger: "blur"
      }
    ]
  });

  // 班级列表对话框
  const classListDialogTitle = ref("班级列表");
  const classListDialogVisible = ref(false);
  const classListPlanID = ref(0);

  // 添加班级对话框
  const pushClassDialogTitle = ref("添加班级");
  const pushClassDialogVisible = ref(false);

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function showEditDialog(type: "create" | "edit", row?: Plan) {
    if (type === "edit" && row) {
      editDialogTitle.value = "编辑考试计划";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.paper_id = row?.paper_id;
      editForm.start_time = row?.start_time;
      editForm.end_time = row?.end_time;
      editForm.duration = row?.duration;
      editForm.publish_time = row?.publish_time;
      editForm.status = row?.status;
      editForm.query_grade = row?.query_grade;
      editForm.memo = row?.memo;
    } else {
      editDialogTitle.value = "新增考试计划";
      editForm.id = 0;
      editForm.name = "";
      editForm.paper_id = 0;
      editForm.start_time = 0;
      editForm.end_time = 0;
      editForm.duration = 0;
      editForm.publish_time = 0;
      editForm.status = PlanStatus.Draft;
      editForm.query_grade = 0;
      editForm.memo = "";
    }
    editDialogVisible.value = true;
  }

  // 弹出考试班级对话框
  function showPlanClassListDialog(row: Class) {
    classListPlanID.value = row.id;
    onSearchPlanClassList();
    classListDialogVisible.value = true;
  }

  // 弹出添加班级对话框
  function showPushClassDialog() {
    onSearchClassList();
    pushClassDialogVisible.value = true;
  }

  function submitEditForm() {
    editFormRef.value.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreatePlan({
          name: editForm.name,
          paper_id: editForm.paper_id,
          start_time: editForm.start_time,
          end_time: editForm.end_time,
          duration: editForm.duration,
          publish_time: editForm.publish_time,
          status: editForm.status,
          query_grade: editForm.query_grade,
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
      UpdatePlan({
        id: editForm.id,
        name: editForm.name,
        paper_id: editForm.paper_id,
        start_time: editForm.start_time,
        end_time: editForm.end_time,
        duration: editForm.duration,
        publish_time: editForm.publish_time,
        status: editForm.status,
        query_grade: editForm.query_grade,
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

  function handleDelete(row: Plan) {
    // 删除
    DeletePlan({
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
    const res = await QueryPlanList({
      name: searchForm.name,
      status: 0,
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryPlanListResponse) => {
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

  function handleClassListSizeChange(val: number) {
    classListPagination.pageSize = val;
    onSearchPlanClassList();
  }

  function handleClassListCurrentChange(val: any) {
    classListPagination.currentPage = val;
    onSearchPlanClassList();
  }

  // 查询考试班级列表
  async function onSearchPlanClassList() {
    classListLoading.value = true;
    const res = await QueryPlanClassList({
      plan_id: classListPlanID.value,
      limit: classListPagination.pageSize,
      offset:
        (classListPagination.currentPage - 1) * classListPagination.pageSize
    });
    handleResponse(res, (data: QueryPlanClassListResponse) => {
      classListDataList.value = data.list;
      classListPagination.total = data.total;
      classListLoading.value = false;
    });
  }

  // 删除考试班级
  function submitDeleteClass() {
    const list = classListTableRef.value
      ?.getTableRef()
      .getSelectionRows()
      .map((item: PlanClass) => {
        return item.id;
      });

    if (list.length === 0) {
      message("请选择班级", {
        type: "error"
      });
      return;
    }

    // 删除考试班级
    DeletePlanClass({
      list: list
    })
      .then((res: ResponseBody) => {
        handleResponse(res, () => {
          message(res.msg, {
            type: "success"
          });
          onSearchPlanClassList();
        });
      })
      .catch(err => {
        console.log(err);
        message("操作失败", {
          type: "error"
        });
      });
  }

  function handlePushClassSizeChange(val: number) {
    pushClassPagination.pageSize = val;
    onSearchClassList();
  }

  function handlePushClassCurrentChange(val: any) {
    pushClassPagination.currentPage = val;
    onSearchClassList();
  }

  // 查询系统班级列表
  async function onSearchClassList() {
    pushClassLoading.value = true;
    const res = await QueryClassList({
      status: ClassStatus.Enable,
      limit: pushClassPagination.pageSize,
      offset:
        (pushClassPagination.currentPage - 1) * pushClassPagination.pageSize
    });
    handleResponse(res, (data: QueryClassListResponse) => {
      pushClassDataList.value = data.list;
      pushClassPagination.total = data.total;
      pushClassLoading.value = false;
    });
  }

  // 添加考试班级
  function submitPushClass() {
    const list: Array<number> = pushClassTableRef.value
      ?.getTableRef()
      .getSelectionRows()
      .map((item: Class) => {
        return item.id;
      });

    if (list.length === 0) {
      message("请选择班级", {
        type: "error"
      });
      return;
    }

    // 添加考试班级
    PushPlanClass({
      plan_id: classListPlanID.value,
      class_list: list
    })
      .then((res: ResponseBody) => {
        handleResponse(res, () => {
          message(res.msg, {
            type: "success"
          });
          onSearchPlanClassList();
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
    classListTableRef,
    classListDataList,
    classListLoading,
    classListPagination,
    classListColumns,
    pushClassTableRef,
    pushClassDataList,
    pushClassLoading,
    pushClassPagination,
    pushClassColumns,
    editDialogVisible,
    editDialogTitle,
    classListDialogTitle,
    classListDialogVisible,
    pushClassDialogTitle,
    pushClassDialogVisible,
    editFormRef,
    editForm,
    editRule,
    buttonClass,
    onSearch,
    onSearchPlanClassList,
    onSearchClassList,
    resetForm,
    showEditDialog,
    showPlanClassListDialog,
    showPushClassDialog,
    submitEditForm,
    submitDeleteClass,
    submitPushClass,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleClassListSizeChange,
    handleClassListCurrentChange,
    handlePushClassSizeChange,
    handlePushClassCurrentChange
  };
}
