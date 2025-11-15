<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "enrollment";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// ✅ Include the 'status' column directly from your DB
$query = "
    SELECT 
        id, 
        fullname AS full_name, 
        email, 
        contact, 
        course, 
        status,           -- 👈 include this column
        created_at AS enrolled_at
    FROM enrolled
    ORDER BY id DESC
";

$result = $conn->query($query);
if (!$result) {
    die(json_encode(["error" => $conn->error]));
}

$enrolled = [];
while ($row = $result->fetch_assoc()) {
    // ✅ No need to override status here
    $enrolled[] = $row;
}

echo json_encode($enrolled);
$conn->close();
?>
