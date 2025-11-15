<?php
// Disable notices and warnings (production-safe)
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// Always return JSON
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// 1️⃣ Enforce POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "This endpoint only accepts POST requests with JSON payload."
    ]);
    exit;
}

// 2️⃣ Connect to database
$conn = new mysqli("localhost", "root", "", "enrollment");
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

// 3️⃣ Read raw JSON input
$raw = trim(file_get_contents("php://input"));

// 4️⃣ Check if input is empty
if (empty($raw)) {
    echo json_encode([
        "success" => false,
        "message" => "No JSON input received. Make sure to send a POST request with JSON."
    ]);
    exit;
}

// 5️⃣ Decode JSON safely
$data = json_decode($raw, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "success" => false,
        "message" => "Malformed JSON: " . json_last_error_msg()
    ]);
    exit;
}

// 6️⃣ Validate required fields
$fullName = trim($data['fullName'] ?? '');
$email = trim($data['email'] ?? '');
$contact = trim($data['contact'] ?? '');
$course = trim($data['course'] ?? '');

if (!$fullName || !$email || !$contact || !$course) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required input fields."
    ]);
    exit;
}

// 7️⃣ Prevent duplicate enrollment
$stmt = $conn->prepare("SELECT id FROM enrolled WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "You have already enrolled with this email."
    ]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// 8️⃣ Default values
$status = 'Pending';
$reviewed_at = null;

// 9️⃣ Insert new enrollment
$stmt = $conn->prepare("
    INSERT INTO enrolled (fullName, email, contact, course, status, reviewed_at)
    VALUES (?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("ssssss", $fullName, $email, $contact, $course, $status, $reviewed_at);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Enrollment successful.",
        "data" => [
            "id" => $stmt->insert_id,
            "fullName" => $fullName,
            "email" => $email,
            "contact" => $contact,
            "course" => $course,
            "status" => $status
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Insert failed: " . $stmt->error
    ]);
}

// 🔚 Clean up
$stmt->close();
$conn->close();
exit;
?>
