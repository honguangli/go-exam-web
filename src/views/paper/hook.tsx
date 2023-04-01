import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, computed, onMounted, Ref, watch } from "vue";
import { handleResponse } from "@/api/exam/client/client";
import {
  QueryPaperList,
  QueryPaperListResponse
} from "@/api/exam/modules/paper/query_list";
import { CreatePaper } from "@/api/exam/modules/paper/create";
import { Paper, PaperStatus } from "@/api/exam/models/paper";
import { UpdatePaper } from "@/api/exam/modules/paper/update";
import { DeletePaper } from "@/api/exam/modules/paper/delete";
import { FormInstance, FormRules } from "element-plus";
import { QuestionType } from "@/api/exam/models/question";
import { QuestionOption } from "@/api/exam/models/question_option";

export function useHook() {
  // 筛选表单
  const searchForm = reactive({
    name: "",
    type: ""
  });
  // 表格数据
  const dataList: Ref<Array<Paper>> = ref([]);
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
      label: "试卷名称",
      prop: "name",
      minWidth: 200
    },
    {
      label: "难度",
      prop: "difficulty",
      minWidth: 150
    },
    {
      label: "总分",
      prop: "score",
      minWidth: 150
    },
    {
      label: "及格分",
      prop: "pass_score",
      minWidth: 150
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 150,
      formatter: ({ status }) => {
        if (status === 0) {
          return "已发布";
        } else {
          return "未发布";
        }
      }
    },
    {
      label: "备注",
      prop: "memo",
      minWidth: 200
    },
    {
      label: "操作",
      fixed: "right",
      width: 260,
      slot: "operation"
    }
  ];

  // 编辑对话框
  const editDialogVisible = ref(false);
  const editDialogTitle = ref("新增试卷");
  // 编辑表单
  const editFormRef = ref<FormInstance>();
  const editForm = reactive({
    id: 0,
    name: "",
    score: 100,
    pass_score: 60,
    difficulty: 0.5,
    status: PaperStatus.Draft,
    create_time: 0,
    update_time: 0,
    memo: "",
    choice_single_num: 0,
    choice_single_score: 2,
    choice_multi_num: 0,
    choice_multi_score: 6,
    judge_num: 0,
    judge_score: 2,
    blank_single_num: 0,
    blank_single_score: 2,
    blank_multi_num: 0,
    blank_multi_score: 6,
    answer_single_num: 0,
    answer_single_score: 10,
    answer_multi_num: 0,
    answer_multi_score: 20
  });
  const editRule = reactive<FormRules>({
    name: [
      {
        required: true,
        max: 50,
        message: "请输入不超过50字符的试卷名称",
        trigger: "blur"
      }
    ]
  });

  // 智能组卷对话框
  const aiDialogVisible = ref(false);
  const aiDialogTitle = ref("智能组卷");
  // 组卷表单
  const aiFormRef = ref<FormInstance>();
  const aiForm = reactive({
    id: 0,
    name: "",
    score: 0,
    pass_score: 0,
    difficulty: 0.5,
    memo: "",
    choice_single_num: 0,
    choice_single_score: 2,
    choice_multi_num: 0,
    choice_multi_score: 6,
    judge_num: 0,
    judge_score: 2,
    blank_single_num: 0,
    blank_single_score: 2,
    blank_multi_num: 0,
    blank_multi_score: 6,
    answer_single_num: 0,
    answer_single_score: 10,
    answer_multi_num: 0,
    answer_multi_score: 20
  });
  const aiRule = reactive<FormRules>({
    name: [
      {
        required: true,
        max: 50,
        message: "请输入不超过50字符的试卷名称",
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

  function showEditDialog(type: "create" | "edit", row?: Paper) {
    if (type === "edit" && row) {
      editDialogTitle.value = "编辑试卷";
      editForm.id = row?.id;
      editForm.name = row?.name;
      editForm.score = row?.score;
      editForm.pass_score = row?.pass_score;
      editForm.difficulty = row?.difficulty;
      editForm.status = row?.status;
      editForm.memo = row?.memo;
    } else {
      editDialogTitle.value = "新增试卷";
      editForm.id = 0;
      editForm.name = "";
      editForm.score = 100;
      editForm.pass_score = 60;
      editForm.difficulty = 0.5;
      editForm.status = PaperStatus.Draft;
      editForm.memo = "";
    }
    editDialogVisible.value = true;
  }

  function showAiEditDialog() {
    aiDialogVisible.value = true;
  }

  function submitEditForm() {
    editFormRef.value?.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }

      if (editForm.id === 0) {
        // 创建
        CreatePaper({
          name: editForm.name,
          score: editForm.score,
          pass_score: editForm.pass_score,
          difficulty: editForm.difficulty,
          status: editForm.status,
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
      UpdatePaper({
        id: editForm.id,
        name: editForm.name,
        status: editForm.status,
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
    });
  }

  function handleDelete(row: Paper) {
    // 删除
    DeletePaper({
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

  function handleSelectionChange(val: Paper[]) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const res = await QueryPaperList({
      name: searchForm.name,
      status: -1,
      limit: pagination.pageSize,
      offset: (pagination.currentPage - 1) * pagination.pageSize
    });

    handleResponse(res, (data: QueryPaperListResponse) => {
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

  function submitAiEditForm() {
    aiFormRef.value?.validate((valid, fields) => {
      if (!valid) {
        console.log("error submit!", fields);
        return;
      }
    });
  }

  // 试题集
  type QuestionBlock = {
    type: QuestionType; // 试题类型
    title: string; // 标题
    score: number; // 试题分值
    list: Array<QuestionCache>; // 试题列表
  };

  // 试题缓存
  type QuestionCache = {
    id: number;
    type: number;
    content: string;
    options: Array<QuestionOption>;
  };

  const questionBlock: Ref<Array<QuestionBlock>> = ref([
    {
      type: QuestionType.ChoiceSingle,
      title: "单选题",
      score: 4,
      list: []
    },
    {
      type: QuestionType.ChoiceMulti,
      title: "多选题",
      score: 6,
      list: []
    },
    {
      type: QuestionType.Judge,
      title: "判断题",
      score: 2,
      list: []
    },
    {
      type: QuestionType.BlankSingle,
      title: "填空题",
      score: 2,
      list: []
    },
    {
      type: QuestionType.BlankMulti,
      title: "填空题",
      score: 6,
      list: []
    },
    {
      type: QuestionType.AnswerSingle,
      title: "简答题",
      score: 10,
      list: []
    },
    {
      type: QuestionType.AnswerMulti,
      title: "简答题",
      score: 30,
      list: []
    }
  ]);
  const questionList: Ref<Array<QuestionCache>> = ref([]);

  // 获取试题题号
  function getQuestionSort(blockIndex: number, index: number) {
    let sort = 1;
    for (let i = 0; i < blockIndex; i++) {
      sort += questionBlock.value[i].list.length;
    }
    return sort + index;
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

  // 获取单选题正确答案
  function getChoiceSingleRight(options: QuestionOption[]) {
    return options.findIndex(item => item.is_right) + 1;
  }

  // 获取多选题正确答案
  function getChoiceMultiRight(options: QuestionOption[]) {
    const list: number[] = [];

    options.forEach((item, index) => {
      if (item.is_right) {
        list.push(index + 1);
      }
    });

    return list;
  }

  // 获取判断题正确答案
  function getJudgeRight(options: QuestionOption[]) {
    return getChoiceSingleRight(options);
  }

  // 上移试题
  function sortUpQuestion(list: QuestionCache[], index: number) {
    if (index <= 0 || index > list.length - 1) {
      return;
    }
    swapQuestion(list, index - 1, index);
  }

  // 下移试题
  function sortDownQuestion(list: QuestionCache[], index: number) {
    if (index < 0 || index >= list.length - 1) {
      return;
    }
    swapQuestion(list, index, index + 1);
  }

  // 交换试题位置
  function swapQuestion(list: QuestionCache[], a: number, b: number) {
    if (a < 0 || a >= list.length) {
      return;
    }
    if (b < 0 || b >= list.length) {
      return;
    }
    const temp = list[a];
    list[a] = list[b];
    list[b] = temp;
  }

  // 删除试题
  function deleteQuestion(list: QuestionCache[], index: number) {
    if (index < 0 || index >= list.length) {
      return;
    }
    list.splice(index, 1);
    // TODO 添加占位试题
    list.push({
      id: 0,
      type: QuestionType.ChoiceSingle,
      content: "",
      options: []
    });
  }

  function setData() {
    questionList.value.push(
      {
        id: 0,
        type: QuestionType.ChoiceSingle,
        content: "路由发生在TCP/IP模型的",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "应用层",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "网络层",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "传输层",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "物理层",
            is_right: 0,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.ChoiceSingle,
        content: "二层交换机根据（   ）信息决定如何转发数据帧",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "源MAC地址",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "源IP地址",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "目的端口地址",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "目的MAC地址",
            is_right: 0,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.ChoiceSingle,
        content: "以太网使用物理地址的原因是（   ）",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "在二层唯一确定一台设备",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "允许设备在不同网络中通信",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "区分二层和三层数据包",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "允许应用程序在不同网络中通信",
            is_right: 0,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.ChoiceSingle,
        content: "OSPF协议使用的算法是",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "最短路径优先( Shortest Path First, SPF) 算法",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "Bellman- Ford算法",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "路径向量(Path-Vector) 算法",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "最小生成树算法",
            is_right: 0,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.ChoiceSingle,
        content: "以下（   ）协议不属于应用层",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "Telnet",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "TCP",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "DNS",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "HTTP",
            is_right: 0,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.ChoiceSingle,
        content: "以下（   ）标准是无线局域网标准",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "IEEE 802. 1",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "IEEE 802. 3",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "IEFE 802. 11",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "IEEE 802. 15",
            is_right: 0,
            memo: ""
          }
        ]
      },
      // 多项题
      {
        id: 0,
        type: QuestionType.ChoiceMulti,
        content: "在路由器上可以出现的端口是",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "Console端口",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "AUX端口",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "PCI端口",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "RJ45端口",
            is_right: 1,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.ChoiceMulti,
        content: "下列属于私有地址的是",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "10.16.26.100",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "172.16.20.10",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "192.168.1.1",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "172.31.1.1",
            is_right: 1,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.ChoiceMulti,
        content: "Internet中包含的网络类型包括",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "局域网",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "城域网",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "广域网",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "无线网络",
            is_right: 1,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.ChoiceMulti,
        content: "要组建一个快速以太网，需要的基本硬件设备与材料包括",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "100BASE-T交换机",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "100BASE-T网卡",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "C",
            content: "路由器",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "D",
            content: "双绞线或光缆",
            is_right: 0,
            memo: ""
          }
        ]
      },
      // 判断题
      {
        id: 0,
        type: QuestionType.Judge,
        content: "交换机的自学习功能是通过帧的源MAC地址实现的",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "正确",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "错误",
            is_right: 0,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.Judge,
        content: "奇偶校验码是一种纠错码",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "正确",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "错误",
            is_right: 0,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.Judge,
        content: "静态路由就是每次选择的路由都一样",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "正确",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "错误",
            is_right: 1,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.Judge,
        content: "根域名服务器一般采用迭代查询方式进行域名解释",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "正确",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "错误",
            is_right: 0,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.Judge,
        content: "在端口VLAN中，主机接收VLAN号相同的帧，把VLAN号不同的帧丢弃",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "正确",
            is_right: 0,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "错误",
            is_right: 1,
            memo: ""
          }
        ]
      },
      {
        id: 0,
        type: QuestionType.Judge,
        content:
          "某主机通过DHCP获得IP地址，当该主机关机时，必须发送向DHCP服务器发送通知，让服务器回收该IP地址",
        options: [
          {
            id: 0,
            question_id: 0,
            tag: "A",
            content: "正确",
            is_right: 1,
            memo: ""
          },
          {
            id: 0,
            question_id: 0,
            tag: "B",
            content: "错误",
            is_right: 0,
            memo: ""
          }
        ]
      },
      // 简答题
      {
        id: 0,
        type: QuestionType.AnswerSingle,
        content:
          "什么是网络自治？在Internet中，有哪些网络自治技术？请列举出至少2个，并做简要说明",
        options: []
      },
      {
        id: 0,
        type: QuestionType.AnswerSingle,
        content: "缓解IPV4的地址紧缺，有什么方法？列举出至少3个，并做简要说明",
        options: []
      },
      {
        id: 0,
        type: QuestionType.AnswerSingle,
        content:
          "在某通讯环境中，接收端收到的信息为110111，CRC校验码为1011，生成多项式为G(x)=x4+x3+1。（1）分析收到的信息是否有错？为什么？（2）计算其编码效率。为了提高编码效率，能否无限制增加一次发送的信息？为什么？（3）网络通讯中，除了校验方法，提高可靠性还有什么技术？",
        options: []
      },
      {
        id: 0,
        type: QuestionType.AnswerSingle,
        content:
          "直接交付和间接交付各用在什么场合？指出各种场合产生的帧中，MAC地址和IP地址的对应情况",
        options: []
      }
    );
    questionList.value.sort((a, b) => {
      return a.type - b.type;
    });
    questionList.value.forEach((item, index) => {
      item.id = index + 1;
      switch (item.type) {
        case QuestionType.ChoiceSingle:
          questionBlock.value[0].list.push(item);
          break;
        case QuestionType.ChoiceMulti:
          questionBlock.value[1].list.push(item);
          break;
        case QuestionType.Judge:
          questionBlock.value[2].list.push(item);
          break;
        case QuestionType.BlankSingle:
          questionBlock.value[3].list.push(item);
          break;
        case QuestionType.BlankMulti:
          questionBlock.value[4].list.push(item);
          break;
        case QuestionType.AnswerSingle:
          questionBlock.value[5].list.push(item);
          break;
        case QuestionType.AnswerMulti:
          questionBlock.value[6].list.push(item);
          break;
      }
    });
    editForm.choice_single_num = questionBlock.value[0].list.length;
    editForm.choice_single_score = 4;
    editForm.choice_multi_num = questionBlock.value[1].list.length;
    editForm.choice_multi_score = 6;
    editForm.judge_num = questionBlock.value[2].list.length;
    editForm.judge_score = 2;
    editForm.blank_single_num = questionBlock.value[3].list.length;
    editForm.blank_single_score = 2;
    editForm.blank_multi_num = questionBlock.value[4].list.length;
    editForm.blank_multi_score = 6;
    editForm.answer_single_num = questionBlock.value[5].list.length;
    editForm.answer_single_score = 10;
    editForm.answer_multi_num = questionBlock.value[6].list.length;
    editForm.answer_multi_score = 30;
  }

  onMounted(() => {
    onSearch();
    setData();
  });

  // 响应式计算试卷总分
  watch(
    () =>
      editForm.choice_single_num * editForm.choice_single_score +
      editForm.choice_multi_num * editForm.choice_multi_score +
      editForm.judge_num * editForm.judge_score +
      editForm.blank_single_num * editForm.blank_single_score +
      editForm.blank_multi_num * editForm.blank_multi_score +
      editForm.answer_single_num * editForm.answer_single_score +
      editForm.answer_multi_num * editForm.answer_multi_score,
    sum => {
      editForm.score = sum;
    }
  );
  watch(
    () =>
      aiForm.choice_single_num * aiForm.choice_single_score +
      aiForm.choice_multi_num * aiForm.choice_multi_score +
      aiForm.judge_num * aiForm.judge_score +
      aiForm.blank_single_num * aiForm.blank_single_score +
      aiForm.blank_multi_num * aiForm.blank_multi_score +
      aiForm.answer_single_num * aiForm.answer_single_score +
      aiForm.answer_multi_num * aiForm.answer_multi_score,
    sum => {
      aiForm.score = sum;
    }
  );

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
    aiDialogVisible,
    aiDialogTitle,
    aiFormRef,
    aiForm,
    aiRule,
    buttonClass,
    onSearch,
    resetForm,
    showEditDialog,
    showAiEditDialog,
    submitEditForm,
    submitAiEditForm,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    questionBlock,
    getQuestionSort,
    transformOptionTag,
    getChoiceSingleRight,
    getChoiceMultiRight,
    getJudgeRight,
    sortUpQuestion,
    sortDownQuestion,
    deleteQuestion
  };
}
