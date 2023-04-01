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
      label: "难度",
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
  // 选项缓存
  type OptionCache = {
    type: QuestionType;
    options: Array<QuestionOption>;
    right_option: number;
    right_options: Array<number>;
  };

  const optionsCache = reactive<{
    choiceSingle: OptionCache;
    choiceMulti: OptionCache;
    judge: OptionCache;
    blankSingle: OptionCache;
    blankMulti: OptionCache;
    answerSingle: OptionCache;
    answerMulti: OptionCache;
    fileSingle: OptionCache;
    fileMulti: OptionCache;
  }>({
    choiceSingle: {
      type: QuestionType.ChoiceSingle,
      options: [],
      right_option: 0,
      right_options: []
    },
    choiceMulti: {
      type: QuestionType.ChoiceMulti,
      options: [],
      right_option: 0,
      right_options: []
    },
    judge: {
      type: QuestionType.Judge,
      options: [],
      right_option: 0,
      right_options: []
    },
    blankSingle: {
      type: QuestionType.BlankSingle,
      options: [],
      right_option: 0,
      right_options: []
    },
    blankMulti: {
      type: QuestionType.BlankMulti,
      options: [],
      right_option: 0,
      right_options: []
    },
    answerSingle: {
      type: QuestionType.AnswerSingle,
      options: [],
      right_option: 0,
      right_options: []
    },
    answerMulti: {
      type: QuestionType.AnswerMulti,
      options: [],
      right_option: 0,
      right_options: []
    },
    fileSingle: {
      type: QuestionType.FileSingle,
      options: [],
      right_option: 0,
      right_options: []
    },
    fileMulti: {
      type: QuestionType.FileMulti,
      options: [],
      right_option: 0,
      right_options: []
    }
  });
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
    initOptionsCache();
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
            // 设置选项
            setOptions(editForm.type, data.options);
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
      // 设置选项
      setOptions(editForm.type, []);
    }
    editDialogVisible.value = true;
  }

  // 创建/更新信息
  function submitEditForm() {
    editFormRef.value?.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreateQuestion({
          question: {
            subject_id: editForm.subject_id,
            name: editForm.name.substring(0, 500),
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
          name: editForm.name.substring(0, 500),
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

  function handleSelectionChange(val: Question[]) {
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

  // 初始化选项列表缓存
  function initOptionsCache() {
    optionsCache.choiceSingle.options = [
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
    optionsCache.choiceSingle.right_option = 0;
    optionsCache.choiceSingle.right_options = [];

    optionsCache.choiceMulti.options = [
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
    optionsCache.choiceMulti.right_option = 0;
    optionsCache.choiceMulti.right_options = [];

    optionsCache.judge.options = [
      {
        id: 0,
        question_id: 0,
        tag: "",
        content: "正确",
        is_right: 0,
        memo: ""
      },
      {
        id: 0,
        question_id: 0,
        tag: "",
        content: "错误",
        is_right: 0,
        memo: ""
      }
    ];
    optionsCache.judge.right_option = 0;
    optionsCache.judge.right_options = [];

    optionsCache.blankSingle.options = [];
    optionsCache.blankSingle.right_option = 0;
    optionsCache.blankSingle.right_options = [];

    optionsCache.blankMulti.options = [];
    optionsCache.blankMulti.right_option = 0;
    optionsCache.blankMulti.right_options = [];

    optionsCache.answerSingle.options = [];
    optionsCache.answerSingle.right_option = 0;
    optionsCache.answerSingle.right_options = [];

    optionsCache.answerMulti.options = [];
    optionsCache.answerMulti.right_option = 0;
    optionsCache.answerMulti.right_options = [];

    optionsCache.fileSingle.options = [];
    optionsCache.fileSingle.right_option = 0;
    optionsCache.fileSingle.right_options = [];

    optionsCache.fileMulti.options = [];
    optionsCache.fileMulti.right_option = 0;
    optionsCache.fileMulti.right_options = [];
  }

  // 设置选项列表
  function setOptions(qt: QuestionType, options: Array<QuestionOption>) {
    let cache: OptionCache;
    switch (qt) {
      case QuestionType.ChoiceSingle:
        cache = optionsCache.choiceSingle;
        break;
      case QuestionType.ChoiceMulti:
        cache = optionsCache.choiceMulti;
        break;
      case QuestionType.Judge:
        cache = optionsCache.judge;
        break;
      case QuestionType.BlankSingle:
        cache = optionsCache.blankSingle;
        break;
      case QuestionType.BlankMulti:
        cache = optionsCache.blankMulti;
        break;
      case QuestionType.AnswerSingle:
        cache = optionsCache.answerSingle;
        break;
      case QuestionType.AnswerMulti:
        cache = optionsCache.answerMulti;
        break;
      case QuestionType.FileSingle:
        cache = optionsCache.fileSingle;
        break;
      case QuestionType.FileMulti:
        cache = optionsCache.fileMulti;
        break;
      default:
        return;
    }
    if (options.length > 0) {
      cache.options = options;
    }
    const rights: number[] = [];
    cache.options.forEach((item, index) => {
      if (item.is_right === QuestionOptionResult.Right) {
        rights.push(index + 1);
      }
    });
    if (rights.length == 0) {
      cache.right_option = 0;
      cache.right_options = [];
    } else {
      switch (cache.type) {
        case QuestionType.ChoiceSingle:
        case QuestionType.Judge:
          cache.right_option = rights[0];
          cache.right_options = [];
          break;
        case QuestionType.ChoiceMulti:
          cache.right_option = 0;
          cache.right_options = rights;
          break;
      }
    }

    editForm.options = cache.options;
    editForm.right_option = cache.right_option;
    editForm.right_options = cache.right_options;
  }

  // 设置正确选项
  // @param qt 试题类型
  // @param rights 正确选项索引，取值范围为[ 1, options.length ]
  function setOptionRight(qt: QuestionType, rights: number[]) {
    let cache: OptionCache;
    switch (qt) {
      case QuestionType.ChoiceSingle:
        cache = optionsCache.choiceSingle;
        break;
      case QuestionType.ChoiceMulti:
        cache = optionsCache.choiceMulti;
        break;
      case QuestionType.Judge:
        cache = optionsCache.judge;
        break;
      case QuestionType.BlankSingle:
        cache = optionsCache.blankSingle;
        break;
      case QuestionType.BlankMulti:
        cache = optionsCache.blankMulti;
        break;
      case QuestionType.AnswerSingle:
        cache = optionsCache.answerSingle;
        break;
      case QuestionType.AnswerMulti:
        cache = optionsCache.answerMulti;
        break;
      case QuestionType.FileSingle:
        cache = optionsCache.fileSingle;
        break;
      case QuestionType.FileMulti:
        cache = optionsCache.fileMulti;
        break;
      default:
        return;
    }

    cache.options.forEach((item, index) => {
      if (!rights.includes(index + 1)) {
        item.is_right = QuestionOptionResult.Wrong;
      } else {
        item.is_right = QuestionOptionResult.Right;
      }
    });
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

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
    querySubjectList();
    queryKnowledgeList();
  });

  // 更改试题类型时，重新获取选项
  watch(
    () => editForm.type,
    value => {
      setOptions(value, []);
    }
  );

  // 更改试题正确答案
  watch(
    [() => editForm.right_option, () => editForm.right_options],
    ([single, multi]) => {
      setOptionRight(editForm.type, [single, ...multi]);
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
