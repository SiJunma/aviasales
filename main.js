const formSearch = document.querySelector('.form-search'),
      inputCitiesForm = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
      proxy = 'https://cors-anywhere.herokuapp.com/',
      API_KEY = '481fac61cd22564d978b8acf86176d6a',
      calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });
    request.send();
};

const showCity = (input, list) => {
    list.textContent = '';
    if (input.value == '') return;

    const filterCity = city.filter((item) => {
        // if (item.name) {
            const fixItem = item.name.toLowerCase();
            const fixItemEn = item.name_translations.en.toLowerCase();
            return fixItem.includes(input.value.toLowerCase()) || fixItemEn.includes(input.value.toLowerCase());

    });

    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);
    });
};

const selectCity = (evt, input, list) => {
    const target = evt.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};

inputCitiesForm.addEventListener('input', () => {
    showCity(inputCitiesForm, dropdownCitiesFrom)
});

dropdownCitiesFrom.addEventListener('click', (evt) => {
    selectCity(evt, inputCitiesForm, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesTo.addEventListener('click', (evt) => {
    selectCity(evt, inputCitiesTo, dropdownCitiesTo)
});

getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
});

// getData(proxy + citiesApi, data => city = JSON.parse(data).filter(item => item.name));