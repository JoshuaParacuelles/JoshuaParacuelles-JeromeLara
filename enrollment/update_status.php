<?php
// -----------------------------
// Headers
// -----------------------------
header("Content-Type: application/json");

// -----------------------------
// Database connection
// -----------------------------
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "enrollment";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// -----------------------------
// Read JSON input
// -----------------------------
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['email']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing email or status"]);
    exit();
}

$email = trim($data['email']);
$status = trim($data['status']); // Expected: "Enrolled" or "Unrolled"

// Validate status
$allowedStatuses = ["Enrolled", "Unrolled", "Pending", "Cancelled"];
if (!in_array($status, $allowedStatuses)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid status value"]);
    exit();
}

// -----------------------------
// Update status and reviewed_at
// -----------------------------
$reviewed_at = date("Y-m-d H:i:s"); // current timestamp

$stmt = $conn->prepare("UPDATE enrolled SET status = ?, reviewed_at = ? WHERE email = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare statement failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("sss", $status, $reviewed_at, $email);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Student status updated successfully",
            "data" => [
                "email" => $email,
                "status" => $status,
                "reviewed_at" => $reviewed_at
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No record updated (email not found or status already set)"
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to update status: " . $stmt->error]);
}

// -----------------------------
// Clean up
// -----------------------------
$stmt->close();
$conn->close();
exit();
?>
