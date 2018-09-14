import { Message, Loading,MessageBox } from 'element-ui'
import axios, { CancelToken } from 'axios'
import qs from 'qs'
import config from 'config'
import sleep from 'sleep'

const { server: baseURL } = config

let instance = axios.create({
  baseURL,
  withCredentials: true,
  transformRequest: [
    data => qs.stringify(data, { arrayFormat: 'brackets' })
  ]
})

instance.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("userToken");
    if(token){
      config.headers.Authorization = token;
    }
    return config
  },
  e => Promise.reject(e)
)

instance.interceptors.response.use(
  async ({ status, data }) => {
    if (status === 200) {
      let { code, message = '' } = data
      if (code === 200 || code === 0 || code === '0') {
        return data
      } else if (code === 100) {
        Message.error(message)
        window.location.href = '/#/login'
        return
      } else if(code === 1000){
        MessageBox.alert(message,'提示', {
          confirmButtonText: '确定',
          callback: action => {
            return ;
          }
        });
      }else if(code === 500){
        Message.warning(message);
      }else{
        Message.error(message)
      }
      return Promise.reject(message)
    } else {
      Message.error(status)
      return Promise.reject(status)
    }
  },
  async e => {
    if (!e.__CANCEL__) {
      Message.error(e.message)
    }
    return Promise.reject(e)
  },
)

const loading = async function (ajax = this) {
  let loadingInstance = Loading.service()
  try {
    await ajax
  } catch (e) {
  }
  loadingInstance.close()
  return ajax
}

const transformRequest = axios.defaults.transformRequest

export default instance

export {
  loading,
  transformRequest,
  CancelToken
}
