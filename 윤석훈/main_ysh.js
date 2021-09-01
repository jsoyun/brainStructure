$(function () {
  usrIconClick();
});


function usrIconClick() {
  let button = $(".user-icon");
  let historyWindow = $(".history-opened");
  let blackedWindow = $(".blacked-window");

  // 유저 아이콘 클릭했을때 히스토리 창 및 전체 검은 화면 켜기
  button.mouseup(function () {
    historyWindow.toggle();
    blackedWindow.toggle();
  });
  
  // 검은 화면 클릭했을때 히스토리 창, 전체 검은 화면 끄기
  blackedWindow.mouseup(function () {
    historyWindow.toggle();
    blackedWindow.toggle();
  });
}

function recentTabClick() {
  let recentTab = $(".recent-tab");
  let historyWindow = $(".history-opened");
  let blackedWindow = $(".blacked-window");

  recentTab.mouseup(function () {
    historyWindow.toggle();
    blackedWindow.toggle();
  });

  blackedWindow.mouseup(function () {
    historyWindow.toggle();
    blackedWindow.toggle();
  });
}