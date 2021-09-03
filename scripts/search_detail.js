var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.53991, 127.12335), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
geocoder.addressSearch('서울 강동구 올림픽로 651 예경빌딩 4층 경일게임아카데미', function(result, status) {

    // 정상적으로 검색이 완료됐으면 
     if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div class="name-in-map" style="width:150px;text-align:center;padding:6px 0;">경일게임아카데미</div>'
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    }   
    
}); 

//지도 컨트롤러 추가
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);













// const API_URL='http://openapi.gd.go.kr:8088/6b6963726e69736133307158495a53/json/GdModelRestaurantDesignate/1/1000/'

// $(function(){
//   $('.btn-search').click(function(){
//     let searchKeyword =$('#search-text').val();
    
//     search(searchKeyword);
//       //let RestaurantList =data.GdModelRestaurantDesignate.row;
//     //console.log(searchKeyword);
//   });
// });

// function search(searchKeyword){  // search(): 문자열에서 조건 문자열을 찾아서 몇번쨰 위치에 확인을 해주는 함수
//   //console.log(searchKeyword);
//   $.getJSON(API_URL,{ searchKeyword:searchKeyword },function(data){
//     let list = data.GdModelRestaurantDesignate.row;

//     //console.log(searchKeyword);
//     console.log(list);    
    
//     const $list = $('.detail-text');
//     for(let i = 0; i < list.length; i++){
//       console.log(searchKeyword);
//       let item = list[i];

//       let $elem =$('#detail-template').clone().removeAttr('id');

//       $elem.find('#detail-template-no').html(i+1);
//       $elem.find('#detail-template-title').html(item.UPSO_NM);
//       $elem.find('#detail-template-content').html(item.SITE_ADDR_RD);

//       $list.append($elem);
//     }
//   });
// }

/////////////////////////////////////////////////////////////////////////////////////////////
 
// $.ajax({
//   method: "GET", //전송방식
//   url: "http://openapi.gd.go.kr:8088/6b6963726e69736133307158495a53/json/GdModelRestaurantDesignate/1/1000/", //전송주소
//   data: { UPSO_NM : "더 파크뷰", MAIN_EDF:"부페"}, //보낼데이터
// })
//   .done(function(msg) { //요청에대한 응답이 오면 응답에 대한 처리를 함.
//     console.log(msg.GdModelRestaurantDesignate.row[0].UPSO_NM); 
//     console.log(msg.GdModelRestaurantDesignate.row[0].MAIN_EDF);
//     $( '.detail-text' ).append( "<strong>"+msg.GdModelRestaurantDesignate.row[0].UPSO_NM+"</strong>" );
//     $( '.detail-text' ).append( "<strong>"+msg.GdModelRestaurantDesignate.row[0].MAIN_EDF+"</strong>" );

//     for(let i = 0; i < GdModelRestaurantDesignate.row.length; i++){
//       console.log(msg.GdModelRestaurantDesignate.row[i].UPSO_NM); 
//       console.log(msg.GdModelRestaurantDesignate.row[i].MAIN_EDF);
//       $( '.detail-text' ).append( "<strong>"+msg.GdModelRestaurantDesignate.row[i].UPSO_NM+"</strong>" );
//       $( '.detail-text' ).append( "<strong>"+msg.GdModelRestaurantDesignate.row[i].MAIN_EDF+"</strong>" );
//     }
    
//   });
  