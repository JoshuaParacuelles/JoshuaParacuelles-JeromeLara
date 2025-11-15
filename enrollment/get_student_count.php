<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "enrollment";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// ✅ If your student records are stored in "enrolled" table
$sql = "SELECT COUNT(*) AS total_students FROM enrolled";

$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode(["count" => (int)$row['total_students']]);
} else {
    echo json_encode(["count" => 0]);
}

$conn->close();
?>
