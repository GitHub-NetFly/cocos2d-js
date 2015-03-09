/***
 * 菜单Layer
 */

var MenuLayer=cc.Layer.extend({
	starSprite:null,//星星
	startItem:null,//开始按钮
	ctor:function(){
		this._super();
		cc.spriteFrameCache.addSpriteFrames(res.playPlist);
		cc.log();
		var sprite=new cc.Sprite(res.playbg);
		sprite.setPosition(cc.winSize.width/2,cc.winSize.height/2);
		this.addChild(sprite,-1);
		
		var titleSprite=new cc.Sprite("#title.png");
		titleSprite.setPosition(cc.winSize.width/3,cc.winSize.height/3*2);
		this.addChild(titleSprite);
		
		/*
		var move=new cc.moveTo(1,cc.p(0,10));
		titleSprite.runAction(cc.repeatForever(cc.sequence(move,move.reverse())));*/
		
		//创建开始按钮
		
		var startItem = new cc.MenuItemImage(
				res.start1,
				res.start2,
				function () {
					//开始执行方法
					Audio.button();
					cc.director.runScene(new LevelScene());
				}, this);
		
		startItem.attr({
			x: (cc.winSize.width-startItem.getContentSize().width)/2,
			y: cc.winSize.height/6,
			anchorX: 0,
			anchorY: 0
		});
		
		this.startItem=startItem;
		
		var menu = new cc.Menu(startItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);
		//创建star
		var starSprite =new cc.Sprite("#star.png");
		starSprite.setScale(0.7);
		this.addChild(starSprite, 11);
		starSprite.attr({
			x:startItem.x,
			y:startItem.y
		})
		this.starSprite=starSprite;
		
		//创建一个沿按钮运动的效果
		var path=this.MyPathFun(1, startItem.getContentSize().height, startItem.getContentSize().width)
		
		starSprite.runAction(path);
		//创建按钮旋转的粒子效果
		this.createParticle(path);
	},
	//创建粒子
	createParticle:function(path){
		var _emitter = new cc.ParticleSystem(res.SpinningPeas);
		_emitter.x=this.startItem.x;
		_emitter.y=this.startItem.y;
		
		_emitter.retain();
		var batch=cc.ParticleBatchNode(_emitter.getTexture());
		batch.addChild(_emitter);
		
		_emitter.runAction(path.clone());
		this.addChild(batch, 10);
		
		_emitter.release();
		
	},
	MyPathFun:function(controlX, controlY, w){
		
		//第一个贝塞尔曲线路径
		var bezier1=[cc.p(-controlX,0),cc.p(-controlX, controlY),cc.p(0, controlY)];
		
		var bezierBy1=cc.BezierBy(0.6,bezier1);
		
		
		var move1=new cc.MoveBy(2,cc.p(w, 0));
		
		//第二个贝塞尔曲线路径
		var bezier2=[cc.p(controlX,0),cc.p(controlX, -controlY),cc.p(0, -controlY)];
		var bezierBy2=cc.BezierBy(0.6,bezier2);
		
		var move2=new cc.MoveBy(2,cc.p(-w, 0));
		var path=cc.Sequence(bezierBy1,move1,bezierBy2,move2).repeatForever();
		return path;
		
	}
	
	
});