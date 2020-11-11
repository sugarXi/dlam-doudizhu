$(function(){
    // 图片轮播
let html =""
let lunbo=$(".lunbo")
let imgs=$(".lunbo ul")
let left=$(".left img")
let right=$(".right img")
let timer="";
let index=1
html +="<li><img src='../img/login/4.jpg' alt=''></li>"
for (let i = 1; i <5; i++) {
    // console.log(i)
    html +="<li><img src='../img/login/"+i+".jpg' alt=''></li>"
}
    html +="<li><img src='../img/login/1.jpg' alt=''></li>"
imgs.html(html);

left.click(function(){
    console.log(index)
    index--;
    if (index<0) {
        index=4;
        imgs.css({
            "left":"-5200px"
        })
    } else {
        let new_left=-1300*index;
    imgs.animate({
        "left":new_left+"px"
    },1000)
    }
    // index=--index <0? 4:index;
    // let new_left=-1300*index;
    // imgs.animate({
    //     "left":new_left+"px"
    // },1000)
   
 })
right.click(function(){
   
   index++;
   if (index>4) {
       imgs.animate({
           "left":index*-1300+"px"
       },500)
       console.log(imgs.position().left)
       index=1
    //    let new_left=-1300*index;
    //    imgs.animate({
    //     "left":new_left+"px"
    //      },500)

    //    index=1
    //    imgs.css('left',-1300+"px")
    //    console.log(imgs)
    //    console.log(imgs.position().left)
 
    //    console.log(index)

   }else{
       let left=-1300*index+1300
       imgs.css('left',left+"px")
       imgs.animate({
        "left":-1300*index+"px"
    },500)
    // let new_left=-1300*index;
    // let left = new_left+1300
    // imgs.css('left',left+"px")
    // console.log(imgs.position().left)
    // console.log(new_left)
    // imgs.animate({
    //     "left":new_left+"px"
    // },500)
}
})
function auto(){
 timer=setInterval(function(){
 right.click()
},2000)
}
lunbo.mouseover(function () { 
    clearInterval(timer)
});
lunbo.mouseout(function(){
    auto()
})
auto()
// 云朵变化
let cloud=$(".cloud")

cloud.each(function(i){
    let a=Math.abs(i/2-1)*19+6
    $(this).css({
        'top':a+'px',
        'animation':'run 31s linear infinite',
        'animation-delay':i*9.5+'s'
    })
})
// let clOne=$("#cloudOne")
// function autoImg(){
//     clOne.animate({
//         left:"1310px"
//     },20000,function(){
//         clOne.css({
//             "left":"0px"
//         })
//     })
   
// }
// setInterval(function(){
//     autoImg();
//     console.log("aaa")
// },222)
// logo动态效果

let logo=$(".logo img ")
let boolean=1;
setInterval(function(){
if (boolean>0) {
   
    logo.attr({"src":"../img/login/logo-2.png"})
    boolean =boolean*-1
   
} else {
    logo.attr({"src":"../img/login/logo-1.png"})
    boolean =boolean*-1
 
}
},1000)
})
