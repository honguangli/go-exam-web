import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { FormInstance, FormRules } from "element-plus";
import { handleResponse } from "@/api/exam/client/client";
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

export function useQuestion() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
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
      width: 220,
      slot: "operation"
    }
  ];

  // 编辑对话框
  const editDialogTitle = ref("新增班级");
  const editDialogVisible = ref(false);

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
    if (editFormType.value === "edit") {
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
