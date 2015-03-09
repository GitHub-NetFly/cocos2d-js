var g_groundHeight = 57;
var g_runnerStartX = 80;
var offY; //偏差值Y
var pointsVector=[]; //保存从地图中获取的路径点
if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.background = 0;
    TagOfLayer.Animation = 1;
    TagOfLayer.GameLayer = 2;
    TagOfLayer.Status = 3;
};
var winSize;//窗口大小
// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.runner = 0;
    SpriteTag.coin = 1;
    SpriteTag.rock = 2;
};
/***塔的类型
 * ARROW_TOWER
 * 
 **/
var TowerType = {
		ARROW_TOWER:0,ATTACK_TOWER:1 ,MULTIDIR_TOWER:2 ,ANOTHER:3
}; 

/***当前选中的塔类*/
var chooseTowerType;

var createTowerMap;  //创建的塔的集合

var towerMap;  //创建的塔的集合

var money; //初始化金币

var enemyVector;//敌人的集合

var groupCounter; //敌人当前波数
var maxGroup; //最大波数
var groupVector;//敌人波数集合

var isSuccessful; //是否成功过关
var GroupToTal; //波数

var waitTime; //波之间等待时间

var bulletVector;//子弹集合

var isStart; //是否开始标志

var enemyNeedToDelete; //需要删除的enemy
var bulletNeedToDelete; //需要删除的bullet
var jianshedistance=50; //溅射伤害距离

var jiansheVector; //溅射伤害的怪物
var initEnemy=function(){
	GroupToTal=10;
	groupCounter=0;
	enemyVector=new Array();
	isSuccessful=false;
	waitTime=3;
	isStart=false;
	maxGroup=10;
	enemyNeedToDelete=new Array();
	bulletNeedToDelete=[];
	jiansheVector=[];
}
var initFun=function(){
	cc.log("initfun start");
	createTowerMap=new Map();
	towerMap=new Map();
	money=500;
	cc.log("initfun enemy");
	initEnemy();
	bulletVector=new Array();

	cc.log("initfun ok");
}

