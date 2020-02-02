const request = require('request');
const cheerio = require('cheerio');
var fs = require("fs");
const url = "https://en.wikipedia.org/wiki/2019%E2%80%9320_Wuhan_coronavirus_outbreak";
var infectInfo = {};
var deathInfo = {};
var infectedData;
var countInfo = 0;
var ctrsname = {'China': "중국", 'Japan': "일본", 'Thailand': "태국", 'Singapore': "싱가포르", 'Hong Kong': "홍콩", 'South Korea': "한국", 'Australia': "호주", 'Taiwan': "대만", 'Malaysia': "말레이시아", 'Macau': "마카오", 'France': "프랑스", 'United States': "미국", 'Germany': "독일", 'Vietnam': "베트남", 'United Arab Emirates': "아랍 에미리트", 'Canada': "캐나다", 'Italy': "이탈리아", 'Cambodia': "캄보디아", 'Finland': "핀란드", 'India': "인도", 'Nepal': "네팔", 'Philippines': "필리핀", 'Sri Lanka': "스리랑카", 'United Kingdom': "영국"};

getInfec();

function getInfec() {

request(url, (error, response, body) => {
  if (error) throw error;
  let $ = cheerio.load(body);
	var info = Array(50).fill(null).map(() => Array());
	
	//table의 모든 정보를 긁어온다
	try {
		var getTable = $('#mw-content-text > div > table > tbody > tr > td').text();
		getTable = replaceAll(getTable,"\n","|");
		var proc = getTable.trim().split("|");
		for (var i=0;i<proc.length-1;i++) {
			if (proc[i].indexOf("[")==0)
				if (i > -1) proc.splice(i, 1)
		}
		
		//긴급 시 임시 테이블 - 먹통일 때 주석 풀기
		// getEmergencyWorld(); return 0;
		
		
		
		//2020vte와 Suspected 사이에 있는것만 짜르기
		var cut1;
		for (var i=0;i<proc.length-1;i++) {
			if (proc[i].includes("vte"))
				cut1 = i;
		}
		var cut2;
		for (var i=0;i<proc.length-1;i++) {
			if(proc[i].includes("identified"))
				cut2 = i;
		}
		if (cut2 != undefined && cut1 != undefined)
			proc = proc.slice(cut2+1, cut1);
		else {
			console.log("[오류 발생] 테이블 양식이 변경되었습니다. EmergencyWorld로 크롤링을 진행합니다. 사이트에서는 예전의 수치가 표시될 것 입니다. 양식을 변경해주세요.");
			getEmergencyWorld(); return 0;
		}
		
		//첫번째 데이터 China(mainland) 가 예외라서 따로 처리
		var count = 0;
		for (var i=0;i<(proc.length-1)/3;i++) {
			for (var j=0;j<3;j++) {
				if (count==0) {
					info[0][0] = "China";
					j++;
				}
				info[i][j] = proc[count].trim();
				count++;
			}
		}
		while (true) {
			if (info[countInfo][0]!=undefined) {
				countInfo++;
			} else {
				console.log(countInfo);
				break;
			}
		}
		filter(info);
		
	} catch (error) {
		console.error(error);
	}
});
}

function filter (info) {
//codes, ctrs는 새 국가가 감염될때마다 추가해줘야 함.	
	var codes = ["CN", "TH", "HK", "TW", "JP", "MO", "MY", "SG", "AU", "US", "FR", "DE", "KR", "AE", "CA", "VN", "IT", "GB", "KH", "IN", "NP", "FI", "PH", "LK", "RU", "SE"];
var ctrs = ["China", "Thailand", "Hong Kong", "Taiwan", "Japan", "Macau", "Malaysia", "Singapore", "Australia", "United States", "France", "Germany", "South Korea", "United Arab Emirates", "Canada", "Vietnam", "Italy", "United Kingdom", "Cambodia", "India", "Nepal", "Finland", "Philippines", "Sri Lanka", "Russia", "Sweden"];
	//숫자에 반점 없애기
	for (var i=0;i<countInfo;i++) {
		if (info[i][1].includes(",")) {
			info[i][1] = replaceAll(info[i][1], ",", "");
		}
		if (info[i][2].includes(",")) {
			info[i][2] = replaceAll(info[i][1], ",", "");
		}
	}
	
	// [ ] 짜르기
	for (var i=0;i<countInfo;i++) {
		if (info[i][1].indexOf("[") != -1) {
			info[i][1] = info[i][1].substring(0, info[i][1].indexOf("["));
		}
		if (info[i][2].indexOf("[") != -1) {
			info[i][2] = info[i][2].substring(0, info[i][2].indexOf("["));
		}
	}
	
	
	//감염자
	for (var i=0;i<countInfo;i++) {
		for (var j=0;j<countInfo;j++) {
			if (info[i][0] == ctrs[j]) {
				infectInfo[codes[j]] = info[i][1];
			}
		}
	}
	//사망자
	for (var i=0;i<countInfo;i++) {
		for (var j=0;j<countInfo;j++) {
			if (info[i][0] == ctrs[j]) {
				deathInfo[codes[j]] = info[i][2];
			}
		}
	}
	
	
	var putterInfect = JSON.stringify(infectInfo);
	var putterDeath = JSON.stringify(deathInfo);
	
	infectedData = "{ \"infected\":"+putterInfect+",\"death\":"+putterDeath+"}";
	
	fs.readFile('index.txt', 'utf-8', function(err, data) {
    if (err) throw err;
 
    var newValue = data.replace(/email/gim, 'name');
 
    fs.writeFile('index.txt', newValue, 'utf-8', function(err, data) {
        if (err) throw err;
        console.log('Done!');
    })
})
	
// 	try {
// 	fs.unlink(__dirname + '/data/infectionData.json', function (err) { if (err) throw err; console.log('successfully deleted infectionData.json'); });
// 	} catch (e) {
// 		console.log("삭제 오류 발생");}
// 	try {
// 		fs.writeFile(__dirname + '/data/infectionData.json', infectedData, 'utf8', function(error){ console.log('write complete') });
// 	} catch (e) {
// 		console.log("쓰기 오류 발생");}
// }

function getEmergencyWorld() {
	const kourl = "https://docs.google.com/spreadsheets/d/1A8ehkMY4YvKmW3aeFNFY118i3J_lH3hjahNRGLbuYbw/htmlview?usp=sharing&sle=true";
	var info = Array(50).fill(null).map(() => Array());

	request(kourl, (error, response, body) => {
  		if (error) throw error;
  		let $ = cheerio.load(body);
		try {
			var emergencyTable = $('div > table > tbody > tr > td').text().split("|");
			
			//첫번째 데이터 China(mainland) 가 예외라서 따로 처리
			var count = 0;
			for (var i=0;i<(emergencyTable.length-1)/3;i++) {
				for (var j=0;j<3;j++) {
					if (count==0) {
						info[0][0] = "China";
						j++;
					}
				info[i][j] = emergencyTable[count].trim();
				count++;
			}
		}
			while (true) {
				if (info[countInfo][0]!=undefined) {
					countInfo++;
				} else {
					break;
				}
			}
		filter(info);
			
		} catch (error) {
		console.error(error);
	}
});
}


function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}
