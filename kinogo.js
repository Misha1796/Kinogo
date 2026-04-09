(function () {
    'use strict';

    function searchKinogo(title, year, callback) {
        let query = encodeURIComponent(title + ' ' + (year || ''));
        let url = 'https://kinogo.online/index.php?do=search&subaction=search&story=' + query;

        fetch(url, {
            method: 'GET'
        })
        .then(r => r.text())
        .then(html => {
            let match = html.match(/href="(https:\/\/kinogo\.online\/[^"]+\.html)"/);
            if (match) callback(match[1]);
            else callback(null);
        })
        .catch(() => callback(null));
    }

    function openKinogo(card) {
        let title = card.title || card.original_title;
        let year = card.release_date ? card.release_date.split('-')[0] : '';

        Lampa.Noty.show('Поиск Kinogo...');

        searchKinogo(title, year, function (url) {
            if (!url) {
                Lampa.Noty.show('Не найдено на Kinogo');
                return;
            }

            Lampa.Player.play({
                title: title,
                url: url
            });
        });
    }

    Lampa.Listener.follow('full', function (e) {
        if (e.type == 'complite') {
            let card = e.data.movie;

            e.object.append({
                title: '▶ Kinogo',
                icon: 'play',
                onSelect: function () {
                    openKinogo(card);
                }
            });
        }
    });
})();
