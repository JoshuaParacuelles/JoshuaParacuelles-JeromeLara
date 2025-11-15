<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php'; // your DB connection

$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode(['success' => false, 'answers' => []]);
    exit;
}

$sql = "SELECT question, answer FROM screening_answers WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$answers = [];
while ($row = $result->fetch_assoc()) {
    $answers[] = $row;
}

echo json_encode(['success' => true, 'answers' => $answers]);
?>
