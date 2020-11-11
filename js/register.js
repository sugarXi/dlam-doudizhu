$(function () {
  let logo = $(".logo")
  let boolean = 1;
  // logo
  setInterval(function () {
    if (boolean > 0) {

      logo.attr({ "src": "../img/login/logo-2.png" })
      boolean = boolean * -1

    } else {
      logo.attr({ "src": "../img/login/logo-1.png" })
      boolean = boolean * -1

    }
  }, 1000)
  let ul = $(".top ul")
  let html = ""

  for (let i = 1; i < 10; i++) {
    html += "<li style='background: url(../img/register/nav" + i + ".png) no-repeat center ;background-size: 40px;'></li>"
  }
  ul.html(html)
  // 日历
  var mydate = new Date;
  let $time = $(".time")
  let month = mydate.getMonth() + 1;
  let day = mydate.getDate();
  $time.prepend("<span>" + month + "月</span><span>" + day + "日</span>")


  // 表单验证
  $("form :input.require").blur(function () {
    let $parent = $(this).parent()
    console.log("a")
    // 验证姓名
    if ($(this).is("#username")) {
      let usernameVal = $("#username").val()
      console.log(usernameVal)
      if (usernameVal == "" || usernameVal.length < 2) {
        let errorMsg = " 姓名非空，长度6位以上！";
        $parent.find(".tips_sucess").remove()
        $parent.find(".tips").remove()
        $parent.append("<span class='tips'>" + errorMsg + "</span>")
      } else {
        $parent.find(".tips_sucess").remove()
        $parent.find(".tips").remove()
        let errorMsg = "检验成功！！";
        $parent.append("<span class='tips_sucess'>" + errorMsg + "</span>")
      }
    }
    // 验证密码
    if ($(this).is("#password")) {
      let passwordVal = $("#password").val()
      if (passwordVal == "" || passwordVal.length < 1) {
        let errorMsg = "密码不合规的";
        $parent.find(".tips_sucess").remove()
        $parent.find(".tips").remove()
        $parent.append("<span class='tips'>" + errorMsg + "</span>")
      } else {
        let errorMsg = "密码符合规定！";
        $parent.find(".tips_sucess").remove()
        $parent.find(".tips").remove()
        $parent.append("<span class='tips_sucess'>" + errorMsg + "</span>")
      }

    }
    // 验证电话
    if ($(this).is($("#phone"))) {
      let phoneVal = $("#phone").val()
      if (!(/^1[34578]\d{9}$/.test(phoneVal))) {
        let errorMsg = "电话不符合规定！";
        $parent.find(".tips_sucess").remove()
        $parent.find(".tips").remove()
        $parent.append("<span class='tips'>" + errorMsg + "</span>")
      } else {
        let errorMsg = "电话符合规定！";
        $parent.find(".tips_sucess").remove()
        $parent.find(".tips").remove()
        $parent.append("<span class='tips_sucess'>" + errorMsg + "</span>")
      }

    }


    if ($(this).is($("#checked"))) {
      console.log("aaaddd")
      let $parent = $("#checked").parent()
      let code = $("#checked").val()
      if (code.toLowerCase() == vailCode.toLowerCase()) {
        let errorMsg = "验证码输入正确!";
        $parent.find(".tips_sucess").remove()
        $parent.find(".tips").remove()
        $parent.find(".YzTips").remove()
        $parent.append("<span class='tips_sucess'>" + errorMsg + "</span>")

      } else {
        let errorMsg = "验证码输入错误!";
        $parent.find(".tips_sucess").remove()
        $parent.find(".tips").remove()
        $parent.find(".YzTips").remove()
        $parent.append("<span class='YzTips tips'>" + errorMsg + "</span>")
      }
    }

  })

  $("#send").click(function () {
    //trigger 事件执行完后，浏览器会为submit按钮获得焦点
    $("form .required:input").trigger("blur");
    let numsuccess = $(
      "form .tips_sucess").length;
    // console.log(numsuccess)
    if (numsuccess == 4) {
      console.log(numsuccess)
    } else {
      return false
    }

  });

})

