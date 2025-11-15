<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

include 'db.php';

$response = ["success" => false, "message" => "Unknown error"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = $_POST['fullname'] ?? '';
    $student_id = $_POST['student_id'] ?? '';
    $email = $_POST['email'] ?? '';
    $course = $_POST['course'] ?? '';
    $section = $_POST['section'] ?? '';

    if ($fullname && $student_id && $email && $course && $section) {
        $stmt = $conn->prepare("INSERT INTO students (fullname, student_id, email, course, section) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $fullname, $student_id, $email, $course, $section);

        if ($stmt->execute()) {
            $response = ["success" => true, "message" => "Student added successfully!"];
        } else {
            $response = ["success" => false, "message" => "Database error: " . $stmt->error];
        }

        $stmt->close();
    } else {
        $response = ["success" => false, "message" => "Missing required fields"];
    }
}

$conn->close();
echo json_encode($response);
exit;
