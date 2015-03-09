var attackTowerThat;


var AttackTower=TowerBase.extend({
	ctor:function(opts){
		this._super("#attackTower.png");
		//通过underscor的extend拓展传入参数
		_.extend(this,opts); //extend opts内容
		var guid=uuid(16);
		this.attr({guid:guid}); //设置ID查找值
		that.addChild(this,-1);
		towerMap.put(this,this);

		this.schedule(this.shoott,this.speed);
		cc.log("塔创建完成");
		
		return true;  //返回塔的精灵，由父节点控制
		//return this;
	},
	ArrowTowerBullet:function(){
		var bullet=cc.Sprite("#bullet1.png");
		bullet.setPosition(1,this.getContentSize().height-10);
		//bullet.release();
		var guid=uuid(16);
		bullet.attr({guid:"bullte"+guid}); //设置ID查找值
		this.addChild(bullet);
		return bullet;
	},
	shoott:function(dt){
		var towerModel;
		//通过循环Map获取到当前的this,because通过node创建的定时器获取到的的this是node本身，
		if(towerMap.size()>0){
			for(var b in towerMap.values()){
				var ms=towerMap.values()[b];
				if(ms.guid==this.guid){
					towerModel=towerMap.keys()[b];
					continue;
				}
			}
		}else return;
		
		//this=towerModel; //重新
//		cc.log("model"+towerModel.speed);
		
//		cc.log("赋值完成"+towerMap.size());
		towerModel.checkNearestEnemy();
		if(towerModel.nearestEnemy!=null){ 
			//towerModel.audioEngine.playEffect("res/height_864/sound/shoot.wav");
			var currBullet = towerModel.ArrowTowerBullet();
			bulletVector[bulletVector.length]=currBullet;
			
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
	//移除子弹
	removeBullet:function(pSender){
		
	}
	
	
});
/*var AttackTower=function(opts){
	_.extend(this,new TowerBase(that));
	this.scope=90; //攻击范围
	this.rate=2; //旋转角度
	this.lethality=1;
	//this.pos=opts.pos;
	this.attackTower;
	attackTowerThat=this;
	this.init=function(){
		this.attackTower = cc.Sprite.createWithSpriteFrameName("attackTower.png");
		that.addChild(this.attackTower,-1);
		cc.schedule(this.shoott,0.3);
		return this.attackTower;  //返回塔的精灵，由父节点控制
	}
	
	
	*//***射击*//*
	this.shoot=function(dt){
		cc.log(JSON.stringify(attackTowerThat.attackTower.getPosition()));
		//attackTowerThat.checkNearestEnemy();
		
		var towerBase=new TowerBase();
		towerBase.init({tower:attackTowerThat.attackTower,scope:390,lethality:1,rate:2});
		towerBase.checkNearestEnemy();
		if(towerBase.nearestEnemy!=null){ //通过原型设计方式，获取Base类里的函数nearestEnemy
			var rotateVector=cc.pSub(towerBase.nearestEnemy.getPosition(),attackTowerThat.attackTower.getPosition()); //计算两个position距离
			//cc.log(rotateVector.x+":"+rotateVector.y);
			var rotateRadians=cc.pAngleSigned(towerBase.nearestEnemy.getPosition(),attackTowerThat.attackTower.getPosition()); //向量与X轴之间的弧度数
			var rotateDegrees=cc.radiansToDegrees(rotateRadians); //弧度到角度
			
			var speed = 1;//旋转时间
			var rotateDuration=(rotateRadians*speed);
			cc.audioEngine.playEffect("res/height_864/sound/shoot.wav");
			attackTowerThat.attackTower.runAction(cc.Sequence(cc.RotateTo(rotateDuration, rotateDegrees),cc.CallFunc(attackTowerThat.shoott, attackTowerThat)));
		}else{
			
		}
		
		
	};
	*//***生成子弹*//*
	this.ArrowTowerBullet=function(){
		var bullet=cc.Sprite.createWithSpriteFrameName("bullet1.png");
		bullet.setPosition(1,this.attackTower.getContentSize().height-10);
		//bullet.setRotation(attackTowerThat.attackTower.getRotation());
		this.attackTower.addChild(bullet);
		return bullet;
	};
	*//***射击*//*
	this.shoott=function(dt){
		var instance=new GameManager();
		this.bulletVector=instance.bulletVector;
		var towerBase=new TowerBase();
		towerBase.init({tower:attackTowerThat.attackTower,scope:390,lethality:1,rate:2});
		towerBase.checkNearestEnemy();
		if(towerBase.nearestEnemy!=null){ 
			cc.log("shoott");
			var currBullet = attackTowerThat.ArrowTowerBullet();
			//instance.bulletVector.push(currBullet); 添加子弹到队列中
			var guid=uuid(16);
			currBullet.attr({guid:guid});
			bulletVector[bulletVector.length]=currBullet;
			
			var moveDuration=attackTowerThat.rate;
			var shootVector=cc.pSub(towerBase.nearestEnemy.getPosition(),attackTowerThat.attackTower.getPosition());
			//cc.log("shootVector"+shootVector.x+":"+shootVector.y);
			 	shootVector=cc.pNormalize(shootVector);
			 	//cc.log("shootVector"+shootVector.x+":"+shootVector.y);
			var normalizedShootVector=cc.pNeg(shootVector);
			//cc.log("normalizedShootVector"+normalizedShootVector.x+":"+normalizedShootVector.y);
			 	
			
			var farthestDistance=cc.director.getWinSize().width;
			
			var overshotVector=cc.pMult(normalizedShootVector,farthestDistance);
			//cc.log("overshotVector"+overshotVector.x+":"+overshotVector.y);
			
			
			var offscreenPoint=cc.pSub(currBullet.getPosition(),overshotVector);
			//cc.log("offscreenPoint"+offscreenPoint.x+":"+offscreenPoint.y);
			currBullet.runAction(cc.Sequence(cc.MoveTo(moveDuration, offscreenPoint),
					cc.CallFunc(attackTowerThat.removeBullet, attackTowerThat)));
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