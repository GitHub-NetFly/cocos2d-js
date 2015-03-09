/***
 * 弓箭箭塔
 */

var ArrowTower=TowerBase.extend({
	scope:90, //攻击范围
	rate:2,  ////旋转角度
	lethality:2, //杀伤力
	speed:0.5, //移动速度
	ctor:function(opts){
		this._super("#baseplate.png");
		_.extend(this,opts); //extend opts内容
		that.addChild(this,-1);
		//设置ID查找值
		this.attr({guid:uuid(16)}); //设置ID查找值
		
		towerMap.put(this,this);
	
		var rotateArrow =new  cc.Sprite("#arrow.png");
		rotateArrow.setPosition(this.getContentSize().width/2, this.getContentSize().height /2 );
		this.addChild(rotateArrow);
		this.rotateArrow=rotateArrow;
		
		
		this.schedule(this.rotateAndShoot,this.speed);
		
	},
	/***旋转弓箭，等待射击*/
	rotateAndShoot:function(dt){
		
		var arrowTower;
		//通过循环Map获取到当前的this,because通过node创建的定时器获取到的的this是node本身，
		if(towerMap.size()>0){
			for(var b in towerMap.values()){
				var ms=towerMap.values()[b];
				if(ms.guid==this.guid){
					arrowTower=towerMap.keys()[b];
					continue;
				}
			}
		}
		else return;
		
		//判断距离
		arrowTower.checkNearestEnemy();
		var nearestEnemy=arrowTower.nearestEnemy
		if(nearestEnemy!=null){
			//箭塔
			var tower=arrowTower;
			//弓箭
			
			var moveDuration=arrowTower.rate;
			
			
			var rotateArrow=arrowTower.rotateArrow;
			//计算两个position距离
			//var rotateVector=cc.pSub(nearestEnemy.getPosition(),tower.getPosition()); 
			//向量与X轴之间的弧度数
			var rotateRadians=cc.pAngle(nearestEnemy.getPosition(),tower.getPosition());
			//弧度到角度
			var rotateDegrees=cc.radiansToDegrees(-1*rotateRadians); 
			
			//speed表示炮塔旋转的速度，0.5 / M_PI其实就是 1 / 2PI，它表示1秒钟旋转1个圆。
			var speed =0.5/180;//旋转时间
			
			//rotateDuration表示旋转特定的角度需要的时间，计算它用弧度乘以速度。
			var rotateDuration=Math.abs(rotateRadians*speed);
			
			rotateArrow.runAction(cc.Sequence(cc.rotateTo(rotateDuration,rotateDegrees),
					cc.CallFunc(arrowTower.shoot, arrowTower)));
		}
	}
	,
	//射击
	shoot:function(){
		cc.log(this.nearestEnemy);
			if(this.nearestEnemy!=null ){
				var currBullet = this.ArrowTowerBullet();
				var towerModel=this;
				bulletVector.push(currBullet);

				var moveDuration=towerModel.rate;
				var shootVector=cc.pSub(towerModel.nearestEnemy.getPosition(),towerModel.getPosition());
				//cc.log("shootVector"+shootVector.x+":"+shootVector.y);
				shootVector=cc.pNormalize(shootVector);
				//cc.log("shootVector"+shootVector.x+":"+shootVector.y);
				var normalizedShootVector=cc.pNeg(shootVector);
				//cc.log("normalizedShootVector"+normalizedShootVector.x+":"+normalizedShootVector.y);


				var farthestDistance=cc.director.getWinSize().width;

				var overshotVector=cc.pMult(normalizedShootVector,farthestDistance);
				//cc.log("overshotVector"+overshotVector.x+":"+overshotVector.y);

				//子弹移动到的坐标()
				var offscreenPoint=cc.pSub(currBullet.getPosition(),overshotVector);
				//cc.log("offscreenPoint"+offscreenPoint.x+":"+offscreenPoint.y);



				//移除子弹，释放内存
				var removeBullet=function(){
					for(var i=0;i<bulletVector.length;i++){
						var bullet = bulletVector[i];

						if(bullet.guid==currBullet.guid){
							bullet.removeFromParent();
							bulletVector.remove(i);
						}

					}

				};
				//paly sound
				cc.audioEngine.playEffect("res/height_864/sound/shoot.wav");
				currBullet.runAction(cc.Sequence(cc.MoveTo(moveDuration, offscreenPoint),
						cc.CallFunc(removeBullet)));

			}
			
	},
	//创建子弹
	ArrowTowerBullet:function(){
		var bullet=cc.Sprite("#arrowBullet.png");
		bullet.setPosition(this.rotateArrow.getPosition());
		bullet.setRotation(this.rotateArrow.getRotation());
		this.addChild(bullet);
		return bullet;
	}
	
});
/*
var ArrowTower=function(opts){
	_.extend(this,new TowerBase(that));
	this.scope=90; //攻击范围
	this.rate=2; //旋转角度
	this.lethality=1;
	//this.pos=opts.pos;
	this.init=function(){
		var baseplate = cc.Sprite.createWithSpriteFrameName("baseplate.png");
		//baseplate.setPosition(this.pos);
		that.addChild(baseplate,-1);

		var rotateArrow = cc.Sprite.createWithSpriteFrameName("arrow.png");
		rotateArrow.setPosition(baseplate.getContentSize().width/2, baseplate.getContentSize().height /2  );
		baseplate.addChild(rotateArrow);
		
		return baseplate;  //返回塔的精灵，由父节点控制
	}
	
	//this.ArrowTower=baseplate; //初始化塔的位置
	
	*//***旋转弓箭，等待射击*//*
	this.rotateAndShoot=function(dt){
		
		this.checkNearestEnemy();
		
		if(this.nearestEnemy!=null){ //通过原型设计方式，获取Base类里的函数nearestEnemy
			var rotateVector=cc.pSub(this.nearestEnemy.getPosition(),baseplate.getPosition()); //计算两个position距离
			//cc.log(rotateVector.x+":"+rotateVector.y);
			var rotateRadians=cc.pAngleSigned(this.nearestEnemy.getPosition(),baseplate.getPosition()); //向量与X轴之间的弧度数
			cc.log(rotateRadians);
			var rotateDegrees=cc.radiansToDegrees(rotateRadians); //弧度到角度
			
			var speed = 1;//旋转时间
			var rotateDuration=(rotateRadians*speed);
			
			rotateArrow.runAction(cc.Sequence(cc.RotateTo(rotateDuration, rotateDegrees),cc.CallFunc(this.shoot, this)));
		}else{
			cc.log("not rotate");
		}
		
		
	};
	*//***生成子弹*//*
	this.ArrowTowerBullet=function(){
		var bullet=cc.Sprite.createWithSpriteFrameName("arrowBullet.png");
		bullet.setPosition(rotateArrow.getPosition());
		bullet.setRotation(rotateArrow.getRotation());
		return bullet;
	};
	*//***射击*//*
	this.shoot=function(){
		var instance=new GameManager();
		this.bulletVector=instance.bulletVector;
		if(this.nearestEnemy!=null ){
			var currBullet = this.ArrowTowerBullet();
			instance.bulletVector.push(currBullet);
			var moveDuration=this.rate;
			var shootVector=cc.pSub(this.nearestEnemy.getPosition(),baseplate.getPosition());
			var normalizedShootVector=cc.pNormalize(shootVector);
			var  offscreenPoint;//设置moveTo的坐标
			currBullet.runAction(cc.Sequence(cc.MoveTo(moveDuration, offscreenPoint),
					cc.CallFunc(this.removeBullet, this)));
			currBullet = null;
			
		}
	};
	this.removeBullet=function(){
		cc.log("removeBulllet");
		var instance = new GameManager;

		var  bulletVector = instance.bulletVector;
		
	};
	//this.rotateAndShoot();
	
	//this.init();
}*/