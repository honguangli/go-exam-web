import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { handleResponse } from "@/api/exam/client/client";
import { FormInstance } from "element-plus";
import { dayjs } from "@/utils/dayjs";
import router from "@/router";
import {
  QueryExamList,
  QueryExamListResponse
} from "@/api/exam/modules/exam/query_list";
import { Grade } from "@/api/exam/models/grade";
import { useUserStoreHook } from "@/store/modules/user";

export function useHook() {
  // 筛选表单
  const searchForm = reactive({
    name: ""
  });
  // 表格数据
  const dataList: Ref<Array<Grade>> = ref([]);
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
      label: "考试名称",
      prop: "plan_name",
      minWidth: 200
    },
    {
      label: "考试时间",
      prop: "",
      minWidth: 250,
      formatter: ({ plan_start_time, plan_end_time }) =>
        dayjs.unix(plan_start_time).format("YYYY-MM-DD HH:mm:ss") +
        " 至 " +
        dayjs.unix(plan_end_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "考试时长",
      prop: "duration",
      minWidth: 150,
      formatter: ({ plan_duration }) => {
        if (plan_duration / 60 >= 2) {
          return (
            Math.floor(plan_duration / 60) +
            "小时" +
            (plan_duration % 60) +
            "分钟"
          );
        } else {
          return plan_duration + "分钟";
        }
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  // 开始考试
  function startExam(row: Grade) {
    router.push({ path: "/onlineexam", query: { id: row.id } });
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
    const res = await QueryExamList({
      user_name: useUserStoreHook().username || "",
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryExamListResponse) => {
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
    buttonClass,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    startExam
  };
}
