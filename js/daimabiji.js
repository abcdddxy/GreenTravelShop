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

//设置经纬度
function setMapValue() {
	if ($("#map_txt").val() == "") {
		alert('你还没选择相应的坐标点^_^哦');
		return false;
	}
	$("#map").val($("#map_txt").val());
	$('#myModal').modal('hide');
}

$(".submit").click(function () {
	return false;
})

function sendVer() {
	setTimeout(function () {
		alert("发送验证码成功！");
	}, 500);
}

function createModal() {
	// alert("111111");
	// $("#cMap").trigger("click");
	$('#myModal').modal('show');
}

function selcetCY() {
	$("#selectTypeText").val("餐饮");
}

function selcetYL() {
	$("#selectTypeText").val("娱乐");
}

function selcetGW() {
	$("#selectTypeText").val("购物");
}

function selcetLY() {
	$("#selectTypeText").val("旅游");
}

$('#datetimepicker').datetimepicker({
	format: 'MM/dd/yyyy hh:mm',
	language: 'en',
	pickDate: true,
	pickTime: true,
	hourStep: 1,
	minuteStep: 15,
	secondStep: 30,
	inputMask: true
});