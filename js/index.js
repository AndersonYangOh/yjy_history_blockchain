/*
	区块链大事记系统主要操作
*/

//合约
var historyContract;

$(function() {
	if (false) {//typeof web3 !== 'undefined'
		web3 = new Web3(web3.currentProvider);
	} else {
		// set the provider you want from Web3.providers
		web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
	}
	web3.eth.defaultAccount = '0x7340864EB4b93F756F5BED0741fdA30Cf4287bc8';//web3.eth.accounts.wallet[0];
	console.log(web3.eth.defaultAccount);
	
	//合约接口
	var abi = [{"constant": true,"inputs": [],"name": "creator","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "month","type": "bytes3"}],"name": "retriveByMonth","outputs": [{"components": [{"name": "day","type": "bytes4"},{"name": "title","type": "string"},{"name": "writer","type": "string"},{"name": "content","type": "string"}],"name": "hisEntries","type": "tuple[]"},{"name": "length","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "year","type": "bytes2"}],"name": "retriveByYear","outputs": [{"components": [{"name": "day","type": "bytes4"},{"name": "title","type": "string"},{"name": "writer","type": "string"},{"name": "content","type": "string"}],"name": "hisEntries","type": "tuple[]"},{"name": "length","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "day","type": "bytes4"},{"name": "time","type": "bytes2"},{"name": "title","type": "string"},{"name": "writer","type": "string"},{"name": "content","type": "string"}],"name": "record","outputs": [{"name": "success","type": "bool"}],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "retriveAll","outputs": [{"components": [{"name": "day","type": "bytes4"},{"name": "title","type": "string"},{"name": "writer","type": "string"},{"name": "content","type": "string"}],"name": "hisEntries","type": "tuple[]"},{"name": "length","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "totalHisCount","outputs": [{"name": "count","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "day","type": "bytes4"}],"name": "retriveByDay","outputs": [{"components": [{"name": "day","type": "bytes4"},{"name": "title","type": "string"},{"name": "writer","type": "string"},{"name": "content","type": "string"}],"name": "hisEntries","type": "tuple[]"},{"name": "length","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"inputs": [],"payable": false,"stateMutability": "nonpayable","type": "constructor"}];
	historyContract = new web3.eth.Contract(abi, '0xD1E47d57f5B0900d43aaB834bAC2387073f35890', {
		from: web3.eth.defaultAccount, // default from address
		gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
	});
	//console.log(historyContract);
	var ret = historyContract.methods.retriveAll().call(function(error, result) {
			if(!error)
				{
					var hisEntries = result[0];
					var hisCount = result[1];
					for (i=0; i< hisEntries.length; i++) {
						//console.log(hisEntries[i].title);
						addTip(hisEntries[i].title, hisEntries[i].content, hisEntries[i].day, hisEntries[i].writer);
					}
					//console.log(hisCount);
				}
			else
				console.error(error);
		}
	);
	
	$("#addTime").click(function() {
		//获取当前时间
		var date = new Date();
		var myDate = date.toLocaleDateString();
		var hours = date.getHours();
		var minute = date.getMinutes()
		var submitTime = myDate + ' ' + hours + ':' + minute;
		var mon = $("#mon").val(submitTime);
	})
	$(".sure").click(function() {
		//获取输入框内容
		var title = $("#title").val();  
		var content = $("#content").val();
		var time = $("#mon").val();
		var note = $("#note").val();
		//判断输入框内容是否为空
		if(title == '') {
			alert("请输入事件名称");
			return false;
		} else if(content == '') {
			alert("请输入描述内容");
			return false;
		} else if(note == '') {
			alert("请填写记录人");
			return false;
		}
		
		var date = writeChain(title, content, time, note);
		var hexStrDate = ('0x'+dec2hex(date[0],2)+dec2hex(date[1],2)+dec2hex(date[2],2)+dec2hex(date[3],2));
		console.log(hexStrDate);
		addTip(title, content, hexStrDate, note);
	})
})


/**
	向大事记中追加内容
*/
function addTip(title, content, time, note) {
		//内容追加至页面
		console.log(time);
		var hyear = parseInt(time.substr(2,2),16);
		var lyear = parseInt(time.substr(4,2),16);
		var month = parseInt(time.substr(6,2),16);
		var day = parseInt(time.substr(8,2),16);
		var strDate = hyear + ((lyear<9)?'0':'') + lyear + '年' + month + '月' + day + '日';
		var str = "";
		str = '<div class="box">' +
			'<div class="box-left">' +
			'<h4>' + title + '</h4>' +
			'<p>' + content + '</p>' +
			'</div>' +
			'<div class="box-right">' +
			'<h4>' + strDate + '</h4>' +
			'<h4>' + '记录人：' + note + '</h4>' +
			'</div>' +
			'</div>'
		//$(".main").append(str);
		$(".main").prepend(str);
}

/**
	写链的底层方法
*/
function writeChain(title, content, time, note) {
	//console.log(time);
	var splitDate = time.split(' ')[0].split('/');
	var date = new Array(4);
	date[0] = parseInt(splitDate[0].substr(0,2),10);
	date[1] = parseInt(splitDate[0].substr(2,2),10);
	date[2] = parseInt(splitDate[1],10);
	date[3] = parseInt(splitDate[2],10);
	console.log(date);
	historyContract.methods.record(date, [0,0], title, note, content).send({gas:3000000, from: web3.eth.defaultAccount}, function(error, result) {
		if(!error)
			{
				console.log(result);
			}
		else
			console.error(error);
	});
	return date;
}

/**
	进制转换方法
*/
function dec2hex (dec, len) {
	var hex = "";
	while( dec ) {
		var last = dec & 15;
		hex = String.fromCharCode(((last>9)?55:48)+last) + hex;
		dec >>= 4;
	}
	if(len) {
		while(hex.length < len) hex = '0' + hex;
	}
	return hex;
}
