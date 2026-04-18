(function () {
    'use strict';

    function LampaKinoPlugin() {
        // Добавляем кнопку "Смотреть" в карточку фильма
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var render = e.object.render;
                var movie = e.object.movie;

                var button = $(`<div class="full-start__button selector">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12L7 20V4L21 12Z" fill="white"/>
                    </svg>
                    <span>Смотреть Онлайн</span>
                </div>`);

                button.on('hover:enter', function () {
                    // Отправляем запрос на наш PHP прокси
                    var proxy_url = 'https://твой-сайт.ru/parser.php?id=' + movie.id;
                    
                    Lampa.Noty.show('Ищу потоки...');

                    $.getJSON(proxy_url, function (data) {
                        if (data.data && data.data[0] && data.data[0].iframe_src) {
                            // Открываем видео. Lampa сама подхватит iframe или ссылку
                            Lampa.Player.play({
                                url: data.data[0].iframe_src,
                                title: movie.title || movie.name
                            });
                        } else {
                            Lampa.Noty.show('Видео пока не найдено');
                        }
                    });
                });

                $('.full-start__buttons', render).append(button);
            }
        });
    }

    // Инициализация
    if (window.app_ready) LampaKinoPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') LampaKinoPlugin(); });
})();
