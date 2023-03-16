import { QuestionType } from "@/api/exam/models/question";
import { ref, onMounted, Ref } from "vue";

// 试题集
type QuestionBlock = {
  type: QuestionType; // 试题类型
  title: string; // 标题
  score: number; // 试题分值
  list: Array<Question>; // 试题列表
};

// 试题
type Question = {
  id?: number;
  name?: string;
  type: number;
  content: string;
  score: number;
  status: number;
  sort?: number;
  answer: string;
  answer_multi: Array<string>;
  options?: Array<QuestionOption>;
};

// 试题
type QuestionOption = {
  id?: number;
  question_id?: number;
  tag: string;
  content: string;
};

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

  const questionList: Ref<Array<Question>> = ref([]);

  function submitEditForm() {}

  onMounted(() => {
    setData();
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
  });

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

  function setData() {
    questionList.value.push(
      {
        type: QuestionType.ChoiceSingle,
        content: "路由发生在TCP/IP模型的",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "应用层"
          },
          {
            tag: "B",
            content: "网络层"
          },
          {
            tag: "C",
            content: "传输层"
          },
          {
            tag: "D",
            content: "物理层"
          }
        ]
      },
      {
        type: QuestionType.ChoiceSingle,
        content: "二层交换机根据（   ）信息决定如何转发数据帧",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "源MAC地址"
          },
          {
            tag: "B",
            content: "源IP地址"
          },
          {
            tag: "C",
            content: "目的端口地址"
          },
          {
            tag: "D",
            content: "目的MAC地址"
          }
        ]
      },
      {
        type: QuestionType.ChoiceSingle,
        content: "以太网使用物理地址的原因是（   ）",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "在二层唯一确定一台设备"
          },
          {
            tag: "B",
            content: "允许设备在不同网络中通信"
          },
          {
            tag: "C",
            content: "区分二层和三层数据包"
          },
          {
            tag: "D",
            content: "允许应用程序在不同网络中通信"
          }
        ]
      },
      {
        type: QuestionType.ChoiceSingle,
        content: "OSPF协议使用的算法是",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "最短路径优先( Shortest Path First, SPF) 算法"
          },
          {
            tag: "B",
            content: "Bellman- Ford算法"
          },
          {
            tag: "C",
            content: "路径向量(Path-Vector) 算法"
          },
          {
            tag: "D",
            content: "最小生成树算法"
          }
        ]
      },
      {
        type: QuestionType.ChoiceSingle,
        content: "以下（   ）协议不属于应用层",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "Telnet"
          },
          {
            tag: "B",
            content: "TCP"
          },
          {
            tag: "C",
            content: "DNS"
          },
          {
            tag: "D",
            content: "HTTP"
          }
        ]
      },
      {
        type: QuestionType.ChoiceSingle,
        content: "以下（   ）标准是无线局域网标准",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "IEEE 802. 1"
          },
          {
            tag: "B",
            content: "IEEE 802. 3"
          },
          {
            tag: "C",
            content: "IEFE 802. 11"
          },
          {
            tag: "D",
            content: "IEEE 802. 15"
          }
        ]
      },
      // 多项题
      {
        type: QuestionType.ChoiceMulti,
        content: "在路由器上可以出现的端口是",
        score: 6,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "Console端口"
          },
          {
            tag: "B",
            content: "AUX端口"
          },
          {
            tag: "C",
            content: "PCI端口"
          },
          {
            tag: "D",
            content: "RJ45端口"
          }
        ]
      },
      {
        type: QuestionType.ChoiceMulti,
        content: "下列属于私有地址的是",
        score: 6,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "10.16.26.100"
          },
          {
            tag: "B",
            content: "172.16.20.10"
          },
          {
            tag: "C",
            content: "192.168.1.1"
          },
          {
            tag: "D",
            content: "172.31.1.1"
          }
        ]
      },
      {
        type: QuestionType.ChoiceMulti,
        content: "Internet中包含的网络类型包括",
        score: 6,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "局域网"
          },
          {
            tag: "B",
            content: "城域网"
          },
          {
            tag: "C",
            content: "广域网"
          },
          {
            tag: "D",
            content: "无线网络"
          }
        ]
      },
      {
        type: QuestionType.ChoiceMulti,
        content: "要组建一个快速以太网，需要的基本硬件设备与材料包括",
        score: 6,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "100BASE-T交换机"
          },
          {
            tag: "B",
            content: "100BASE-T网卡"
          },
          {
            tag: "C",
            content: "路由器"
          },
          {
            tag: "D",
            content: "双绞线或光缆"
          }
        ]
      },
      // 判断题
      {
        type: QuestionType.Judge,
        content: "交换机的自学习功能是通过帧的源MAC地址实现的",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "正确"
          },
          {
            tag: "B",
            content: "错误"
          }
        ]
      },
      {
        type: QuestionType.Judge,
        content: "奇偶校验码是一种纠错码",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "正确"
          },
          {
            tag: "B",
            content: "错误"
          }
        ]
      },
      {
        type: QuestionType.Judge,
        content: "静态路由就是每次选择的路由都一样",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "正确"
          },
          {
            tag: "B",
            content: "错误"
          }
        ]
      },
      {
        type: QuestionType.Judge,
        content: "根域名服务器一般采用迭代查询方式进行域名解释",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "正确"
          },
          {
            tag: "B",
            content: "错误"
          }
        ]
      },
      {
        type: QuestionType.Judge,
        content: "在端口VLAN中，主机接收VLAN号相同的帧，把VLAN号不同的帧丢弃",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "正确"
          },
          {
            tag: "B",
            content: "错误"
          }
        ]
      },
      {
        type: QuestionType.Judge,
        content:
          "某主机通过DHCP获得IP地址，当该主机关机时，必须发送向DHCP服务器发送通知，让服务器回收该IP地址",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: [
          {
            tag: "A",
            content: "正确"
          },
          {
            tag: "B",
            content: "错误"
          }
        ]
      },
      // 简答题
      {
        type: QuestionType.AnswerSingle,
        content:
          "什么是网络自治？在Internet中，有哪些网络自治技术？请列举出至少2个，并做简要说明",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: []
      },
      {
        type: QuestionType.AnswerSingle,
        content: "缓解IPV4的地址紧缺，有什么方法？列举出至少3个，并做简要说明",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: []
      },
      {
        type: QuestionType.AnswerSingle,
        content:
          "在某通讯环境中，接收端收到的信息为110111，CRC校验码为1011，生成多项式为G(x)=x4+x3+1。（1）分析收到的信息是否有错？为什么？（2）计算其编码效率。为了提高编码效率，能否无限制增加一次发送的信息？为什么？（3）网络通讯中，除了校验方法，提高可靠性还有什么技术？",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: []
      },
      {
        type: QuestionType.AnswerSingle,
        content:
          "直接交付和间接交付各用在什么场合？指出各种场合产生的帧中，MAC地址和IP地址的对应情况",
        score: 2,
        status: 0,
        answer: "",
        answer_multi: [],
        options: []
      }
    );
  }

  return {
    questionList,
    questionBlock,
    submitEditForm
  };
}
