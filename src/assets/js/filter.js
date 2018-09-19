//	数据处理工具
//    
export default {
    install(Vue, options) {
        Vue.prototype.trimAll = e => (e+'').replace(/\s/g,'');

        //	日期格式化
     	Vue.prototype.hqDateFormat = e => {
			var date;
		    if((e+'').length === 10){
		        e = parseInt(e)*1000;
		    }
		    date = new Date(parseInt(e));
		    if(date == "Invalid Date" || parseInt(e) == 0){
		        return '------';
		    }else{
		        var year = date.getFullYear(),
		            month = date.getMonth()+1,
		            day = date.getDate(),
		            hour = date.getHours(),
		            min = date.getMinutes(),
		            sec = date.getSeconds(),
		            newTime = year + '-' +
		                (month < 10? '0' + month : month) + '-' +
		                (day < 10? '0' + day : day) + ' ' +
		                (hour < 10? '0' + hour : hour) + ':' +
		                (min < 10? '0' + min : min) + ':' +
		                (sec < 10? '0' + sec : sec);
		        return newTime; 
		    }
		}

        Vue.prototype.hqDateFormatYMD = e => {
            var date;
            if((e+'').length === 10){
                e = parseInt(e)*1000;
            }
            date = new Date(parseInt(e));
            if(date == "Invalid Date" || parseInt(e) == 0){
                return '------';
            }else{
                var year = date.getFullYear(),
                    month = date.getMonth()+1,
                    day = date.getDate(),
                    hour = date.getHours(),
                    min = date.getMinutes(),
                    sec = date.getSeconds(),
                    newTime = year + '-' +
                        (month < 10? '0' + month : month) + '-' +
                        (day < 10? '0' + day : day);
                return newTime; 
            }
        }

        //  elements插件里面的table 日期格式化
		Vue.prototype.hqDateFormat1 = function(row,col,cellValue){
            var date,e = cellValue;
            if((e+'').length === 10){
                e = parseInt(e)*1000;
            }
            date = new Date(parseInt(e));
            if(date == "Invalid Date" || parseInt(e) == 0){
                return '------';
            }else{
                var year = date.getFullYear(),
                    month = date.getMonth()+1,
                    day = date.getDate(),
                    hour = date.getHours(),
                    min = date.getMinutes(),
                    sec = date.getSeconds(),
                    newTime = year + '-' +
                        (month < 10? '0' + month : month) + '-' +
                        (day < 10? '0' + day : day) + ' ' +
                        (hour < 10? '0' + hour : hour) + ':' +
                        (min < 10? '0' + min : min) + ':' +
                        (sec < 10? '0' + sec : sec);
                return newTime; 
            }
        }

		//	行合并数据格式化
		Vue.prototype.placeDataFormat = list => {
            // console.log(list);
			var destArr = [],i,j;
            for(i = 0;i < list.length;i++){
                for(j = 0;j<list[i].list.length;j++){
                    if(j == 0){
                        destArr.push({
                            row: list[i].list.length,
                            index: i+1
                        })
                    }else{
                        destArr.push({
                            row: 0,
                            index: i+1
                        })
                    }

                    for(var item1 in list[i]){
                        if(item1 != 'list'){
                            destArr[destArr.length-1][item1] = list[i][item1];
                        }
                    }
                    for(var item in list[i].list[j]){
                        destArr[destArr.length-1][item] = list[i].list[j][item];
                    }
                }
            }
            return destArr;
		}

        //  排序
        Vue.prototype.hqJsonSortInRow = function(jsondata,rowName,sort){
            if(sort == 'asc'){
                jsondata.sort(asc);
            }else{
                jsondata.sort(desc);
            }

            function asc(x,y){
                return x[rowName] - y[rowName];
            }
            function desc(x,y){
                return y[rowName] - x[rowName];
            }
        }

        //          
        Vue.prototype.jsonDataFormat = function(list){
            var destArr = [],i,j;
            for(i = 0;i < list.length;i++){
                for(j = 0;j<list[i].length;j++){
                    if(j == 0){
                        destArr.push({
                            row: list[i].length,
                            index: i+1
                        })
                    }else{
                        destArr.push({
                            row: 0,
                            index: i+1
                        })
                    }

                    for(var item1 in list[i][j]){
                        destArr[destArr.length-1][item1] = list[i][j][item1];
                    }
                }
            }
            return destArr;
        }

        //  elementUI 合并行 前两列相等
        Vue.prototype.objectSpanMethod = function({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0 ||columnIndex === 1) {
                if (row.row != 0) {
                    return {
                        rowspan: row.row,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        }

        //  elementUI 合并行 前四列相等
        Vue.prototype.objectSpanMethodForPlace = function({ row, column, rowIndex, columnIndex }) {
            if (columnIndex <= 3) {
                if (row.row != 0) {
                    return {
                        rowspan: row.row,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        }

        Vue.prototype.objectSpanThird = function({ row, column, rowIndex, columnIndex }){
            if (columnIndex <= 2) {
                if (row.row != 0) {
                    return {
                        rowspan: row.row,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        }

        //  案件布控合并列
        Vue.prototype.objectSpanControl = function({ row, column, rowIndex, columnIndex }){
            if (columnIndex <= 5 || columnIndex>=8) {
                if (row.row != 0) {
                    return {
                        rowspan: row.row,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        }


        Vue.prototype.percentage = function(row,col,cellValue){
            return cellValue + '%';
        }

        Vue.prototype.autoPercentage = function(cellValue){
            return (parseFloat(cellValue)*100).toFixed(2)+'%';
        }

        Vue.prototype.defaultIndex = function(e){
            return e+1;
        }

        Vue.prototype.checkSameDatas = function(list){
            let i,j,S = new Set();
            if(!!list[0].addr){                                             //  少华
                for(i = 0;i<list.length-1;i++){
                    for(j = i+1;j<list.length;j++){
                        if(list[i].addr == list[j].addr &&(list[i].start>=list[j].start && list[i].start<=list[j].end || list[i].end>=list[j].start && list[i].end<=list[j].end || list[j].start>=list[i].start && list[j].start<=list[i].end || list[j].end>=list[i].start && list[j].end<=list[i].end)){
                            return false;
                        }else if(list[i].end - list[i].start){

                        }
                    }
                }
            }else if(!!list[0].deviceid){                                   //  龙峰
                for(i = 0;i<list.length-1;i++){
                    for(j = i+1;j<list.length;j++){
                        if(list[i].deviceid == list[j].deviceid &&(list[i].beginTime>=list[j].beginTime && list[i].beginTime<=list[j].lastTime || list[i].lastTime>=list[j].beginTime && list[i].lastTime<=list[j].lastTime || list[j].beginTime>=list[i].beginTime && list[j].beginTime<=list[i].lastTime || list[j].lastTime>=list[i].beginTime && list[j].lastTime<=list[i].lastTime)){
                            return false;
                        }
                    }
                }
            }else if(!!list[0].cameraIds){                                  //  余佩
                for(i = 0;i<list.length-1;i++){
                    for(j = i+1;j<list.length;j++){
                        if((list[i].beginTime>=list[j].beginTime && list[i].beginTime<=list[j].endTime || list[i].endTime>=list[j].beginTime && list[i].endTime<=list[j].endTime || list[j].beginTime>=list[i].beginTime && list[j].beginTime<=list[i].endTime || list[j].endTime>=list[i].beginTime && list[j].endTime<=list[i].endTime)){
                            list[i].cameraIds.split(',').forEach(function(e){
                                S.add(e);
                            });
                            list[j].cameraIds.split(',').forEach(function(e){
                                S.add(e);
                            });
                            if(S.size != list[i].cameraIds.split(',').length + list[j].cameraIds.split(',').length){
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        }


        Vue.prototype.Wx = '90px';
        Vue.prototype.Wxx = '120px';
        Vue.prototype.Wxxx = '150px';
        Vue.prototype.Wxxxx = '180px';
        Vue.prototype.Wxxxxx = '210px';
    }
}