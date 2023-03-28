import dayjs from "dayjs";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref, watch } from "vue";
import {
  QueryQuestionList,
  QueryQuestionListResponse
} from "@/api/exam/modules/question/query_list";
import { handleResponse } from "@/api/exam/client/client";
import {
  formatQuestionTypeText,
  getQuestionTypeTagType,
  Question,
  QuestionStatus,
  QuestionType
} from "@/api/exam/models/question";
import { DeleteQuestion } from "@/api/exam/modules/question/delete";
import { UpdateQuestion } from "@/api/exam/modules/question/update";
import { CreateQuestion } from "@/api/exam/modules/question/create";
import {
  QuestionOption,
  QuestionOptionResult
} from "@/api/exam/models/question_option";
import {
  QueryQuestionDetail,
  QueryQuestionDetailResponse
} from "@/api/exam/modules/question/query_detail";
import {
  QueryKnowledgeList,
  QueryKnowledgeListResponse
} from "@/api/exam/modules/knowledge/query_list";
import {
  QuerySubjectList,
  QuerySubjectListResponse
} from "@/api/exam/modules/subject/query_list";
import { Knowledge } from "@/api/exam/models/knowledge";
import { Subject } from "@/api/exam/models/subject";

export function useHook() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    type: ""
  });
  // 表格数据
  const dataList: Ref<Array<Question>> = ref([]);
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
      label: "题干",
      prop: "name",
      minWidth: 200
    },
    {
      label: "题型",
      prop: "type",
      minWidth: 150,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={getQuestionTypeTagType(row.type)}
          effect="plain"
        >
          {formatQuestionTypeText(row.type)}
        </el-tag>
      )
    },
    {
      label: "难度系数",
      prop: "difficulty",
      minWidth: 100
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

  // 科目列表
  const subjectList: Ref<Array<Subject>> = ref([]);

  // 知识点列表
  const knowledgeList: Ref<Array<Knowledge>> = ref([]);

  // 编辑对话框
  const editDialogVisible = ref(false);
  const editDialogTitle = ref("新增试题");

  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editFormType: Ref<"create" | "edit"> = ref("create");
  const editForm = reactive<{
    id: number;
    subject_id: number;
    name: string;
    type: QuestionType;
    content: string;
    tips: string;
    analysis: string;
    difficulty: number;
    knowledge_ids: Array<number>;
    score: number;
    status: QuestionStatus;
    memo: string;
    options: Array<QuestionOption>;
    right_option: number;
    right_options: Array<number>;
  }>({
    id: 0,
    subject_id: 0,
    name: "",
    type: QuestionType.ChoiceSingle,
    content: "",
    tips: "",
    analysis: "",
    difficulty: 0.5,
    knowledge_ids: [],
    score: 1,
    status: QuestionStatus.Enable,
    memo: "",
    options: [],
    right_option: 0,
    right_options: []
  });
  // 更改试题类型时，重置选项正确答案
  watch(
    () => editForm.type,
    value => {
      switch (value) {
        case QuestionType.ChoiceSingle:
        case QuestionType.ChoiceMulti:
          editForm.options = [
            {
              id: 0,
              question_id: 0,
              tag: "",
              content: "",
              is_right: 0,
              memo: ""
            },
            {
              id: 0,
              question_id: 0,
              tag: "",
              content: "",
              is_right: 0,
              memo: ""
            },
            {
              id: 0,
              question_id: 0,
              tag: "",
              content: "",
              is_right: 0,
              memo: ""
            },
            {
              id: 0,
              question_id: 0,
              tag: "",
              content: "",
              is_right: 0,
              memo: ""
            }
          ];
          break;
        case QuestionType.Judge:
          editForm.options = [
            {
              id: 0,
              question_id: 0,
              tag: "",
              content: "",
              is_right: 0,
              memo: ""
            },
            {
              id: 0,
              question_id: 0,
              tag: "",
              content: "",
              is_right: 0,
              memo: ""
            }
          ];
          break;
        case QuestionType.BlankSingle:
          break;
        case QuestionType.BlankMulti:
          break;
        case QuestionType.AnswerSingle:
          break;
        case QuestionType.AnswerMulti:
          break;
        case QuestionType.FileSingle:
          break;
        case QuestionType.FileMulti:
          break;
      }
      editForm.right_option = 0;
      editForm.right_options = [];
    }
  );
  // 更改试题正确答案
  watch(
    [() => editForm.right_option, () => editForm.right_options],
    ([single, multi]) => {
      if (single > 0 && single <= editForm.options.length) {
        editForm.options[single - 1].is_right = QuestionOptionResult.Right;
      }
      if (multi.length > 0) {
        multi.forEach(item => {
          if (item > 0 && item <= editForm.options.length) {
            editForm.options[item - 1].is_right = QuestionOptionResult.Right;
          }
        });
      }
    }
  );
  // const editFormRule2 = reactive<FormRules>({
  //   name: [
  //     {
  //       required: true,
  //       max: 50,
  //       message: "请输入角色名称",
  //       trigger: "blur"
  //     }
  //   ],
  //   code: [
  //     {
  //       required: true,
  //       max: 50,
  //       message: "请输入角色代码",
  //       trigger: "blur"
  //     }
  //   ],
  //   status: [
  //     {
  //       required: true,
  //       message: "请选择角色状态",
  //       trigger: "blur"
  //     }
  //   ],
  //   seq: [
  //     {
  //       required: true,
  //       message: "请选择角色排序",
  //       trigger: "blur"
  //     },
  //     {
  //       type: "integer",
  //       min: 1,
  //       max: 999999,
  //       message: "请输入1~999999之间的正整数",
  //       trigger: "blur"
  //     }
  //   ],
  //   memo: [
  //     {
  //       required: false,
  //       max: 255,
  //       message: "请输入备注",
  //       trigger: "blur"
  //     }
  //   ]
  // });
  const editFormRule = reactive({
    subject_id: [
      {
        required: true,
        message: "请选择科目",
        trigger: "blur"
      }
    ],
    knowledge_ids: [
      {
        required: true,
        message: "请选择知识点",
        trigger: "blur"
      }
    ],
    type: [
      {
        required: true,
        message: "请选择题型",
        trigger: "blur"
      }
    ],
    difficulty: [
      {
        required: true,
        message: "请设置试题难度",
        trigger: "blur"
      }
    ],
    content: [
      {
        required: true,
        message: "请输入题干",
        trigger: "blur"
      }
    ],
    choice_single: [
      {
        required: true,
        message: "请选择正确答案",
        validator: (_rule: any, value: number) => {
          if (value <= 0 || value > editForm.options.length) {
            return new Error("请选择正确答案");
          }
          return true;
        },
        trigger: "blur"
      }
    ],
    choice_multi: [
      {
        required: true,
        message: "请选择正确答案",
        validator: (_rule: any, value: number[]) => {
          if (
            value.length <= 0 ||
            !value.some(v => {
              return v > 0 || v <= editForm.options.length;
            })
          ) {
            return new Error("请选择正确答案");
          }
          return true;
        },
        trigger: "blur"
      }
    ],
    choice_option: [
      {
        required: true,
        message: "请输入选项内容",
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
    if (editFormType.value === "edit" && row) {
      editDialogTitle.value = "编辑试题";
      // 查询
      QueryQuestionDetail({
        id: row.id
      })
        .then(res => {
          handleResponse(res, (data: QueryQuestionDetailResponse) => {
            editForm.id = data.detail.id;
            editForm.subject_id = data.detail.subject_id;
            editForm.name = data.detail.name;
            editForm.type = data.detail.type;
            editForm.content = data.detail.content;
            editForm.tips = data.detail.tips;
            editForm.analysis = data.detail.analysis;
            editForm.difficulty = data.detail.difficulty;
            const knowledgeIds: Array<number> = [];
            data.detail.knowledge_ids.split(",").forEach(item => {
              knowledgeIds.push(parseInt(item));
            });
            editForm.knowledge_ids = knowledgeIds;
            editForm.score = data.detail.score;
            editForm.memo = data.detail.memo;
            editForm.options = data.options;
            editForm.right_option = 0;
            editForm.right_options = [];
            const rights: number[] = [];
            editForm.options.forEach((item, index) => {
              if (item.is_right === QuestionOptionResult.Right) {
                rights.push(index + 1);
              }
            });
            if (rights.length > 0) {
              switch (editForm.type) {
                case QuestionType.ChoiceSingle:
                case QuestionType.Judge:
                  editForm.right_option = rights[0];
                  break;
                case QuestionType.ChoiceMulti:
                  editForm.right_options = rights;
                  break;
              }
            }
            console.log("rights", rights, editForm);
          });
        })
        .catch(err => {
          console.log(err);
          message("获取数据失败", {
            type: "error"
          });
        });
    } else {
      editDialogTitle.value = "新增试题";
      editForm.id = 0;
      editForm.name = "";
      editForm.type = QuestionType.ChoiceSingle;
      editForm.content = "";
      editForm.tips = "";
      editForm.analysis = "";
      editForm.difficulty = 0.5;
      editForm.knowledge_ids = [];
      editForm.score = 1;
      editForm.memo = "";
      editForm.options = [
        {
          id: 0,
          question_id: 0,
          tag: "",
          content: "",
          is_right: 0,
          memo: ""
        },
        {
          id: 0,
          question_id: 0,
          tag: "",
          content: "",
          is_right: 0,
          memo: ""
        },
        {
          id: 0,
          question_id: 0,
          tag: "",
          content: "",
          is_right: 0,
          memo: ""
        },
        {
          id: 0,
          question_id: 0,
          tag: "",
          content: "",
          is_right: 0,
          memo: ""
        }
      ];
      editForm.right_option = 0;
      editForm.right_options = [];
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

      // const options: {
      //   question_id: number; // int
      //   tag: string; // string
      //   content: string; // string
      //   is_right: number; // int
      //   memo: string; // string
      // }[] = [];

      if (editForm.id === 0) {
        // 创建
        CreateQuestion({
          question: {
            subject_id: editForm.subject_id,
            name: editForm.name.substring(0, 100),
            type: editForm.type,
            content: editForm.content,
            tips: editForm.tips,
            analysis: editForm.analysis,
            difficulty: editForm.difficulty,
            knowledge_ids: editForm.knowledge_ids.join(","),
            score: editForm.score,
            memo: editForm.memo
          },
          options: editForm.options
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
        question: {
          id: editForm.id,
          subject_id: editForm.subject_id,
          name: editForm.name.substring(0, 100),
          type: editForm.type,
          content: editForm.content,
          tips: editForm.tips,
          analysis: editForm.analysis,
          difficulty: editForm.difficulty,
          knowledge_ids: editForm.knowledge_ids.join(","),
          score: editForm.score,
          memo: editForm.memo
        },
        options: editForm.options
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

  function transformOptionTag(index: number) {
    const ans = [];
    while (index > 0) {
      const a0 = ((index - 1) % 26) + 1;
      ans.push(String.fromCharCode(a0 - 1 + "A".charCodeAt(0)));
      index = Math.floor((index - a0) / 26);
    }
    ans.reverse();
    return ans.join("");
  }

  // 添加选项
  function addOption(index: number) {
    if (editForm.options.length >= 7) {
      return;
    }
    editForm.options.splice(index + 1, 0, {
      id: 0,
      question_id: 0,
      tag: "",
      content: "",
      is_right: 0,
      memo: ""
    });
  }

  // 删除选项
  function deleteOption(index: number) {
    if (editForm.options.length <= 2) {
      return;
    }
    editForm.options.splice(index, 1);
  }

  async function onSearch() {
    loading.value = true;
    const res = await QueryQuestionList({
      name: searchForm.name,
      type: parseInt(searchForm.type) || 0,
      status: -1,
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

  async function querySubjectList() {
    const res = await QuerySubjectList({
      name: searchForm.name,
      limit: 1000,
      offset: 0
    });

    handleResponse(res, (data: QuerySubjectListResponse) => {
      subjectList.value = data.list;
    });
  }

  async function queryKnowledgeList() {
    const res = await QueryKnowledgeList({
      name: searchForm.name,
      limit: 1000,
      offset: 0
    });

    handleResponse(res, (data: QueryKnowledgeListResponse) => {
      knowledgeList.value = data.list;
    });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
    querySubjectList();
    queryKnowledgeList();
  });

  watch(
    () => editForm.type,
    type => {
      console.log(`type is: ${type}`);
    }
  );

  return {
    searchForm,
    loading,
    columns,
    dataList,
    pagination,
    subjectList,
    knowledgeList,
    editDialogVisible,
    editDialogTitle,
    editFormRef,
    editForm,
    editFormRule,
    buttonClass,
    onSearch,
    resetForm,
    showEditDialog,
    submitEditForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    transformOptionTag,
    addOption,
    deleteOption
  };
}
