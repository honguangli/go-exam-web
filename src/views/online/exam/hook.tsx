import { message } from "@/utils/message";
import { handleResponse, ResponseBody } from "@/api/exam/client/client";
import { Grade } from "@/api/exam/models/grade";
import { PaperQuestionOption } from "@/api/exam/models/paper_question_option";
import { QuestionType } from "@/api/exam/models/question";
import { StartExam, StartExamResponse } from "@/api/exam/modules/exam/start";
import { SubmitExam } from "@/api/exam/modules/exam/submit";
import { useUserStoreHook } from "@/store/modules/user";
import { dayjs } from "@/utils/dayjs";
import { ref, onMounted, Ref, computed } from "vue";
import { useRoute } from "vue-router";
import { AnswerItem, AnswerItemCheck } from "@/api/exam/models/answer_item";

// 试题集
type QuestionBlock = {
  type: QuestionType; // 试题类型
  title: string; // 标题
  score: number; // 试题分值
  list: Array<TempQuestion>; // 试题列表
};

// 试题
type TempQuestion = {
  id: number;
  name: string;
  type: number;
  content: string;
  score: number;
  status: number;
  options: Array<PaperQuestionOption>;
  sort: number;
  answer_option_id: number;
  answer_option_ids: Array<number>;
  answer_content: string;
};

// // 试题
// type QuestionOption = {
//   id?: number;
//   question_id?: number;
//   tag: string;
//   content: string;
// };

export function useHook() {
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

  const route = useRoute();

  // 加载状态
  const loading = ref(true);

  // 考试状态
  const canExam = ref(false);
  const failureMsg = ref("");

  // 考试id
  const id = parseInt(route.query.id as string);
  const detail: Ref<Grade> = ref({
    id: 0,
    plan_id: 0,
    paper_id: 0,
    user_id: 0,
    score: 0,
    objective_score: 0,
    subjective_score: 0,
    status: 0,
    start_time: 0,
    end_time: 0,
    duration: 0,
    memo: "",
    plan_name: "",
    plan_start_time: 0,
    plan_end_time: 0,
    plan_duration: 0,
    plan_status: 0,
    plan_query_grade: 0,
    paper_name: "",
    paper_subject_id: 0,
    paper_knowledge_ids: "",
    paper_score: 0,
    paper_pass_score: 0,
    user_name: "",
    user_true_name: "",
    user_mobile: "",
    user_email: "",
    user_status: 0
  });
  const questionList: Ref<Array<TempQuestion>> = ref([]);

  // 考试截止时间
  const examEndTime = ref(0);

  // 当前时间
  const currentTime = ref(dayjs().unix());
  setInterval(() => {
    currentTime.value++;
  }, 1000);

  // 剩余时间
  const remainTime = computed(() => {
    return Math.max(0, examEndTime.value - currentTime.value);
  });

  // 格式化考试时长
  function formatDuration(duration: number) {
    if (duration % 60 === 0) {
      return duration / 60 + "小时";
    }
    if (duration < 120) {
      return duration + "分钟";
    }
    return Math.floor(duration / 60) + "小时" + (duration % 60) + "分钟";
  }

  // 格式化考试剩余时长
  function formatRemainDuration(seconds: number) {
    if (seconds <= 0) {
      return "0";
    }
    if (seconds <= 60) {
      return seconds + "秒";
    }
    if (seconds <= 3600) {
      return Math.floor(seconds / 60) + "分钟" + (seconds % 60) + "秒";
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = (seconds % 3600) % 60;
    return h + "小时" + m + "分钟" + s + "秒";
  }

  // 判断是否作答
  function hasAnswer(row: TempQuestion) {
    switch (row.type) {
      case QuestionType.ChoiceSingle:
        return row.answer_option_id > 0;
      case QuestionType.ChoiceMulti:
        return row.answer_option_ids.length > 0;
      case QuestionType.Judge:
        return row.answer_option_id > 0;
      case QuestionType.AnswerSingle:
        return row.answer_content.length > 0;
      default:
        return false;
    }
  }

  function transformNumberZhcn(index: number) {
    switch (index) {
      case 1:
        return "一";
      case 2:
        return "二";
      case 3:
        return "三";
      case 4:
        return "四";
      case 5:
        return "五";
      case 6:
        return "六";
      case 7:
        return "七";
      case 8:
        return "八";
      case 9:
        return "九";
      case 10:
        return "十";
    }
  }

  async function onSearch() {
    loading.value = true;
    const res = await StartExam({
      id: id,
      user_name: useUserStoreHook().username || ""
    });

    handleResponse(
      res,
      (data: StartExamResponse) => {
        console.log("data", data);
        detail.value = data.detail;
        examEndTime.value = Math.min(
          data.detail.plan_end_time,
          data.detail.start_time + data.detail.plan_duration * 60
        );
        // 组装试题和选项
        // data.question_list.forEach(item => {
        //   const tq: TempQuestion = {
        //     id: item.id,
        //     name: item.name,
        //     type: item.type,
        //     content: item.content,
        //     score: item.score,
        //     status: 0,
        //     options: data.option_list.filter(e => {
        //       return e.question_id == item.id;
        //     }),
        //     sort: 0,
        //     answer_option_id: 0,
        //     answer_option_ids: [],
        //     answer_content: ""
        //   };
        //   questionList.value.push(tq);
        // });
        for (let i = 0; i < data.question_list.length; i++) {
          const item = data.question_list[i];
          const tq: TempQuestion = {
            id: item.id,
            name: item.name,
            type: item.type,
            content: item.content,
            score: item.score,
            status: 0,
            options: data.option_list.filter(e => {
              return e.question_id == item.id;
            }),
            sort: 0,
            answer_option_id: 0,
            answer_option_ids: [],
            answer_content: ""
          };
          questionList.value.push(tq);
        }

        questionList.value.sort((a, b) => {
          return a.type - b.type;
        });
        questionList.value.forEach((item, index) => {
          item.sort = index + 1;
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
        questionBlock.value = questionBlock.value.filter(
          item => item.list.length > 0
        );
        questionBlock.value.forEach((item, index) => {
          item.title = transformNumberZhcn(index + 1) + "、" + item.title;
        });
        console.log("list: ", questionList.value);
        console.log("block: ", questionBlock.value);
        loading.value = false;
        canExam.value = true;
      },
      [],
      (resp: ResponseBody) => {
        console.log("error:", resp);
        loading.value = false;
        failureMsg.value = resp.msg;
      }
    );
  }

  function submitEditForm() {
    console.log("submitEditForm: ", questionList.value);
    const answers: AnswerItem[] = [];

    questionList.value.forEach(item => {
      answers.push({
        id: 0,
        answer_id: 0,
        question_id: item.id,
        option_ids:
          item.answer_option_id > 0
            ? item.answer_option_id + ""
            : item.answer_option_ids.join(","),
        content: item.answer_content,
        check: AnswerItemCheck.UnCheck,
        score: 0,
        memo: ""
      });
    });

    // 提交答题卡
    SubmitExam({
      id: id,
      user_name: useUserStoreHook().username || "",
      answers: answers
    })
      .then(res => {
        handleResponse(res, () => {
          message(res.msg, {
            type: "success"
          });
        });
      })
      .catch(err => {
        console.log(err);
        message("操作失败", {
          type: "error"
        });
      });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    canExam,
    failureMsg,
    detail,
    remainTime,
    questionList,
    questionBlock,
    formatDuration,
    formatRemainDuration,
    hasAnswer,
    submitEditForm
  };
}
