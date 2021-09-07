const EMPTY = "EMPTY";
const NOTEMPTY = "NOTEMPTY";
const RECENT = "RECENT";
const WANNAGO = "WANNAGO";
const LOGINED = "LOGINED";
const NOTLOGINED = "NOTLOGINED";

let loginStatus = NOTLOGINED;
let contentsEmptyStatus = NOTEMPTY;
let historyWindowStatus = RECENT;

$(function () {
  // 상단 메뉴 스크롤 바
  scrollSearchMenu()

  // 우측 상단 아이콘 / 프로필 사진
  usrIconClick();
  userIconDisplay(getCookie("profile_image"));

  // 아이콘 및 프로필 팝업창
  tabClick();
  loginPopupCloseBtnClick();
  loginBtnClick();

  // 상단 검색창
  searchHeader();
  createList(getCookie("historyList"), getCookie("historyAddrList"));
});

/********************** 헤더 스크롤  **********************/
// 스크롤 살짝만 내려도 카테고리와 식당 추천으로 슝 내려가는 디자인
window.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);
var $html = $("html");
var page = 1;
var lastPage = $(".content").length;
$html.animate({ scrollTop: 0 }, 1);
$(window).on("wheel", function (e) {
  if ($html.is(":animated")) return;
  if (e.originalEvent.deltaY > 0) {
    if (page == lastPage) return;
    page++;
  } else if (e.originalEvent.deltaY < 0) {
    if (page == 1) return;
    page--;
  }
  var posTop = (page - 1) * $(window).height();
  $html.animate({ scrollTop: posTop });
});
function scrollSearchMenu() {
  // 상단 메뉴 바 위치에 따라 변경
  $(window).scroll(function () {
    // scrollTop: 현재 브라우저의 창의 스크롤값을 구해줌
    let top = $(window).scrollTop();
    if (top > 0) {
      $("#header").addClass("inverted");
    } else {
      $("#header").removeClass("inverted");
    }
  });
  // 스크롤 내려가 있는 상태에서도 동작하게 함
  $(window).trigger("scroll");
}
/*************************************************/

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

  // 버튼을 눌렀을때
  searchBtn.addEventListener("click", () => {
    // 현재 창이 main 페이지면 search 페이지로 연결
    if (window.location.href.includes("main.html")) {
      // 현재 창에서 검색창으로 연결
      searchBtn.href = "search.html";
      // 새탭에서 검색창으로 연결
      // window.open("search.html", "_blank");
    }
    // 검색한 키워드 쿠키에 저장
    setCookie("searchKeyword", searchKeyword.value);
    let getSearchKeyword = getCookie("searchKeyword");
    // 현재 창이 search 페이지일때 동작들
    if (window.location.href.includes("search.html")) {
      removeList("res-list");
      search(getSearchKeyword);
      mapSearchAutoFilled(getSearchKeyword);
      searchPlaces();
    }
    // saveHistoryList("historyList", getSearchKeyword);
    // createList(getCookie("historyList"));
  });
}

// 검색 히스토리 생성
function createList(dataString1, dataString2) {
  let historyArray = dataString1.split(",");
  let historyAddrArray = dataString2.split(",");
  removeList("recent-list");
  if (!(historyArray == "")&&!(historyAddrArray == "")) {
    for (let i = 0; i < historyArray.length; i++) {
      let list = document.getElementsByClassName("search-history-list")[0];
      let elem = document
        .getElementsByClassName("search-history-item")[0]
        .cloneNode(true);
      elem.removeAttribute("id");
      elem.classList.add("recent-list");
      let detail = elem.children[0];
      detail.children[0].innerText = historyArray[i];
      detail.children[1].innerText = historyAddrArray[i];
      list.prepend(elem);
    }
    contentsEmptyStatus = NOTEMPTY;
  } else contentsEmptyStatus = EMPTY;

  historyContentsDisplay();
}
// 검색 히스토리를 쿠키에 저장
function saveHistoryList(name, value) {
  if (!(value == "")) {
    let history;
    let cookieData = getCookie(name);
    // 겹치는 목록이 있으면 바로 함수 탈출
    if(!(cookieData.indexOf(value)==-1)) return;
    if (cookieData == "") {
      history = value.split(",")[0];
    } else {
      history = cookieData + "," + value.split(",")[0];
    }
    setCookie(name, history);
  }
}

