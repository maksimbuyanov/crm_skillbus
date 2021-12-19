"use strict"
import sortArr from './sort.js'
import { openModal, closeModal } from './form.js';

const API = 'http://localhost:3000/api/clients'
const table = document.querySelector('.content__table');
const legendId = document.querySelector('.legend__id');
const legendName = document.querySelector('.legend__name');
const legendCreativeDate = document.querySelector('.legend__creative-date');
const legendLastChange = document.querySelector('.legend__last-change');
const legendContacts = document.querySelector('.legend__contacts');
const searchInput = document.querySelector('.header__search');
const addClientBtn = document.querySelector('.content__add-client');
const modal = document.querySelector('.modal');
const modalWindow = document.querySelector('.modal__card');
const modalBg = document.querySelector('.modal__background');

addClientBtn.addEventListener('click', () => {
  openModal(modal)
})

modalBg.addEventListener('click', () => {
  closeModal()
})

let arrForRender = [];
let sortParam = { type: 'id', direction: 'up' };

function loadSortParam() {
  if (localStorage['sortParametr']) {
    sortParam = JSON.parse(localStorage.getItem('sortParametr'));
  };
};


// Так хранятся в BD
// {
//   "name": "Maksim",
//   "surname": "Buyanov",
//   "lastName": "Olegovich",
//   "id": "1636979915865",
//   "updatedAt": "2021-11-15T12:38:35.865Z",
//   "createdAt": "2021-11-15T12:38:35.865Z"
//   "contacts": [
//     { "type": "tel", "value": "+79059756549" },
//     { "type": "mail", "value": "maksim.buyanov@gmail.com" },
//     { "type": "vk", "value": "@maks.buyanov" },
//     { "type": "twitter", "value": "some-one twitter" }
//   ],
// }

async function addClient() {
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Anna',
      surname: 'Buyanova',
      lastName: 'Alekseevna',
      contacts: [
        { type: "tel", value: "+Kis-kis-kis" },
      ]
    })
  });
  const data = await response.json();
  console.log(data);
};

