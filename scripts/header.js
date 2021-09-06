const EMPTY = 0;
const NOTEMPTY = "NOTEMPTY";
const RECENT = "RECENT";
const WANNAGO = "WANNAGO";
const LOGINED = "LOGINED";
const NOTLOGINED = "NOTLOGINED";

let contentsEmptyStatus = EMPTY;
let historyWindowStatus = RECENT;

$(function () {
  // setCookie('loginStatus', getCookie('loginStatus'));
  // console.log(getCookie('loginStatus'));
  search(getCookie("searchKeyword"));
  scrollBar();
  usrIcon();
  userIconDisplay(getCookie("profile_image"));
  tabClick();
  loginPopupCloseBtnClick();
  loginBtnClick();
  searchHeader();
});

/***************** 검색 버튼 **********************/
// 클릭 + 엔터 누르면 쿠키에 검색어 저장
function searchHeader() {
  const searchKeyword = document.getElementById("search-text");
  const searchBtn = document.getElementById("search-btn");
  // 엔터를 쳤을때 searchBtn.click 이벤트를 활성화
  searchKeyword.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      searchBtn.click();
    }
  });
  // 버튼을 눌렀을때 검색어 쿠키에 저장
  searchBtn.addEventListener("click", () => {
    if(window.location.href.includes("main.html")){
      // 현재 창에서 검색창으로 연결
      // searchBtn.href="search.html";
      // 새탭에서 검색창으로 연결
      window.open("search.html", "_blank");
    }
    setCookie("searchKeyword", searchKeyword.value);
    console.log(getCookie("searchKeyword"));
    search(getCookie("searchKeyword"));
    mapSearch(getCookie("searchKeyword"));
    searchPlaces();
  });
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

    console.log(2);
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
        //만약에 contents배열이 서치키워드 포함하면

        if (contents[X].includes(searchKeyword)) {
          //#item-template을 복사하겠다? id는 제거하고? 여기 정확히는 모르겠음
          let $elem = $("#item-template").clone().removeAttr("id");
          // $elem.find('.item-no').html(i + 1);
          $elem.find(".item-name").html(item.UPSO_NM);
          $elem.find(".item-menu").html(item.MAIN_EDF);
          $elem.find(".item-addr").html(item.SITE_ADDR_RD);
          $elem.find(".item-category").html(item.SNT_UPTAE_NM);
          //보여주겠다
          $list.append($elem);
        }
      }
    }
  });
}
function scrollBar(){
  $(window).scroll(function () {
    // scrollTop: 현재 브라우저의 창의 스크롤값을 구해줌
    let top = $(window).scrollTop();
    if (top > 160) {
      $("#header").addClass("inverted");
    } else {
      $("#header").removeClass("inverted");
    }
  });
}

/***************** 유저 아이콘 **********************/
// 상단 유저 아이콘/프로필 클릭했을 때 동작 함수
function usrIcon() {
  const button = $("#user-icon");
  const profile = $("#user-profile-btn");
  const blackedWindow = $(".blacked-window");
  emptyScreen();
  tabStyle();

  // 로그인/비로그인 상태일때 찜목록 만들어야함

  // 목록 있을때 함수도 만들어야함

  // 유저 아이콘 클릭했을때 히스토리 창 및 전체 검은 화면 켜기
  button.mouseup(function () {
    toggleWindow();
  });
  // 프로필 사진 클릭했을때 히스토리 창 및 전체 검은 화면 켜기
  profile.mouseup(function () {
    toggleWindow();
  });

  // 검은 화면 클릭했을때 히스토리 창, 전체 검은 화면 끄기
  blackedWindow.mouseup(function () {
    toggleWindow();
  });
}
// 드롭다운 화면 토글 함수
function toggleWindow() {
  const historyWindow = $(".history-opened");
  const blackedWindow = $(".blacked-window");
  historyWindow.toggle();
  blackedWindow.toggle();
}
/***********************************************/

/***************** 탭 부분 **********************/
// 탭을 눌렀을 때 화면 전환
function tabClick() {
  const recentTabBtn = $("#recent-tab-btn");
  const wannagoTabBtn = $("#wannaGo-tab-btn");

  recentTabBtn.mouseup(() => {
    historyWindowStatus = RECENT;
    // console.log(historyWindowStatus);
    emptyScreen();
    tabStyle();
  });
  wannagoTabBtn.mouseup(() => {
    historyWindowStatus = WANNAGO;
    // console.log(historyWindowStatus);
    // console.log(loginStatus);
    if (getCookie("loginStatus") == NOTLOGINED) {
      loginPopupWindowOpen();
    } else {
      emptyScreen();
      tabStyle();
    }
  });
}
// 선택된 탭 스타일 변경
function tabStyle() {
  const recent = document.getElementById("recent-tab-btn");
  const wannaGo = document.getElementById("wannaGo-tab-btn");
  switch (historyWindowStatus) {
    case RECENT:
      recent.style.borderBottom = "solid orange 2px";
      wannaGo.style.borderBottom = "solid #dbdbdb 1px";
      break;
    case WANNAGO:
      recent.style.borderBottom = "solid #dbdbdb 1px";
      wannaGo.style.borderBottom = "solid orange 2px";
      break;
  }
}
// 최근 검색 목록 및 찜 목록이 없을때 화면 불러오기
function emptyScreen() {
  const recentEmpty = document.getElementById("history-contents-emptyView");
  const wannagoEmpty = document.getElementById("history-contents-emptyWannaGo");
  const rsListElem = document.getElementsByClassName("restaurant-list");
  // rsListElem[0].style.display='none';

  // 컨텐츠 내용의 유무에 따라 화면 바꾸기
  switch (contentsEmptyStatus) {
    case EMPTY:
      // 탭 클릭 상태에 따라 보이는 화면 바꾸기
      switch (historyWindowStatus) {
        case RECENT:
          // rsListElem.toggle();
          recentEmpty.style.display = "block";
          wannagoEmpty.style.display = "none";
          break;
        case WANNAGO:
          recentEmpty.style.display = "none";
          wannagoEmpty.style.display = "block";
          break;
        default:
          console.error("Check historyWindowStatus");
      }
      break;
    case NOTEMPTY:
      recentEmpty.style.display = "none";
      wannagoEmpty.style.display = "none";
      rsListElem[0].style.display = "block";
      break;

    default:
      console.error("Check contentsEmptyStatus");
  }
}

