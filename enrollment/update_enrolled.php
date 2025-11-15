<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// ✅ If accessed directly (via browser, not POST request)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => true,
        "message" => "Enrollment Update API is running. Use POST method to update a student."
    ]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "enrollment");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// ✅ Read data from POST
$id = $_POST['id'] ?? null;
$fullName = $_POST['fullName'] ?? null;
$email = $_POST['email'] ?? null;
$contact = $_POST['contact'] ?? null;
$course = $_POST['course'] ?? null;

if (!$id || !$fullName || !$email || !$contact || !$course) {
    echo json_encode([
        "success" => false,
        "message" => "Incomplete data",
        "received" => $_POST
    ]);
    exit;
}

$query = "UPDATE enrolled SET fullName=?, email=?, contact=?, course=? WHERE id=?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssssi", $fullName, $email, $contact, $course, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Student updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}
?>
