
var GroupEnemy=cc.Sprite.extend({
	enemyAttribute:null,
	ctor:function(opts,_node){
		this._super();
		this.enemyAttribute=[];
		_.extend(this.enemyAttribute,opts);  //初始化时候初始化怪物属性信息
		
		var sj=	LGRandom(0,3);
		var thief=new Thief(this.enemyAttribute[sj],_node);
		enemyVector[enemyVector.length]=thief;
		thief=null;

		groupCounter++;
		
	}
});

/*

var GroupEnemy=function(opts){

	*//***
	 * 参数type1Total，type2Total，type3Total分别代表了小偷，土匪，海盗三种敌人的数目，type1Hp，type2Hp，type3Hp代表了它们的生命值，
	 * 而enemyTotal则表示总敌人的总个数，isFinishedAddGroup用于判断该波敌人是否全部都添加到了场景
	 *//*
	this.enemyAttribute=[];
	_.extend(this.enemyAttribute,opts);  //初始化时候初始化怪物属性信息

	this.initGroupEnemy=function(){
		
		
		var sj=	LGRandom(0,3);
		var thief=new Thief(this.enemyAttribute[sj]);
		enemyVector[enemyVector.length]=thief;
		thief=null;
		
		groupCounter++;

		return this;

	}

}*/