
/***
 * 关卡选择界面
 */
var LevelLayer=cc.Layer.extend({
	pageNode		:null,//LevelLayer层中总共的子页数
	curPageNode		:null,//表示当前显示的第几个页节点
	WINDOW_WIDTH	:null, //固定宽
	WINDOW_HEIGHT	:null,	//固定高。
	ctor:function(){
		this._super();
		//初始化背景
		this.initBG();
		
		this.initLevelSelect();
	},
	//初始化背景
	initBG:function(){
		var sprite=new cc.Sprite(res.playbg);
		sprite.setPosition(cc.winSize.width/2,cc.winSize.height/2);
		this.addChild(sprite,-1);
	},
	
	//初始化关卡选择
	initLevelSelect:function(){
		this._root=ccs.uiReader.widgetFromJsonFile(res.leveView);
		this._root.x=cc.winSize.width/5;
		this._root.y=cc.winSize.height/6;
		this._root.setAnchorPoint(0,0);
		this.addChild(this._root);
		
		for(var i=1;i<20;i++){
			var checkbox=ccui.helper.seekWidgetByName(this._root, "CheckBox_"+i);
			cc.log(checkbox);
			if(checkbox){
				checkbox.addEventListener(this.selectedEvent,this);
			}
		}
		
	},
	selectedEvent:function(sender, type){
		switch (type) {
		case ccui.CheckBox.EVENT_SELECTED:
			cc.director.runScene(new PlayScene());
			break;
		case ccui.CheckBox.EVENT_UNSELECTED:
			cc.director.runScene(new PlayScene());
			break;
		default:
			break;
		}
	}
	
});