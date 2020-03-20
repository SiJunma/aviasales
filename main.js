const formSearch = document.querySelector('.form-search'),
      inputCitiesForm = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart'),
      cheapestTicket = document.getElementById('cheapest-ticket'),
      otherCheapTickets = document.getElementById('other-cheap-tickets');

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
            const fixItem = item.name.toLowerCase();
            const fixItemEn = item.name_translations.en.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());

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

const getNameCity = (code) => {
    const objCity = city.find(item => item.code === code);
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="https://www.aviasales.ru/search/" class="button button__buy">Купить
                        за ${data.value}₽</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">Вылет из города:
                            <span class="city__name">${getNameCity(data.origin)}</span>
                        </div>
                        <div class="date">${getDate(data.depart_date)}</div>
                    </div>
            
                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="city__to">Город назначения:
                            <span class="city__name">${getNameCity(data.destination)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        deep = '<h3>К сожалению, на желаемую дату билетов не нашлось.</h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
 
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    cheapTickets.sort((a, b) => a.value - b.value);

    if (cheapTickets.length > 1) {
        for (i = 0; i < 5; i++) {
            const ticket = createCard(cheapTickets[i]);
            otherCheapTickets.append(ticket);
        }
    } else {
        const ticket = document.createElement('article');
        ticket.classList.add('ticket');
        const deep = '<h3>Билетов нет вообще, чувак</h3>';
        ticket.insertAdjacentHTML('beforeend', deep);
        otherCheapTickets.append(ticket);
    }
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
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

formSearch.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const cityFrom = city.find((item) => {
        return inputCitiesForm.value === item.name
    }),
            //Новый синтаксис с таким же результатом:
          cityTo = city.find((item) => inputCitiesTo.value === item.name);

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value
    };

    if (formData.from && formData.to) {

        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${API_KEY}`;

        //Старый формат строчки:
        // const requestData2 = '?depart_date=' + formData.when + '&origin=' + formData.from + '&destination=' + formData.to + '&one_way=true&token=' + API_KEY;

        getData(calendar + requestData, (response) => {
            renderCheap(response, formData.when);
        });
    } else {
        alert('Введите корректное название города');
    }
});

getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });

    city.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
});

//Новый формат функции с одним return и одним параметром:
// getData(proxy + citiesApi, data => city = JSON.parse(data).filter(item => item.name));
