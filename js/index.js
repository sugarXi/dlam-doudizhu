//点击选中样式
let arr=$('#spanImg').children('img')
let arr1=$('#spanMs').children('span')
let arr2=$('#spanDd').children('span')
let num = 0

for (let i = 0; i < arr.length; i++) {
	arr[i].onclick = function(){
		for(let i = 0;i<4;i++){
			arr[i].className = ''
		}
		arr[i].className = 'changColor'
		num = i
	}
}
for (let i = 0; i < arr1.length; i++) {
	arr1[i].onclick = function(){
		for(let i = 0;i<arr1.length;i++){
			arr1[i].className = ''
		}
		arr1[i].className = 'changBorder'
	}
}
for (let i = 0; i < arr2.length; i++) {
	arr2[i].onclick = function(){
		for(let i = 0;i<arr2.length;i++){
			arr2[i].className = ''
		}
		arr2[i].className = 'changBorder'
	}
}
//选中协议 按钮有效
let startGame=$('#startGame')
let checkbox=$('#checkbox')
// console.log(startGame);
function checkStart() {
	if(checkbox.is(':checked')){
		startGame.attr("disabled", false)
		startGame.css("backgroundColor", "#60b1e6")
		// startGame.className = 'startChange'
	}else{
		startGame.attr("disabled", true)
		startGame.css("backgroundColor", "gray")
	}
}
//跳转到主页
console.log(window.location.href)
let add = window.location.href
let index1 = add.indexOf('?')
let res = add.slice(index1+1)

$('#startGame')[0].onclick = function() {
	if(checkbox.is(':checked')) {
		window.location.href = "../html/main.html?"+res+"&"+num
	}
}

console.log($('.service'))
$('.service').click(function () {
    window.location.href = "../aggrem.html?"+decodeURIComponent(res)
})
$('#wellcome').append(decodeURIComponent(res))

//浮窗
function myEvent(obj,ev,fn){
	if (obj.attachEvent){
		obj.attachEvent('on'+ev,fn);
	}else{
		obj.addEventListener(ev,fn,false);
	};
};

function getByClass(obj,sClass){
	var array = [];
	var elements = obj.getElementsByTagName('*');
	for (var i=0; i<elements.length; i++){
		if (elements[i].className == sClass){
			array.push (elements[i]);
		};
	};
	return array;
};

var cs_box = {
	set : function(json){
		this.box = document.getElementById('cs_box');
		this.setimg(json);
		this.qqfn(json);
		this.cs_close();
	},
	setimg : function(json){
		this.img_box = getByClass(this.box,'cs_img')[0];
		var img_e = document.createElement('img');
		img_e.src = json.img_path;
		img_e.style.width = img_e.style.height = 100+'px';
		this.img_box.appendChild(img_e);
	},
	qqfn : function(json){
		this.btn = getByClass(this.box,'cs_btn')[0];
		var link = 'http://wpa.qq.com/msgrd?v=3&uin='+json.qq+'&site=qq&menu=yes';
		this.btn.onclick = function(){
			window.open(link,'_blank');
		};
	},
	cs_close : function(){
		this.btn = getByClass(this.box,'cs_close')[0];
		var _this = this;
		var speed = 0;
		var timer = null;
		var sh = document.documentElement.clientHeight || document.body.clientHeight;
		this.btn.onclick = function(){
			clearInterval(timer);
			timer = setInterval(function(){
				speed += 4;
				var t = _this.box.offsetTop + speed;
				if (t >= sh-_this.box.offsetHeight){
					speed *= -0.8;
					t = sh-_this.box.offsetHeight;
				};
				if (Math.abs(speed)<2)speed = 0;
				if (speed == 0  && sh-_this.box.offsetHeight == t){
					clearInterval(timer);
					_this.fn();
				};
				_this.box.style.top = t + 'px';
			}, 30);
		};
	},
	fn : function(){
		var _this = this;
		var timer = setTimeout(function(){
			_this.box.style.display = 'none';
		}, 1000);
	},
};