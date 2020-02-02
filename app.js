const request = require('request');
const cheerio = require('cheerio');
var express = require("express");
var fs = require("fs");
var url = require("url");

var app = express();

//크롤링
var infectInfo = {};
var deathInfo = {};
var ctrss = {};

var kotype = ["확진자", "의사환자", "조사대상유증상자", "격리해제", "검사중", "격리중교민", "격리해제교민"];
var koinfo = [[],[],[],[],[],[],[]];
var kojson = {};

var newsinfo = [[],[],[]];
var newsjsontitle = {};
var newsjsontsor = {};
var newsjsonurl = {};
var countInfo = 0;

var ctrsname = {'China': "중국", 'Japan': "일본", 'Thailand': "태국", 'Singapore': "싱가포르", 'Hong Kong': "홍콩", 'South Korea': "한국", 'Australia': "호주", 'Taiwan': "대만", 'Malaysia': "말레이시아", 'Macau': "마카오", 'France': "프랑스", 'United States': "미국", 'Germany': "독일", 'Vietnam': "베트남", 'United Arab Emirates': "아랍 에미리트", 'Canada': "캐나다", 'Italy': "이탈리아", 'Cambodia': "캄보디아", 'Finland': "핀란드", 'India': "인도", 'Nepal': "네팔", 'Philippines': "필리핀", 'Sri Lanka': "스리랑카"};

app.use('/static', express.static('static'));


app.get ("/", function(req, res) {
	res.end(fs.readFileSync(__dirname + '/static/index.html'));
});

app.get ("/world", function(req, res) {
	res.end(fs.readFileSync(__dirname + '/static/indexbk.html'));
});

app.get ("/mobile", function(req, res) {
  res.end(fs.readFileSync(__dirname + '/static/mobile.html'));
});

app.get ("/about", function(req, res) {
  res.end(fs.readFileSync(__dirname + '/static/about.html'));
});

app.listen(3000, function () {
  console.log("server start");
  getInfec();
});


var inter = setInterval(function(){getInfec();}, 30*1000);

function getInfec() {
	getWorld();
	getNews();
	getKorea();
}
 



/*크롤링*/
function getKorea() {
	const kourl = "https://docs.google.com/spreadsheets/d/1VsTh88cLo6PcjUs9xTvWi2b0D4okDfTDqwqdJQVrGe4/htmlview?usp=sharing&sle=true";
	
	request(kourl, (error, response, body) => {
  if (error) throw error;
  let $ = cheerio.load(body);
	try {
		var getTable = $('div > table > tbody > tr > td').text().split("|");file:///opt/Ramme/resources/app.asar/src/assets/icon.png
		var count = 0;
		for (var i=0;i<getTable.length;i++) {
			if (getTable[i].indexOf(kotype[i]) != -1) {
				koinfo[i][0] = kotype[i];
				koinfo[i][1] = getTable[i].replace(kotype[i], "");
				kojson[kotype[i]] = getTable[i].replace(kotype[i], "");
			}
		}
		
		var putterkoreainfo = JSON.stringify(kojson);
		infectedData = "{\"koreainfo\":"+putterkoreainfo+"}";
		try {
		fs.unlink(__dirname + '/static/data/koreainfo.json', function (err) { if (err) throw err; console.log('successfully deleted koreainfo.json'); });
		} catch (e) {
			console.log("삭제 오류 발생");}
			fs.writeFile(__dirname + '/static/data/koreainfo.json', infectedData, 'utf8', function(error){ console.log('write complete') });

	} catch (error) {
		console.error(error);
	}
});
}

