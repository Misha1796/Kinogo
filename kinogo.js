(function() {
    'use strict';

    // Добавляем кнопку ▶ Kinogo в карточку фильма
    function addKinogoButton(card, object) {
        object.append({
            title: '▶ Kinogo',
            icon: 'play',
            onSelect: function() {
                if(!card.title){
                    Lampa.Noty.show('Название фильма не найдено');
                    return;
                }
                Lampa.Noty.show('Поиск на Kinogo...');
                searchKinogo(card.title, function(url){
                    if(url){
                        Lampa.Player.play({title: card.title, url: url});
                    } else {
                        Lampa.Noty.show('Фильм не найден на Kinogo');
                    }
                });
            }
        });
    }

    // Функция поиска ссылки на Kinogo
    function searchKinogo(title, callback){
        var query = encodeURIComponent(title);
        var url = 'https://kinogo.online/index.php?do=search&subaction=search&story=' + query;

        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Сначала ищем сериал, затем фильм
                var match = html.match(/href="(https:\/\/kinogo\.online\/serialy\/[^"]+\.html)"/i);
                if(!match) match = html.match(/href="(https:\/\/kinogo\.online\/film\/[^"]+\.html)"/i);
                callback(match ? match[1] : null);
            })
            .catch(() => callback(null));
    }

    // Отслеживаем открытие карточки фильма
    Lampa.Listener.follow('full', function(e){
        if(e.type === 'complite'){
            var card = e.data.movie;
            addKinogoButton(card, e.object);
        }
    });

})();