async function getClients(param = null) {
  let url = API
  const type = typeof param;
  switch (type) {
    case ('string'):
      const query = `?search=${param}`
      url += query;
      break;

    case ('number'):
      const id = `/${param}`
      url += id;
      break;

    default:
      break;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data;
};

async function renderFirstOpen() {
  loadSortParam()
  let arrForSortedFn = await getClients();
  const sortedArr = sortArr(arrForSortedFn, sortParam);
  renderClients(sortedArr)
};

function renderClients(array) {
  (function removeAllChildren() {
    if (table.childElementCount > 0) {
      table.removeChild(table.children[0])
      removeAllChildren()
    }
  })()
  const list = document.createElement('ul');
  list.classList.add('table__list');

  array.forEach(element => {
    const item = createTableLine(element)
    list.append(item);
  });
  table.append(list)

  tippy(document.querySelectorAll('[data-tippy-content]'));
};

function createTableLine(obj) {
  const item = document.createElement('li');
  item.classList.add('table__item')

  if (obj.error) {
    const error = document.createElement('div');
    error.textContent = obj.error;
    error.classList.add('table__error');
    item.append(error);
    return item
  }

  let id = document.createElement('div');
  id.textContent = obj.id;
  id.classList.add('table__id')
  item.append(id);

  const fullName = concatinationFullName(obj.surname, obj.name, obj.lastName)
  let name = document.createElement('div');
  name.textContent = fullName;
  name.classList.add('table__name');
  item.append(name);

  let creativeDate = parseDateForRender(obj.createdAt);
  creativeDate.classList.add('table__creative-date');
  item.append(creativeDate);

  let lastChange = parseDateForRender(obj.updatedAt);
  lastChange.classList.add('table_last-change');
  item.append(lastChange);
  let contacts = renderContacts(obj.contacts);
  contacts.classList.add('table__contacts');
  item.append(contacts)

  let actions = document.createElement('div');
  actions.classList.add('table__actions');
  const buttonChange = createButton('change');
  buttonChange.addEventListener('click', async () => {
    const person = await getClients(+obj.id)
    openModal(modal, person)
  })
  const buttonDelete = createButton('delete');
  buttonDelete.addEventListener('click', () => {
    deleteClient(obj.id);
  })
  actions.append(buttonChange, buttonDelete);
  item.append(actions);

  return item
};

function concatinationFullName(surname, name, lastName) {
  const fullName = `${surname} ${name} ${lastName}`;
  return fullName;
};

function parseDateToStr(date) {
  let str = new Date(date);
  const yearShortNote = str.getFullYear().toString().slice(-2);
  const month = str.getMonth() + 1;
  const day = str.getDate();
  const hour = str.getHours();
  const min = str.getMinutes();
  const result = {
    fullDate: `${day}.${month}.${yearShortNote}`,
    fullTime: `${hour}:${min}`
  }
  return result
}

function parseDateForRender(date) {
  const dateStr = parseDateToStr(date);
  const parent = document.createElement('div');

  let fullDate = document.createElement('span');
  fullDate.classList.add('table__date');
  let fullTime = document.createElement('span');
  fullTime.classList.add('table__time');

  fullDate.textContent = dateStr.fullDate;
  fullTime.textContent = dateStr.fullTime;

  parent.append(fullDate, fullTime)
  return parent
};

function renderContacts(arr) {
  const parent = document.createElement('div');
  parent.classList.add('table__contacts');
  arr.forEach(element => {
    const a = document.createElement('a');
    const item = document.createElement('span');
    item.classList.add('icon');
    switch (element.type) {
      case 'tel':
        item.classList.add('contact_phone');
        item.setAttribute('data-tippy-content', element.value);
        a.setAttribute('href', `tel:${element.value}`);
        a.append(item);
        break;
      case 'vk':
        item.classList.add('contact_vk');
        item.setAttribute('data-tippy-content', element.value);
        a.setAttribute('href', `https://vk.com/${element.value}`);
        a.append(item);
        break;
      case 'fb':
        item.classList.add('contact_fb');
        item.setAttribute('data-tippy-content', element.value);
        a.setAttribute('href', `https://www.facebook.com/${element.value}`);
        a.append(item);
        break;
      case 'mail':
        item.classList.add('contact_mail');
        item.setAttribute('data-tippy-content', element.value);
        a.setAttribute('href', `mailto:${element.value}`);
        a.append(item);
        break;

      default:
        item.classList.add('contact_other');
        let content = `${element.type} : ${element.value}`;
        item.setAttribute('data-tippy-content', content);
        a.setAttribute('href', element.value);
        a.append(item);
        break;
    }
    parent.append(a);
  });
  return parent
};

function createButton(type) {
  const button = document.createElement('button');
  const icon = document.createElement('span');
  icon.classList.add('icon')

  switch (type) {
    case 'change':
      button.textContent = 'Изменить';
      icon.classList.add('table__change_icon');
      button.classList.add('table__change');
      break;

    case 'delete':
      icon.classList.add('table__delete_icon');
      button.textContent = 'Удалить';
      button.classList.add('table__delete');
      break;

    case 'new':

      break;

    case 'oth':

      break;

    default:
      break;
  }
  button.prepend(icon);


  return button
};

legendId.addEventListener('click', async function () {
  sortParam.type = 'id';
  searchInput.value = '';
  let setDirection = this.children[1].classList.contains('legend__arrow-up');
  if (setDirection) {
    sortParam.direction = 'down';
    this.children[1].classList.remove('legend__arrow-up');
    this.children[1].classList.add('legend__arrow-down');
  }
  else {
    sortParam.direction = 'up';
    this.children[1].classList.remove('legend__arrow-down');
    this.children[1].classList.add('legend__arrow-up');
  }
  const arrForSortedFn = await getClients();
  const sortedArr = sortArr(arrForSortedFn, sortParam);
  renderClients(sortedArr);
});

legendName.addEventListener('click', async function () {
  sortParam.type = 'name';
  searchInput.value = '';
  let setDirection = this.children[1].classList.contains('legend__arrow-up');
  if (setDirection) {
    sortParam.direction = 'down';
    this.children[1].classList.remove('legend__arrow-up');
    this.children[1].classList.add('legend__arrow-down');
  }
  else {
    sortParam.direction = 'up';
    this.children[1].classList.remove('legend__arrow-down');
    this.children[1].classList.add('legend__arrow-up');
  }
  const arrForSortedFn = await getClients();
  const sortedArr = sortArr(arrForSortedFn, sortParam);
  renderClients(sortedArr);
});

legendCreativeDate.addEventListener('click', async function () {
  sortParam.type = 'creative-date';
  searchInput.value = '';
  let setDirection = this.children[1].classList.contains('legend__arrow-up');
  if (setDirection) {
    sortParam.direction = 'down';
    this.children[1].classList.remove('legend__arrow-up');
    this.children[1].classList.add('legend__arrow-down');
  }
  else {
    sortParam.direction = 'up';
    this.children[1].classList.remove('legend__arrow-down');
    this.children[1].classList.add('legend__arrow-up');
  }
  const arrForSortedFn = await getClients();
  const sortedArr = sortArr(arrForSortedFn, sortParam);
  renderClients(sortedArr);
});

legendLastChange.addEventListener('click', async function () {
  sortParam.type = 'last-change';
  searchInput.value = '';
  let setDirection = this.children[1].classList.contains('legend__arrow-up');
  if (setDirection) {
    sortParam.direction = 'down';
    this.children[1].classList.remove('legend__arrow-up');
    this.children[1].classList.add('legend__arrow-down');
  }
  else {
    sortParam.direction = 'up';
    this.children[1].classList.remove('legend__arrow-down');
    this.children[1].classList.add('legend__arrow-up');
  }
  const arrForSortedFn = await getClients();
  const sortedArr = sortArr(arrForSortedFn, sortParam);
  renderClients(sortedArr);
});


searchInput.addEventListener('input', () => {
  const value = searchInput.value
  timer(value);
})

function debounce() {
  let id = null;
  return function (value) {
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      enterInput(value);
      id = null;
    }, 300)
  }
}

let timer = debounce()

async function enterInput(value) {
  const arrForSortedFn = await getClients(value);
  const sortedArr = sortArr(arrForSortedFn, sortParam);
  renderClients(sortedArr);
}

async function deleteClient(id) {
  const url = API + `/${id}`;
  let isOkey
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  isOkey = response.status === 200 ? true : false;

  if (isOkey) {
    renderFirstOpen()
  } else {
    console.log('Ошибка во время удаления')
  }
}



document.addEventListener('DOMContentLoaded', () => {
  renderFirstOpen();
})