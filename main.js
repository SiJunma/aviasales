const formSearch = document.querySelector('.form-search'),
      inputCitiesForm = formSearch.querySelector('.input__cities-from'),
      dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
      inputCitiesTo = formSearch.querySelector('.input__cities-to'),
      dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
      inputDateDepart = formSearch.querySelector('.input__date-depart');

const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск', 'Керчь', 'Волгоград', 'Самара', 'Днепропетровск', 'Екатеринбург', 'Одесса', 'Ухань', 'Шымкен', 'Нижний Новгород', 'Калининград', 'Вроцлав', 'Ростов-на-Дону', 'Волгоград', 'Киев', 'Харьков', 'Львов'];

const showCity = (input, list) => {
    list.textContent = '';
    if (input.value == '') return;

    const filterCity = city.filter((item) => {
        const fixItem = item.toLowerCase();
        return fixItem.includes(input.value.toLowerCase());
    });

    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item;
        list.append(li);
    });
};

const addCity = (target, input, list) => {
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};

inputCitiesForm.addEventListener('input', () => {
    showCity(inputCitiesForm, dropdownCitiesFrom)
});

dropdownCitiesFrom.addEventListener('click', (evt) => {
    const target = evt.target;
    addCity(target, inputCitiesForm, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesTo.addEventListener('click', (evt) => {
    const target = evt.target;
    addCity(target, inputCitiesTo, dropdownCitiesTo)
});