/***
 * 游戏主场景
 */


var that;
var MAP_WIDTH=16;
var MAP_HEIGHT=9;
//创建Layer
var PlayLayer=cc.Layer.extend({
	_spriteSheet:null,
	_map:null,
	_objects:null,
	_winSize:null, //窗口大小
	_offX:null, //X轴的偏差值
	towerMatrix:null,
	countdown:null,
	toolLayer:null,//tool
	ctor:function(){
		this._super();
		that=this;
		//进行数据初始化
		initFun();
		cc.spriteFrameCache.addSpriteFrames(res.playPlist);
		winSize=cc.director.getWinSize();
		this._winSize=winSize;
		var failedBg=cc.Sprite(res.playbg);//加载背景
		failedBg.setPosition(this._winSize.width/2, this._winSize.height/2);
		this.addChild(failedBg,-1);
		map=cc.TMXTiledMap(res.map); //加载map
		//map.scale = 0.9;
		this._map=map;
		this.bgLayer=map.getLayer("bg"); //背景layer
		this._offX=(map.getContentSize().width - winSize.width)/ 2;
		offY=(map.getContentSize().height - winSize.height)/ 2;
		var s = this.bgLayer.getLayerSize();

		var anchP=cc.p(0.5, 0.5); //设置围绕旋转坐标
		this.bgLayer.setAnchorPoint(anchP);
		this.bgLayer.setPosition(cc.p(winSize.width / 2 ,winSize.height / 2));  

		this._objects=map.getObjectGroup("obj");
		this.addChild(map, -1); //添加地图

		//计算X轴的偏差值

		this.initPointsVector(this._offX);
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan
		}, this);
		//加载tool
		this.initToolLayer();
		
		this.scheduleUpdate();
		this.schedule(this.logic,1);
	},
	//定时器执行函数
	update:function(dt){
		//----start6----update
		//碰撞检测
		this.collisionDetection();
		//this.addTower();
		//----end6----
	},
	logic:function(dt){

		if(waitTime<6&&waitTime>=0){ //开始倒计时
			waitTime++;
			if(this.countdown){
				this.removeChild(this.countdown);
				this.countdown=null;
			}

			this.countdown = cc.LabelTTF(6-waitTime+"秒后开始", "Verdana", 32, cc.size(winSize.width, 50), cc.TEXT_ALIGNMENT_CENTER);
			this.countdown.x = this._winSize.width / 2;
			this.countdown.y = this._winSize.height * 3 / 8;
			this.addChild(this.countdown);
		}else{
			if(this.countdown){
				this.removeChild(this.countdown);
				this.countdown=null;
				isStart=true;
			}
			//倒计时结束，开始敌人进攻
		}
		if(isStart){
			//cc.log("敌人开进攻");
			//判断是否可以创建敌人
			if(!isSuccessful){
				//创建敌人
				var groupEnemy=new GroupEnemy(enemyAttr,this);
			}
		}

		/*var groupEnemy=	this.currentGroup();
		if(groupEnemy == null){ return; }

		if(enemyVector.length==0&& groupCounter < getGroupNum())*/
	},

	//当前波数
	currentGroup:function(){
		var groupEnemy;
		if(enemyVector){
			groupEnemy=groupVector[groupCounter];
		}else{
			groupEnemy=null;
		}
		return groupEnemy;
	},
	//下一波数
	nextGroup:function(){
		if (groupCounter < GroupToTal - 1)
		{
			groupCounter++;
		}else
		{
			isSuccessful = true;
		}
		var groupEnemy=groupVector[groupCounter];

		return groupEnemy;
	},
	//初始化路径点信息
	initPointsVector:function(offX){
		var count=0;
		var point;
		var objs=this._objects.getObjects(); //获取所有对象的内容
		pointsVector=new Array();
		for(var i in objs){
			//runOfPoint.retain();//此处一定要设置内容保留，否则释放以后，坐标点不存在，动画再次调用出错
			pointsVector.push({x:objs[i].x-offX,y:objs[i].y});
		}
		cc.log(pointsVector);
	},
	//触摸事件
	onTouchBegan:function(touch, event) {
		var pos = touch.getLocation();
		that.checkAndAddTowerPanle(pos);
		return true;
	},
	//检测和创建炮塔选择界面
	checkAndAddTowerPanle:function(position){
		var towerCoord=that.convertTotileCoord(position);
		var matrixCoord=that.convertToMatrixCoord(position);
		//如果创建炮塔选择界面存在，则移除该界面
		if(this.chooseTowerpanel){
			this.removeChild(this.chooseTowerpanel);
		}

		var  gid = this.bgLayer.getTileGIDAt(towerCoord); //地图坐标gid
		var tileTemp =this._map.getPropertiesForGID(gid);
		var MatrixIndex = matrixCoord.y * MAP_WIDTH + matrixCoord.x;
		//	cc.log(tileTemp);
		var TouchVaule;
		if (tileTemp==null){ //假如不能触摸
			TouchVaule = 0;
		}else{
			TouchVaule = tileTemp.canTouch;
		}
		var tileWidth = this._map.getContentSize().width / this._map.getMapSize().width;
		var tileHeight = this._map.getContentSize().height / this._map.getMapSize().height;

		var towerPos = cc.p((towerCoord.x * tileWidth) + tileWidth/2-this._offX,this._map.getContentSize().height - (towerCoord.y * tileHeight) - tileHeight/2);

		if (1 == TouchVaule && !createTowerMap.get(towerPos.x+","+towerPos.y)){
			this.addTowerChoosePanel(towerPos);
		}else{
			var tips = cc.Sprite.createWithSpriteFrameName("no.png");
			tips.setPosition(towerPos);
			this.addChild(tips);
			this.scheduleOnce(function(){
				this.removeChild(tips);
			},3);
		}

	},
	/***创建一个炮塔选择界面*/
	addTowerChoosePanel:function(towerPos){
		//创建炮塔的相关参数
		var opts={pos:towerPos};
		that.chooseTowerpanel = new TowerPanleLayer(opts);
		that.chooseTowerpanel.setPosition(towerPos);
		that.addChild(that.chooseTowerpanel);
	},
	// 把本地坐标（OpenGL坐标）转换为地图坐标
	convertTotileCoord:function(position){
		var x=(position.x + that._offX)/ that._map.getContentSize().width * that._map.getMapSize().width;
		var y=that._map.getMapSize().height- position.y / that._map.getContentSize().height * map.getMapSize().height;
		return cc.p(parseInt(x),parseInt(y));
	},
	// 把本地坐标（OpenGL坐标）转换为数组坐标
	convertToMatrixCoord:function( position){
		var x = (position.x + that._offX)/ that._map.getContentSize().width * that._map.getMapSize().width;
		var  y = position.y / map.getContentSize().height * map.getMapSize().height;
		return cc.p(x,y);
	},
	/***添加炮塔*/
	addTower:function(){
		//cc.log(that.chooseTowerpanel);
		if(that.chooseTowerpanel){
			var type =chooseTowerType;
		}
	},
	/***碰撞检测*/
	collisionDetection:function(){

		if(bulletVector.length==0||enemyVector.length==0){
			return;
		}
//		cc.log("子弹----------------------数量"+bulletVector.length);
		for(var i=0;i<bulletVector.length;i++){
			var bullet = bulletVector[i];
			
			if(!bullet){ //如果父节点已经移除，则移除
				bulletVector.remove(i);
				return;
			}
			/*if(bullet.getPositionX()<0||bullet.getPositionY()<0){

				return;
			}*/
			//子弹范围
			var bulletRect=cc.rect(bullet.getPositionX() +bullet.getParent().getPositionX() - bullet.getContentSize().width / 2,
					bullet.getPositionY() +bullet.getParent().getPositionY() - bullet.getContentSize().height / 2,
					bullet.getContentSize().width,
					bullet.getContentSize().height );

			for (var j = 0; j < enemyVector.length; j++){
				var enemy = enemyVector[j];
				var enemyRect = cc.rect(enemy.getPositionX() - enemy.getContentSize().width / 4,
						enemy.getPositionY()  - enemy.getContentSize().height / 4,
						enemy.getContentSize().width / 2,
						enemy.getContentSize().height / 2 );
				//如果有碰撞
				if(cc.rectIntersectsRect(bulletRect,enemyRect)){
//					cc.log("碰撞ing"+JSON.stringify(enemy));
//					cc.log("碰撞后当前血量"+enemy.currHp);
					enemy.currHp-=50;
//					cc.log("碰撞后当前血量"+enemy.currHp);
					var currHp=enemy.currHp;
					var currHpPercentage=enemy.hpPercentage; //进度条
					var offHp = 100 / enemy.maxHp; //比例
					currHpPercentage -= offHp;
					if(currHpPercentage < 0){
						currHpPercentage = 0;
					}
					enemy.hpPercentage=currHpPercentage; //重设进度条
					enemy.hpBar.setPercentage(currHpPercentage);
					if(currHp <= 0)
					{
//						cc.log("添加到删除队列");
						enemyNeedToDelete[enemyNeedToDelete.length]=enemy;
						//auto valueMoney = enemy->getVaule();
						money += 10;
						//var moneyText = std::to_string(money);
						//moneyLabel->setString(moneyText);
						
					}else{
						//计算溅射伤害
						this.jianshe(enemy);
					}
					
					//bulletNeedToDelete 暂时不设置bullet销毁事件，等超过指定长度自动消除
					break;
				}
			}
			//this.removeChild(bullet);
			//bulletVector.remove(i);

		}
		//移除指定的怪物并从怪物数组中移除
		for (var i=0; i< enemyNeedToDelete.length;i++)
		{
					var delEnemy=enemyNeedToDelete[i];
			for(var b=0;b<enemyVector.length;b++){
				if(delEnemy.guid==enemyVector[b].guid){
					enemyNeedToDelete.remove(i);
					enemyVector.remove(b);
					//执行动画后删除，详见enemyExpload
					delEnemy.enemyExpload();
				}
			}
			
		}
	},
	//处理溅射伤害的怪物血量
	jianshe:function(enemy){
		var esprite=enemy;//受伤怪物

		for(var b=0;b<enemyVector.length;b++){
			var evSprite=enemyVector[b];//周围怪物
			//cc.pDistance 计算两点之间的距离，根据函数
			if(!esprite||!evSprite){
				return;
			}
			var distance=cc.pDistance(esprite.getPosition(),evSprite.getPosition());
			if(jianshedistance>distance){
				cc.log("******************************溅射伤害发生");
				enemyVector[b].currHp-=25;
				var currHp=enemyVector[b].currHp;
				var currHpPercentage=enemyVector[b].hpPercentage; //进度条
				var offHp = 100 / enemyVector[b].maxHp; //比例
				currHpPercentage -= offHp;
				if(currHpPercentage < 0){
					currHpPercentage = 0;
				}
				
				enemyVector[b].hpPercentage=currHpPercentage; //重设进度条
				enemyVector[b].hpBar.setPercentage(50);
				if(currHp <= 0)
				{
					cc.log("添加到删除队列");
					money += 10;
					enemyVector.remove(b);
					enemyNeedToDelete.push(evSprite);
				}

			}
		}
	},
	
	//创建Toobar
	initToolLayer:function(){
		// 工具栏背景图片
		var spritetool=new cc.Sprite("#toolbg.png");
		spritetool.setAnchorPoint(0.5,1);
		
		spritetool.setPosition(winSize.width/2, winSize.height);
		
		this.addChild(spritetool);
		
		// 金币数
		this.moneyLabel = new cc.LabelBMFont("00.0", "res/fonts/bitmapFontChinese.fnt");
		spritetool.addChild(this.moneyLabel);
		this.moneyLabel.setPosition(spritetool.getContentSize().width / 8, spritetool.getContentSize().height / 2);
		
		this.moneyLabel.setAnchorPoint(0, 0.5);
		
		this.moneyLabel.setString(money);
		
		//以下需进行完善
		// 玩家血量条
		// 玩家得分标尺 
		// 当前波数
		// 总波数
	}
	

});