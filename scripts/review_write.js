// ● 달력 넣기 (datepicker 함수를 통해)
$( function() {
    $( "#datepicker" ).datepicker({
        changeMonth :true,
        changeYear: true,
        // 요일 한글 표기로 바꾸기
        dayNames: ['월요일','화요일','수요일','목요일','금요일','토요일','일요일'],
        dayNamesMin: ['월','화','수','목','금','토','일'],
        // 월(月)을 클릭 했을 때와 아닐 때의 표기 방법 정해주기
        monthNamesShort:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월',],
        monthNames:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월',],
        // 미래에서 온 리뷰 방지
        maxDate: 0
    });
});
// ● 별점매기기!!!!!!
$('#staR a').click(function(){
    $(this).parent().children("a").removeClass("on");
    $(this).addClass("on").prevAll("a").addClass("on");
    console.log($(this).attr("value"));
});
// ● 사진 첨부하기
$("#photoBtn").on('click',function(e){
    e.preventDefault(); // 예기치 않은 이벤트버블링 방지
    var val = $("#userfile1").val();
    if (!val) {
     $(".title.roboto").html("이미지 파일을 선택해주세요");
     $("#userfile1").focus();
     return false;
    }
    // Formdata  겍체를 만들고 append로 추가시켜 data 형식으로 보낸다.
    var fD = new FormData($("#fphoto")[0]);
    fD.append("userfile1",$("input[name=userfile1]")[0].files[0]);
    $.ajax({
     type: "post",
     url: "ajax.php?com_no=<?=$com_no?>",
     data: fD,
     processData: false,
     contentType: false,
     success: function(data) {
       window.location.reload(true); // 업로드후 현재 페이지를 리로딩시킨다.
       alert(data);  // 이미지 업로드 OK;
     },
     error: function() {
      $(".title.roboto").html("사진 업로드시 Error 발생");
     }
    });
   });
