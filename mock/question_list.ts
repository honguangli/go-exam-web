// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";
import { Question } from "@/api/exam/models/question";
import { Code } from "@/api/exam/client/client";
/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */
const list = new Array<Question>();

list.push({
  id: 0,
  name: "第1题",
  type: 0,
  content: "",
  tips: "",
  analysis: "",
  difficulty: 0,
  score: 0,
  create_time: 0,
  update_time: 0,
  memo: ""
});

export default [
  {
    url: "/exam/api/question/list",
    method: "post",
    response: () => {
      return {
        req_id: "",
        code: Code.SUCCESS,
        msg: "SUCCESS",
        data: JSON.stringify({
          list: list,
          total: list.length
        }),
        time: 0,
        sign: ""
      };
    }
  }
] as MockMethod[];
