new Promise(resolve => ymaps.ready(resolve))
  .then(() => init())

const myBalloon = document.querySelector(".review_block");
const closeButton = document.querySelector(".close_btn");
const addButton = document.querySelector(".add_btn");
const place = document.querySelector(".place");
const inputName = document.querySelector(".input__name");
const inputPlace = document.querySelector(".input__place");
const comments = document.querySelector(".review_text");
const inputText = document.querySelector(".input__text");
const placemarks = []; // для использования внутри внешней функции openBalloonFull().

function init() {
  let myPlacemark;
  let coordinates;
  const myMap = new ymaps.Map(
    "map",
    {
      center: [55.76, 37.64],
      zoom: 11,
      controls:['typeSelector','geolocationControl','routeButtonControl','zoomControl'],
    });
  // Создание кластера.
  const clusterer = new ymaps.Clusterer({
    groupByCoordinates: false,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false,
    clusterOpenBalloonOnClick: true,
    clusterBalloonContentLayout: "cluster#balloonCarousel",
    clusterBalloonPanelMaxMapArea: 0,
    clusterBalloonContentLayoutWidth: 300,
    clusterBalloonContentLayoutHeight: 350,
    clusterBalloonPagerSize: 10,
    clusterBalloonPagerType: "marker"
  });

  clusterer.add(placemarks);
  myMap.geoObjects.add(clusterer);

  myMap.behaviors.disable('scrollZoom');
  myMap.events.add("click", e => {
    const coords = e.get("coords");
    coordinates = coords;

    // Выводим окно с отзывами и формой.
    openBalloon();
    myPlacemark = createPlacemark(coords);
    getAddress(coords);
  });

  // Создание метки.
  function createPlacemark(coords) {
    return new ymaps.Placemark(coords);
  }

  // Определяем адрес по координатам 
  function getAddress(coords) {
    ymaps.geocode(coords).then(function(res) {
      const firstGeoObject = res.geoObjects.get(0);

      myPlacemark.properties.set({
        // Формируем строку с данными об объекте.
        iconCaption: [
          // Название населенного пункта или вышестоящее административно-территориальное образование.
          firstGeoObject.getLocalities().length
            ? firstGeoObject.getLocalities()
            : firstGeoObject.getAdministrativeAreas(),
        ],
        // В качестве контента балуна задаем строку с адресом объекта.
        balloonContent: firstGeoObject.getAddressLine()
      });
      // Записываем адресс обьекта в хедер окна.
      place.innerText = firstGeoObject.getAddressLine();
    });
  }

  addButton.addEventListener("click", () => {
    if (inputName.value && inputPlace.value && inputText.value) {
      // Получаем адрес отзыва.
      const placeLink = place.innerText;

      const date = new Date();
      let year = date.getFullYear();
      let month = `${date.getMonth() + 1}`;
      let day = `${date.getDate()}`;

      if (day.length === 1) day = `0${day}`;
      if (month.length === 1) month = `0${month}`;

      const currentTime = `${day}.${month}.${year}`;

      // Создаём метку.
      const newPlacemark = new ymaps.Placemark(
        coordinates,
        {
          balloonContentHeader: inputPlace.value,
          balloonContentBody: `<a onclick="openBalloonFull()" class="balloon__address_link">${placeLink}</a><br><br>${inputText.value}<br><br>`,
          balloonContentFooter: currentTime
        },
        {
          preset: "islands#blackDotIcon",
          draggable: false,
          openBalloonOnClick: false // Используем custom balloon.
        }
      );

      // Добавляем метку на карту, в кластер и массив placemarks.
      myMap.geoObjects.add(newPlacemark);
      clusterer.add(newPlacemark);
      placemarks.push(newPlacemark);

      // Обновляем содержимое нашего балуна
      if (comments.innerHTML === "Ваш отзыв") comments.innerHTML = "";
      newPlacemark.commentContent = `<div><span><b>${inputName.value}</b></span>
        <span class="ligth">${inputPlace.value}</span>
        <span class="ligth">${currentTime}</span><br>
        <span>${inputText.value}</span></div><br>`;
      comments.innerHTML += newPlacemark.commentContent;
      newPlacemark.place = place.innerText;

      // Очищаем инпуты.
      clearInputs();

      newPlacemark.events.add("click", () => {
        openBalloon();
        comments.innerHTML = newPlacemark.commentContent;
        place.innerText = newPlacemark.place;
      });
    } else {
      alert("Заполните все поля");
    }
  });
}

closeButton.addEventListener("click", () => {
  myBalloon.style.display = "none";
  clearInputs();
});

const clearInputs = () => {
  inputName.value = "";
  inputPlace.value = "";
  inputText.value = "";
};

// Наш кастомный балун.
const openBalloon = () => {
  myBalloon.style.top = event.clientY + "px";
  myBalloon.style.left = event.clientX + "px";
  myBalloon.style.display = "block";
};

// Балун с контентом из placemarks.
const openBalloonFull = () => {
  place.innerText = "";
  comments.innerHTML = "";
  const placeLink = document.querySelector(".balloon__address_link");

  for (let i = 0; i < placemarks.length; i++) {
    if (placeLink.innerText === placemarks[i].place) {
      place.innerText = placemarks[i].place;
      comments.innerHTML += placemarks[i].commentContent;
    }
  }

  myBalloon.style.top = event.clientY + "px";
  myBalloon.style.left = event.clientX + "px";
  myBalloon.style.display = "block";
};