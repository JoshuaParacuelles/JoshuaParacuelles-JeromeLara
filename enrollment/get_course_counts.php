<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "enrollment";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// List of courses with BSCS replaced by BEED
$courses = ['BSIT', 'BEED', 'BSCRIM', 'BSAB', 'BSED Math', 'BSED Science', 'BSHM'];
$data = [];

foreach ($courses as $course) {
    // Prepare statement to count students per course
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS count 
        FROM enrolled 
        WHERE LOWER(course) LIKE LOWER(CONCAT('%', ?, '%'))
    ");
    $stmt->bind_param("s", $course);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    // Convert course name to uppercase and replace spaces with underscores for React state
    $key = str_replace(' ', '_', strtoupper($course));
    $data[$key] = (int)$result['count'];
}

// Return JSON data
echo json_encode($data);

// Close connection
$conn->close();
?>
