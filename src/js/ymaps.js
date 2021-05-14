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
                contentHeader:'ОПА ты кликнул',
            });
        }
        else {
            myMap.balloon.close();
        }
    });
}