import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted } from "vue";
import { handleResponse } from "@/api/exam/client/client";
import {
  QueryKnowledgeList,
  QueryKnowledgeListResponse
} from "@/api/exam/modules/knowledge/query_list";
import { CreateKnowledge } from "@/api/exam/modules/knowledge/create";
import { Knowledge } from "@/api/exam/models/knowledge";
import { UpdateKnowledge } from "@/api/exam/modules/knowledge/update";
import { DeleteKnowledge } from "@/api/exam/modules/knowledge/delete";
import { FormInstance, FormRules } from "element-plus";

export function useHook() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    type: ""
  });
  // 表格数据
  const dataList = ref<Array<Knowledge>>([]);
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
      label: "名称",
      prop: "name",
      minWidth: 200
    },
    {
      label: "说明",
      prop: "desc",
      minWidth: 250
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
  const editDialogTitle = ref("新增知识点");
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

  function showEditDialog(type: "create" | "edit", row?: Knowledge) {
    if (type === "edit" && row) {
      editDialogVisible.value = true;
      editDialogTitle.value = "编辑知识点";
      editForm.id = row.id;
      editForm.name = row.name;
      editForm.desc = row.desc;
    } else {
      editDialogVisible.value = true;
      editDialogTitle.value = "新增知识点";
    }
  }

  function submitEditForm() {
    editFormRef.value?.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreateKnowledge({
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
      UpdateKnowledge({
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

  function handleDelete(row: Knowledge) {
    // 删除
    DeleteKnowledge({
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

  function handleSelectionChange(val: Knowledge[]) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const res = await QueryKnowledgeList({
      name: searchForm.name,
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryKnowledgeListResponse) => {
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
