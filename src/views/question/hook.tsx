import dayjs from "dayjs";
import { message } from "@/utils/message";
import { FormInstance, FormRules } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref } from "vue";
import {
  QueryQuestionList,
  QueryQuestionListResponse
} from "@/api/exam/modules/question/query_list";
import { handleResponse } from "@/api/exam/client/client";
import {
  Question,
  QuestionStatus,
  QuestionType
} from "@/api/exam/models/question";
import { DeleteQuestion } from "@/api/exam/modules/question/delete";
import { UpdateQuestion } from "@/api/exam/modules/question/update";
import { CreateQuestion } from "@/api/exam/modules/question/create";

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
  const editFormRef = ref<FormInstance>();
  const editFormType: Ref<"create" | "edit"> = ref("create");
  const editForm = reactive({
    id: 0,
    subject_id: 0,
    name: "",
    type: QuestionType.ChoiceSingle,
    content: "",
    tips: "",
    analysis: "",
    difficulty: 0,
    knowledge_ids: "",
    score: 1,
    status: QuestionStatus.Enable,
    memo: ""
  });
  const editFormRule = reactive<FormRules>({
    name: [
      {
        required: true,
        max: 50,
        message: "请输入角色名称",
        trigger: "blur"
      }
    ],
    code: [
      {
        required: true,
        max: 50,
        message: "请输入角色代码",
        trigger: "blur"
      }
    ],
    status: [
      {
        required: true,
        message: "请选择角色状态",
        trigger: "blur"
      }
    ],
    seq: [
      {
        required: true,
        message: "请选择角色排序",
        trigger: "blur"
      },
      {
        type: "integer",
        min: 1,
        max: 999999,
        message: "请输入1~999999之间的正整数",
        trigger: "blur"
      }
    ],
    memo: [
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
  function showEditDialog(editType: "create" | "edit", row?: Question) {
    editFormType.value = editType;
    if (editFormType.value === "edit") {
      editDialogTitle.value = "编辑角色";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.type = row?.type;
      editForm.content = row?.content;
      editForm.tips = row?.tips;
      editForm.analysis = row?.analysis;
      editForm.difficulty = row?.difficulty;
      editForm.score = row?.score;
      editForm.memo = row?.memo;
    } else {
      editDialogTitle.value = "新增角色";
      editForm.id = 0;
      editForm.name = "";
      editForm.type = QuestionType.ChoiceSingle;
      editForm.content = "";
      editForm.tips = "";
      editForm.analysis = "";
      editForm.difficulty = 0;
      editForm.score = 1;
      editForm.memo = "";
    }
    editDialogVisible.value = true;
  }

  // 创建/更新信息
  function submitEditForm() {
    editFormRef.value.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreateQuestion({
          subject_id: 0,
          name: editForm.name,
          type: editForm.type,
          content: editForm.content,
          tips: editForm.tips,
          analysis: editForm.analysis,
          difficulty: editForm.difficulty,
          knowledge_ids: "",
          score: editForm.score,
          status: 0,
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
      UpdateQuestion({
        id: editForm.id,
        name: editForm.name,
        type: editForm.type,
        content: editForm.content,
        tips: editForm.tips,
        analysis: editForm.analysis,
        difficulty: editForm.difficulty,
        score: editForm.score,
        memo: editForm.memo,
        subject_id: 0,
        knowledge_ids: "",
        status: 0
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

  function handleDelete(row: Question) {
    // 删除
    DeleteQuestion({
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
    editFormRule,
    // toolbarConfig,
    // editorRef,
    // editorConfig,
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
