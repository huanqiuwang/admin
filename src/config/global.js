/*
	全局参数配置：

	MAX_QUERY_NUMBER: 	最大查询条件数	（单位：个/条）
	MAX_TIME_LENGTH: 	最大查询时间跨度（单位：秒）
	checkDatePicker: 	校验所选的时间的每一行的时间跨度
	MAX_UPLOAD_IMG: 	长传图片的最大限制
 */
import { Message } from "element-ui"

const MAX_QUERY_NUMBER = 3,				
	MAX_TIME_LENGTH = 100 * 24 * 60 * 60 * 1000,
	MAX_UPLOAD_IMG = 1024 * 1024,

	MAX = {
		COMMON: 30,
		NAME: 20,
		EMAIL: 30,
		REMARK: 50,
		DESTNAME: 30,
		IDCARD: 20,
		POLICEID: 10,
		IPLIST: 80,
		PHONE: 11,
	},
	TIPS = {
		imgUpload: '上传的图片的不能大于1M',
		email: '请输入正确格式的邮箱！',
		idcard: '身份证号码由数字与大写字母组成,长度为15或者18位！',
		policeid: '警号由数字组成，长度为10位以内！',
		iplist: '非法的ip地址,ip地址范围 0.0.0.0~255.255.255.255,允许输入多个IP地址，中间以‘,’进行分隔',
		phone: '手机号码由11位数字组成！',
		email: '非法的邮箱地址，邮箱中必须含有@与.,并且@在.之前',
	},
	REGS = {
		idcard: /^(\d{15}[\dA-Z]{3}?)?$/,
		policeid: /^(\d{1,10})?$/,
		iplist: /^((((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(,(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5])))*)?$/,
		phone: /^(\d{11})?$/,
		email: /^(.+@.+\..+)?$/,
	}


const checkDatePicker = async function(list){
	for(let i = 0;i<list.length;i++){
		if(Date.parse(list[i].endTime) - Date.parse(list[i].startTime) > MAX_TIME_LENGTH){
		 	Message.info('最大查询时间跨度为100天'); 
			return Promise.reject("最大查询时间跨度为100天");
		}
	}
	return true;
}

// 非空判断
const tyCheckNull = (({name = '用户名', value}) => {
    if(!value){
      	return `请输入您的${name}！`;
    }else{
      	return false;
    }
})

//  空格判断
const tyCheckBlank = (({name = '用户名', value}) => {
  	if(/\s/.test(value)){
	    return `${name}中不能含有空格！`;
  	}else{
	    return false;
  	}
})

//  长度控制
const tyCheckLength = (({name = '用户名', value, start = 5, end = 20}) => {
  	if(value.toString().length < start || value.toString().length > 20){
	    return `${name}的长度为${start}～${end}位！`;
  	}else{
	    return false;
  	}
})

const tyCheckEmail = (e => {
  	try{
	    if(!/^.+@.+\..+$/.test(e)){
	      	return TIPS.email;
	    }
	    return false;
  	}catch(err){
	    console.error(err);
  	}
})

export {
	MAX_QUERY_NUMBER,
	MAX_TIME_LENGTH,
	checkDatePicker,
	MAX_UPLOAD_IMG,
	TIPS,
	MAX,
	REGS,
	tyCheckNull,
	tyCheckBlank,
	tyCheckLength,
}
