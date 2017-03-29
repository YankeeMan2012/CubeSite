<?php
$telephone = $_POST['telephone'];
$whatsapp = $_POST['whatsapp'];
$skype = $_POST['skype'];
$email = $_POST['email'];

$link = '';
if (isset($telephone)) {
    $link = 'телефону: ' . $telephone;
} elseif (isset($whatsapp)) {
    $link = 'WhatSapp: ' . $whatsapp;
} elseif (isset($skype)) {
    $link = 'Skype: ' . $skype;
} elseif (isset($email)) {
    $link = 'E-mail: ' . $email;
}

$to  = "yankeeman2012@mail.ru";

$subject = "Обратная связь YoRich";

$message = '<html>
                <head>
                    <title>Клиент просит, чтобы с ним связались:</title>
                </head>
                <body>
                    <p>Клиент просит, чтобы с ним связались:</p>
                    <p>Клиенту удобна связь по '. $link .'</p>
                </body>
            </html>';

$headers  = "Content-type: text/html; charset=UTF-8 \r\n";

$isSent = mail($to, $subject, $message, $headers);
if ($isSent) {
    echo 'Принято к доставке';
} else {
    echo 'Доставка отклонена';
}
?>