<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// 1️⃣ Read raw POST data
$raw = file_get_contents("php://input");

// Remove BOM if present
if (substr($raw, 0, 3) === "\xEF\xBB\xBF") $raw = substr($raw, 3);
$raw = trim($raw);

// 2️⃣ Decode JSON
$data = json_decode($raw, true);

// 3️⃣ Log raw + parsed data for debugging
file_put_contents(
    "screening_debug.txt",
    date("Y-m-d H:i:s") . "\nRAW:\n$raw\nPARSED:\n" . print_r($data, true) . "\n\n",
    FILE_APPEND
);

// 4️⃣ Ensure $data is an array
if (!is_array($data)) $data = [];

// 5️⃣ Extract fields safely
$email = isset($data["email"]) ? trim($data["email"]) : "";
$answers = isset($data["answers"]) && is_array($data["answers"]) ? array_map('trim', $data["answers"]) : [];
$questions = isset($data["questions"]) && is_array($data["questions"]) ? $data["questions"] : array_fill(0, count($answers), "N/A");

// 6️⃣ Validate required fields
if ($email === "" || empty($answers)) {
    echo json_encode([
        "success" => false,
        "message" => "Missing email or answers"
    ]);
    exit;
}

// 7️⃣ DB connection
$conn = new mysqli("localhost", "root", "", "enrollment");
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection error"
    ]);
    exit;
}

// 8️⃣ Prepare insert
$stmt = $conn->prepare("INSERT INTO screening_answers (email, question, answer) VALUES (?, ?, ?)");

foreach ($answers as $i => $answer) {
    $question = $questions[$i] ?? "N/A";
    $stmt->bind_param("sss", $email, $question, $answer);
    $stmt->execute();
}

$stmt->close();
$conn->close();

// 9️⃣ Return success
echo json_encode([
    "success" => true,
    "message" => "Screening answers saved successfully"
]);
