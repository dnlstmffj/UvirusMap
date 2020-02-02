var route = Array();
var mobile = 0;
var map;
var flightPath = Array();
var overdiv = Array();
var marker = Array();
var inform = Array();

var icons = {
          right: {
            icon: 'https://i.pinimg.com/originals/d9/82/f4/d982f4ec7d06f6910539472634e1f9b1.png'
          },
          nonright: {
            icon: 'https://i.pinimg.com/originals/d9/82/f4/d982f4ec7d06f6910539472634e1f9b1.png'
          }
};

var point = [			//장소별 좌표 0 24 25 26 27 28
	{x: 30.590647, y: 114.306577, right: 0, name: "우한"},			//0우환(자세한 장소 특정 불가)
	{x: 31.229068, y: 121.473866, right: 0, name: "상하이"},			//1상하이(자세한 장소 특정 불가)
	{x: 36.067270, y: 120.382532, right: 0, name: "칭디오"},			//2청도(자세한 장소 특정 불가)
	{x: 37.459818, y: 126.440561, right: 1, name: "인천공항"},			//3인천공항
	{x: 37.558726, y: 126.802931, right: 1, name: "김포공항"},			//4김포공항
	{x: 37.478525, y: 126.668504, right: 1, name: "인천의료원"},			//5인천의료원
	{x: 37.567225, y: 127.005654, right: 1, name: "국립중앙의료원"},			//6국립중앙의료원
	{x: 37.532343, y: 126.990352, right: 0, name: "서울 시내 보건소"},			//7서울 용산구보건소(임시)
	{x: 37.524360, y: 127.027933, right: 1, name: "강남구 글로비 성형외과"},			//8강남구 글로비 성형외과
	{x: 37.502991, y: 127.049133, right: 1, name: "강남구 호텔 뉴브"},			//9강남구 호텔 뉴브
	{x: 37.526086, y: 127.016682, right: 0, name: "한강 산책로"},			//10한강 산책로(자세한 장소 특정 불가)
	{x: 37.524532, y: 127.015727, right: 1, name: "GS25 한강잠원 1호점"},			//11한강 GS25 한강잠원 1호점
	{x: 37.499731, y: 127.037003, right: 0, name: "역삼동 일대 음식점"},			//12역삼동(자세한 장소 특정 불가)
	{x: 37.499188, y: 127.061921, right: 0, name: "대치동 일대 음식점"},			//13대치동(자세한 장소 특정 불가)
	{x: 37.638829, y: 126.841228, right: 0, name: "일산 고향집"},			//14일산(자세한 장소 특정 불가)
	{x: 37.642070, y: 126.831243, right: 1, name: "일산 명지병원"},			//15일산 명지병원
	{x: 37.079411, y: 127.057664, right: 1, name: "평택 송탄터미널"},			//16평택 송탄터미널
	{x: 37.052010, y: 127.057333, right: 1, name: "365연합의원"},			//17 365연합의원
	{x: 37.065561, y: 127.066022, right: 0, name: "평택 시내 보건소"},			//18송탄보건소	(임시)
	{x: 37.351316, y: 127.123424, right: 1, name: "분당 서울대병원"},			//19분당 서울대병원
	{x: 30.776604, y: 114.212452, right: 1, name: "중국 텐허공항"},			//20중국 텐허공항
	{x: 37.506973, y: 126.960522, right: 1, name: "중앙대학교병원"},				//21중앙대학병원
	{x: 36.896079, y: 127.535775, right: 1, name: "진천 국가공무원 인재개발원"},			//22진천 인재개발원
	{x: 36.740371, y: 126.987224, right: 1, name: "아산 경찰 인재개발원"},				//23아산 인재개발원
	{x: 28.196654, y: 113.220830, right: 1, name: "장사 국제공항"},				//24장사 국제공항
	{x: 37.592558, y: 127.017048, right: 1, name: "성신여대영화관"},			//25성신여대영화관
	{x: 37.593816, y: 127.018402, right: 0, name: "자택"},						//26성북구 동선동 자택
	{x: 37.606489, y: 127.092758, right: 1, name: "중량구 보건소"},		//27중량구보건소
	{x: 37.612734, y: 127.098166, right: 1, name: "서울시 의료원"}			//28서울시의료원
	
];

