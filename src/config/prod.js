import base from './base'

export default {
  ...base,
  ...{
    // server: '//119.145.41.129:8011'			//	外网生产版本
     server: '//218.17.227.60:8011'			//	外网测试版本
    // server: '//huanqiu.net:8011'
    //server: 'http://43.24.112.41:8011'       // 湘乡外网
  }
}