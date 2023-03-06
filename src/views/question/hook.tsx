import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, shallowRef } from "vue";
import {
  QueryQuestionList,
  QueryQuestionListResponse
} from "@/api/exam/modules/question/query_list";
import { handleResponse } from "@/api/exam/client/client";
import { delay } from "@pureadmin/utils";

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
  const switchLoadMap = ref({});
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
      label: "题干",
      prop: "name",
      minWidth: 200
    },
    {
      label: "类型",
      prop: "type",
      minWidth: 150,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.type === 1 ? "danger" : ""}
          effect="plain"
        >
          {row.type === 1 ? "内置" : "自定义"}
        </el-tag>
      )
    },
    {
      label: "显示顺序",
      prop: "sort",
      minWidth: 100
    },
    {
      label: "状态",
      minWidth: 130,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已开启"
          inactive-text="已关闭"
          inline-prompt
          //onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
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
  const editDialogTitle = ref("新增试题");
  // 编辑表单
  const editForm = reactive({
    id: 0,
    subject_id: null,
    name: "",
    type: 0,
    content: "",
    tips: "",
    analysis: "",
    difficulty: "",
    score: 0,
    memo: ""
  });
  // 编辑器
  const editorRef = shallowRef();
  const toolbarConfig: any = { excludeKeys: "fullScreen" };
  const editorConfig = { placeholder: "请输入内容..." };

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>角色吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改角色状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleCreate() {
    editDialogVisible.value = true;
    editDialogTitle.value = "新增试题";
  }

  function handleUpdate(row) {
    console.log(row);
    editDialogVisible.value = true;
    editDialogTitle.value = "编辑试题";
  }

  function handleDelete(row) {
    console.log(row);
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);

    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: any) {
    console.log(`current page: ${val}`);

    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    console.log("search", pagination.pageSize, pagination.currentPage);
    loading.value = true;
    const res = await QueryQuestionList({
      name: searchForm.name,
      type: parseInt(searchForm.type) || 0,
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryQuestionListResponse) => {
      console.log("handle", data);
      dataList.value = data.list;
      pagination.total = data.total;
      setTimeout(() => {
        loading.value = false;
      }, 500);
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
    editForm,
    toolbarConfig,
    editorRef,
    editorConfig,
    buttonClass,
    onSearch,
    resetForm,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
