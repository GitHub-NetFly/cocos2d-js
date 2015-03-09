/***
 *炮塔基类
 *ths:調用的this
*/

var TowerBase=cc.Sprite.extend({
	scope:0,   ////攻击范围
	rate:null,  ////旋转角度
	towerValue:0,
	lethality:0, //杀伤力
	nearestEnemy:null,
	tower:null,  //箭塔精灵
	speed:null,//箭塔攻击速度
	dirTotal:10,//攻击数量
	checkNearestEnemy:function(){

		/*var gameManager=new GameManager();
		this.enemyVector=gameManager.enemyVector;*/
		var currMinDistant=this.scope;
		var enemyTemp=null;
//		cc.log("敌人数量"+enemyVector.length);
		for(var i = 0; i < enemyVector.length; i++){
			var enemy=enemyVector[i];
			//cc.pDistance 计算两点之间的距离，根据函数
			var distance=cc.pDistance(this.getPosition(),enemy.getPosition());
//			cc.log("shoot距离"+currMinDistant);
			//this.ArrowTower.getPosition().getDistance(enemy.getPosition());
			if (distance < currMinDistant) {
				//currMinDistant = distance;
				enemyTemp = enemy;
				break;
			}
		}
		this.nearestEnemy = enemyTemp;
		
	}
	
});
