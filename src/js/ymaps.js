ymaps.ready(init);
function init(){
    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        controls:['typeSelector','geolocationControl','routeButtonControl','zoomControl'],
        zoom: 11
      });
      myMap.behaviors.disable('scrollZoom');


      myMap.events.add('click', function (e) {
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
            myMap.balloon.open(coords, {
                contentHeader:[`<div class="review_block">
                <h3>Отзыв:</h3>
                <input type="text" class="input" placeholder="Укажите ваше имя">
                <input type="text" class="input" placeholder="Укажите место">
                <textarea class="review" placeholder="Оставить отзыв"></textarea>
                <button class="btn">Добавить</button>
                </div>`]
            });
        }
        else {
            myMap.balloon.close();
        }
    });
}