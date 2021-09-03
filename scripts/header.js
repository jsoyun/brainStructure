const EMPTY = 0;
const NOTEMPTY = "NOTEMPTY";
const RECENT = "RECENT";
const WANNAGO = "WANNAGO";
const LOGINED = "LOGINED";
const NOTLOGINED = "NOTLOGINED";


let contentsEmptyStatus = EMPTY;
let historyWindowStatus = RECENT;
let loginStatus = NOTLOGINED;

$(function () {
  usrIconClick();
  tabClick();
  loginPopupCloseBtnClick();
  loginBtnClick();
});

/***************** 유저 아이콘 **********************/
// 상단 유저 아이콘/프로필 클릭했을 때 동작 함수
function usrIconClick() {
  const button = $("#user-icon");
  const profile = $('#user-profile-btn')
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
    if(loginStatus==NOTLOGINED){
      loginPopupWindowOpen();
    } else{
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
      recent.style.borderBottom = "solid red 2px";
      wannaGo.style.borderBottom = "solid #888 1px";
      break;
    case WANNAGO:
      recent.style.borderBottom = "solid #888 1px";
      wannaGo.style.borderBottom = "solid red 2px";
      break;
  }
}
// 최근 검색 목록 및 찜 목록이 없을때 화면 불러오기
function emptyScreen() {
  const recentEmpty = document.getElementById("history-contents-emptyView");
  const wannagoEmpty = document.getElementById("history-contents-emptyWannaGo");
  const rsListElem = document.getElementsByClassName("restaurant-list");
  // rsListElem[0].style.display='none';

  switch (contentsEmptyStatus) {
    case EMPTY:
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
function loginPopupWindowOpen(){
  const loginPopupWindow =
    document.getElementsByClassName("login-popup-window");
  loginPopupWindow[0].style.display = "block";
}

/****************************************/

/************* 로그인 팝업창 *************/
// 로그인 윈도우 
function loginWindow(loginData) {
  const id = loginData.id;
  const kakao_account = loginData.kakao_account;
  const properties = loginData.properties;
  const userIcon = document.getElementById("user-icon");
  const userProfile = document.getElementById("user-profile");
  
  loginDisp();
  
  // 로그인 시 프사가 나오게 함
  userProfile.src = properties.profile_image;

  // 로그인하자마자 로그인 팝업창 종료
  loginPopupClose();
}

// 로그인 상태에서 보이는 화면
function loginDisp(){
  const loginDispElem = document.getElementsByClassName('login-display');
  const notLoginDispElem = document.getElementsByClassName('not-login-display');

  // 로그인 했을때 보여야하는 요소들 다 켜기
  for (let i = 0; i < loginDispElem.length; i++) {
    loginDispElem[i].style.display='block'
  }
  // 로그인 했을때 보이면 안되는 요소들 다 끄기
  for (let i = 0; i < notLoginDispElem.length; i++) {
    notLoginDispElem[i].style.display='none'
  }
}

// 로그인 안한 상태에서 보이는 화면
function notLoginDisp(){
  const loginDispElem = document.getElementsByClassName('login-display');
  const notLoginDispElem = document.getElementsByClassName('not-login-display');

  // 로그인 했을때 보여야하는 요소들 다 끄기
  for (let i = 0; i < loginDispElem.length; i++) {
    loginDispElem[i].style.display='none'
  }
  // 로그인 했을때 보이면 안되는 요소들 다 켜기
  for (let i = 0; i < notLoginDispElem.length; i++) {
    notLoginDispElem[i].style.display='block'
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
function loginPopupClose(){
  const loginPopupWindow = document.getElementsByClassName("login-popup-window");
  loginPopupWindow[0].style.display = "none";
}

/* 카카오 로그인 팝업창*/
// 카카오 API key 등록
Kakao.init("586fe3f43cb0194d025ad9df81b4de7a");
// 카카오 로그인 버튼 눌렀을때 카카오 로그인 팝업창 띄우기 
// a태그 href로 이 함수 불러옴
function loginWithKakao() {
  Kakao.Auth.login({
    // 로그인시 동의항목들 설정 --> kakao develper 사이트에서 설정해줘야함
    // 받을 데이터들 설정
    scope: 'profile_nickname, profile_image, account_email, gender',
    // 카카오로 로그인 성공했을때 아래 함수 실행
    success: function (authObj) {
      loginStatus = LOGINED;
      // 카카오 API로 로그인 정보 불러오기
      Kakao.API.request({
        url: "/v2/user/me",
        // 성공했을때 아래 함수 실행
        success: (loginData) => {
          loginWindow(loginData);
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
function logoutKakao(){
  Kakao.API.request({
    url: '/v1/user/unlink',
    success: function(response) {
      console.log('로그아웃!');
      notLoginDisp();
    },
    fail: function(error) {
      console.log(error);
    },
  });
}