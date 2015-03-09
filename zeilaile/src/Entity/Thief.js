/***
 * 敌人子类－小偷
 * 由于EnemyBase类中已经给出了敌人的各种逻辑方法，所以在Thief中，我们只需要初始化变量，实现具体的方法，就可以实现一个很普通的敌人了。 
 *
 ** opt:拓展數組函數
 * 	ths:調用的this
 */

var Thief=EnemyBase.extend({
	ctor:function(opts,_node){
		this._super();
		this.init(opts,_node);
	}
})