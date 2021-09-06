$(function () {
  Category();
  // randomDisplay(randNum());
});

/************ 카테고리 ************/
// 카테고리 눌렀을때 쿠키에 저장
function clickCategory(id, categoryName) {
  const idName = document.getElementById(id);
  idName.addEventListener("click", () => {
    setCookie("searchKeyword", categoryName);
    console.log(getCookie("searchKeyword"));
    // idName.href = "search.html";
    // window.open("search.html", "_blank");
  });
}
function Category() {
  const classElem = document.getElementsByClassName("thumbnail");
  for (let i = 0; i < classElem.length; i++) {
    const id = classElem[i].id;
    const categoryName = classElem[i].children[0].textContent;
    clickCategory(id, categoryName);
  }
}

function randNum() {
  let randNumList = [];
  let num;
  // 숫자의 총 개수 설정
  let lengthOfData = 171;
  // 뽑을 숫자 개수 설정
  randNumList.length = 3;
  for (let i = 0; i < randNumList.length; i++) {
    // 중복 검증 flag
    let flag = true;
    while (flag) {
      num = Math.floor(Math.random() * lengthOfData);
      flag = false;
      for (let j = 0; j < i; j++) {
        // 만약 같은 숫자가 발견되면 flag를 이용해서 while문을 다시 돌림
        if (randNumList[j] == num) flag = true;
      }
    }
    // 중복 검증 이후에 값을 리스트에 넣어준다
    randNumList[i] = num;
  }
  // 뽑은 숫자 정렬
  randNumList.sort((a, b) => a - b);
  return randNumList;
}

function request() {
  let randomList = randNum();
  const API_URL =
    "http://openapi.gd.go.kr:8088/6b6963726e69736133307158495a53/json/GdModelRestaurantDesignate/1/1000/";
  fetch(API_URL, {
    method: "GET",
  }) //fetch 함수를 통해 get방식으로 데이터를 불러오자
    .then((response) => {
      return response.json();
    }) // json형식으로 받자
    .then((data) => {
      //받아온 데이터를 유용하게 써보자
      const restaurantInfo = data.GdModelRestaurantDesignate.row; //데이터 중 쓰고 싶은 배열.
      const infoBoxElem = document.getElementsByClassName("random-box");
      for (let i = 0; i < infoBoxElem.length; i++) {
        const detailInfo = infoBoxElem[i].children;
        let infoArray = [
          restaurantInfo[randomList[i]].UPSO_NM,
          restaurantInfo[randomList[i]].SNT_UPTAE_NM,
          restaurantInfo[randomList[i]].MAIN_EDF,
          restaurantInfo[randomList[i]].SITE_ADDR_RD,
        ];
        for (let j = 1; j < detailInfo.length; j++) {
          detailInfo[j].innerHTML = infoArray[j - 1];
        }
      }
    });
}
request();
