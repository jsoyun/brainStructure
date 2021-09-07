const EMPTY = 0;
const NOTEMPTY = "NOTEMPTY";
const RECENT = "RECENT";
const WANNAGO = "WANNAGO";
const LOGINED = "LOGINED";
const NOTLOGINED = "NOTLOGINED";

let contentsEmptyStatus = NOTEMPTY;
let historyWindowStatus = RECENT;

$(function () {
  // 상단 메뉴 스크롤 바
  scrollBar();

  // 우측 상단 아이콘 / 프로필 사진
  usrIconClick();
  userIconDisplay(getCookie("profile_image"));

  // 아이콘 및 프로필 팝업창
  tabClick();
  loginPopupCloseBtnClick();
  loginBtnClick();

  // 상단 검색창
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
    console.log(getCookie("searchKeyword"));
    // 현재 창이 search 페이지일때 동작들
    if (window.location.href.includes("search.html")){
      removeList("res-list");
      search(getCookie("searchKeyword"));
      mapSearchAutoFilled(getCookie("searchKeyword"));
      searchPlaces();
      storeSearchHistoryList(searchKeyword.value);
      getSearchHistoryList();
    }
  });
}

// 배열에 검색목록 저장
let historyData = [];
function storeSearchHistoryList(str) {
  if(!(str=="")){
    historyData.push(str);
    setCookie("historyList", historyData)
  }
}
function getSearchHistoryList(){
  let recentList = getCookie("historyList");
  console.log(recentList);
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
    if (top > 80) {
      $("#header").addClass("inverted");
    } else {
      $("#header").removeClass("inverted");
    }
  });
  // 스크롤 내려가 있는 상태에서도 동작하게 함
  $(window).trigger('scroll');
}

/***************** 팝업 창 **********************/
// 상단 유저 아이콘/프로필 클릭했을 때 동작 함수
function usrIconClick() {
  const button = $("#user-icon");
  const profile = $("#user-profile-btn");
  const blackedWindow = $(".blacked-window");
  historyContentsDisplay();
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
    historyContentsDisplay();
    tabStyle();
  });
  wannagoTabBtn.mouseup(() => {
    historyWindowStatus = WANNAGO;
    if (getCookie("loginStatus") == LOGINED) {
      historyContentsDisplay();
      tabStyle();
    } else {
      loginPopupWindowOpen();
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
