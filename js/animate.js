$(function(){
//-------------音乐播放开关------------
let $mp3 = $('#mp3');
$('.music a').click(function(){
	if($mp3.autoplay){
		$mp3.autoplay;
	}else{
		$mp3.pause;
	}
})
// 暂停或者播放背景音乐
let music_btn = document.getElementsByClassName('music')[0].getElementsByTagName('a')[0];
	let mp3 = document.getElementById('mp3');
	let statu = true;
	console.log(music_btn);
	music_btn.onclick = function(){
		if(statu == true){
			mp3.pause();
			statu = false;
			
		}else{
			mp3.play();
			statu = true;
		}
	}




});