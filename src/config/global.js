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
		DESTNAME: 30
	},
	TIPS = {
		imgUpload: '上传的图片的不能大于1M',
		email: '请输入正确格式的邮箱！',
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
	tyCheckNull,
	tyCheckBlank,
	tyCheckLength,
}
