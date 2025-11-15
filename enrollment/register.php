<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// ✅ Database connection
$conn = new mysqli("localhost", "root", "", "enrollment");
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);
    exit();
}

// ✅ Get JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// ✅ Validate input
if (!$data || !isset($data['fullname'], $data['email'], $data['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "Please provide all required fields."
    ]);
    exit();
}

$fullname = $conn->real_escape_string($data['fullname']);
$email = $conn->real_escape_string($data['email']);
$password = $conn->real_escape_string($data['password']); // 🔹 plain text password

// ✅ Check if email already exists
$result = $conn->query("SELECT * FROM users WHERE email='$email'");
if ($result && $result->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email already registered."
    ]);
    exit();
}

// ✅ Insert new user (plain text password)
$query = "INSERT INTO users (fullname, email, password) VALUES ('$fullname', '$email', '$password')";
if ($conn->query($query)) {
    echo json_encode([
        "success" => true,
        "message" => "Registration successful!"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to register. Please try again."
    ]);
}

$conn->close();
?>
