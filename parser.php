<?php
header('Access-Control-Allow-Origin: *'); // Разрешаем Lampa обращаться к скрипту
header('Content-Type: application/json');

$tmdb_id = $_GET['id'] ?? '';

if (!$tmdb_id) {
    echo json_encode(['error' => 'No ID provided']);
    exit;
}

// В этом месте мы эмулируем запрос к базе видео
// Для примера используем открытый API одного из балансеров (например, Videocdn или похожий)
$api_url = "https://videocdn.tv/api/short?api_token=ВАШ_ТОКЕН&tmdb_id=" . $tmdb_id;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Эмулируем браузер, чтобы сайт не блокировал нас
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

$response = curl_exec($ch);
curl_close($ch);

echo $response;
