function Map(){
	this.elements = new Array();

//	获取Map元素个数
	this.size = function() {
		return this.elements.length;
	},

//	判断Map是否为空
	this.isEmpty = function() {
		return (this.elements.length < 1);
	},

//	删除Map所有元素
	this.clear = function() {
		this.elements = new Array();
	},

//	向Map中增加元素（key, value) 
	this.put = function(_key, _value) {
		if (this.containsKey(_key) == true) {
			if(this.containsValue(_value)){
				if(this.remove(_key) == true){
					this.elements.push( {
						key : _key,
						value : _value
					});
				}
			}else{
				this.elements.push( {
					key : _key,
					value : _value
				});
			}
		} else {
			this.remove(_key);
			this.elements.push( {
				key : _key,
				value : _value
			});
		}
	},

//	删除指定key的元素，成功返回true，失败返回false
	this.remove = function(_key) {
		var bln = false;
		try {  
			for (i = 0; i < this.elements.length; i++) {  
				if (this.elements[i].key == _key){
					this.elements.splice(i, 1);
					return true;
				}
			}
		}catch(e){
			bln = false;  
		}
		return bln;
	},

//	获取指定key的元素值value，失败返回null
	this.get = function(_key) {
		try{  
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
		}catch(e) {
			return null;  
		}
	},

//	获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null
	this.element = function(_index) {
		if (_index < 0 || _index >= this.elements.length){
			return null;
		}
		return this.elements[_index];
	},

//	判断Map中是否含有指定key的元素
	this.containsKey = function(_key) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {  
				if (this.elements[i].key == _key){
					bln = true;
				}
			}
		}catch(e) {
			bln = false;  
		}
		return bln;
	},

//	判断Map中是否含有指定value的元素
	this.containsValue = function(_value) {
		var bln = false;
		try {
			for (i = 0; i < this.elements.length; i++) {  
				if (this.elements[i].value == _value){
					bln = true;
				}
			}
		}catch(e) {
			bln = false;  
		}
		return bln;
	},

//	获取Map中所有key的数组（array）
	this.keys = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {  
			arr.push(this.elements[i].key);
		}
		return arr;
	},

//	获取Map中所有value的数组（array）
	this.values = function() {
		var arr = new Array();
		for (i = 0; i < this.elements.length; i++) {  
			arr.push(this.elements[i].value);
		}
		return arr;
	};
};

/***
 * 随机函数
 * @param min
 * @param max
 * @returns
 */
function  LGRandom(min,max){

	return Math.floor(min+Math.random()*(max-min));

}


/**
 * obj 调用guideAnimation的对象
 * getGuideSpritsFuncName 得到需要闪烁的精灵的方法名字，调用后返回的数据格式为：[[true(是否点击过), 精灵1, 精灵2....], [false(是否点击过), 精灵1, 精灵2....]]
 * index 从第几个精灵开始闪烁引导
 * getStopGuideFlagFuncName  得到是否结束动画引导的标识的方法名字
 * */
function guideAnimation(obj, getGuideSpritsFuncName, index, getStopGuideFlagFuncName){

	var duration = 1;
	var blinks = 5;

	eval("var sprits = obj."+ getGuideSpritsFuncName +"()");
	eval("var stopGuide = obj."+ getStopGuideFlagFuncName +"()");
	if(sprits.length == 0 || stopGuide){
		return;
	}

	if(index > sprits.length){
		index = 0
	}

	var next = index + 1;
	if(next == sprits.length){
		next = 0;
	}

	var spritArr = sprits[index];
	if(spritArr){
		for(var j = 1; j < spritArr.length; j++){
			spritArr[j].runAction(cc.Blink.create(duration, blinks));
		}
	}
	
	obj.scheduleOnce(function(){
		guideAnimation(obj, getGuideSpritsFuncName, next, getStopGuideFlagFuncName);
	}, duration);
};

/**
 * obj 调用guideAnimation的对象
 * getGuideSpritsFuncName 得到需要闪烁的精灵的方法名字，调用后返回的数据格式为：[[true(是否点击过), 精灵1, 精灵2....], [false(是否点击过), 精灵1, 精灵2....]]
 * */
function stopClickedSpiritAction(obj, getGuideSpritsFuncName){
	eval("var sprits = obj."+ getGuideSpritsFuncName +"()");
	for(var i = 0; i < sprits.length; i++){
		//假如没有点击过，则不停止
		var spritArr = sprits[i];
		if(!spritArr[0]){
			continue;
		}

		for(var j = 1; j < spritArr.length; j++){
			spritArr[j].stopAllActions();
			spritArr[j].setVisible(true);
		}
	}
}


