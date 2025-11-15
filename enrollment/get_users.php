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

$sql = "SELECT id, fullname, email, password FROM users";
$result = $conn->query($sql);

$users = [];
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $users[] = $row;
  }
}

echo json_encode($users);
$conn->close();
?>
