var server = 'http://218.17.227.60:8011/',
	loading_str = `<div class="ibox-content default-backmood loading-case" style="background: rgba(255,255,255,.8);">
                        <div class="spiner-example">
                            <div class="sk-spinner sk-spinner-wave">
                                <div class="sk-rect1"></div>
                                <div class="sk-rect2"></div>
                                <div class="sk-rect3"></div>
                                <div class="sk-rect4"></div>
                                <div class="sk-rect5"></div>
                            </div>
                        </div>
                    </div>`;

function CONNNECT(e){
	if(!/(http:\/\/|https:\/\/)/.test(e)){
		return server + e;
	}else{
		return e;
	}
}

$(document).ajaxStart(function(e){
	// console.log("开始请求:",e);
	loading(true);
}).ajaxSuccess(function( event, request, settings ) {
    // console.log("返回成功拦截：",request);
    var { status, responseText } = request;
	if(!responseText.status){
		toastr.warning(responseText.message || '发生了一个未知的错误！');
	}
	// else if(statusCode != 201){
	// 	window.location.href = 'http://'+ window.location.host + "/login.html";
	// }
}).ajaxError(function( event, request, settings ) {
	// console.log("未返回成功拦截：",request.status);
    toastr.error("出错了，请联系管理员来处理该问题！");
}).ajaxStop(function(e) {
	// console.log("结束请求",e);
	loading();
});



toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "400",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

//	页面加载效果
function loading(e){
	if(e && $(".loading-case").length == 0){
		$("body").append(loading_str);
	}else{
		$("body .loading-case").remove();
	}
}