// 로그인 버튼 눌렀을때 로그인 팝업창 띄우기
function loginBtnClick() {
  const loginBtn = document.getElementById("login-btn");
  loginBtn.addEventListener("click", () => {
    loginPopupWindowOpen();
  });
}

// 로그인 팝업창 띄우기 함수
function loginPopupWindowOpen() {
  const loginPopupWindow =
    document.getElementsByClassName("login-popup-window");
  loginPopupWindow[0].style.display = "block";
}

/****************************************/

/************* 로그인 팝업창 *************/
// 로그인 윈도우
function loginWindow() {
  const userProfile = document.getElementById("user-profile");
  userProfile.src = getCookie("profile_image");

  // 로그인 상태 화면 보이게 하기
  loginWindowDisp();
  // 로그인하자마자 로그인 팝업창 종료
  loginPopupClose();
}

function userIconDisplay(image) {
  let loginStatus = getCookie("loginStatus");
  switch (loginStatus) {
    case LOGINED:
      loginWindowDisp();
      const userProfile = document.getElementById("user-profile");
      userProfile.src = image;
      return;
    case NOTLOGINED:
      const userIcon=document.getElementById("user-icon");
      userIcon.style.display = "block";
      notLoginWindowDisp();
      return;
  }
}

// 로그인 상태에서 보이는 화면
function loginWindowDisp() {
  const loginDispElem = document.getElementsByClassName("login-display");
  const notLoginDispElem = document.getElementsByClassName("not-login-display");

  // 로그인 했을때 보여야하는 요소들 다 켜기
  for (let i = 0; i < loginDispElem.length; i++) {
    loginDispElem[i].style.display = "block";
  }
  // 로그인 했을때 보이면 안되는 요소들 다 끄기
  for (let i = 0; i < notLoginDispElem.length; i++) {
    notLoginDispElem[i].style.display = "none";
  }
}

// 로그인 안한 상태에서 보이는 화면
function notLoginWindowDisp() {
  const loginDispElem = document.getElementsByClassName("login-display");
  const notLoginDispElem = document.getElementsByClassName("not-login-display");

  // 로그인 했을때 보여야하는 요소들 다 끄기
  for (let i = 0; i < loginDispElem.length; i++) {
    loginDispElem[i].style.display = "none";
  }
  // 로그인 했을때 보이면 안되는 요소들 다 켜기
  for (let i = 0; i < notLoginDispElem.length; i++) {
    notLoginDispElem[i].style.display = "block";
  }
}

// 로그인 팝업 종료 버튼 함수
function loginPopupCloseBtnClick() {
  const closeBtn = document.getElementById("login-popup-close-btn");
  closeBtn.addEventListener("click", () => {
    loginPopupClose();
  });
}
// 로그인 팝업 꺼지는 함수
function loginPopupClose() {
  const loginPopupWindow =
    document.getElementsByClassName("login-popup-window");
  loginPopupWindow[0].style.display = "none";
}

/* 카카오 로그인 팝업창*/
// 카카오 API key 등록
Kakao.init("586fe3f43cb0194d025ad9df81b4de7a");
// 카카오 로그인 버튼 눌렀을때 카카오 로그인 팝업창 띄우기
function loginWithKakao() {
  Kakao.Auth.login({
    // 로그인시 동의항목들 설정 --> kakao develper 사이트에서 설정해줘야함
    // 받을 데이터들 설정
    scope: "profile_nickname, profile_image, account_email, gender",
    // 카카오로 로그인 성공했을때 아래 함수 실행
    success: function (authObj) {
      // 카카오 API로 로그인 정보 불러오기
      Kakao.API.request({
        url: "/v2/user/me",
        // 성공했을때 아래 함수 실행
        success: (loginData) => {
          const profileImage=loginData.properties.profile_image;
          loginWindow();
          setCookie("profile_image", profileImage);
          setCookie("loginStatus", LOGINED);
          userIconDisplay(profileImage);
          console.log(profileImage);
        },
      });
    },
  });
}

// 로그아웃 버튼 클릭 함수
function loginPopupCloseBtnClick() {
  const closeBtn = document.getElementById("login-popup-close-btn");
  closeBtn.addEventListener("click", () => {
    loginPopupClose();
  });
}
// 카카오 로그아웃 함수
function logoutKakao() {
  Kakao.API.request({
    url: "/v1/user/unlink",
    success: function (response) {
      // console.log("로그아웃!");
      notLoginWindowDisp();
      setCookie("loginStatus", NOTLOGINED);
      historyWindowStatus = RECENT;
      emptyScreen();
      tabStyle();
      alert("로그아웃 되었습니다.");
    },
    fail: function (error) {
      console.log(error);
    },
  });
}
/************************************/
