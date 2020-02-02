const request = require('request');
const cheerio = require('cheerio');

const newsurl = "https://search.naver.com/search.naver?&where=news&query=%EC%9A%B0%ED%95%9C%ED%8F%90%EB%A0%B4";
var newsinfo = [[],[],[]];
var newsjson = {};

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
			newsinfo[0][i]=newsinfo[0][i].replace(/(종합)/gi,"").replace(/\[단독\]/gi,"").replace(/\[전문\]/gi,"").replace(/^\s+|\s+$/g,'');
			console.log(newsinfo[0][i]);
			console.log(newsinfo[1][i]);
			console.log(newsinfo[2][i]);
			console.log();
		}
		
	} catch (error) {
		console.error(error);
	}
});

//이거 돌리시면 info에 딕셔너리로 정보 들어와요이거 app.js안에 있어요