function getNews() {
	const newsurl = "https://search.naver.com/search.naver?&where=news&query=%EC%9A%B0%ED%95%9C%ED%8F%90%EB%A0%B4";
	 request(newsurl, (error, response, body) => {
if (error) throw error;
let $ = cheerio.load(body);
try {
var count=0;
$('a._sp_each_title').each(function(post) {
newsinfo[0][count]=$(this).text();
//console.log($(this).text());
count=count+1;
});
count=0;
$('span._sp_each_source').each(function(post) {
//console.log($(this).text());
newsinfo[1][count]=$(this).text();
count=count+1;
});
count=0;
$('a._sp_each_title').each(function(post) {
newsinfo[2][count]=$(this).attr("href");
//console.log($(this).text());
count=count+1;
});
for (var i =0; i<count;i++) {
newsinfo[1][i]=newsinfo[1][i].replace(/선정/gi,"").replace(/언론사/gi,"").replace(/\s/g,'');
newsinfo[0][i]=newsinfo[0][i].replace(/\(종합\)/gi,"").replace(/\(공식\)/gi,"").replace(/\[단독\]/gi,"").replace(/\[전문\]/gi,"").replace(/^\s+|\s+$/g,'');
newsjsontitle[i]=newsinfo[0][i];
newsjsontsor[i]=newsinfo[1][i];
newsjsonurl[i]=newsinfo[2][i];
}
var putternewstitle = JSON.stringify(newsjsontitle);
var putternewssor = JSON.stringify(newsjsontsor);
var putternewsurl = JSON.stringify(newsjsonurl);
infectedData = "{\"title\":"+putternewstitle+",\"sor\":"+putternewssor+",\"url\":"+putternewsurl+"}";
try {
fs.unlink(__dirname + '/static/data/news.json', function (err) { if (err) throw err; console.log('successfully deleted news.json'); });
} catch (e) {
	console.log("삭제 오류 발생");}
try {
fs.writeFile(__dirname + '/static/data/news.json', infectedData, 'utf8', function(error){ console.log('write complete') });
} catch (e) {
	console.log("쓰기 오류 발생");}

} catch (error) {
console.error(error);
}
});
}

function getWorld() {
	const url = "https://en.wikipedia.org/wiki/2019%E2%80%9320_Wuhan_coronavirus_outbreak";
	var countInfo = 0;
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
	var codes = ["CN", "TH", "HK", "TW", "JP", "MO", "MY", "SG", "AU", "US", "FR", "DE", "KR", "AE", "CA", "VN", "IT", "GB", "KH", "IN", "NP", "FI", "PH", "LK", "RU", "SE", "ES"];
	var ctrs = ["China", "Thailand", "Hong Kong", "Taiwan", "Japan", "Macau", "Malaysia", "Singapore", "Australia", "United States", "France", "Germany", "South Korea", "United Arab Emirates", "Canada", "Vietnam", "Italy", "United Kingdom", "Cambodia", "India", "Nepal", "Finland", "Philippines", "Sri Lanka", "Russia", "Sweden", "Spain"];
	//숫자에 반점 없애기
	for (var i=0;i<ctrs.length;i++) {
		if (info[i][1].includes(",")) {
			info[i][1] = replaceAll(info[i][1], ",", "");
		}
		if (info[i][2].includes(",")) {
			info[i][2] = replaceAll(info[i][1], ",", "");
		}
	}
	
	//감염자
	for (var i=0;i<info.length;i++) {
		var err = 0;
		for (var j=0;j<info.length;j++) {
		if (info[i][0] == ctrs[j]) {
			infectInfo[codes[j]] = info[i][1];
			err = 1;
		}
	}
		if (err != 1)
			console.log("[오류 발생] 새 국가가 감염되었습니다. 국가를 추가해야합니다.")
	}
	//사망자
	for (var i=0;i<info.length;i++) {
		var err = 0;
		for (var j=0;j<info.length;j++) {
			if (info[i][0] == ctrs[j]) {
				deathInfo[codes[j]] = info[i][2];
				err = 1;
			}
		}
		if (err != 1)
			console.log("[오류 발생] 새 국가가 감염되었습니다. 국가를 추가해야합니다.")
	}
	//국가코드
	for (var i=0;i<info.length;i++) {
		ctrss[codes[i]] = ctrs[i];
	}
	
	var putterInfect = JSON.stringify(infectInfo);
	var putterDeath = JSON.stringify(deathInfo);
	var putterctrs = JSON.stringify(ctrss);
	
	infectedData = "{ \"infected\":"+putterInfect+",\"death\":"+putterDeath+",\"ctrs\":"+putterctrs+"}";
	try {
	fs.unlink(__dirname + '/static/data/infectionData.json', function (err) { if (err) throw err; console.log('successfully deleted infectionData.json'); });
	} catch (e) {
		console.log("삭제 오류 발생");}
	try {
		fs.writeFile(__dirname + '/static/data/infectionData.json', infectedData, 'utf8', function(error){ console.log('write complete') });
	} catch (e) {
		console.log("쓰기 오류 발생");}
}

function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}