//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function () {
	if (animating) return false;
	animating = true;

	current_fs = $(this).parent();
	next_fs = $(this).parent().next();

	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

	//show the next fieldset
	next_fs.show();
	//hide the current fieldset with style
	current_fs.animate({
		opacity: 0
	}, {
		step: function (now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50) + "%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
				'transform': 'scale(' + scale + ')'
			});
			next_fs.css({
				'left': left,
				'opacity': opacity
			});
		},
		duration: 800,
		complete: function () {
			current_fs.hide();
			animating = false;
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".previous").click(function () {
	if (animating) return false;
	animating = true;

	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();

	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	//show the previous fieldset
	previous_fs.show();
	//hide the current fieldset with style
	current_fs.animate({
		opacity: 0
	}, {
		step: function (now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1 - now) * 50) + "%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
				'left': left
			});
			previous_fs.css({
				'transform': 'scale(' + scale + ')',
				'opacity': opacity
			});
		},
		duration: 800,
		complete: function () {
			current_fs.hide();
			animating = false;
		},
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$("#createMap").click(function () {
	setTimeout(function () { //添加延时加载。解决问题
		var map = new BMap.Map("map_main");
		var myCity = new BMap.LocalCity();
		myCity.get(function (res) {
			map.centerAndZoom(res.center, res.level);
			var old_map = $('#map').val(); //如果已设置过
			if (old_map.length > '5') { //打开的时候显示已设置的
				$("#map_txt").val(old_map);
				var oldMap = old_map.split(",");
				var point = new BMap.Point(oldMap[0], oldMap[1]);
				var marker = new BMap.Marker(point); // 创建标注    
				map.clearOverlays();
				map.addOverlay(marker);
			}
			map.addEventListener("click", function (e) {
				var lng_lat = e.point.lng + ',' + e.point.lat;
				$("#map_txt").val(lng_lat); //加入到设置框
				var point = new BMap.Point(e.point.lng, e.point.lat);
				var marker = new BMap.Marker(point); // 创建标注    
				map.clearOverlays();
				map.addOverlay(marker);
			});
			map.enableScrollWheelZoom(true);
		});
	}, 300);
});

$(".submit").click(function () {
	if (pass.value != cpass.value) {
		alert("两次输入的密码不一致！");
	} else if (phone.value == "") {
		alert("手机号不能为空！");
	} else if (ver == "") {
		alert("验证码校验失败！");
	} else if (selectTypeText.value == "") {
		alert("店铺类型不能为空");
	} else if (lnglat.value == "") {
		alert("店铺经纬度不能为空");
	} else if (shopNum.value == "") {
		alert("店铺数量不能为空");
	} else if (shopName.value == "") {
		alert("店铺名称不能为空");
	} else if (shopPhone.value == "") {
		alert("联系电话不能为空");
	} else if ((datetimeStart.value == "") && (datetiemEnd.value == "")) {
		alert("营业时间不能为空");
	} else {
		//ajax注册操作
	}
});

//设置经纬度
function setMapValue() {
	if ($("#map_txt").val() == "") {
		alert('你还没选择相应的坐标点^_^哦');
		return false;
	}
	$("#map").val($("#map_txt").val());
	$('#myModal').modal('hide');
};

$(".submit").click(function () {
	return false;
});

function sendVer() {
	setTimeout(function () {
		alert("发送验证码成功！");
	}, 500);
};

function selcetCY() {
	$("#selectTypeText").val("餐饮");
};

function selcetYL() {
	$("#selectTypeText").val("娱乐");
};

function selcetGW() {
	$("#selectTypeText").val("购物");
};

function selcetLY() {
	$("#selectTypeText").val("旅游");
};

$("#datetimeStart").datetimepicker({
	format: 'hh:ii',
	autoclose: true,
	startView: 1,
	maxView: 0,
	minView: 0,
	forceParse: false,
	minuteStep: 10
});

$("#datetimeEnd").datetimepicker({
	format: 'hh:ii',
	autoclose: true,
	startView: 1,
	maxView: 0,
	minView: 0,
	forceParse: false,
	minuteStep: 10
});

//初始化fileinput控件（第一次初始化）
$('#uploadImg').fileinput({
	language: 'zh', //设置语言
	uploadUrl: "/GreenTravelShop/img/upload", //上传的地址
	previewFileType: 'image',
	overwriteInitial: false,
	maxFileSize: 1000,
	maxFilesNum: 10,
	showUpload: true, //是否显示上传按钮
	showCaption: true, //是否显示标题
	browseClass: "btn btn-primary", //按钮样式             
	previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
	msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",

	slugCallback: function (filename) {
		return filename.replace('(', '_').replace(']', '_');
	}
});

// //初始化fileinput控件（第一次初始化）
// function initFileInput(ctrlName, uploadUrl) {    
//     var control = $('#' + ctrlName); 

//     control.fileinput({
//         language: 'zh', //设置语言
//         uploadUrl: uploadUrl, //上传的地址
//         allowedFileExtensions : ['jpg', 'png'],//接收的文件后缀
//         showUpload: false, //是否显示上传按钮
//         showCaption: false,//是否显示标题
//         browseClass: "btn btn-primary", //按钮样式             
//         previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
//     });
// };
// //初始化fileinput控件（第一次初始化）
// initFileInput("file-Portrait", "C://Users/ZERO/VScode/GreenTravelShop/img/upload");
// //添加记录的窗体处理
// formValidate("ffAdd", function (form) {
// 	$("#add").modal("hide");
// 	//构造参数发送给后台
// 	var postData = $("#ffAdd").serializeArray();
// 	$.post(url, postData, function (json) {
// 		var data = $.parseJSON(json);
// 		if (data.Success) {
// 			//增加肖像的上传处理
// 			initPortrait(data.Data1);//使用写入的ID进行更新
// 			$('#file-Portrait').fileinput('upload');

// 			//保存成功  1.关闭弹出层，2.刷新表格数据
// 			showTips("保存成功");
// 			Refresh();
// 		}
// 		else {
// 			showError("保存失败:" + data.ErrorMessage, 3000);
// 		}
// 	}).error(function () {
// 		showTips("您未被授权使用该功能，请联系管理员进行处理。");
// 	});
// });
// //初始化图像信息
// function initPortrait(ctrlName, id) {
// 	var control = $('#' + ctrlName);
// 	var imageurl = '/PictureAlbum/GetPortrait?id=' + id + '&r=' + Math.random();

// 	//重要，需要更新控件的附加参数内容，以及图片初始化显示
// 	control.fileinput('refresh', {
// 		uploadExtraData: { id: id },
// 		initialPreview: [ //预览图片的设置
// 			"<img src='" + imageurl + "' class='file-preview-image' alt='肖像图片' title='肖像图片'>",
// 		],
// 	});
// }