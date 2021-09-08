const LOGINED = "LOGINED";
const NOTLOGINED = "NOTLOGINED";

$(function(){
    reviewBtnClick();
})


function reviewBtnClick(){
    const reviewBtn = document.getElementsByClassName('RestaurantReviewWrite-button-link');
    console.log(reviewBtn);
    reviewBtn[0].addEventListener("click", ()=>{
        let loginStatus = getCookie("loginStatus");
        switch(loginStatus){
            case LOGINED:
                reviewBtn[0].href = "create.html";
                break;
            default:
                alert('로그인이 필요합니다. 메인페이지로 이동합니다.');
                reviewBtn[0].href = "main.html";
                console.log(1);
                break;
        }
    });
}
