var PlayScene=cc.Scene.extend({
	onEnter:function(){
		this._super();
		var playLayer=new PlayLayer();
		this.addChild(playLayer);
	}
})