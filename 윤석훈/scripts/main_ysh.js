$(function () {
  usrIconClick();
});


function usrIconClick() {
  const button = $(".user-icon");
  const historyWindow = $(".history-opened");
  const blackedWindow = $(".blacked-window");

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

// 리스트 모두 제거
function clearAllButton(){
  let index = -1;
  // id를 찾아서 찾으면 index=1
  for (let i = 0; i < list.length; i++) {
      if(list[i].id===id){
          index=1;
          break;
      }
      // 찾지 못했으면 index=-1
  }
  if(index!==-1){
      list.splice(index,1);
  }
  return list;
}

function recentTabClick() {
  const recentTab = $(".recent-tab");
  const historyWindow = $(".history-opened");
  const blackedWindow = $(".blacked-window");

  recentTab.mouseup(function () {
    historyWindow.toggle();
    blackedWindow.toggle();
  });

  blackedWindow.mouseup(function () {
    historyWindow.toggle();
    blackedWindow.toggle();
  });
}