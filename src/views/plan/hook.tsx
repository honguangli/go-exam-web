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
  Plan
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
import { Paper, PaperStatus } from "@/api/exam/models/paper";
import {
  QueryPaperList,
  QueryPaperListResponse
} from "@/api/exam/modules/paper/query_list";

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
      width: 220,
      slot: "operation"
    }
  ];

  // 试卷表格
  const paperListTableRef = ref();
  // 筛选表单
  const searchPaperForm = reactive({
    name: ""
  });
  // 表格数据
  const paperListDataList: Ref<Array<Paper>> = ref([]);
  // 表格加载状态
  const paperListLoading = ref(true);
  // 表格分页
  const paperListPagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  // 表格列
  const paperListColumns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      minWidth: 100
    },
    {
      label: "试卷名称",
      prop: "name",
      minWidth: 200
    },
    {
      label: "难度",
      prop: "difficulty",
      minWidth: 150
    },
    {
      label: "总分",
      prop: "score",
      minWidth: 150
    },
    {
      label: "及格分",
      prop: "pass_score",
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
    paper_name: "",
    start_time: "",
    end_time: "",
    duration: 120,
    memo: ""
  });
  const editRule = reactive<FormRules>({
    name: [
      {
        required: true,
        max: 50,
        message: "请输入不超过50字符的考试名称",
        trigger: "blur"
      }
    ],
    start_time: [
      {
        required: true,
        message: "请选择考试开始时间",
        trigger: "blur"
      }
    ],
    end_time: [
      {
        required: true,
        message: "请选择考试结束时间",
        trigger: "blur"
      },
      {
        message: "考试结束时间不能小于开始时间",
        validator: (_rule: any, value: string) => {
          if (parseInt(value) <= parseInt(editForm.start_time)) {
            return new Error("考试结束时间不能小于开始时间");
          }
          return true;
        },
        trigger: "blur"
      }
    ],
    memo: [
      {
        required: false,
        max: 255,
        message: "请输入不超过255字符的考试计划备注说明",
        trigger: "blur"
      }
    ]
  });

  // 选择试卷对话框
  const paperListDialogTitle = ref("试卷列表");
  const paperListDialogVisible = ref(false);

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
      editForm.paper_name = row?.paper_name;
      editForm.start_time = row?.start_time + "";
      editForm.end_time = row?.end_time + "";
      editForm.duration = row?.duration;
      editForm.memo = row?.memo;
    } else {
      editDialogTitle.value = "新增考试计划";
      editForm.id = 0;
      editForm.name = "";
      editForm.paper_id = 0;
      editForm.paper_name = "";
      editForm.start_time = "";
      editForm.end_time = "";
      editForm.duration = 120;
      editForm.memo = "";
    }
    editDialogVisible.value = true;
  }

  // 弹出选择试卷对话框
  function showPaperListDialog() {
    onSearchPaperList();
    paperListDialogVisible.value = true;
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
    editFormRef.value?.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreatePlan({
          name: editForm.name,
          paper_id: editForm.paper_id,
          start_time: parseInt(editForm.start_time),
          end_time: parseInt(editForm.end_time),
          duration: editForm.duration,
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
        start_time: parseInt(editForm.start_time),
        end_time: parseInt(editForm.end_time),
        duration: editForm.duration,
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

  function handleSelectionChange(val: any) {
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

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  // 试卷
  function handlePaperListSizeChange(val: number) {
    paperListPagination.pageSize = val;
    onSearchPaperList();
  }

  function handlePaperListCurrentChange(val: any) {
    paperListPagination.currentPage = val;
    onSearchPaperList();
  }

  // 查询试卷列表
  async function onSearchPaperList() {
    paperListLoading.value = true;
    const res = await QueryPaperList({
      name: searchPaperForm.name,
      status: PaperStatus.Release,
      limit: paperListPagination.pageSize,
      offset:
        (paperListPagination.currentPage - 1) * paperListPagination.pageSize
    });
    handleResponse(res, (data: QueryPaperListResponse) => {
      paperListDataList.value = data.list;
      paperListPagination.total = data.total;
      paperListLoading.value = false;
    });
  }

  // 选择试卷
  function selectPaper(paper: Paper) {
    editForm.paper_id = paper.id;
    editForm.paper_name = paper.name;
    paperListDialogVisible.value = false;
  }

  // 考试班级
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
    searchPaperForm,
    paperListTableRef,
    paperListDataList,
    paperListLoading,
    paperListPagination,
    paperListColumns,
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
    paperListDialogTitle,
    paperListDialogVisible,
    classListDialogTitle,
    classListDialogVisible,
    pushClassDialogTitle,
    pushClassDialogVisible,
    editFormRef,
    editForm,
    editRule,
    buttonClass,
    onSearch,
    onSearchPaperList,
    onSearchPlanClassList,
    onSearchClassList,
    resetForm,
    showEditDialog,
    showPaperListDialog,
    showPlanClassListDialog,
    showPushClassDialog,
    selectPaper,
    submitEditForm,
    submitDeleteClass,
    submitPushClass,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handlePaperListSizeChange,
    handlePaperListCurrentChange,
    handleClassListSizeChange,
    handleClassListCurrentChange,
    handlePushClassSizeChange,
    handlePushClassCurrentChange
  };
}
