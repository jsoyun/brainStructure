<?php
$conn = mysqli_connect(
  'localhost',
  'root',
  '1234',
  'reviews');

$sql = "
  INSERT INTO rev
    (restaurantName, starRate, contents, visitDate, created)
    VALUES(
        '{$_POST['restaurantName']}',
        '{$_POST['starRate']}',
        '{$_POST['contents']}',
        '{$_POST['visitDate']}',
        NOW()
    )
";

$result = mysqli_query($conn, $sql);
if($result === false){
  echo '저장하는 과정에서 문제가 생겼습니다. 관리자에게 문의해주세요';
  error_log(mysqli_error($conn));
} else {
  echo '리뷰를 작성해주셔서 감사합니다. &nbsp&nbsp <a href="review_list.html" font-size=“3rem” font-weight=“bold”>리뷰리스트로 돌아가기</a>';
}
?>