// 클론 리스트 지우기 함수
function removeList(className) {
  const itemList = document.getElementsByClassName(className);
  const repeatNum = itemList.length;
  for (let i = 0; i < repeatNum; i++) {
    itemList[0].remove();
  }
}

// 상단 메뉴 바 위치에 따라 변경
function scrollBar() {
  $(window).scroll(function () {
    // scrollTop: 현재 브라우저의 창의 스크롤값을 구해줌
    let top = $(window).scrollTop();
    if (top > 0) {
      $("#header").addClass("inverted");
    } else {
      $("#header").removeClass("inverted");
    }
  });
  // 스크롤 내려가 있는 상태에서도 동작하게 함
  $(window).trigger("scroll");
}

/***************** 팝업 창 **********************/
// 상단 유저 아이콘/프로필 클릭했을 때 동작 함수
function usrIconClick() {
  const IconBtn = $("#user-icon");
  const profile = $("#user-profile-btn");
  const blackedWindow = $(".blacked-window");
  historyContentsDisplay();
  tabStyle();
  

  // 로그인/비로그인 상태일때 찜목록 만들어야함

  // 유저 아이콘 클릭했을때 히스토리 창 및 전체 검은 화면 켜기
  IconBtn.mouseup(function () {
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
    historyContentsDisplay();
    tabStyle();
  });
  wannagoTabBtn.mouseup(() => {
    historyWindowStatus = WANNAGO;
    if (getCookie("loginStatus")) loginStatus = getCookie("loginStatus");

    if (loginStatus == NOTLOGINED) {
      loginPopupWindowOpen();
    } else {
      historyContentsDisplay();
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
// 최근 검색 목록 및 찜 목록 화면 불러오기
function historyContentsDisplay() {
  const recentEmpty = document.getElementById("history-contents-emptyView");
  const wannagoEmpty = document.getElementById("history-contents-emptyWannaGo");
  const rsListElem = document.getElementsByClassName("search-history-list");

  // 컨텐츠 내용의 유무에 따라 화면 바꾸기
  switch (contentsEmptyStatus) {
    case EMPTY:
      // 탭 클릭 상태에 따라 보이는 화면 바꾸기
      switch (historyWindowStatus) {
        case RECENT:
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
      switch (historyWindowStatus) {
        case RECENT:
          rsListElem[0].style.display = "block";
          break;
        case WANNAGO:
          rsListElem[0].style.display = "none";
          recentEmpty.style.display = "none";
          wannagoEmpty.style.display = "block";
          break;
        default:
          console.error("Check historyWindowStatus");
      }
      break;
    default:
      console.error("Check contentsEmptyStatus");
  }
}

// clear all 버튼
function clearBtnClick() {
  const clearBtn = document.getElementById("clear-btn");
  clearBtn.addEventListener("click", () => {
    removeList("recent-list");
    setCookie("historyList", "");
    setCookie("historyAddrList", "");
    contentsEmptyStatus = EMPTY;
    historyContentsDisplay();
  });
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
  if (getCookie("loginStatus")) loginStatus = getCookie("loginStatus");
  
  clearBtnClick();
  switch (loginStatus) {
    case LOGINED:
      loginWindowDisp();
      const userProfile = document.getElementById("user-profile");
      userProfile.src = image;
      return;
    case NOTLOGINED:
      const userIcon = document.getElementById("user-icon");
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
          const profileImage = loginData.properties.profile_image;
          loginWindow();
          setCookie("profile_image", profileImage);
          loginStatus = LOGINED;
          setCookie("loginStatus", LOGINED);
          userIconDisplay(profileImage);
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
      console.log("로그아웃!");
      notLoginWindowDisp();
      loginStatus = NOTLOGINED;
      setCookie("loginStatus", NOTLOGINED);
      historyWindowStatus = RECENT;
      historyContentsDisplay();
      tabStyle();
      alert("로그아웃 되었습니다.");
    },
    fail: function (error) {
      console.log(error);
    },
  });
}
/************************************/
