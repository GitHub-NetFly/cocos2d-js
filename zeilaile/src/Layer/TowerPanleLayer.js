
var tplThat;

/**
 * 塔类Layer
 * opts：相关参数
 */
var TowerPanleLayer=cc.Layer.extend({
	sprite1:null,
	sprite2:null,
	sprite3:null,
	pos:null,
	ctor:function(opts){
		this._super();
		if(!_.isEmpty(opts)){
			this.pos=opts.pos; //获取创建坐标
		}
		tplThat=this;
		// 分别表示箭塔、攻击塔、多方向攻击塔

		var sprite = cc.Sprite("#towerPos.png");
		sprite.setPosition(cc.p(0, 0));
		this.addChild(sprite);

		this.sprite1 = cc.Sprite.createWithSpriteFrameName("ArrowTower1.png");
		this.sprite1.setAnchorPoint( cc.p(0.5, 0));
		this.sprite1.setPosition(cc.p(-sprite.getContentSize().width, sprite.getContentSize().height/2));
		this.addChild(this.sprite1);

		this.sprite2 = cc.Sprite.createWithSpriteFrameName("AttackTower1.png");
		this.sprite2.setAnchorPoint(cc.p(0.5, 0));
		this.sprite2.setPosition(cc.p(0, sprite.getContentSize().height/2));
		this.addChild(this.sprite2);

		this.sprite3 = cc.Sprite.createWithSpriteFrameName("MultiDirTower1.png");
		this.sprite3.setAnchorPoint( cc.p(0.5, 0));
		this.sprite3.setPosition(cc.p(sprite.getContentSize().width, sprite.getContentSize().height/2));
		this.addChild(this.sprite3);


		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchEnded: this.onTouchEnded
		}, this.sprite1);


		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchEnded: this.onTouchEnded
		}, this.sprite2);



		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			onTouchEnded: this.onTouchEnded
		}, this.sprite3);

		return this;
	}
,//触摸事件
onTouchBegan:function(touch, event) {
	cc.log("-----------------------------");
	var target = event.getCurrentTarget();
	var locationInNode = target.convertTouchToNodeSpace(touch);
	// 3
	var size = target.getContentSize();
	var rect = cc.rect(0, 0, size.width, size.height);
	// 4
	if (cc.rectContainsPoint(rect, locationInNode))
	{
		target.setOpacity(180);
		return true;
	}
	return false;
},
onTouchEnded:function(touch, event) {
	cc.log("-----------------------------end");
	var target = event.getCurrentTarget();
	var pos = touch.getLocation();
	// 5
	var tower;//塔
	var noMoneyTips;
	
	//创建不同类型的炮塔
	if (target == tplThat.sprite1)
	{	
		//弓箭塔
		chooseTowerType = TowerType.ARROW_TOWER;
		if( money >= 200 ){

			var arrowTower= new ArrowTower();
			tower=arrowTower;
			money -= 200;
		}else{
			noMoneyTips = true;
		}
	}
	else if(target == tplThat.sprite2)
	{
		chooseTowerType =  TowerType.ATTACK_TOWER;
		if( money >= 150 ){
			var attackTower= new AttackTower({scope:390,lethality:1,rate:2,speed:0.5});

			tower=attackTower;

			money -= 150;
			tplThat.pos.y=tplThat.pos.y+15;
		}else{
			noMoneyTips = true;
		}

	}
	else if(target == tplThat.sprite3)
	{	
		//多向攻击塔
		chooseTowerType =  TowerType.MULTIDIR_TOWER;
		//判断金额
		if( money >= 500 ){
			var multiDirTower= new MultiDirTower();
			tower=multiDirTower;
			money -= 500;
		}else{
			noMoneyTips = true;
		}

	}
	else{
		chooseTowerType =  TowerType.ANOTHER;
	}

	if(chooseTowerType == TowerType.ANOTHER){
		cc.log("未点击");
		return;
	}

	if(tower){
		createTowerMap.put(tplThat.pos.x+","+tplThat.pos.y, tower);
		tower.setPosition(tplThat.pos);//创建塔完成,设置塔的坐标位置

		//移除创建塔界面
		if(that.chooseTowerpanel){
			that.removeChild(that.chooseTowerpanel);
			that.chooseTowerpanel=null;//重新创建塔界面
		}

	}

	if(noMoneyTips){
		cc.audioEngine.playEffect("res/height_864/sound/tip.wav");
		var tips = cc.Sprite("#nomoney_mark.png");
		tips.setPosition(tplThat.pos);
		that.addChild(tips);
		//tips.runAction(cc.Sequence(cc.DelayTime(0.5),cc.CallFunc(cc.Sprite.removeFromParent, tips)));
		//3秒后移除
		that.scheduleOnce(function(){
			that.removeChild(tips);
		},3);

		//移除创建塔界面
		if(that.chooseTowerpanel){
			that.removeChild(that.chooseTowerpanel);
			that.chooseTowerpanel=null;//重新创建塔界面
		}
	}

}

});