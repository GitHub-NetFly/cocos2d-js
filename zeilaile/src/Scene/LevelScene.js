var LevelScene=cc.Scene.extend({
	
	onEnter:function(){
		this._super();
		var levelLayer=new LevelLayer();
		this.addChild(levelLayer);
		
	}
});