let btn=document.getElementById("loginBtn");
btn.onclick=()=>{
  //  for (let i = 0; i<users.length; i++) {
  //    if (username==users[i].username&&password==users[i].password) {
  //     tips.innerHTML=""
  //     alert("登录成功")
  //      break;
  //    } else {
  //      if (i==users.length-1) {
  //       document.getElementById("username").value="";
  //       document.getElementById("password").value="";
  //       tips.className="fail"
  //       tips.innerHTML="用户名密码错误!!!!"
  //     }
  //     console.log("aaa")
  //      }
  
  // }
 // 登录方法
function login(){
  if(isNone()){
    if(localStorage.user){
      //取出user对象
      arr=eval(localStorage.user)
      let i=0
      
      for (const e in arr) {
        
        if ($('#username').val().trim()==arr[e].userName) {
          if ($('#password').val().trim()==arr[e].passWord) {
           //alert('登录成功');
            clear()
            i=0;
            //传参用户名
            window.location.href="index.html?"+arr[e].userName;
            return
          }else{
            $('#loginMsg').html('密码错误')
            setTimeout(() => {
              $('#loginMsg').html('')
            }, 3000);
            clear()
            i=0;
            return
          }
          
        }else{
          k=1;
        }
      }

      if (k==1) {
        $('#loginMsg').html('用户名不存在')
        setTimeout(() => {
          $('#loginMsg').html('')
        }, 3000);
       
        clear()
        
      }
    }else{
      $('#loginMsg').html('用户名不存在，请先注册！')
        setTimeout(() => {
          $('#loginMsg').html('')
        }, 3000);
      window.location.href="register.html";
                    clear();
    }
  }
}
login()
//清空数据
function clear(){
  $('#username').val('');
  $('#password').val('');
}
//登录验证为空
function isNone(){
  if ($('#username').val().trim()=='') {
    $('#loginMsg').html('用户名不能为空')
    setTimeout(() => {
      $('#loginMsg').html('')
    }, 3000);
   
    return false;
  }else if($('#password').val().trim()==""){
    $('#loginMsg').html('密码不能为空')
    setTimeout(() => {
      $('#loginMsg').html('')
    }, 3000);
    
    return false;
  }
  return true
}
  }

// 其他登录方式
let login=document.getElementById("img_link");
for (let i = 0; i <6; i++) {
login.innerHTML+=" <a class='weixin' style='background-position:" +-i*35+"px"+" "+i*0+"px;'></a>"
}
let weixin=document.getElementsByClassName("weixin");
for (let i = 0; i < 6; i++) {
  weixin[i].onmouseover=function(){
    console.log(i)
    weixin[i].style.backgroundPositionY='-34px'

  }
  weixin[i].onmouseout=function(){
    weixin[i].style.backgroundPositionY='0px'
  }
  
}





// 列表遍历
let fList=document.getElementById("fList");
let list3=[
  {text:"关于我们"},
  {text:"XOYO(OVERSEAS)"},
  {text:"服务协议"},
  {text:"客服中心"},
  {text:"加入我们"},
  {text:"联系我们"},
  {text:"站点地图"},
  {text:"帮助中心"}];
  
for(let i=0;i<list3.length;i++) {
     fList.innerHTML+="<a href=\"#\">"+list3[i].text+"</a>";
}


