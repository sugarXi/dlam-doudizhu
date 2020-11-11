$(function(){
	let names = ['James', 'Alisa', 'Phil'];
	
	console.log(window.location.href)
	let add = window.location.href
	let index1 = add.indexOf('?')
	let res =add.slice(index1+1).split('&')
	console.log(res)

	// 玩家数据集合
	let player = [];
	for(let i=0; i<3; i++){
		player.push({nekname:names[i], score: 1000, identity:0, poker:[],selected:{type:0,max:0,poker:[]},role:0,win:0});
	}

	// 关于本局游戏数据的集合
	let game_data = {boss:-1,play:-1,desktop:{type:0,max:0,poker:[]}}

	// 第一个阶段：洗牌
	// 第一步：生成牌组HTML代码
	function pokerGroup(){
		let li_html = '';
			for(let i=0; i<54; i++){
				li_html += '<li class="back" style="top:-'+i+'px"></li>';
			}
			$('.all_poker').html(li_html);
	}

	for(let i=0;i<3;i++){
		if (i===1){
            $('.point .nickname span').eq(i).html(decodeURIComponent(res[0]))
            $('.point .bot span').eq(i).html(1000)
            $('.point .total span').eq(i).html(player[i].score)
		} else{
            $('.point .nickname span').eq(i).html(player[i].nekname)
            $('.point .bot span').eq(i).html(1000)
            $('.point .total span').eq(i).html(player[i].score)
		}
	}

    //随机角色动画
    for(let i = 0;i<3;i++){
        let temp = '';
        let math = Math.round(Math.random()*3);
        console.log(math);

        if(i == 0){
            temp = '<img src="../img/roleimg/left'+math+'.png">';
            $('.role_'+(i+1)).append(temp);
        }else if(i == 1){
            temp = '<img src="../img/roleimg/'+parseInt(res[1])+'.png">';
            $('.role_'+(i+1)).append(temp);
        }else{
            temp = '<img src="../img/roleimg/right'+math+'.png">';
            $('.role_'+(i+1)).append(temp);
        }
    }
	
	let all_poker = [];
	function pokerMess(){
		// 数据阶段：
		// 第一步：初始化牌组的数据
		// 通过循环生成52张除了大小王以外的牌的数据
		for(let i=1; i<=13; i++){
			for(let j=0; j<4; j++){
				all_poker.push({num: i, color: j});
			}
		}
		all_poker.push({num: 14, color: 0});		// 生成小王的数据
		all_poker.push({num: 14, color: 1});		// 生成大王的数据
	}
	

	// 第二步：绑定洗牌事件
	// 记录用户点击牌组的次数
	// 由于洗牌的过程中绑定事件的元素会发生改变，导致事件的失效。为了防止事件失效。我们使用监听绑定
	wash();
	function wash(){
		for(let i = 0;i<3;i++){
			//清空玩家手牌数据
			player[i].poker = [];
			console.log(player[i].poker); 
		}
		//清空桌面牌组数据以及地主信息
		game_data.desktop.poker = [];
		game_data.desktop.type = 0;
		game_data.desktop.max = 0;
		game_data.play = -1;
		game_data.boss = -1;
		console.log(game_data.desktop.poker);
		//清空桌面牌组
		all_poker = [];	
		console.log(all_poker); 
		//清除所有牌面
		$('.all_poker li').remove();
		//清除所有玩家手牌
		$('.play_poker li').remove();
		//清空每位玩家的身份图标
		$('.ident img').remove();	
		$('.desktop_poker li').remove();

		//抢地主的闹钟显示
		$('.text').css({'display':'none'});

		//生成牌组HTML代码
		pokerGroup();
		//初始化牌组的数据
		pokerMess();
		let click = 0;		// 记录用户点击牌组的次数
		//解除重复绑定
		//设置当前动画状态
		let status = false;
		$('.mid_top').off('click', '.all_poker li');
		$('.mid_top').on('click', '.all_poker li', function(){
			if(status == false){
				if(click == 0){
					// 调用洗牌动画函数
					claerPoker(click);

					// 把初始牌组数据打乱
					for(let i=0; i<4; i++){
						all_poker.sort(function(x, y){
							return Math.random()-0.5;
						});
					}
					console.log(all_poker);	

					// 自增点击数
					click++;
					//把状态值改为true
					status = true;
					//11.1秒后洗牌动画执行后把状态值改为false
					setTimeout(function(){
						status = false;
					},4100)
				}else{
					// 调用发牌函数
					sendPoker(0);
					$('.all_poker').stop(true,true);
					//调用随机角色函数
					role();
					//解除发牌按钮的事件
					$('.mid_top').off('click', '.all_poker li');
					//播放发牌的音频
					$('#audio1').attr({'src':'../video/aduio/fai.mp3'})
				}
			}
		});
	}

	//随机角色动画
	function role(){
		$('.role_1 img').animate({'left':'0px','opacity':'1'},1000);
		$('.role_2 img').animate({'bottom':'-50px','opacity':'1'},1000);
		$('.role_3 img').animate({'right':'0px','opacity':'1'},1000);
	}

	// 洗牌动画函数
	function claerPoker(click){
		// 1、删除原牌组，并且在这之前先保存该HTML代码
		let all_poker_html = $('.mid_top').html();
		$('.all_poker').remove();

		// 2、生成三组新牌组
		let temp_poker = '';
		for(let i=0; i<3; i++){
			temp_poker += '<ul class="all_poker" style="top:-'+i*275+'px;">';
			for(let j=0; j<18; j++){
				temp_poker += '<li class="back" style="top:-'+j+'px"></li>';
			}
			temp_poker += '</ul>';
		}
		$('.mid_top').html(temp_poker);

        $('body').mousemove(function(e){
            if(click++==1){$('.mid_top').html(temp_poker);}

            for(let i=0;i<54;i++){
                let math=Math.random()
                setTimeout(function(){
                    $('.all_poker li').eq(i).css({'top':''+(e.pageY-160)+'px','left':''+(e.pageX-950)+'px','transition':'linear 1s','transition':'linear 1s'})
                },55*i)
            }
        })
        //洗牌动画执行3秒
        setTimeout(function(){
            $('body').off('mousemove');
        },3000)
        //洗牌动画结束后重新生成新牌组
        //洗牌动画执行4秒
        setTimeout(function(){
            // 4、删除临时动画牌组
            $('.all_poker').remove();

            // 5、回复原样
            $('.mid_top').html(all_poker_html);
            $('.all_poker li').each(function(i){
                $('.all_poker li').eq(i).animate({'top':'0px'},200,function(){
                    $('.all_poker li').eq(i).animate({'left':i*10+'px'},500)
                    $('.all_poker').animate({'left':-270+'px'},500)
                });
            })
        }, 6500);
		
	}

	// 发牌函数
	function sendPoker (number){
		if(number < 17){
			number++;

			// 把牌发给左边玩家
			$('.all_poker').animate({'left':+(number*15-270)+'px'},60);
			$('.all_poker li:last').animate({'left':'-500px','top':number*18+'px'},55, function(){
				// 把总牌组中的最后一张牌的数据，删除并添加到玩家1的手牌数据中
				player[0].poker.push(all_poker.pop());

				// 删除发下去牌背
				$('.all_poker li:last').remove();

				// 生成玩家1当前收到的牌
				let temp = makePoker(player[0].poker[player[0].poker.length-1]);
				$('.play_1').append(temp);
				$('.play_1 li:last').css({'top':number*18+'px'});


				// 把牌发给中间玩家
				$('.all_poker li:last').animate({'left':number*30+'px','top':'500px'}, 55, function(){
					// 把总牌组中的最后一张牌的数据，删除并添加到玩家2的手牌数据中
					player[1].poker.push(all_poker.pop());

					// 删除发下去牌背
					$('.all_poker li:last').remove();

					// 生成玩家2当前收到的牌
					let temp = makePoker(player[1].poker[player[1].poker.length-1]);
					$('.play_2').append(temp);
					$('.play_2 li:last').css({'left':number*30+'px'});
					$('.play_2').css({'left':-number*15+'px'});

					// 把牌发给右边玩家
					$('.all_poker li:last').animate({'left':'700px', 'top':number*18+'px'}, 55, function(){
						// 把总牌组中的最后一张牌的数据，删除并添加到玩家3的手牌数据中
						player[2].poker.push(all_poker.pop());

						// 删除发下去牌背
						$('.all_poker li:last').remove();

						// 生成玩家3当前收到的牌
						let temp = makePoker(player[2].poker[player[2].poker.length-1]);
						$('.play_3').append(temp);
						$('.play_3 li:last').css({'top':number*18+'px'});

						//自调用
						sendPoker(number);
					});
				});
			});
		}else{
			// 牌已经发完了，需要进行排序。所以调用牌的排序函数
			$(player).each(function(i){
				sortPoker(player[i].poker);
			})
			// 通过动画把排序好的牌重新生成到页面对应的位置上
			// 所有玩家的动画 
			// 三个玩家都调用手牌排序动画函数
			sortPokerAnimate(0);
			sortPokerAnimate(1);
			sortPokerAnimate(2, function(){
				getBoss();
			});		
		}
	}

	// 抢地主函数
	function getBoss(get_num, cancel){
		// 1、生成一个0~2之间的随机数，确定由哪位玩家开始抢地主
		if(get_num === undefined){
			get_num = Math.round(Math.random()*2);
		}
		cancel = cancel || 0;

		// 2、让开始抢地主的玩家显示功能按钮
		$('.get_boss').eq(get_num).css({'display':'block'});
		//抢地主的闹钟显示
		$('.clock').eq(get_num).css({'display':'block'});
		//把闹钟的数字变为黑色
		$('.clock p').css({'color':'black'});

		// 3、给抢地主的玩家的按钮绑定对应的事件
		// 3.1、绑定的是抢地主的事件
		$('.get_boss').eq(get_num).find('.get').off();
		$('.get_boss').eq(get_num).find('.get').on('click', function(){

			// 把抢地主按钮隐藏
			$('.get_boss').eq(get_num).css({'display':'none'});
			//不抢地主标签全隐藏
			$('.text').css({'display':'none'});
			//给三位玩家的身份图片显示出来
			$('.ident').animate({'opacity':'1','margin-top':'-25px'},1500);

			$('.point').css({'display':'block'})

			$('.clock').css({'display':'none'})


			//抢完地主清除抢地主定时器
			clearInterval(time);

			player[get_num].identity = 1;		// 给对应玩家设置为地主身份
			game_data.boss = get_num;

			// 4、把桌面上留下的三张牌发给地主
			// 4.1、通过简单的动来描述这个过程
			$('.all_poker li').eq(0).animate({'left':'-150px'},500);
			$('.all_poker li').eq(2).animate({'left':'160px'},500, function(){
				// 4.2删除牌背的元素
				$('.all_poker li').remove();

				// 4.3生成三张牌的牌面
				$(all_poker).each(function(i){
					$('.all_poker').append(makePoker(all_poker[i]));
					if (i == 1) {
						$('.all_poker li:last').css({'left':'-150px'});
					}else if(i == 2){
						$('.all_poker li:last').css({'left':'150px'});
					}
				});

				// 4.4 生成的牌进行一个简单移动动画
                $('.all_poker').css({'transform':'scale(0.8)'})
                $('.all_poker li').css({'transform':'scale(0.8)'})
				$('.all_poker li').animate({'top':'-80px'}, 300);

				// 4.5 等动画结束后，把剩余牌的数据放入地主玩家的手牌中
				setTimeout(function(){
					let temp;
					let temp_html = '';
					let num = 17;
					$(all_poker).each(function(i){
						// 把数据放到地主玩家的手牌数据中
						temp = all_poker.pop();
						player[game_data.boss].poker.push(temp);

                        // 设置玩家地主角色
						player[game_data.boss].role = 1

						// 把牌生成到地主玩家的HTML代码中
						temp_html = makePoker(temp);
						$('.play_'+(game_data.boss+1)).append(temp_html);
						if(game_data.boss == 1){
							$('.play_'+(game_data.boss+1)).find('li:last').css({'left': (510+i*18) + 'px','top':'-50px'});
							$('.play_'+(game_data.boss+1)).css({'left':-(num++ * 15) + 'px'});
							$('.play_'+(game_data.boss+1)).find('li:last').animate({'top':'0px'},500,function(){
								sort();
							});
						}else if(game_data.boss == 2){
							$('.play_'+(game_data.boss+1)).find('li:last').css({'top':(510+i*18) + 'px','left':'-50px'});
							$('.play_'+(game_data.boss+1)).find('li:last').animate({'left':'0px'},500,function(){
								sort();
							});
						}else{
							$('.play_'+(game_data.boss+1)).find('li:last').css({'top':(510+i*18) + 'px','right':'-50px'});
							$('.play_'+(game_data.boss+1)).find('li:last').animate({'left':'0px'},500,function(){
								sort();
							});
						}
						// 4.6 地主玩家再做一次动画，进行排序
						function sort(){
							sortPoker(player[game_data.boss].poker);
							sortPokerAnimate(game_data.boss);
						};
					})
				}, 1000);

				// 4.7 把当前出牌玩家设置为地主；
				game_data.play = game_data.boss;

				//把地主玩家的身份图片改掉
				//抢完地主后判断谁是地主写入图标
				for(let i = 0;i<3;i++){
					if(i == game_data.play){
						$('.ident').eq(i).append('<img src="../img/king.png">');
					}
				}

				//播放抢地主的音频
				$('#audio1').attr({'src':'../video/aduio/抢地主.mp3'})

				//开始进入出牌
				//5.设置地主出牌函数
				setTimeout(function(){
					playPoker(game_data.play);
				},2500)
			});
		});
		// 3.2、绑定不抢地主事件
		$('.get_boss').eq(get_num).find('.cancel').off();
		$('.get_boss').eq(get_num).find('.cancel').on('click', function(){
			//不抢抢地主清除抢地主定时器
			clearInterval(time);

			// 把对应玩家抢地主按钮隐藏或删除
			$('.get_boss').eq(get_num).css({'display':'none'});
			//抢地主的闹钟显示
			$('.clock').eq(get_num).css({'display':'none'});
			//不抢地主标签显示
			$('.text').eq(get_num).css({'display':'block'});

			// 自调函数\
			get_num = ++get_num > 2? 0: get_num; 
			if(++cancel == 3){
				// 流局
				//重新洗牌
				wash();
				cancel = 0;
				console.log(cancel);
			}else{
				getBoss(get_num, cancel);
			}

			//播放抢地主的音频
			$('#audio1').attr({'src':'../video/aduio/不抢.mp3'})

		});

		//定义一个空的定时器变量
		let time = '';
		//给抢不抢地主做一个时间限制8秒内不抢直接到下一个玩家抢地主	
		//抢地主倒计时函数
		function timeout(){
			let ms = 9;
            $('.clock p').html(9);
			time = setInterval(function(){
				ms = --ms < 0?0:ms;
				if(ms > 3){
					$('.clock p').html(ms);	
					$('.clock p').css({'color':'black'});
				}else if(ms <= 3 && ms > 0){
					//抢地主剩下最后3秒的时候和出现警告声
					$('.clock p').css({'color':'red'});
					$('#audio1').attr({'src':'../video/aduio/警告声.mp3'})
					$('.clock p').html(ms);
				}else{
					clearInterval(time);
					$('.clock p').html(8);
					//8秒以后直接点击不抢地主
					$('.get_boss').eq(get_num).find('.cancel').one().click();
				}	
			},1000)
		}
		timeout();

	}

	//出牌封装的函数
		
	function playPoker(play,pass){
		let time = '';

		// 如果已经累加了2次过牌，则桌面牌清空
		if(pass == 2){
			game_data.desktop.type = 0;
			game_data.desktop.max = 0;
			game_data.desktop.poker = [];
			pass = 0;
		}
		//给当前玩家按钮赋值
		let $play_btn = $('.play_btn').eq(play);
		let $play_clock = $('.clock').eq(play);

		//  把所玩家的按钮都隐藏
		//  把所闹钟的按钮都隐藏
		$('.play_btn').css({'display':'none'});
		$('.clock').css({'display':'none'});
		$('.clock p').css({'color':'black'});
		// 对玩家操作按钮组进行处理
		$play_btn.css({'display':'block'});
		//闹钟
		$play_clock.css({'display':'block'});

		//解除重复绑定事件
		$play_btn.off('click','.play').off('click','.pass');
		// 解绑选择牌的事件
		$('.play_poker').off('click', 'li');

		//绑定点击牌事件
		$('.play_'+(play+1)).on('click','li',function(){
            // $('.tips').off()
            $('.play_'+play).off('click', 'li');
			//出牌后清除定时器
			// clearInterval(timmer3);
			//获取点中的牌的数据
			let poker_data ={};
			poker_data.num = $(this).attr('data-num')*1;
			poker_data.color = $(this).attr('data-color')*1;
			// alert(21)

			//通过当前牌的样式是否有selected这样的类型来判断选中还是取消
			if($(this).attr('class') != 'selected'){
				player[play].selected.poker.push(poker_data)
				//设置该牌的样式为选中
				$(this).addClass('selected');
			}else{
				//把要点击取消的牌的数据从选中牌数组中删除
				for(let i = 0;i<player[play].selected.poker.length;i++){
					if(player[play].selected.poker[i].num == poker_data.num && 
						player[play].selected.poker[i].color == poker_data.color){
						player[play].selected.poker.splice(i,1);
						break;
					}
				}
				//如果有就是被取消去除该牌的样式
				$(this).removeClass('selected');

			}		
		})
		//绑定出牌事件
			$play_btn.on('click','.play',function(){
				//解除重复绑定事件
				// $('.play_'+(play+1)).off('click','li');
				if(player[play].selected.poker.length == 0){
					//再次点击的时候后移除第一张图片
					$('.trip').find('img').eq(0).remove();
					$('.trip').css({'z-index':'9999'});

                    popUp('你还没有选择牌哟')
					// 提示图片执行的动画
					$('.trip img').eq(0).animate({'top':'0px','opacity':'1'},500).animate({'opacity':'1'},3000,function(){
						$('.trip img').eq(0).animate({'top':'50px','opacity':'0'},500,function(){
							$('.trip').css({'z-index':'0'});
						})
					})
				}else{
					//进入出牌阶段
					//对打出的牌形进行判断是否正确
					if(!checkPoker(player[play].selected)){
						disCover(!checkVS(play),!checkPoker(player[play].selected),play);
					}else{
						if(!checkVS(play)){
							//对当前玩家出牌情况进行判断
							// 判断用户的牌能不能打得过上一个用出得牌组
							console.log(!checkVS(play));
							disCover(!checkVS(play),!checkPoker(player[play].selected),play);
						}else{
							//先把打出去的牌的数据替换成桌面牌组的数组
							game_data.desktop.type = player[play].selected.type;
							game_data.desktop.max = player[play].selected.max;
							game_data.desktop.poker = [];

							for(let i = 0;i<player[play].selected.poker.length;i++){
								//最先开局的时候桌面什么牌都没有
								game_data.desktop.poker.push({num:0, color:0});

								for(x in player[play].selected.poker[i]){
									game_data.desktop.poker[i][x] = player[play].selected.poker[i][x];
								}
							}

							//把打出去的牌从手牌数据中删除
							for(let i = 0;i<player[play].poker.length;i++){
								for(let j = 0;j<player[play].selected.poker.length;j++){
									if(player[play].poker[i].num == player[play].selected.poker[j].num && 
										player[play].poker[i].color == player[play].selected.poker[j].color
										){
										// console.log(i,j);
										player[play].poker.splice(i, 1);
									}
								}
							}

							//打出牌的数据替换成桌面牌数据和手牌数据替换后把玩家选中的牌初始化
							player[play].selected.type = 0;
							player[play].selected.max = 0;
							player[play].selected.poker = [];

							// 画面的生成
							// 1、生成桌面牌的HTML代码
							// 1.1 删除原桌面的牌组、
							$('.desktop_poker li').remove();

							$(game_data.desktop.poker).each(function(i){
								$('.desktop_poker').append(makePoker(game_data.desktop.poker[i]));
								$('.desktop_poker li:last').css({'left':i*30+'px'});
								$('.desktop_poker').css({'left':-15*i+'px'});
							});

							// 2、生新生成玩家手牌的HTML代码
							// 2.1 把手牌全删除 
							$('.play_'+(play+1)+' li').remove();
							// 2.2 通过手牌数据重新的生成HTML代码到对应玩家中
							$(player[play].poker).each(function(i){
								$('.play_'+(play+1)).append(makePoker(player[play].poker[i]));
									if(play == 1){
										$('.play_'+(play+1)+' li:last').css({'left':i*30+'px'});
										$('.play_'+(play+1)).css({'left':-i*15+'px'});
									}else{
										$('.play_'+(play+1)+' li:last').css({'top':i*18+'px'});
									}
							});

							// -----------判断胜负--------
							if(player[play].poker.length == 0 ){
								for(let i=0;i<3;i++){
									console.log(game_data.boss,play)
								   if (game_data.boss === play){
								   		if (i === play){
                                            player[play].score  = player[play].score+1000
                                            player[play].win  = player[play].win+1
										}else{
                                            player[i].score  = player[i].score-500
										}
								   }else{
									  if (i !== game_data.boss){
										  player[i].score  = player[i].score+500
                                          player[i].win  = player[i].win+1
									  }else{
                                          player[i].score  = player[i].score-1000
									  }
								   }
								}
								//对当前玩家出牌情况进行判断
								//再次点击的时候后移除第一张图片
								$('.trip').find('img').eq(0).remove();
								$('.trip').css({'z-index':'9999'});
								// 胜出的动画
								$('.trip').append('<img src="../img/win.gif"><audio src="video/aduio/winner.mp3" autoplay></audio>')
								//提示图片执行的动画
								$('.trip img').eq(0).animate({'top':'0px','opacity':'1'},500).animate({'opacity':'1'},3000,function(){
									$('.trip img').eq(0).animate({'top':'50px','opacity':'0'},500,function(){
										$('.trip').css({'z-index':'0'});

                                        //隐藏所有玩家按钮和时钟
                                        $play_btn.css({'display':'none'});
                                        $('.clock').css({'display':'none'});
                                        clearInterval(time);
                                        // 显示结算页
                                        for(let i=0;i<3;i++){
                                        	if(i===1){
                                                $('.player_wrap').eq(i).find('li').eq(0).html(decodeURIComponent(res[0]))
                                                $('.player_wrap').eq(i).find('li').eq(2).html(player[i].score)

                                            }else{
                                                $('.player_wrap').eq(i).find('li').eq(0).html(player[i].nekname)
                                                $('.player_wrap').eq(i).find('li').eq(2).html(player[i].score)

                                            }
                                            	console.log(player[i])
                                            if (player[i].win === 1){
                                                $('.player_wrap').eq(i).find('li').eq(1).html('胜')
                                            }else{
                                                $('.player_wrap').eq(i).find('li').eq(1).html('负')
											}
											$('.total').eq(i).find('span').html(player[i].score)

                                        }
                                        $('.gameover').css({display:'block'})

                                        $('.again').on('click',function () {
                                            $('.again').off()
                                            $('.tips').off()
											$('.pass').off()
											$('.play').off()
                                            $('.play_1').off('click', 'li');
                                            $('.play_2').off('click', 'li');
                                            $('.play_3').off('click', 'li');
                                            //清除定时器否则会继续进行游戏
                                            clearInterval(time);
                                            //重新洗牌
                                            wash();
                                            $('.gameover').css({display:'none'})

                                        })
										$('.hidden').on('click',function () {
                                            $('.hidden').off()
                                            $('.tips').off()
                                            $('.pass').off()
                                            $('.play').off()
                                            $('.play_1').off('click', 'li');
                                            $('.play_2').off('click', 'li');
                                            $('.play_3').off('click', 'li');
                                            //清除定时器否则会继续进行游戏
                                            clearInterval(time);
                                            //重新洗牌
                                            wash();
                                            $('.gameover').css({display:'none'})
                                        })
                                    })
								})

								//隐藏所有玩家按钮和时钟
								$play_btn.css({'display':'none'});
								$('.clock').css({'display':'none'});

							/*	//游戏结束后3秒重新开始游戏洗牌
								setTimeout(function(){

								},3000)*/
							}else{
								//调用音效函数
								pokerAudio(game_data.desktop.type,game_data.desktop.poker[0].num,game_data.desktop.poker[0].color);
								// 还没有分出胜负，继续打牌
								play = ++play > 2? 0: play;
								//清除上一个玩家定时器
								clearInterval(time);
								//判断牌型如果是连对或者飞机或者炸弹或者是王炸就延迟5秒等动画播放完后再调用出牌函数
								if(game_data.desktop.type == 7 || 
									game_data.desktop.type == 8 || 
									game_data.desktop.type == 100 ||
									game_data.desktop.type == 110 ){
									//五秒后调用
										setTimeout(function(){
											playPoker(play, 0);	
										},5500);
									}else{
										// 否则立即调用
										playPoker(play, 0);	
									}

							}
						}
					}
				}
			})

			//绑定过牌事件
				$play_btn.on('click','.pass',function(){
                    $('.tips').off()

					if(game_data.desktop.poker == ''){
						//对当前玩家出牌情况进行判断
						disCover(!checkVS(play),!checkPoker(player[play].selected),play);
						// $play_btn.off('click','.pass');
						// alert('你必须先出牌');
					}else{
						//如果有手牌选中就取消选中
						$('.play_'+(play+1)+' li').each(function(i){
							if($('.play_'+(play+1)).find('li').eq(i).attr('class') == 'selected'){
								$('.play_'+(play+1)).find('li').eq(i).on().click();
							}
						})
						// 解除重复绑定事件
						$('.play_'+(play+1)).off('click','li');
						// 切换到下一位玩家进行按钮操作
						game_data.play = ++play > 2?0 :play;
						//重新调用出牌函数
						playPoker(game_data.play,pass+1);
						//清除上一个玩家的出牌时间的定时器
						clearInterval(time);
						//播放抢地主的音频
						$('#audio1').attr({'src':'../video/aduio/过.mp3'})
					}	
				});

				//出牌倒计时函数
				function timeOut(){
					let ms =30
                    $('.clock p').html(30);
					time = setInterval(function(){
						ms = --ms < 0?0:ms;
						if(ms > 5){
							$('.clock p').html(ms);	
							// console.log(ms);	
						}else if(ms <= 5 && ms > 0){
							//出牌玩家剩下最后5秒的时候出现红色数字和警告声音
							$('.clock p').css({'color':'red'});
							$('#audio1').attr({'src':'../video/aduio/警告声.mp3'})
							$('.clock p').html(ms);
						}else if(game_data.desktop.poker == '' && ms == 0){
							//如果地主或者经过一轮后超过了限定时间未出牌有选中的牌的话先取消选中在出第一战牌
							$('.play_'+(play+1)+' li').each(function(i){
								if($('.play_'+(play+1)).find('li').eq(i).attr('class') == 'selected'){
									$('.play_'+(play+1)).find('li').eq(i).on().click();
								}
							})
							clearInterval(time);
							//取消选中的牌或没有选中的牌后自动出第一张最小的牌
							$('.play_'+(play+1)).find('li').eq(0).on().click();
							$play_btn.find('.play').on().click();
						}else{
							$('.clock p').html(30);
							clearInterval(time);
							$play_btn.find('.pass').on().click();
						}	
					},1000)
				}
				timeOut();

        // 玩家选择提示
        $('.tips').one('click',function () {
            $('.tips').off()
            $('.play_'+play).off('click', 'li');
			if (play===3){
				play = 0;
			}
			$('.play_'+play).off('click', 'li');

            console.log(play)
            console.log(player[play])
            console.log(game_data)
			// 首先判断是否有选中的牌
			if (player[play].selected.poker.length === 0){

                if (game_data.desktop.poker.length === 0){
                    //如果地主或者经过一轮后超过了限定时间未出牌有选中的牌的话先取消选中在出第一战牌
                    $('.play_'+(play+1)+' li').each(function(i){
                        if($('.play_'+(play+1)).find('li').eq(i).attr('class') == 'selected'){
                            $('.play_'+(play+1)).find('li').eq(i).on().click();
                        }
                    })
                    clearInterval(time);

                    //取消选中的牌或没有选中的牌后自动出第一张最小的牌
                    $('.play_'+(play+1)).find('li').eq(0).on().click();

					let $this  = $('.play_'+(play+1)).find('li').eq(0)
                    //获取点中的牌的数据
                    let poker_data ={};
                    poker_data.num = $this.attr('data-num')*1;
                    poker_data.color = $this.attr('data-color')*1;

                    for(let i=0;i<player[play].selected.poker.length;i++){
                        player[play].selected.poker  = []
                    }
                    player[play].selected.poker.push(poker_data)
                    console.log(player[play].selected.poker);
                    //设置该牌的样式为选中
                    $this.addClass('selected');
                    //通过当前牌的样式是否有selected这样的类型来判断选中还是取消
                    console.log(poker_data)
                }else{
					let type = game_data.desktop.type
                    let len = player[play].poker.length
					console.log(player)
					switch (type) {
                    	// 只出一张牌的情况
						case 1 :
							console.log(game_data.desktop.poker)
                            for(let i=0;i<len;i++){
                                if (player[play].poker[i].num > game_data.desktop.max){
                                    player[play].selected.poker  = []
                                    choosePoker(i)
                                    return false
                                }else if (player[play].poker[i].num === game_data.desktop.max && game_data.desktop.max === 14 && player[play].poker[i].color === 1){
                                    player[play].selected.poker  = []
									choosePoker(i)
									return false
								}
                            }

							let arr5 = zhadan()
							if (arr5){
								for(let i=0;i<arr5.length;i++){
									choosePoker(arr5[i])
								}
								return false
							}

                            popUp('你没有能打的牌哦')
                            break
						// 出两张牌的情况
						case 2:
                            for(let i=0;i<len-1;i++){
                            	if (player[play].poker[i].num > game_data.desktop.max){
                                    if (player[play].poker[i].num === player[play].poker[i+1].num){
                                        player[play].selected.poker  = []
                                        choosePoker(i)
                                        choosePoker(i+1)
                                        return false
                                    }else if(player[play].poker[i].num === 14 && player[play].poker[i+1].num === 14){
                                        player[play].selected.poker  = []
                                        choosePoker(i)
                                        choosePoker(i+1)
                                        return false
                                    }
								}
                            }

                            let arr6 = zhadan()
                            if (arr6){
                                for(let i=0;i<arr6.length;i++){
                                    choosePoker(arr6[i])
                                }
                                return false
                            }
                            popUp('你没有能打的牌哦')
							break
						case 3:
                            for(let i=0;i<len-2;i++){
                                if (player[play].poker[i].num > game_data.desktop.max){
                                    if (player[play].poker[i].num === player[play].poker[i+1].num && player[play].poker[i+1].num === player[play].poker[i+2].num){
                                        player[play].selected.poker  = []
                                        choosePoker(i)
                                        choosePoker(i+1)
                                        choosePoker(i+2)
                                        return false
                                    }else if(player[play].poker[i].num === 14 && player[play].poker[i+1].num === 14){
                                        player[play].selected.poker  = []
                                        choosePoker(i)
                                        choosePoker(i+1)
										return false
									}
                                }
                            }

                            let arr7= zhadan()
                            if (arr7){
                                for(let i=0;i<arr7.length;i++){
                                    choosePoker(arr7[i])
                                }
                                return false
                            }
                            popUp('你没有能打的牌哦')
							break
						case 4:
							for(let i=0;i<len-2;i++){
                                if (player[play].poker[i].num > game_data.desktop.max){
                                    if (player[play].poker[i].num === player[play].poker[i+2].num){
                                        player[play].selected.poker  = []
                                        choosePoker(i)
                                        choosePoker(i+1)
                                        choosePoker(i+2)
										if (i !== 0){
                                            choosePoker(0)
										} else{
											choosePoker(i+3)
										}
                                        console.log(player[play])
										return false
									}else if(player[play].poker[i].num === 14 && player[play].poker[i+1].num === 14){
                                        player[play].selected.poker  = []
                                        choosePoker(i)
                                        choosePoker(i+1)
                                        return false
                                    }
								}
							}

                            let arr8 = zhadan()
                            if (arr8){
                                for(let i=0;i<arr8.length;i++){
                                    choosePoker(arr8[i])
                                }
                                return false
                            }
                            popUp('你没有能打的牌哦')
							break
						case 5:
                            for(let i=0;i<len-2;i++){
                                if (player[play].poker[i].num > game_data.desktop.max){
                                    if (player[play].poker[i].num === player[play].poker[i+2].num){
                                        player[play].selected.poker  = []
                                        choosePoker(i)
                                        choosePoker(i+1)
                                        choosePoker(i+2)
										for(let j=0;j<len-1;j++){
										   if (player[play].poker[j].num !== player[play].poker[i].num &&player[play].poker[j].num === player[play].poker[j+1].num) {
                                               choosePoker(j)
                                               choosePoker(j+1)
											  return false
										   }
										}
                                        return false
                                    }else if(player[play].poker[i].num === 14 && player[play].poker[i+1].num === 14){
                                    	// 王炸
                                        player[play].selected.poker  = []
                                        choosePoker(i)
                                        choosePoker(i+1)
                                        return false
                                    }
                                }
                            }

                            let arr9 = zhadan()
                            if (arr9){
                                for(let i=0;i<arr9.length;i++){
                                    choosePoker(arr9[i])
                                }
                                return false
                            }
                            popUp('你没有能打的牌哦')
							break
						// 判断顺子
						case 6:
							let arr = []
							let arr2 = []
							if (player[play].poker.length >= 6){
								// 将牌数据每个添加一个index属性用于存储索引值
								for(let i=0;i<player[play].poker.length;i++){
                                    player[play].poker[i].index = i
									// 去掉牌组数据中重复的数据，存到一个新数组中
									if (!arr.includes(player[play].poker[i].num)){
										arr.push(player[play].poker[i].num)
									}
								}

                                console.log(arr)
								for(let i=5;i<arr.length;i++){
									console.log(arr.length)
                                    if (game_data.desktop.max<arr[i]){
                                    	console.log(arr[i])

                                    	if (arr[i]-5 === arr[i-5]){
                                    		arr2.push(arr[i],arr[i-1],arr[i-2],arr[i-3],arr[i-4],arr[i-5])
											console.log(arr2)
                                    		for(let i=0;i<arr2.length;i++){
                                    			for(let j=0;j<player[play].poker.length;j++){
                                                    if (arr2[i] ===player[play].poker[j].num){
                                                        choosePoker(player[play].poker[j].index)
														break
                                                    }
                                    			}
                                    		}
                                    		return false
                                    	}
                                    }
								}
                                let arr5 = zhadan()
                                if (arr5){
                                    for(let i=0;i<arr5.length;i++){
                                        choosePoker(arr5[i])
                                    }
                                    return false
                                }
                                king()
							}

                            popUp('你没有能打的牌哦')
							break
						// 判断连对
						case 7:
							let arr3 = []
							let arr4 = []
                            if (player[play].poker.length >= 6){
                                for(let i=0;i<player[play].poker.length;i++){
                                    player[play].poker[i].index = i
                                    if (!arr3.includes(player[play].poker[i].num)){
                                        arr3.push(player[play].poker[i].num)
                                    }
                                }
                                console.log(arr3)
								// for(let i=3;i<arr3.length;i++){
                                //     if (game_data.desktop.max<arr3[i]){
                                //         if (arr3[i]-3 === arr3[i-3]){
                                //         	if (arr3[i] === 14 || arr3[i] === 13){
                                //         		break
								// 			}
                                //             arr4.push(arr3[i],arr3[i-1],arr3[i-2])
								//
								// 			console.log(arr4)
                                //             for(let i=0;i<arr4.length;i++){
                                //                 for(let j=0;j<player[play].poker.length;j++){
                                //                     if (arr4[i] ===player[play].poker[j].num && arr4[i] ===player[play].poker[j+1].num){
                                //                         choosePoker(player[play].poker[j].index)
                                //                         choosePoker(player[play].poker[j+1].index)
                                //                         break
                                //                     }
                                //                 }
                                //             }
                                //             return false
                                //         }
                                //     }
								// }

								for(let i=0;i<len;i++){
                                    if (game_data.desktop.max<player[play].poker[i]){

                                    }
								}

                                let arr5 = zhadan()
                                if (arr5){
                                    for(let i=0;i<arr5.length;i++){
                                        choosePoker(arr5[i])
                                    }
                                    return false
                                }
                            }
                            popUp('你没有能打的牌哦')
                			break
						// 判断炸弹
						case 100:
							for(let i=0;i<len-1;i++){
								if(player[play].poker[i].num === 14 && player[play].poker[i+1].num === 14){
												player[play].selected.poker  = []
												choosePoker(i)
												choosePoker(i+1)
												return false
								}
							}
								popUp('你没有能打的牌哦')
								break
						// 判断王炸
						case 110:
							popUp('你没有能打的牌哦')
							break
                    }
                    function choosePoker(i){
                        let $this = $('.play_'+(play+1)).find('li').eq(i)
                        //获取点中的牌的数据
                        let poker_data ={};
                        poker_data.num = $this.attr('data-num')*1;
                        poker_data.color = $this.attr('data-color')*1;

                        player[play].selected.poker.push(poker_data)
                        $this.addClass('selected')
                    }

                    function king() {
                       if ( player[play].poker[len-1].num ===  player[play].poker[len-2].num === 14) {
                           player[play].selected.poker  = []
                           choosePoker(len-1)
                           choosePoker(len-2)
						   return false
					   }
                    }

                    function zhadan() {
						for(let i=0;i<player[play].poker.length-3;i++){
						   if (player[play].poker[i].num === player[play].poker[i+3].num) {
						   	 return [i,i+1,i+2,i+3]
						   }
						}
						return false
                    }
                }
			}
        })
    }

	// 生成牌面的HTML代码的函数
	function makePoker(poker){
		// console.log(poker);
		let colors = [
			{x:-16, y:-226},		// 方块花色的坐标
			{x:-16, y:-8},			// 梅花花色的坐标
			{x:-160, y:-8},			// 红桃花色的坐标
			{x:-160, y:-226},		// 黑桃花色的坐标
		];


		let x, y;
		if(poker.num != 14){
			x = colors[poker.color].x;
			y = colors[poker.color].y;
		}else {
			if(poker.color == 0){
				x = -160;
				y = -8;
			}else {
				x = -16; 
				y = -8;
			}
		}
		
		let html = '<li data-num="'+poker.num+'" data-color="'+poker.color+'" style="width: 125px; height: 174px; background: url(../img/'+poker.num+'.jpg) '+x+'px '+y+'px;"></li>';
		return html;
	}

	// 牌组排序函数
	function sortPoker(poker_data){
		poker_data.sort(function(x, y){
			if(x.num != y.num){
				return x.num - y.num;
			}else {
				return x.color - y.color;
			}
		});
		return true;
	}


	// 玩家手牌排序动画函数
	// 这个函数中使用了回调函数的方法，可以让动画结束后再按需要执行我们想要执行的语句
	function sortPokerAnimate(play, fun){
		// 1、删除原牌
		$('.play_'+(play+1)+' li').remove();
		// 2、生成牌背
		let temp = '';
		$(player[play].poker).each(function(i){
			if(play == 1){
				temp += '<li class="back" style="left:'+i*30+'px;opacity:0;"></li>';
			}else{
				temp += '<li class="back" style="top:'+i*18+'px;opacity:0;"></li>';
			}
		});
		$('.play_'+(play+1)).html(temp);

		//洗牌动画
		$('.play_'+(play+1)+' li').animate({'opacity':'1'},500,function(){
			if(play == 1){
				$('.play_2 li').animate({'left':60+(((player[play].poker.length/2)*15)+70)+'px'},500);
				// console.log(player[play].poker.length/2);
			}else{
				$('.play_'+(play+1)+' li').animate({'top':210+'px'},500);
			}
		});

		// 等2秒后生成新的牌面
		setTimeout(function(){
			// 删除牌背
			$('.play_'+(play+1)+' li').remove();

			// 循环生成新的牌面
			if(play == 1){
				$(player[play].poker).each(function(i){
					temp = makePoker(player[1].poker[i]);
					$('.play_2').append(temp);
					$('.play_2 li:last').css({'left':(((player[play].poker.length/2)*15)+70)+'px','opacity':'0'});
					$('.play_2 li:last').animate({'left':i*30+'px','opacity':'1'},500);
				});
			}else{
				$(player[play].poker).each(function(i){
					temp = makePoker(player[play].poker[i]);
					$('.play_'+(play+1)).append(temp);
					$('.play_'+(play+1)+' li:last').css({'top':'210px','opacity':'0'});
					$('.play_'+(play+1)+' li:last').animate({'top':i*18+'px','opacity':'1'},500);
				});
			}

			// 判断fun这个值是否有函数传进来，如果有的话，再执行它
			console.log(typeof fun);
			if(typeof fun == 'function'){
				fun();
			}
		}, 1800);
	}

	// 牌型判断的函数
	function checkPoker( data ){
		/*
			牌型判断需要通不同牌张数来各自进行判断的
			牌型代码：
			1 			单张
			2 			对子
			3 			三张
			4  			三带一
			5 			三带二
			6 			顺子
			7  			连对
			8 			飞机
			9 			四带二
			100 		炸弹
			110 		王炸

		 */
		// 手牌数据重新排序
		sortPoker(data.poker);
		let poker = data.poker;
		// console.log(poker.length);

		// 先判断一次牌子是否为顺子
		if(poker.length >= 5 && poker.length <= 12){
			if(checkStraight(poker)){
				data.type = 6;		// 设置牌型为顺子
				data.max = poker[poker.length-1].num;		// 设置牌型判断值
				return true;
			}
		}

		switch(data.poker.length){
			// 没有牌的情况
			case 0:
				return false;
			break;

			// 一张牌的情况
			case 1:
				data.type = 1;		// 设置牌型为单张
				data.max = poker[0].num;		// 设置牌型判断值
				return true;
			break;

			// 两张牌的情况 
			case 2:
				// 判断两张牌的点数是否相同
				if(poker[0].num != poker[1].num){
					return false;
				}
				// 判断牌型是对子还是王炸
				if(poker[0].num != 14){
					data.type = 2;		// 设置牌型为对子
					data.max = poker[0].num;		// 设置牌型判断值
				}else{
					data.type = 110;		// 设置牌型为王炸
					data.max = poker[0].num;		// 设置牌型判断值
				}
				return true;
			break;

			// 三张牌的情况 
			case 3:
				//判断为三张
				if(poker[0].num == poker[2].num){
					data.type = 3;		// 设置牌型为三张
					data.max = poker[0].num;		// 设置牌型判断值
					return true;
				}else{
					return false;
				}
			break;

			// 四张牌的情况 
			case 4:
				// 先判断是否为炸弹
				if(poker[0].num == poker[3].num){
					data.type = 100;		// 设置牌型为炸弹
					data.max = poker[0].num;		// 设置牌型判断值
					return true;
				}
				// 再判断是否为三带一
				if(poker[0].num == poker[2].num || poker[1].num == poker[3].num){
					data.type = 4;		// 设置牌型为三带一
					data.max = poker[1].num;		// 设置牌型判断值
					return true;
				}
				return false;
			break;

			// 五张牌的情况 
			case 5:
				// 判断牌型是否为三带二
				if(poker[0].num == poker[2].num && poker[3].num == poker[4].num ||
					poker[0].num == poker[1].num && poker[2].num == poker[4].num
					){
					data.type = 5;		// 设置牌型为三带二
					data.max = poker[2].num;		// 设置牌型判断值
					return true;
				}
				return false;
			break;

			// 六张牌的情况 
			case 6:
				// 判断是否为连对
				if(checkPair(poker)){
					data.type = 7;		// 设置牌型为连对
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				// 判断是否为6张牌的飞机
				if(poker[0].num == poker[2].num && poker[3].num == poker[5].num && poker[1].num+1 == poker[4].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				// 判断是否为四带二
				if(poker[0].num == poker[3].num || poker[2].num == poker[5].num || poker[1].num == poker[4].num){
					data.type = 9;		// 设置牌型为四带二
					data.max = poker[2].num;		// 设置牌型判断值
					return true;
				}
				return false;
			break;

			//只有顺子一种情况
			case 7:
				if(checkStraight(poker)){
					data.type = 6;		// 设置牌型为顺子
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
					// console.log(poker[poker.length-1]);
				}else{
					return false;
				}
			break;

			// 五张牌的情况
			case 8:
				//判断是否为连对
				//33445566
				if(checkPair(poker)){
					data.type = 7;		// 设置牌型为连对
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				//判断是否为飞机
				if(poker[2].num == poker[4].num && poker[5].num == poker[7].num && poker[3].num + 1 == poker[6].num || 
					poker[1].num == poker[3].num && poker[4].num == poker[6].num && poker[2].num + 1 == poker[5].num || 
					poker[0].num == poker[2].num && poker[3].num == poker[5].num && poker[1].num + 1 == poker[4].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[5].num;		// 设置牌型判断值
					return true;
				}

				// //判断四带两对子    /------------------------问题获取牌面最大的点数大小-----------------------/
				return false;
			break;

			//九张牌的情况
			case 9:
				//判断是否为飞机
				//333444555
				if(poker[0].num == poker[2].num && poker[3].num == poker[5].num && poker[6].num == poker[8].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}else{
					return false;
				}
			break;

			//十张牌情况
			case 10:
				//判断是否为连对
				//3344556677
				if(checkPair(poker)){
					data.type = 7;		// 设置牌型为连对
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}else{
					return false;
				}
			break;

			//十一张牌情况
			case 11:
				//只有一种顺子牌型
				if(checkStraight(poker)){
					data.type = 6;		// 设置牌型为顺子
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
					// console.log(poker[poker.length-1]);
				}else{
					return false;
				}
			break;

			//十二张牌的情况
			case 12:
				//判断是否为连对
				//334455667788
				if(checkPair(poker)){
					data.type = 7;		// 设置牌型为连对
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				//判断是否为飞机
				//分解机的第一种判断
				if(poker[0].num == poker[2].num && poker[3].num == poker[5].num && 
					poker[6].num == poker[8].num && poker[9].num == poker[11].num &&
					poker[1].num + 1 == poker[4].num && poker[4].num + 1 == poker[7].num &&
					poker[7].num + 1== poker[10].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				//飞机的第二种判断
				if(poker[3].num == poker[5].num && poker[6].num == poker[8].num && poker[9].num == poker[11].num && 
					poker[4].num + 1 == poker[7].num && poker[7].num + 1 == poker[10].num || 
					poker[2].num == poker[4].num && poker[5].num == poker[7].num && poker[8].num == poker[10].num && 
					poker[3].num + 1 == poker[6].num && poker[6].num + 1 == poker[9].num ||
					poker[1].num == poker[3].num && poker[4].num == poker[6].num && poker[7].num == poker[9].num && 
					poker[2].num + 1 == poker[5].num && poker[5].num + 1 == poker[8].num ){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[9].num;		// 设置牌型判断值
					return true;
				}

				//第三种飞机的情况
				if(poker[0].num == poker[2].num && poker[3].num == poker[5].num && poker[6].num == poker[8].num && 
					poker[1].num + 1 == poker[44].num && poker[4].num + 1 == poker[7].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[8].num;		// 设置牌型判断值
					return true;
				}
				return false;
			break;

			//十三张牌的情况
			case 13:
				if(checkStraight(poker)){
					data.type = 6;		// 设置牌型为顺子
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}else{
					return false;
				}
			break;

			//十四张牌的情况
			case 14:
				//判断是否为连对
				if(checkPair(poker)){
					data.type = 7;		// 设置牌型为连对
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}else{
					return false;
				}
			break;

			//十五张牌的情况
			case 15:
				//判断是否为飞机
				if(poker[0].num == poker[2].num && poker[3].num == poker[5].num &&
					poker[6].num == poker[8].num && poker[9].num == poker[11].num && 
					poker[12].num == poker[14].num && poker[1].num + 1 == poker[4].num && 
					poker[4].num + 1 == poker[7].num && poker[7].num + 1== poker[10].num &&
					poker[10].num + 1== poker[13].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}else{
					return false;
				}
			break;

			//十六章牌的情况
			case 16:
				//判断是否为连对
				if(checkPair(poker)){
					data.type = 7;		// 设置牌型为连对
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				//判断是否为飞机

				if(poker[4].num == poker[6].num && poker[7].num == poker[9].num && poker[10].num == poker[12].num && poker[13].num == poker[15].num &&
					poker[5].num + 1 == poker[8].num && poker[8].num + 1 == poker[11].num && poker[11].num + 1 == poker[14].num ||
					poker[3].num == poker[5].num && poker[6].num == poker[8].num && poker[9].num == poker[11].num && poker[12].num == poker[14].num &&
					poker[4].num + 1 == poker[7].num && poker[7].num + 1 == poker[10].num && poker[10].num + 1 == poker[13].num ||
					poker[2].num == poker[4].num && poker[5].num == poker[7].num && poker[8].num == poker[10].num && poker[11].num == poker[13].num &&
					poker[3].num + 1 == poker[6].num && poker[6].num + 1 == poker[9].num && poker[9].num + 1 == poker[12].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[13].num;		// 设置牌型判断值
					return true;
				}

				if(poker[1].num == poker[3].num && poker[4].num == poker[6].num && poker[7].num == poker[9].num && poker[10].num == poker[12].num &&
					poker[2].num + 1 == poker[5].num && poker[5].num + 1 == poker[8].num && poker[8].num + 1 == poker[11].num ||
					poker[0].num == poker[2].num && poker[3].num == poker[5].num && poker[6].num == poker[8].num && poker[9].num == poker[11].num &&
					poker[1].num + 1 == poker[4].num && poker[4].num + 1 == poker[7].num && poker[7].num + 1 == poker[10].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[11].num;		// 设置牌型判断值
					return true;
				}

				return false;

			break;

			//十七张牌的情况
			case 17:
				//牌型只有顺子
				//只有一种顺子牌型
				if(checkStraight(poker)){
					data.type = 6;		// 设置牌型为顺子
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}else{
					return false;
				}
			break;

			//十八张牌的情况
			case 18:
				//判断是否为连对
				if(checkPair(poker)){
					data.type = 7;		// 设置牌型为连对
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				//判断是否为飞机
				if(poker[0].num == poker[2].num && poker[3].num == poker[5].num && poker[6].num == poker[8].num &&
					poker[9].num == poker[11].num && poker[12].num == poker[14].num && poker[15].num == poker[17].num && 
					poker[1].num + 1 == poker[4].num && poker[4].num + 1 == poker[7].num && poker[7].num + 1== poker[10].num && 
					poker[10].num + 1== poker[13].num && poker[13].num + 1== poker[16].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				return false;

			break;

			//十九张牌的情况
			case 19:
				//只有一种顺子牌型
				if(checkStraight(poker)){
					data.type = 6;		// 设置牌型为顺子
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}else{
					return false;
				}

			break;

			//二十张牌的情况
			case 20:
				//判断是否为连对
				if(checkPair(poker)){
					data.type = 7;		// 设置牌型为连对
					data.max = poker[poker.length-1].num;		// 设置牌型判断值
					return true;
				}

				// 判断是否为飞机
				//第一种飞机的情况
				if(poker[5].num == poker[7].num && poker[8].num == poker[10].num && poker[11].num == poker[13].num && 
					poker[14].num == poker[16].num && poker[17].num == poker[19].num &&
					poker[6].num + 1 == poker[9].num && poker[9].num + 1 == poker[12].num && 
					poker[12].num + 1 == poker[15].num && poker[15].num + 1 == poker[18].num ||
					poker[4].num == poker[6].num && poker[7].num == poker[9].num && poker[10].num == poker[12].num && 
					poker[13].num == poker[15].num && poker[16].num == poker[18].num &&
					poker[5].num + 1 == poker[8].num && poker[8].num + 1 == poker[11].num && 
					poker[11].num + 1 == poker[14].num && poker[14].num + 1 == poker[17].num ||
					poker[3].num == poker[5].num && poker[6].num == poker[8].num && poker[9].num == poker[11].num && 
					poker[12].num == poker[14].num && poker[15].num == poker[17].num &&
					poker[4].num + 1 == poker[7].num && poker[7].num + 1 == poker[10].num && 
					poker[10].num + 1 == poker[13].num && poker[13].num + 1 == poker[16].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[17].num;		// 设置牌型判断值
					return true;
				}

				//第二种飞机的情况
				if(poker[2].num == poker[4].num && poker[5].num == poker[7].num && poker[8].num == poker[10].num && 
					poker[11].num == poker[13].num && poker[14].num == poker[16].num &&
					poker[3].num + 1 == poker[6].num && poker[6].num + 1 == poker[9].num && 
					poker[9].num + 1 == poker[12].num && poker[12].num + 1 == poker[15].num ||
					poker[1].num == poker[3].num && poker[4].num == poker[6].num && poker[7].num == poker[9].num && 
					poker[10].num == poker[12].num && poker[13].num == poker[15].num &&
					poker[2].num + 1 == poker[5].num && poker[5].num + 1 == poker[8].num && 
					poker[8].num + 1 == poker[11].num && poker[11].num + 1 == poker[14].num ||
					poker[0].num == poker[2].num && poker[3].num == poker[5].num && poker[6].num == poker[8].num && 
					poker[9].num == poker[11].num && poker[12].num == poker[14].num &&
					poker[1].num + 1 == poker[4].num && poker[4].num + 1 == poker[7].num && 
					poker[7].num + 1 == poker[10].num && poker[10].num + 1 == poker[13].num){
					data.type = 8;		// 设置牌型为飞机
					data.max = poker[17].num;		// 设置牌型判断值
					return true;
				}
				return false;

			break;

		}

		// 判断牌组是否为顺子的函数
		function checkStraight(poker){
			//判断最大值的那张牌不能是2或者是王
			if(poker[poker.length-1].num == 13 || poker[poker.length-1].num == 14){
				return false;
			}

			// 通过循环来判断牌组数据是否为顺子
			for(let i=0; i<poker.length-1; i++){
				if(poker[i].num + 1 != poker[i+1].num){
					return false;
				}
			}
			return true;
		}
		// 判断牌组是否为连对的函数 
		function checkPair(poker){

			// 通过循环来判断牌组数据是否为连对
			for(let i=0; i<poker.length-3; i += 2){
				if(poker[i].num != poker[i+1].num || poker[i].num+1 != poker[i+2].num || poker[i+2].num != poker[i+3].num){
					return false;
				}else if(poker[i+2].num === poker[i+3].num && poker[i+3].num===13){
					return false
                }
            }



			return true;
		}
	}

	// 出牌时比较两个牌组的方法
	function checkVS(play){
		// 判断必然可以胜出的情况
		if(player[play].selected.type == 110 || game_data.desktop.type == 0){
			return true;
		}

		// 判断必然会输的情况
		if(game_data.desktop.type == 110){
			return false;
		}

		// 判断综合情况
		// 情况1，出的是炸弹，旧面的牌不是炸弹
		if(player[play].selected.type == 100 && game_data.desktop.type !=100){
			return true;
		}

		// 特殊情况大小王对比
		if(player[play].selected.poker[0].num == 14 && game_data.desktop.poker[0].num == 14){
			if(player[play].selected.poker[0].color > game_data.desktop.poker[0].color){
				return true;
			}else{
				return false;
			}
		}

		// 正常情况下两组牌对比的方法
		if(player[play].selected.type != game_data.desktop.type){
			return false;
		}else{
			if(player[play].selected.poker.length != game_data.desktop.poker.length ){
				return false;
			}else{
				if(player[play].selected.max > game_data.desktop.max){
					return true;
				}else{
					return false;
				}
			}
		}
	}

	//打牌音效判断
	
	/*
			牌型判断需要通不同牌张数来各自进行判断的
			牌型代码：
			1 			单张
			2 			对子
			3 			三张
			4  			三带一
			5 			三带二
			6 			顺子
			7  			连对
			8 			飞机
			9 			四带二
			100 		炸弹
			110 		王炸

		 */
	function pokerAudio(type,num,color){
		
		//每次执行一次出牌声效
		$('#audio1').attr({'src':'../video/aduio/play.mp3'}) 
		switch(type){
			case 1:
				if(num == 14 && color == 0){
					$('#audio').attr({'src':'../video/aduio/'+num+'.mp3'})
				}else if(num == 14 && color == 1){
					$('#audio').attr({'src':'../video/aduio/'+(num+1)+'.mp3'})
				}else{
					$('#audio').attr({'src':'../video/aduio/'+num+'.mp3'})
				}	
			break;

			case 2:
				$('#audio').attr({'src':'../video/aduio/dobble'+num+'.mp3'})	
			break;

			case 3:
				$('#audio').attr({'src':'../video/aduio/3for'+num+'.mp3'})	
			break;

			case 4:
				$('#audio').attr({'src':'../video/aduio/3带1.mp3'})	
			break;

			case 5:
				$('#audio').attr({'src':'../video/aduio/3带一对.mp3'})	
			break;

			case 6:
				$('#audio').attr({'src':'../video/aduio/顺子.mp3'})	
			break;

			case 7:
				$('#audio').attr({'src':'../video/aduio/连对.mp3'})	
				$('#audio1').attr({'src':'../video/aduio/连对声.mp3'})
				boom(7);
			break;

			case 8:
				$('#audio').attr({'src':'../video/aduio/飞机.mp3'})	
				$('#audio1').attr({'src':'../video/aduio/飞机声.mp3'})
				boom(8);
			break;

			case 9:
				$('#audio').attr({'src':'../video/aduio/4带2.mp3'})	
			break;

			case 100:
				$('#audio').attr({'src':'../video/aduio/炸弹.mp3'})
				boom(100);
			break;

			case 110:
				$('#audio').attr({'src':'../video/aduio/王炸.mp3'})
				boom(110);
			break;
		}
	}

	//炸弹动画函数
	function boom(type){
		//添加王炸人物的出场图片在执行gif
		$('.boom-role img').attr({'src':'../img/roleimg/'+type+'.png'}).css({'z-index':'9999'}).animate({'right':'0px','opacity':'1'},500,function(){
			$('.boom-role img').animate({'right':'80px'},1500,function(){
				$('.boom-role img').animate({'right':'800px','opacity': '0'},500,function(){
					//等视频播放完后执行
					$('.boom-role img').css({'z-index':'0','right':'-300px'})
				})
			})
		})
		//添加王炸视频在执行gif
		// $('.video').attr({'src':'../video/'+type+'.mp4'});
		$('.gif').attr({'src':'../video/'+type+'.gif'});

		$('.boom').css({'z-index':'9999'}).animate({'height':'500px','margin-top':'-250px','opacity':'1'},500,function(){
			setTimeout(function(){
				$('.boom').animate({'height':'0px','margin-top':'0px','opacity':'0'},500,function(){
					$('.boom').css({'z-index':'0'});
				})
			},4800)
		})
	}

	//出牌判断和地主先出牌和胜负判断
	function disCover(play,rule,num){
		//再次点击的时候后移除第一张图片
		$('.trip').find('img').eq(0).remove();
		$('.trip').css({'z-index':'9999'});
		console.log(game_data.desktop)
		console.log(player[num].selected)
		// 根据判断条件选择弹出什么提示图片
		if(game_data.desktop.poker == '' && player[num].selected.poker.length == 0){
			popUp('你必须先出牌哦')
			// $('.trip').append('<img src="../img/youfirst.png">')
		}else if(rule == true){
            popUp('你出的牌不符合规则哦')
			// $('.trip').append('<img src="../img/mistake.png">')
		}else if(play == true){
            popUp('你的牌太小啦')
			// $('.trip').append('<img src="../img/rule.png">')
		}
		$('.trip img').eq(0).animate({'top':'0px','opacity':'1'},500).animate({'opacity':'1'},3000,function(){
			$('.trip img').eq(0).animate({'top':'50px','opacity':'0'},500,function(){
				$('.trip').css({'z-index':'0'});
			})
		})
	}


	// 哆啦A梦弹框
    function popUp (str,height=260) {
        $(function () {
            $('.tanText').html('<p>多啦A梦提醒您:</p>')
            $('.float').css('display','block');

            $('.tanText').append(str);
            $('.tanBox1').css('height',height+'px');
        });
       setTimeout(()=>{
           $('.float').css('display','none');
       },3000)

        $(".close").click(function () {
            $('.float').css('display','none');
        })

    }
	
});