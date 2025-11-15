<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "enrollment");
if ($conn->connect_error) {
    echo json_encode(['enrolled'=>false,'error'=>'DB connection failed']);
    exit;
}

$email = $_GET['email'] ?? '';
if (!$email) {
    echo json_encode(['enrolled'=>false]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM enrolled WHERE email=? AND status!='Cancelled'");
$stmt->bind_param("s",$email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    $row = $res->fetch_assoc();
    echo json_encode(['enrolled'=>true,'enrollment'=>$row]);
} else {
    echo json_encode(['enrolled'=>false]);
}

$conn->close();
?>
