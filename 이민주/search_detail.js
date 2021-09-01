
var container = document.getElementById('map');
var options = {
  center: new kakao.maps.LatLng(33.450701, 126.570667),
  level: 3
};

var map = new kakao.maps.Map(container, options);

//////////////////////////////////////////////////

const API_URL='http://openapi.gd.go.kr:8088/6b6963726e69736133307158495a53/json/GdModelRestaurantDesignate/1/1000/'

$(function(){
  $('.btn-search').click(function(){
    let searchKeyword =$('#search-text').val();
    
    search(searchKeyword);
      //let RestaurantList =data.GdModelRestaurantDesignate.row;
    });
});

function search(searchKeyword){
  $.getJSON(API_URL,{ searchKeyword:searchKeyword },function(data){
    let list = data.GdModelRestaurantDesignate.row;
    console.log(list);    
    
    const $list = $('.detail-text');
    for(let i = 0; i < list.length; i++){
      let item = list[i];

      let $elem =$('#detail-template').clone().removeAttr('id');

      $elem.find('#detail-template-no').html(i+1);
      $elem.find('#detail-template-title').html(item.UPSO_NM);
      $elem.find('#detail-template-content').html(item.SITE_ADDR_RD);

      $list.append($elem);
    }
  });
}





// function search(name){
//   const URL='http://openapi.gd.go.kr:8088/44777756477465733936475267654e/json/GdModelRestaurantDesignate/1/1000'

//   $.getJSON(
//     URL,
//     {
//       name: name
//     },
//     function(r){
//       console.log(r);
      
//     }
//   )

//