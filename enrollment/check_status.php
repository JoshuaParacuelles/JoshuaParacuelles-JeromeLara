<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$conn = new mysqli("localhost", "root", "", "enrollment");
if ($conn->connect_error) {
    echo json_encode(["enrolled" => false, "error" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$studentId = $data["studentId"] ?? "";

if (empty($studentId)) {
    echo json_encode(["enrolled" => false, "error" => "No student ID provided"]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM enrolled WHERE studentId = ?");
$stmt->bind_param("s", $studentId);
$stmt->execute();
$res = $stmt->get_result();

echo json_encode(["enrolled" => $res->num_rows > 0]);

$stmt->close();
$conn->close();
?>
