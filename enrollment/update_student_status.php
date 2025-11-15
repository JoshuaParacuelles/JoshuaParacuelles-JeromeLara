<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$status = $data['status'];

$query = "UPDATE students SET status='$status' WHERE id='$id'";
if (mysqli_query($conn, $query)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
?>
