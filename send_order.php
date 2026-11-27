<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load PHPMailer (adjust path if you downloaded manually instead of Composer)
require 'vendor/autoload.php';

// 1. Read the JSON data sent from JavaScript
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['items'])) {
    echo "No order data received.";
    exit;
}

$items = htmlspecialchars($data['items']);
$total = htmlspecialchars($data['total']);

$mail = new PHPMailer(true);

try {
    // 2. Gmail SMTP Server Settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'etumanov77@gmail.com';
    $mail->Password   = 'oucqtpylrbjlwibw'; // Paste your Gmail App Password here
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8'; // Important so Cyrillic ("руб.") displays properly

    // 3. Sender and Recipient
    $mail->setFrom('etumanov77@gmail.com', 'Womans Sunglasses Shop');
    $mail->addAddress('djonic77@mail.ru');

    // 4. Email Content
    $mail->isHTML(false);
    $mail->Subject = 'New Sunglasses Order';
    $mail->Body    = "New order received:\n\n" . $items . "\n\n" . $total;

    $mail->send();
    echo 'Order successfully sent to email!';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>

