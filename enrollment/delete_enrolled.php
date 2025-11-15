<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "db.php";

// Accept both JSON and form-data
$data = $_POST;
if (empty($data)) {
    $json = json_decode(file_get_contents("php://input"), true);
    if (!empty($json)) $data = $json;
}

if (!isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "Missing student ID"]);
    exit;
}

$id = intval($data['id']);

// ✅ Get student email first
$getEmail = $conn->prepare("SELECT email FROM enrolled WHERE id = ?");
$getEmail->bind_param("i", $id);
$getEmail->execute();
$result = $getEmail->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Student not found"]);
    exit;
}

$row = $result->fetch_assoc();
$email = $row['email'];
$getEmail->close();

// ✅ Delete screening answers using email
$deleteAnswers = $conn->prepare("DELETE FROM screening_answers WHERE email = ?");
$deleteAnswers->bind_param("s", $email);
$deleteAnswers->execute();
$deleteAnswers->close();

// ✅ Delete student from enrolled table
$deleteStudent = $conn->prepare("DELETE FROM enrolled WHERE id = ?");
$deleteStudent->bind_param("i", $id);

if ($deleteStudent->execute()) {
    echo json_encode(["success" => true, "message" => "Student & screening answers deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete student"]);
}

$deleteStudent->close();
$conn->close();
?>
