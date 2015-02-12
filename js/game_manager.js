/*
	-- game_manager.js --
	Copyright K.MORI
	Ver 1.01
*/


//定数 -- HTML id,class属性値 --
var yiNameAreaIdName = "yi-name";
var yiTimerAreaIdName = "yi-current-time";
var yiTotalClickAreaIdName = "yi-total-click";
var yiCurrentClickCellAreaIdName = "yi-current-click-cell";
var yiNextClickCellAreaIdName = "yi-next-click-cell";
var gridCelTagClassName = "grid-cell";
var gridNumTagClassName = "g-number-text";
var gridNumTagIdCap = "grid-cell-id-";

//定数 -- 盤面配列 --
var gridCellInfoNameId = "id";
var gridCellInfoNameNum = "num";
var gridCellInfoNameState = "state";
var gridCellInfoStateNormal = "g-state-normal";  //HTML,CSSのclass属性値にも使用しているので注意
var gridCellInfoStateMyClick = "g-state-myclick";//HTML,CSSのclass属性値にも使用しているので注意
var gridCellInfoStateClicked = "g-state-clicked";//HTML,CSSのclass属性値にも使用しているので注意

//グローバル変数
var gridCellList = new Array();

//ユーザーデータクラス(コンストラクタ)
var myUserData = new UserData();
function UserData(){
	this.id = "1";
	this.name = "user_name";
    this.currentClickNum = 0; //ゲーム開始時は'0'
	this.nextClickNum = 1; //次にクリックする数字
	this.totalClickCell = 0;//クリック成功数

	//次にクリックする数字の更新関数
	this.updateNextCell = function(){
		this.currentClickNum = this.nextClickNum;
		this.totalClickCell++;
		this.nextClickNum++;
		if(8 < this.nextClickNum){
			this.nextClickNum = 1;
		}
		return;
	};
}

//タイマー設定
var countTimer;
var currentTime = 0;
var currentDisplayTime = 0;
function displayCurrentTime(){
	currentTime += 0.1;
	currentDisplayTime = currentTime.toFixed(1);
	$("#" + yiTimerAreaIdName).html(currentDisplayTime);
	$("#" + yiTotalClickAreaIdName).html(myUserData.totalClickCell);
	$("#" + yiCurrentClickCellAreaIdName).html(myUserData.currentClickNum);
	$("#" + yiNextClickCellAreaIdName).html(myUserData.nextClickNum);
}



/*
	-------------------
	-- Program Start --
	-------------------
*/

//読み込み時実行イベント
$(function(){
	createNewGrid();
	//セル押下イベント登録
	$("." + gridCelTagClassName).click(function(){
	  clickCellEvent($(this).children().attr("id"));
	});
	//タイマー開始
	countTimer = setInterval(displayCurrentTime, 100);
	//ユーザーデータ表示
	$("#" + yiNameAreaIdName).html(myUserData.name);
});

//新しい盤面作成関数
var createNewGrid = function(){
	var gridList = $("." + gridCelTagClassName);
	var elmHtml = "";
	gridCellList = new Array();
	var gridCellInfo = new Array();
	//1～8の数値をランダムにシャッフルする処理
	var gridCellNumArray = createNewBoardArray();
	//64個の要素に繰り返し処理
	$.each($("." + gridCelTagClassName), function(i, elm) {
		//対象のセル情報作成
		gridCellInfo = new Array();
		gridCellInfo[gridCellInfoNameId] = i;
		gridCellInfo[gridCellInfoNameNum] = gridCellNumArray[i];
		gridCellInfo[gridCellInfoNameState] = gridCellInfoStateNormal;
		//セル情報を盤面配列に格納
		gridCellList.push(gridCellInfo);
		//HTML作成/描画
		elmHtml = "<div id=\"" + gridNumTagIdCap + i + "\" class=\"" + 
					gridNumTagClassName + "\">" + 
					gridCellList[i][gridCellInfoNameNum] + "</div>";
	    $(elm).html(elmHtml);
		$(elm).addClass(gridCellList[i][gridCellInfoNameState]);
	});
	return;
};

//64個のセルに対応する数列作成関数
var createNewBoardArray = function(){
	var gridCellNumArray = new Array();
	for(var i = 0; i < 64; i++){
		gridCellNumArray.push((i % 8) + 1);
	}
	gridCellNumArray.sort(function() {
	    return Math.random() - Math.random();
	});
	return gridCellNumArray;
};

//セル押下時実行関数
var clickCellEvent = function(gridCellId){
	gridCellId = gridCellId.replace(gridNumTagIdCap, "");
	//セルクリック成功時(未クリックセルで次に押すべきセルの場合)
	if(gridCellInfoStateNormal == gridCellList[gridCellId][gridCellInfoNameState]
		&& myUserData.nextClickNum == gridCellList[gridCellId][gridCellInfoNameNum]){
		//情報/描画内容を更新
		gridCellList[gridCellId][gridCellInfoNameState] = gridCellInfoStateMyClick;
		myUserData.updateNextCell();
		$.each($("." + gridCelTagClassName), function(i, elm) {
			if(i == gridCellId){
				$(elm).removeClass(gridCellInfoStateNormal);
				$(elm).addClass(gridCellList[i][gridCellInfoNameState]);
			}
		});
	}
	//ゲーム終了していれば
	if(checkGameFinished()){
		clearInterval(countTimer);
		alert("Finished!  Time:" + currentDisplayTime);
	}
	return;
};

//ゲーム終了チェック関数
//終了していればtrueを、していなければfalseを返す
var checkGameFinished = function(){
	var boolFinished = true;
	$.each($("." + gridCelTagClassName), function(i, elm) {
		if($(elm).hasClass(gridCellInfoStateNormal)){
			boolFinished = false;
			return false;
		}
	});
	if(boolFinished){
		return true;
	}
	return false;
};

//乱数作成関数
//min = 最小数, max = 最大数
var getRandNum = function(min, max){
	var randNum = Math.floor(Math.random() * max);
	return randNum + min;
};

/*
	-------------------
	--  Program End  --
	-------------------
*/




