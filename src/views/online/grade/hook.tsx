import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, Ref } from "vue";
import { handleResponse } from "@/api/exam/client/client";
import { FormInstance } from "element-plus";
import {
  QueryUserGradeList,
  QueryUserGradeListResponse
} from "@/api/exam/modules/grade/query_user_grade_list";
import { useUserStoreHook } from "@/store/modules/user";
import { Grade, GradeStatus } from "@/api/exam/models/grade";
import { PlanQueryGrade } from "@/api/exam/models/plan";

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
      prop: "name",
      minWidth: 200
    },
    {
      label: "考试成绩",
      prop: "status",
      minWidth: 200,
      formatter: ({ plan_query_grade, status, score }) => {
        switch (status) {
          case GradeStatus.Default:
          case GradeStatus.UnSubmit:
            return "缺考";
          case GradeStatus.Submit:
          case GradeStatus.Marking:
            return "未公布";
          case GradeStatus.Marded:
            if (plan_query_grade !== PlanQueryGrade.Enable) {
              return "未公布";
            }
            return score;
          case GradeStatus.Cancel:
            return "考试取消";
          default:
            return "未公布";
        }
      }
    },
    // {
    //   label: "考试时间",
    //   prop: "start_time",
    //   minWidth: 200,
    //   formatter: ({ status, start_time }) => {
    //     if (status === 0) {
    //       return "缺考";
    //     }
    //     return dayjs.unix(start_time).format("YYYY-MM-DD HH:mm:ss");
    //   }
    // },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

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
    const res = await QueryUserGradeList({
      user_name: useUserStoreHook().username || "",
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryUserGradeListResponse) => {
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
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
