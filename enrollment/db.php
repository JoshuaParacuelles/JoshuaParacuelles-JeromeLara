<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "enrollment";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . mysqli_connect_error()]));
}
?>
