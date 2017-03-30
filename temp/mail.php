<?php
$telephone = $_POST['telephone'];
$whatsapp = $_POST['whatsapp'];
$skype = $_POST['skype'];
$email = $_POST['email'];

$postData = $_POST;

$pattern = [
    'individual' => 'Индивидуальный дизайн',
];

$postData['designType'] = (isset($pattern[$postData['designType']])) ? $pattern[$postData['designType']] : $pattern['individual'];

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

$file = __DIR__. '/message.php';

function renderPhpFile($_file_, $_params_ = [])
{
    ob_start();
    ob_implicit_flush(false);
    extract($_params_, EXTR_OVERWRITE);
    require($_file_);

    return ob_get_clean();
}

$message = renderPhpFile($file, ['data'=>$postData]);

$headers  = "Content-type: text/html; charset=UTF-8 \r\n";

$isSent = mail($to, $subject, $message, $headers);

if ($isSent) {
    echo 'Принято к доставке';
} else {
    echo 'Доставка отклонена';
}
?>