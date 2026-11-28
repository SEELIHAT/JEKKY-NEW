<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Only POST requests are allowed.']);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) respond(400, ['ok' => false, 'message' => 'Invalid request data.']);

$name = trim((string)($data['name'] ?? ''));
$contact = trim((string)($data['contact'] ?? ''));
$items = $data['items'] ?? [];

if ($name === '' || mb_strlen($name) > 100 || $contact === '' || mb_strlen($contact) > 160) {
    respond(422, ['ok' => false, 'message' => 'Please provide your name and phone or email.']);
}
if (!is_array($items) || count($items) < 1 || count($items) > 26) {
    respond(422, ['ok' => false, 'message' => 'Your basket is empty or invalid.']);
}


function priceForModel(int $model): int {

    if ($model >= 1 && $model <= 24) {
        return 1350;

    } elseif ($model >= 25 && $model <= 55) {
        return 1350;

    } elseif ($model >= 56 && $model <= 78) {
        return 1550;

    } elseif ($model >= 79 && $model <= 100) {
        return 1800;

    } elseif ($model >= 101 && $model <= 120) {
        return 2000;

    } elseif ($model >= 121 && $model <= 150) {
        return 2200;

    } elseif ($model >= 151 && $model <= 200) {
        return 2500;

    } else {
        return 2800;
    }
}

$lines = [];
$total = 0;
foreach ($items as $item) {
    $model = filter_var($item['model'] ?? null, FILTER_VALIDATE_INT);
    $qty = filter_var($item['qty'] ?? null, FILTER_VALIDATE_INT);
    if ($model === false || $model < 1 || $model > 26 || $qty === false || $qty < 1 || $qty > 20) {
        respond(422, ['ok' => false, 'message' => 'One of the selected products is invalid.']);
    }
     $unitPrice = priceForModel($model);

$lineTotal = $unitPrice * $qty;
$total += $lineTotal;

$lines[] = "Модель {$model}: {$qty} шт. × {$unitPrice} руб. = {$lineTotal} руб.";
}

$configFile = __DIR__ . '/smtp-settings.php';
$autoloadFile = __DIR__ . '/vendor/autoload.php';
if (!is_file($configFile)) {
    respond(500, ['ok' => false, 'message' => 'Create smtp-settings.php from smtp-settings.example.php and enter your Gmail App Password.']);
}
if (!is_file($autoloadFile)) {
    respond(500, ['ok' => false, 'message' => 'PHPMailer is missing. Install it with Composer in this folder.']);
}

$config = require $configFile;
if (!is_array($config) || empty($config['password'])) {
    respond(500, ['ok' => false, 'message' => 'Gmail App Password is not configured in smtp-settings.php.']);
}

try {
    require $autoloadFile;
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host = (string)($config['host'] ?? 'smtp.gmail.com');
    $mail->SMTPAuth = true;
    $mail->Username = (string)($config['username'] ?? 'etumanov77@gmail.com');
    $mail->Password = (string)$config['password'];
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int)($config['port'] ?? 587);
    $mail->Timeout = 20;

    $from = (string)($config['from_email'] ?? 'etumanov77@gmail.com');
    $fromName = (string)($config['from_name'] ?? 'Jekky Optics');
    $to = (string)($config['to_email'] ?? 'djonic77@mail.ru');

    $mail->setFrom($from, $fromName);
    $mail->addAddress($to);
    $mail->Subject = 'Новый заказ очков с сайта Jekky';
    $mail->isHTML(false);
    $mail->Body =
        "Новый заказ с сайта Jekky\n\n" .
        "Имя: {$name}\nКонтакт: {$contact}\n\n" .
        implode("\n", $lines) .
        "\n\nИтого: {$total} руб.\n";

    $mail->send();
    respond(200, ['ok' => true, 'message' => 'Order sent successfully.']);
} catch (Throwable $e) {
    error_log('Jekky order email error: ' . $e->getMessage());
    respond(500, ['ok' => false, 'message' => 'Email could not be sent. Check smtp-settings.php and the Apache PHP error log.']);
}
