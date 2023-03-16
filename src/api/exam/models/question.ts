// 试题
export type Question = {
  id: number; // int
  subject_id: number; // int
  name: string; // string
  type: number; // int
  content: string; // string
  tips: string; // string
  analysis: string; // string
  difficulty: number; // int
  knowledge_ids: string; // string
  score: number; // int
  status: number; // int
  create_time: number; // int
  update_time: number; // int
  memo: string; // string
};

// 类型
export enum QuestionType {
  ChoiceSingle = 1, // 单选题
  ChoiceMulti = 2, // 多选题
  Judge = 3, // 判断题
  BlankSingle = 4, // 填空题
  BlankMulti = 5, // 多项填空题
  AnswerSingle = 6, // 简答题
  AnswerMulti = 7, // 多项简答题
  FileSingle = 8, // 文件题
  FileMulti = 9 // 多项文件题
}

// 难度
export enum QuestionDifficulty {
  Simple = 20, // 简单
  MiddleSimple = 40, // 较简单
  Normal = 60, // 普通
  MiddleHard = 80, // 较困难
  Hard = 100 // 困难
}

// 状态
export enum QuestionStatus {
  Disable,
  Enable
}

// 格式化类型文本
export const formatQuestionTypeText = (v: QuestionType) => {
  switch (v) {
    case QuestionType.ChoiceSingle:
      return "单选题";
    case QuestionType.ChoiceMulti:
      return "多选题";
    case QuestionType.Judge:
      return "判断题";
    case QuestionType.BlankSingle:
      return "填空题";
    case QuestionType.BlankMulti:
      return "多项填空题";
    case QuestionType.AnswerSingle:
      return "简答题";
    case QuestionType.AnswerMulti:
      return "多项简答题";
    default:
      return "异常";
  }
};

// 获取类型标签
export const getQuestionTypeTagType = (v: QuestionType) => {
  switch (v) {
    case QuestionType.ChoiceSingle:
      return "primary";
    case QuestionType.ChoiceMulti:
      return "primary";
    case QuestionType.Judge:
      return "success";
    case QuestionType.BlankSingle:
      return "info";
    case QuestionType.BlankMulti:
      return "info";
    case QuestionType.AnswerSingle:
      return "warning";
    case QuestionType.AnswerMulti:
      return "warning";
    default:
      return "danger";
  }
};

// 格式化状态文本
export const formatQuestionStatusText = (v: QuestionStatus) => {
  switch (v) {
    case QuestionStatus.Disable:
      return "禁用";
    case QuestionStatus.Enable:
      return "正常";
    default:
      return "异常";
  }
};

// 获取状态标签
export const getQuestionStatusTagType = (v: QuestionStatus) => {
  switch (v) {
    case QuestionStatus.Disable:
      return "danger";
    case QuestionStatus.Enable:
      return "success";
    default:
      return "warning";
  }
};
