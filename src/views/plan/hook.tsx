import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted } from "vue";
import { handleResponse } from "@/api/exam/client/client";
import {
  QueryPlanList,
  QueryPlanListResponse
} from "@/api/exam/modules/plan/query_list";
import { CreatePlan } from "@/api/exam/modules/plan/create";
import { Plan } from "@/api/exam/models/plan";
import { UpdatePlan } from "@/api/exam/modules/plan/update";
import { DeletePlan } from "@/api/exam/modules/plan/delete";
import { FormInstance, FormRules } from "element-plus";

export function useHook() {
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
      label: "考试名称",
      prop: "name",
      minWidth: 200
    },
    {
      label: "考试时间",
      prop: "",
      minWidth: 250
    },
    {
      label: "考试时长",
      prop: "duration",
      minWidth: 150
    },
    {
      label: "公布时间",
      prop: "publish_time",
      minWidth: 200
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 150
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
  const editDialogTitle = ref("新增考试计划");
  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editForm = reactive({
    id: 0,
    name: "",
    desc: ""
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
    if (type === "edit") {
      editDialogVisible.value = true;
      editDialogTitle.value = "编辑考试计划";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.desc = row?.desc;
    } else {
      editDialogVisible.value = true;
      editDialogTitle.value = "新增考试计划";
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
        CreatePlan({
          name: editForm.name,
          desc: editForm.desc
        })
          .then(res => {
            handleResponse(res, () => {
              message(res.msg, {
                type: "success"
              });
              editDialogVisible.value = false;
              editForm.id = 0;
              editForm.name = "";
              editForm.desc = "";
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
        desc: editForm.desc
      })
        .then(res => {
          handleResponse(res, () => {
            message(res.msg, {
              type: "success"
            });
            editDialogVisible.value = false;
            editForm.id = 0;
            editForm.name = "";
            editForm.desc = "";
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
