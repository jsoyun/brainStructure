$(function () {
  // 키워드로 장소를 검색합니다
  mapSearchAutoFilled(getCookie("searchKeyword"));
  searchPlaces();
  researchClick();
  search(getCookie("searchKeyword"));
});

function researchClick() {
  const researchBtn = document.getElementById("research-btn");
  researchBtn.addEventListener("click", () => {
    // 키워드 쿠키 빈칸으로 만들기
    setCookie("searchKeyword", "");
  });
}

// 지도에 키워드 자동 입력
function mapSearchAutoFilled(keyword) {
  const mapKeyword = document.getElementById("keyword");
  mapKeyword.value = "천호역 " + keyword;
}

//서치함수
function search(searchKeyword) {
  // 식당 API
  const API_URL =
    "http://openapi.gd.go.kr:8088/44777756477465733936475267654e/json/GdModelRestaurantDesignate/1/1000/";

  const $list = $(".classList");

  $.get(API_URL, { searchKeyword: searchKeyword }, function (data) {
    //list로 데이터의 구체적 배열, 할당해줌
    let list = data.GdModelRestaurantDesignate.row;

    //list 배열 반복되는 거 item에 들어감
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      //그 item의 보여줄정보(배열이름임)를 간단히 이름 붙여줌
      let name = item.UPSO_NM;
      let menu = item.MAIN_EDF;
      let addr = item.SITE_ADDR_RD;
      let category = item.SNT_UPTAE_NM;
      //걔네들을 contents배열로 만들어줌
      let contents = [name, menu, addr, category];
      // contents배열을 for문 돌림
      for (let X = 0; X < contents.length; X++) {
        // searchKeyword가 검색 되고 빈칸이 아닐시 검색
        if (contents[X].includes(searchKeyword) && !(searchKeyword == "")) {
          // #item-template의 클론을 만들어서 $elem 변수에 넣고
          // append로 클론을 classList에 추가
          let $elem = $("#item-template").clone().removeAttr("id");
          $elem.addClass("res-list");
          $elem.find(".item-name").html(item.UPSO_NM);
          $elem.find(".item-menu").html(item.MAIN_EDF);
          $elem.find(".item-addr").html(item.SITE_ADDR_RD);
          $elem.find(".item-category").html(item.SNT_UPTAE_NM);
          //보여주겠다
          $list.prepend($elem);
        }
      }
    }
  });
}

//식당리스트 업소명 클릭시 링크 새 창 뜸
$(document).click(function (event) {
  // console.log($(event.target));
  // console.log($(event.target.firstChild));
  if ($(event.target).hasClass("item-name")) {
    console.log($(event.target).text());

    const a = (href = `https://map.kakao.com/?q=${
      "천호 " + $(event.target).text()
    }`);
    console.log(a);
    window.open(a);
  }
});

// 마커를 담을 배열입니다
var markers = [];

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.540005298816624, 127.12334985085471), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

////////////////////////////////////////////////////////

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {
  var keyword = document.getElementById("keyword").value;

  if (!keyword.replace(/^\s+|\s+$/g, "")) {
    alert("키워드를 입력해주세요!");
    return false;
  }
  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayPlaces(data);

    // 페이지 번호를 표출합니다
    displayPagination(pagination);
  }
  //else if (status === kakao.maps.services.Status.ZERO_RESULT) {
  //   alert("검색 결과가 존재하지 않습니다.");
  //   return;
  // } else if (status === kakao.maps.services.Status.ERROR) {
  //   alert("검색 결과 중 오류가 발생했습니다.");
  //   return;
  // }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
  var listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu_wrap"),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = "";

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (var i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, title) {
      kakao.maps.event.addListener(marker, "mouseover", function () {
        displayInfowindow(marker, title);
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };

      itemEl.onmouseout = function () {
        infowindow.close();
      };
    })(marker, places[i].place_name);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  var el = document.createElement("li"),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      "   <h5>" +
      places.place_name +
      "</h5>";

  if (places.road_address_name) {
    itemStr +=
      "    <span>" +
      places.road_address_name +
      "</span>" +
      '   <span class="jibun gray">' +
      places.address_name +
      "</span>";
  } else {
    itemStr += "    <span>" + places.address_name + "</span>";
  }

  itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";

  el.innerHTML = itemStr;
  el.className = "item";

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
  var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById("pagination"),
    fragment = document.createDocumentFragment(),
    i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = "on";
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

////////////밑에는 따로 배열해서 넣은 식당마커/////////

// 마커를 표시할 위치와 title 객체 배열입니다
var positions = [
  {
    title: "가마솥 순대국밥",
    latlng: new kakao.maps.LatLng(37.540005298816624, 127.12334985085471),
    link: "1835218933",
  },
  {
    title: "아키노유키 본점",
    latlng: new kakao.maps.LatLng(37.538894, 127.126467),
    link: "11641919",
  },
  {
    title: "신가네화끈한매운갈비찜",
    latlng: new kakao.maps.LatLng(37.539398, 127.126977),
    link: "73920060",
  },
  {
    title: "고향집홍어",
    latlng: new kakao.maps.LatLng(37.5371311, 127.123568),
    link: "16057596",
  },
];
///////////////////

// 마커 이미지의 이미지 주소입니다
var imageSrc = "https://cdn-icons-png.flaticon.com/512/2533/2533563.png";

for (var i = 0; i < positions.length; i++) {
  // 마커 이미지의 이미지 크기 입니다
  var imageSize = new kakao.maps.Size(24, 35);

  // 마커 이미지를 생성합니다
  var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    map: map, // 마커를 표시할 지도
    position: positions[i].latlng, // 마커를 표시할 위치
    title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
    image: markerImage, // 마커 이미지
  });

  //배열 정리하기 위한 추가//
  //추천식당 링크와 이름
  var content =
    '<div class="customoverlay">' +
    '  <a href="https://place.map.kakao.com/' +
    positions[i].link +
    '"target="_blank">' +
    '    <span class="title">' +
    positions[i].title +
    "</span>" +
    "  </a>" +
    "</div>";
  // 커스텀 오버레이가 표시될 위치입니다
  var position = positions[i].latlng;

  // 커스텀 오버레이를 생성합니다
  var customOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: position,
    content: content,
    yAnchor: 1,
  });
}
