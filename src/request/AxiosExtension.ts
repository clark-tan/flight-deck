import { message } from "ant-design-vue";
/**
 * 判断返回编码是否为正常
 * @param code 编码
 * @return {boolean} 正常返回true, 否则返回false
 */
function isCodeOK(code: string | number): boolean {
  return code === 0 || code === 200 || code === "200";
}

function convertRes2Blob(response: {
  headers: { [x: string]: { match: (arg0: RegExp) => any[] } };
  data: BlobPart;
}) {
  const contentType: any = response.headers["content-type"];
  // 提取文件名
  const fileName =
    response.headers["content-disposition"].match(/filename=(.*)/)[1];
  // 将二进制流转为blob
  const blob = new Blob([response.data], { type: contentType });
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(fileName));
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob);
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", decodeURI(fileName));
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }
    // 挂载a标签
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL);
  }
}

/**
 * 解包响应
 * @param response axios响应对象
 * @return {*} 解包后的数据对象，如果有错误，则抛出异常
 */
function unboxResponse(
  response: { data: { code: any; msg: any; data: any }; code: any; msg: any },
  isTip = false
): any {
  return new Promise((resolve, reject) => {
    if (
      isTip &&
      !isCodeOK(response?.data?.code ?? response?.code) &&
      (response.data?.msg ?? response.msg)
    ) {
      message.error(response.data?.msg ?? response.msg);
    }
    if (isCodeOK(response?.data?.code ?? response?.code))
      resolve(response?.data?.data ?? response?.data);
    else reject(response?.data?.data ?? response?.data);
  });
}

export default {
  extend(axios: {
    getData: (url: any, params: any) => any;
    get: (arg0: any, arg1: any) => Promise<any>;
    delData: (url: any, params: any) => any;
    delete: any;
    postData: (url: any, data: any, params: any) => any;
    post: (
      arg0: any,
      arg1: FormData | null,
      arg2: {
        headers?: { "Content-Type": string };
        params?: any;
        responseType?: string;
      }
    ) => Promise<any>;
    putData: (url: any, data: any, params: any) => any;
    put: any;
    uploadData: (url: any, params: any, file: any) => any;
    postDownloadFile: (url: any, params: any) => any;
    postDownloadFileErrorNotify: (url: any, params: any) => any;
    getWithErrorNotify: (url: any, params: any) => any;
    postWithErrorNotify: (url: any, data: any, params: any) => any;
  }) {
    function getOrDelData(
      method: (arg0: any, arg1: any) => Promise<any>,
      url: any,
      params: any
    ) {
      return method(url, params ? { params: params } : params).then(
        (resp: any) => unboxResponse(resp)
      );
    }

    function putOrPostData(
      method: (arg0: any, arg1: any, arg2: any) => Promise<any>,
      url: any,
      data: any,
      params: any
    ) {
      return method(url, data, params ? { params: params } : params).then(
        (resp: any) => unboxResponse(resp)
      );
    }

    axios.getData = (url: any, params: any) => {
      return getOrDelData(axios.get, url, params);
    };

    axios.delData = (url: any, params: any) => {
      return getOrDelData(axios.delete, url, params);
    };

    axios.postData = (url: any, data: any, params: any) => {
      return putOrPostData(axios.post, url, data, params);
    };

    axios.putData = (url: any, data: any, params: any) => {
      return putOrPostData(axios.put, url, data, params);
    };

    axios.uploadData = (url: any, params: any, file: string | Blob) => {
      const data = new FormData(); //创建form对象
      data.append("file", file); //通过append向form对象添加数据
      //添加请求头
      const config: any = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      if (params) config.params = params;
      return axios
        .post(url, data, config)
        .then((resp: any) => unboxResponse(resp));
    };

    axios.postDownloadFile = (url: any, params: any) => {
      return axios
        .post(url, null, { params, responseType: "blob" })
        .then((response: any) => convertRes2Blob(response));
    };
    axios.postDownloadFileErrorNotify = (url: any, params: any) => {
      return axios.post(url, null, { params }).then((response: any) => {
        try {
          console.log(response.data);
          message.error(response.data?.msg ?? response.msg);
        } catch (error) {
          console.log(error);
          convertRes2Blob(response);
        }
      });
    };

    axios.getWithErrorNotify = (url: any, params: any) => {
      return axios
        .get(url, params ? { params: params } : params)
        .then((resp: any) => unboxResponse(resp, true));
    };

    axios.postWithErrorNotify = (url: any, data: any, params: any) => {
      return axios
        .post(url, data, params ? { params: params } : params)
        .then((resp: any) => unboxResponse(resp, true));
    };
  },
};