// 验证码
var width = 100; //宽度
var height = 40; //高度
var fontSize = 25; //字体大小
var str = "0123456789qazwsxedcrfvtgbyhnujikolpQAZWSXEDCRFVTGBYHNUJMIKOLP";
//随机生成最大值不超过max的整数
function randInt(max) {
  return Math.floor(Math.random() * 100000 % max);
}
//生成随机长度的字符串验证码
function randCode(lng) {
  if (lng < 4) {
    lng = 4;
  }
  var code = "";
  for (var i = 0; i < lng; i++) {
    code += str.charAt(randInt(str.length));
  }
  return code;
}
//生成随机颜色
function randColor() {
  var r = randInt(256);
  var g = randInt(256);
  var b = randInt(256);
  return "rgb(" + r + "," + g + "," + b + ")";
}
//绘制图片
function drawCode(canvas) {
  var vailCode = randCode(4);
  width = 5 + fontSize * vailCode.length;
  if (canvas != null && canvas.getContext && canvas.getContext("2d")) {
    //设置显示区域大小
    canvas.style.width = width;
    //设置画板高宽
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    //得到画笔
    var pen = canvas.getContext("2d");
    //绘制背景
    pen.fillStyle = "rgb(255,255,255)";
    pen.fillRect(0, 0, width, height);
    //设置值水平线位置
    pen.textBaseline = "top";
    //绘制内容
    for (var i = 0; i < vailCode.length; i++) {
      pen.fillStyle = randColor();
      // pen.font = "bloder" + (fontSize + randInt(50)) + "px 微软雅黑";
      pen.font = '30px Arial'
      pen.fillText(vailCode.charAt(i), 5 + fontSize * i, randInt(5));
    }
    //绘制噪音线
    for (var i = 0; i < 2; i++) {
      pen.moveTo(randInt(width) / 2, randInt(height)); //设置起点
      pen.lineTo(randInt(width), randInt(height)); //设置终点
      pen.strokeStyle = randColor();
      pen.lineWidth = 2; //线条粗细
      pen.stroke();
    }
    return vailCode;
  }
}
//localStorage  登陆 
$('#send').click(() => {
  let yzmcode = $('#checked').val();
  // console.log($('#checked').val());
  // console.log(vailCode);
  // 判断验证码正确
  if (yzmcode.toLowerCase().trim() == vailCode.toLowerCase().trim()) {
    console.log($('#username').val().trim());
    console.log($('#password').val().trim());
    console.log($('#password1').val().trim());
    function  register() {
      if(isNone()){
        //定义一个空数组
        let arr=[];
        // arr.push({
        //   "userName": "曹聪",
        //   "passWord": "cc123"
        // }, {
        //   "userName":"胥梦",
        //   "passWord":"xm123",
        // }, {
        //   "userName":"邓雪婷",
        //   "passWord":"dxt123",
        // }, {
        //   "userName":"张宝林",
        //   "passWord":"zbl123",
        // }, {
        //   "userName":"谢聪",
        //   "passWord":"xc123",
        // })
        if(localStorage.user){
          arr =eval(localStorage.user)
          for (const e in arr) {
            if ($('#username').val().trim()==arr[e].userName) {
             alert('该账号已被注册')
             clear()
             return
            }
          }
        }
        const user={

          'userName':$('#username').val(),
          'passWord':$('#password').val()
        }
        
        //添加数据
      arr.push(user)
      localStorage.user=JSON.stringify(arr)
      alert('注册成功')
      window.location.href='login.html'
      clear()
      }
    }
      //调用注册函数
      register()
    // 清空数据
    function clear(){
      $('#username').val('')
      $('#password').val('')
      $('#password1').val('')
      $('#checked').val('')
    }
    //判断两次密码是否相等
    function isNone(){
      if($('#username').val().trim()==''){
        alert('用户名不能为空')
        return false
      }else if($('#password').val().trim()==''){
        alert('密码不能为空')
        return false
      }else if($('#password').val().trim()!=$('#password1').val().trim()){
        alert('密码不一致')
        return false
      }
      console.log('true');
     return true

    }
  
  } else {
    $('#f-msg').html('验证码输入错误')
    setTimeout(() => {
      $('#f-msg').html('')
    }, 3000);
  }


})

