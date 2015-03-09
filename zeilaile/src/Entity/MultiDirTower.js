
/***
 * 多向攻击箭塔
 * 其原理和箭塔类似，就不做赘述。不同的是该塔会同时朝六个方向发射子弹，
 * 其逻辑行为也只有2个阶段，
 * 第一阶段会创建子弹，朝六个方向射击，第二阶段就是销毁子弹。下面来看朝六个方向射击的方法。
 */

var MultiDirTower=TowerBase.extend({
	scope:360, //攻击范围
	rate:2, //旋转角度
	lethality:1,
	speed:1,
	
	ctor:function(opts){
		this._super("#multiDirTower.png");
		
		this.attr({guid:uuid(16)}); //设置ID查找值
		towerMap.put(this,this);
		
		that.addChild(this,-1);
		//通过this创建不出来scheule，原因未知
		this.schedule(this.shoott,this.speed);
		cc.log("塔创建完成");
		
		
	},
	//创建子弹
	ArrowTowerBullet:function(){
		var bullet=cc.Sprite("#bullet.png");
		bullet.setPosition(1,this.getContentSize().height-10);
		bullet.attr({guid:"bullte"+uuid(16)}); //设置ID查找值
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

		towerModel.checkNearestEnemy();
		if(towerModel.nearestEnemy!=null){ 
			//生成dirTotal个方向的子弹
			for(var i=0;i<this.dirTotal;i++){
				
				//创建子弹
				var currBullet = towerModel.ArrowTowerBullet();
				bulletVector.push(currBullet);
				
				var moveDuration=towerModel.rate;
				var shootVector=cc.p(1,Math.tan(( i * 2 * 180 / this.dirTotal )));
				
				var normalizedShootVector;
				
				if( i >= this.dirTotal / 2 )
				{
					normalizedShootVector =shootVector;
				}else{
					//cc.pNeg,转成负数
					normalizedShootVector =cc.pNeg(shootVector);
				}
				var farthestDistance=cc.director.getWinSize().width;
				
				cc.log(JSON.stringify(normalizedShootVector));
				
				var overshotVector=cc.pMult(normalizedShootVector,farthestDistance);
				
				var offscreenPoint=cc.pSub(currBullet.getPosition(),overshotVector);
				
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
				//cc.audioEngine.playEffect("res/height_864/sound/shoot.wav");
				currBullet.runAction(cc.Sequence(cc.MoveTo(moveDuration, offscreenPoint),
						cc.CallFunc(removeBullet)));
				
				
			}
			
			
			
			

		}
	}
});
