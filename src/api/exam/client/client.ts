import { nanoid } from "nanoid";
import md5 from "crypto-js/md5";
import { dayjs } from "@/utils/dayjs";

export const baseUrlApi = (url: string) => `/exam/api${url}`;
// process.env.NODE_ENV === "development"
//   ? `/exam/api${url}`
//   : url;

export const AppKey = "cz74e826ea5485aaa233ceb972a3326bde";
export const AppSecret = "2bb011d61507f7eeabd6ca7cc6d551eb";

// 响应码
export enum Code {
  SUCCESS = 200, // 成功
  NOTLOGIN = 401, // 未登录/未授权
  FORBIDDEN = 403, // 无权限
  ERROR = 500, // 异常
  FAILURE = 501, // 失败
  // 业务代码
  CompanyInventoryFull = 10101 // 无空闲柜门可供租赁
}

/**
 * @description 结构体定义
 */

export interface RequestParam {
  req_id: string;
  data: string;
  time: number;
  sign: string;
}

export interface ResponseBody {
  req_id: string;
  code: number;
  msg: string;
  data: string;
  time: number;
  sign: string;
}

// 构建请求参数
export const genParam = (param: any): RequestParam => {
  const reqID = nanoid();
  const timeStamp = dayjs().unix();
  const data = JSON.stringify(param);
  const sign = md5(
    `req${reqID}-key${AppKey}+secret${AppSecret}-data${data}+time${timeStamp}-key${AppKey}`
  ).toString();
  console.log("genParam", {
    req_id: reqID,
    data: data,
    time: timeStamp,
    sign: sign
  });
  return {
    req_id: reqID,
    data: data,
    time: timeStamp,
    sign: sign
  };
};

// 解析响应数据
export const handleResponse = (
  response: ResponseBody,
  success?: (data: any, resp: ResponseBody) => void,
  other?: Record<number, (data: any, resp: ResponseBody) => void>,
  failure?: (resp: ResponseBody) => void
) => {
  const { code, msg, data } = response;

  // 成功逻辑
  if (code === Code.SUCCESS) {
    if (success !== void 0) {
      success(JSON.parse(data), response);
    }
    return;
  }

  // 业务分支逻辑
  if (other !== void 0) {
    const key = Object.keys(other).find(item => {
      return parseInt(item) === code;
    });
    if (key !== void 0) {
      other[parseInt(key)](JSON.parse(data), response);
      return;
    }
  }

  // 异常逻辑
  if (failure === void 0) {
    console.log(msg);
    return;
  }

  failure(response);
};
