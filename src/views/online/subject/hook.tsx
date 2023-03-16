import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import { handleResponse } from "@/api/exam/client/client";
import { CreateSubject } from "@/api/exam/modules/subject/create";
import { Subject } from "@/api/exam/models/subject";
import { UpdateSubject } from "@/api/exam/modules/subject/update";
import { DeleteSubject } from "@/api/exam/modules/subject/delete";
import { FormInstance, FormRules } from "element-plus";
import { dayjs } from "@/utils/dayjs";
import { Plan } from "@/api/exam/models/plan";
import router from "@/router";

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
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
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
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  // 编辑对话框
  const editDialogVisible = ref(false);
  const editDialogTitle = ref("新增科目");
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
        message: "请输入不超过50字符的科目名称",
        trigger: "blur"
      }
    ],
    desc: [
      {
        required: false,
        max: 255,
        message: "请输入不超过255字符数的科目说明",
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

  function showEditDialog(type: "create" | "edit", row?: Subject) {
    if (type === "edit" && row) {
      editDialogVisible.value = true;
      editDialogTitle.value = "编辑科目";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.desc = row?.desc;
    } else {
      editDialogVisible.value = true;
      editDialogTitle.value = "新增科目";
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
        CreateSubject({
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
      UpdateSubject({
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
    DeleteSubject({
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

  // 开始考试
  function startExam(row: Plan) {
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

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    // const res = await QuerySubjectList({
    //   name: searchForm.name,
    //   limit: pagination.pageSize,
    //   offset: (pagination.currentPage - 1) * pagination.pageSize
    // });

    // handleResponse(res, (data: QuerySubjectListResponse) => {
    //   dataList.value = data.list;
    //   pagination.total = data.total;
    //   loading.value = false;
    // });

    dataList.value = [
      {
        id: 1,
        name: "2023上半年C语言程序设计",
        paper_id: 1,
        start_time: 1679277600,
        end_time: 1679824800,
        duration: 90,
        publish_time: 0,
        status: 1,
        query_grade: 0,
        create_time: 0,
        update_time: 0,
        memo: ""
      }
    ];
    pagination.total = 1;
    loading.value = false;
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
    handleSelectionChange,
    startExam
  };
}
