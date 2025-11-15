<?php
// review_answers.php
// ✅ Handles status updates (Correct / Incorrect) from admin panel

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// ✅ Allow preflight request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "enrollment";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit;
}

// ✅ Decode JSON input
$input = json_decode(file_get_contents("php://input"), true);
$email = $input["email"] ?? null;
$status = $input["status"] ?? null;

if (!$email || !$status) {
    echo json_encode([
        "success" => false,
        "message" => "Missing email or status field."
    ]);
    exit;
}

// ✅ Check if student exists
$check = $conn->prepare("SELECT id FROM enrolled WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "No student found with that email."
    ]);
    $check->close();
    $conn->close();
    exit;
}
$check->close();

// ✅ Update status
$stmt = $conn->prepare("UPDATE enrolled SET status = ?, reviewed_at = NOW() WHERE email = ?");
$stmt->bind_param("ss", $status, $email);
$ok = $stmt->execute();

if ($ok) {
    echo json_encode([
        "success" => true,
        "message" => "Student status updated to $status."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update student status."
    ]);
}

$stmt->close();
$conn->close();
?>
