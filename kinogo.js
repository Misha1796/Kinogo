(function () {
    'use strict';

    // Функция поиска ссылки на Kinogo
    function searchKinogo(title, callback) {
        let query = encodeURIComponent(title);
        let url = 'https://kinogo.online/index.php?do=search&subaction=search&story=' + query;

        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Ищем ссылку на сериал или фильм
                let match = html.match(/href="(https:\/\/kinogo\.online\/serialy\/[^"]+\.html)"/i);
                if (!match) match = html.match(/href="(https:\/\/kinogo\.online\/film\/[^"]+\.html)"/i);
                callback(match ? match[1] : null);
            })
            .catch(() => callback(null));
    }

    // Открытие Kinogo через встроенный плеер Lampa
    function openKinogo(card) {
        let title = card.title || card.original_title || '';
        if (!title) {
            Lampa.Noty.show('Название фильма не найдено');
            return;
        }

        Lampa.Noty.show('Поиск на Kinogo...');
        searchKinogo(title, function(url) {
            if (!url) {
                Lampa.Noty.show('Не найдено на Kinogo');
                return;
            }

            // Запуск плеера Lampa
            Lampa.Player.play({
                title: title,
                url: url
            });
        });
    }

    // Добавляем кнопку в карточку фильма
    Lampa.Listener.follow('full', function(e) {
        if (e.type === 'complite') {
            let card = e.data.movie;

            e.object.append({
                title: '▶ Kinogo',
                icon: 'play',
                onSelect: function() {
                    openKinogo(card);
                }
            });
        }
    });
})();
