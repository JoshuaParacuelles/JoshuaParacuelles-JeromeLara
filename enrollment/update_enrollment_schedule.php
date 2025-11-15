<?php
header("Content-Type: application/json");
include "db.php";

$open = $_POST['open'] ?? null;
$close = $_POST['close'] ?? null;

if (!$open || !$close) {
    echo json_encode([
        "success" => false,
        "message" => "Both dates are required."
    ]);
    exit;
}

// Save to DB

// Check if a record exists
$res = $conn->query("SELECT COUNT(*) as count FROM enrollment_schedule");
$row = $res->fetch_assoc();

if ($row['count'] > 0) {
    $stmt = $conn->prepare("UPDATE enrollment_schedule SET open_date=?, close_date=?");
    $stmt->bind_param("ss", $open, $close);
} else {
    $stmt = $conn->prepare("INSERT INTO enrollment_schedule (open_date, close_date) VALUES (?, ?)");
    $stmt->bind_param("ss", $open, $close);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Enrollment schedule saved.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}
?>
