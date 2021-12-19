let modal;
const cross = document.querySelector('.card__cross_icon')
const inputSurname = document.querySelector('.card__input_surname')
const inputName = document.querySelector('.card__input_name')
const inputLastName = document.querySelector('.card__input_last-name')
const modalId = document.querySelector('.card__id')
// const addContactButton = document.querySelector('.card__button')
// const contactType = document.querySelector('.add-new-contact__select')
// const contactInput = document.querySelector('.add-new-contact__input')
// const deletContact = document.querySelector('.add-new-contact__close')
// const deletePerson = document.querySelector('.card__delete')
// const savePerson = document.querySelector('.card__save')
const title = document.querySelector('.card__title')
const contactBlick = document.querySelector('.card__add-contact')

cross.addEventListener('click', closeModal)



export function openModal(obj, persone = false) {
    modal = obj;
    obj.classList.remove('modal_none');
    if (persone) {
        inputName.value = persone.name;
        inputSurname.value = persone.surname;
        inputLastName.value = persone.lastName;
        modalId.textContent = `ID: ${persone.id}`
        title.textContent = ``

        renderContact(persone.contacts)
    }

}

function renderContact(arr) {
    arr.forEach(item => {
        const line = createContactLine(item);
        contactBlick.prepend(line);
    });
}

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

export function closeModal() {
    modal.classList.add('modal_none');
    clearForm()
}

function clearForm() {
    inputSurname.value = '';
    inputName.value = '';
    inputLastName.value = '';
    const arr = document.querySelectorAll('.add-new-contact__wrapper')
    arr.forEach(node => {
        node.remove()
    });
}
