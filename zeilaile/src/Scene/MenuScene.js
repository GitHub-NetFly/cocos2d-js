
//菜单场景
var MenuScene=cc.Scene.extend({
	
	onEnter:function(){
		this._super();
		var menuLayer=new MenuLayer();
		this.addChild(menuLayer);
	}
	
});