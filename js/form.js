import { addNewPerson, deletePerson } from "./api.js";

let modal;
const MAX_CONTACT_COUNT = 10;
const cross = document.querySelector('.card__cross_icon')
const inputSurname = document.querySelector('.card__input_surname')
const inputName = document.querySelector('.card__input_name')
const inputLastName = document.querySelector('.card__input_last-name')
const addContactButton = document.querySelector('.card__button')
// const contactType = document.querySelector('.add-new-contact__select')
// const contactInput = document.querySelector('.add-new-contact__input')
// const deletContact = document.querySelector('.add-new-contact__close')
const deletePersonBtn = document.querySelector('.card__delete')
const savePersonBtn = document.querySelector('.card__save')
const title = document.querySelector('.card__title')
const contactBlick = document.querySelector('.card__add-contact')
let personId

cross.addEventListener('click', closeModal)



export function openModal(obj, persone = false) {
  modal = obj;
  obj.classList.remove('modal_none');
  if (persone) {
    inputName.value = persone.name;
    inputSurname.value = persone.surname;
    inputLastName.value = persone.lastName;
    title.textContent = `Изменить данные `
    const modalId = document.createElement('span')
    modalId.textContent = `ID: ${persone.id}`
    personId = persone.id
    modalId.classList.add('card__id')
    title.append(modalId)

    renderContact(persone.contacts)
  }

}

function renderContact(arr) {
  arr.forEach(item => {
    const line = createContactLine(item);
    line.children[line.children.length - 1].addEventListener('click', () => {
      const arr = document.querySelectorAll('.add-new-contact__wrapper')
      let el
      arr.forEach(item => {
        if (item.childNodes[1].value === line.childNodes[1].value) {
          el = item
        }
      })
      el.remove()
    })
    contactBlick.prepend(line);
  });
  if (contactBlick.childElementCount > MAX_CONTACT_COUNT) {
    addContactButton.classList.add('modal_none')
  }
}

addContactButton.addEventListener('click', () => {
  const line = createContactLine({ value: '' })
  contactBlick.prepend(line)
  if (contactBlick.childElementCount > MAX_CONTACT_COUNT) {
    addContactButton.classList.add('modal_none')
  }
})

function createContactLine(item) {
  const wrap = document.createElement('div');
  wrap.classList.add('add-new-contact__wrapper');

  const select = document.createElement('select');
  select.classList.add('add-new-contact__select');
  const optionTel = createOption('tel', 'Телефон', 'add-new-contact__option')
  const optionVk = createOption('vk', 'Vk', 'add-new-contact__option')
  const optionFb = createOption('fb', 'Facebook', 'add-new-contact__option')
  const optionMail = createOption('mail', 'E-mail', 'add-new-contact__option')
  const optionOther = createOption('other', 'Другие контакты', 'add-new-contact__option')
  select.append(optionTel, optionVk, optionFb, optionMail, optionOther);
  select.value = item.type
  if (!select.value) {
    select.value = 'other'
  }
  wrap.append(select)

  const input = document.createElement('input');
  input.type = 'text';
  input.classList = 'add-new-contact__input';
  input.value = item.value
  wrap.append(input)

  const button = document.createElement('button');
  button.classList = 'add-new-contact__close';
  const cross = document.createElement('span');
  cross.classList.add('add-new-contact__close-icon', 'icon')
  button.append(cross);
  wrap.append(button)

  return wrap
}

function createOption(val, text, classList) {
  const option = document.createElement('option');
  option.value = val
  option.textContent = text
  option.classList.add(classList);
  return option
}

savePersonBtn.addEventListener('click', () => {
  savePerson()
})

function savePerson() {
  const serName = inputSurname.value
  const name = inputName.value
  const lastName = inputLastName.value
  const contacts = []
  const arr = document.querySelectorAll('.add-new-contact__wrapper')
  arr.forEach(item => {
    const contact = {
      type: item.children[0].value,
      value: item.children[1].value
    }
    contacts.push(contact)
  })
  addNewPerson({
    name: name,
    surname: serName,
    lastName: lastName,
    contacts: contacts
  })
    .then(() => {
      closeModal()
    })
    .catch((error) => console.log(error))

}

deletePersonBtn.addEventListener('click', () => {
  const result = deletePerson(personId)
    .then(() => {
      closeModal()
    })
    .catch((error) => console.log(error))
})

export function closeModal() {
  modal.classList.add('modal_none');
  clearForm()
}

function clearForm() {
  personId = null;
  title.textContent = 'Новый клиент'
  inputSurname.value = '';
  inputName.value = '';
  inputLastName.value = '';
  addContactButton.classList.remove('modal_none')
  const arr = document.querySelectorAll('.add-new-contact__wrapper')
  arr.forEach(node => {
    node.remove()
  });
}