document.onmousemove = function(e){                 /*마우스의 좌표 감지*/
	$("#map_inform").css("top", `${e.pageY}px`);
	$("#map_inform").css("left", `${e.pageX}px`);
}

$(document).ready(function(){
	// $("#momap").prepend("<div id=\"map_inform\"></div>");
	getroute();
});

function initMap() {
	var a;
	// The location of Uluru
 	// The map, centered at Uluru
    map = new google.maps.Map(
    	document.getElementById('map1'), {
			zoom: 8,
			center: {lat: 36.501417, lng: 127.888230},
		}
	);
	for (a=0; a<point.length; a++) {										//구글맵에 아이콘 붙이기
		if (point[a].right == 1) {
			marker[a] = new google.maps.Marker({
    			map:map,
				position: {lat: point[a].x, lng: point[a].y},
				num: a,
    			// position: new google.maps.LatLng(point[a].x, point[a].y),
    			//icon: '/static/Group_1.png', // null = default icon
				icon: '/static/img/red.png',
				title: point[a].name
  			});
		} else {
			marker[a] = new google.maps.Marker({
    			map:map,
				position: {lat: point[a].x, lng: point[a].y},
				num: a,
    			// position: new google.maps.LatLng(point[a].x, point[a].y),
    			//icon: '/static/Group_2.png', // null = default icon
				icon: '/static/img/blue.png',
				title: point[a].name
  			});
		}
		inform[a] = new google.maps.InfoWindow({
    		content: "<div style=\"color: black;\">"+marker[a].title+"</div>"
  		});
		marker[a].addListener('click', function() {
			console.log(this.num);
    		inform[this.num].open(map, marker[this.num]);
  		});
	}
	
	for (a=0; a<route.length; a++) {				//구글맵에 선그리기
		var flightPlanCoordinates = [
    		{lat: 1*(point[1*(route[a].point1)].x), lng: 1*(point[1*(route[a].point1)].y)},
    		{lat: 1*(point[1*(route[a].point2)].x), lng: 1*(point[1*(route[a].point2)].y)}
  		];
  		flightPath[a] = new google.maps.Polyline({
  		  path: flightPlanCoordinates,
  		  geodesic: true,
  		  strokeColor: route[a].color,
  		  strokeOpacity: 1.0,
 		  strokeWeight: 5,
		  num: a,
  		});
		flightPath[a].addListener('mouseover', function(event) {
			overdiv[this.num] = 1;
			if (route[this.num].save == 0) {																						//person_num 이 0이라면 우환귀국교민으로 간주
				if (route[this.num].person_num == 0) {
					$("#map_inform").text(`${route[this.num].date}, 우환귀국교민, 바이러스 노출 위험이 있다고 판단되는 경로입니다.`);
				} else {
					$("#map_inform").text(`${route[this.num].date}, ${route[this.num].person_num}번째 감염자, 바이러스 노출 위험이 있다고 판단되는 경로입니다.`);
				}
			} else {
				if (route[this.num].person_num == 0) {
					$("#map_inform").text(`${route[this.num].date}, 우환귀국교민, 병원이송 등으로 안전하다고 판단된 경로입니다.`);
				} else {
					$("#map_inform").text(`${route[this.num].date}, ${route[this.num].person_num}번째 감염자, 병원이송 등으로 안전하다고 판단된 경로입니다.`);
				}
			}
			$("#map_inform").css("display", "block");
  		});
		flightPath[a].addListener('mouseout', function(event) {
			if (overdiv[this.num] == 1) {
				overdiv[this.num] = 0;
				$("#map_inform").css("display", "none");
			}
  		});
		// flightPath[a].addListener('mouseout', function(event) {
		// // $("#map_information").css("display", "none");
		// });
		flightPath[a].setMap(map);
	}
}

function getroute() {
	$.getJSON('/static/data/route.json', function(data){
		route = data.route;
		console.log(route);
		initMap();
	});
}