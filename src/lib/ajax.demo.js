import AJAX, { loading, CancelToken, transformRequest } from 'ajax'

// AJAX 用法同 axios
AJAX()
AJAX.get()
AJAX.post()


// 请求的同时出现 loading 遮罩
AJAX.post(url, data, options)::loading()


// 连续请求时取消上一次请求
let cancelSource
if (cancelSource) {
  cancelSource.cancel('request cancelled.')
}
cancelSource = CancelToken.source()
AJAX.post(url, data, { cancelToken: cancelSource.token })


// 使用默认的 transformRequest
AJAX.post(url, data, { transformRequest })
