
/***
 * 进攻的敌人基类
 * 通過原型設計模式提供出來外部調用的接口，
 * opt:拓展數組函數
 * _node:調用的this
 */

var EnemyBase=cc.Sprite.extend({
	hpBgSprite :null, //血条
	runSpeed :3, //移动时间
	//把敌人和地图数据很好的关联起来，这样我们就可以把从地图中获取的路径点赋值给敌人，然后敌人就可以通过它方便的计算行进路线和方向了
	pointCounter :null, //当前的点计数器
	animationRight :null, //右方向动画
	animationLeft :null, //左方向动画
	currPoint :null, //精灵当前位置
	nextPoint :null, //精灵下次移动位置
	hpPercentage :null, //进度条值
	pic :null, //精灵图片
	maxHp :null, //精灵最大血量
	currHp :null, //当前血量
	sprite:null,//敌人精灵
	ctor:function(){
		this._super();
	},
	//开始执行
	init:function(opts,_node){
		//初始化数据
		this.initData(opts);
		//this=new cc.Sprite();
		//获取当前点
		this.getCurrPoint();
		this.x=this.currPoint.x;
		this.y=this.currPoint.y;
		var anmima=this.createAnimation(this.pic, 4, 0.1);
		this.runAction(anmima.repeatForever());
		this.createAndSetHpBar(); //创建血条
		var guid=uuid(16);
		//设置标签属性,运动完成后通过该标签移除队列中的该精灵
		this.attr({guid:guid});
		
		_node.addChild(this);
		
		this.runFllowPoint();
	},
	initData:function(opts){
		this.pointCounter=0; //
		this.runSpeed=3;
		this.hpPercentage=100;
		_.extend(this,opts);
		this.currHp=this.maxHp;
	}
	,
	//开始运动
	runFllowPoint:function(){
		
		this.getNextPoint();
		if( this.nextPoint){
			var actionTo = cc.MoveTo(this.runSpeed,cc.p(this.nextPoint)); //设置移动效果
			this.runAction(cc.sequence(actionTo,cc.CallFunc(this.runFllowPoint,this))); //设置移动完成后的回调
		}else{
			//运动完成后通过该标签移除队列中的该精灵
			for(var i=0;i<enemyVector.length;i++){
				var enemy=enemyVector[i];
				if(enemy.guid==this.guid){
					enemyVector.remove(i);
					//
					this.removeFromParent();
				}
			}
			cc.log("运动结束"+enemyVector.length);
		}
	},
	
	updateHpBar:function(){
		this.hpBar.setPercentage(this.hpPercentage);
	},
	/***
	 * 创建动作~
	 * 图片名称,帧数,销毁时间
	 */
	createAnimation:function(prefixName,framesNum,delay){
		var animFrames=[];
		for (var i = 1; i <= framesNum; i++){
			var pngname=prefixName+"_"+i+".png";
			var pfram=cc.spriteFrameCache.getSpriteFrame(pngname);
			animFrames.push(pfram);
		}
		var animation = cc.Animation(animFrames,delay);
		var animate = cc.Animate(animation);
		return animate;
	},
	
	createAndSetHpBar:function(){

		this.hpBgSprite=cc.Sprite("#hpBg1.png");
		this.hpBgSprite.setPosition(cc.p(this.hpBgSprite.getContentSize().width / 2, this.hpBgSprite.getContentSize().height*5 ));
		this.hpBar = cc.ProgressTimer(cc.Sprite("#hp1.png"));
		this.hpBar.type = cc.ProgressTimer.TYPE_BAR;
		this.hpBar.setMidpoint(cc.p(0, 0.5));
		this.hpBar.barChangeRate = cc.p(1, 0);
		this.hpBar.setPercentage(this.hpPercentage);
		this.hpBar.setPosition(cc.p(this.hpBgSprite.getContentSize().width / 2, this.hpBgSprite.getContentSize().height / 3 * 2 ));
		this.hpBgSprite.addChild(this.hpBar);
		this.addChild(this.hpBgSprite);
	},
	//获取当前运动点
	getCurrPoint:function(){
	
		if (this.pointCounter < pointsVector.length ){ 
			this.currPoint =pointsVector[this.pointCounter];
			
		}
	},
	/***
	 * 下一个移动点
	 * _pointsVector 全局函数，在playLayer初始化完成
	 */
	getNextPoint:function(){
		this.pointCounter++;
		if (this.pointCounter < pointsVector.length ){ 
			this.nextPoint=pointsVector[this.pointCounter];
		} 
		else{
			this.pointCounter = pointsVector.length -1 ;
			this.nextPoint=null;
		} 

	},
	//改变自身方向
	changeDirection:function(){
		
	},
	//死亡爆炸效果，执行动画后删除
	enemyExpload:function(){
		//隐藏血条
		this.hpBgSprite.setVisible(false);
		this.stopAllActions();
		this.unscheduleUpdate();
		this.setAnchorPoint(0.5,0.25);
		var explode=this.createAnimation("explode3", 6, 0.1);
		var that=this;
		var removCall=function(){
			that.removeFromParent(true);
		}
		
		var action=cc.Sequence(explode,cc.CallFunc(removCall));
		
		this.runAction(action);
	}
});