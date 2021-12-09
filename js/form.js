let modal;


export function openModal(obj, persone) {
    console.log(persone)
    const 
    modal = obj;
    obj.classList.remove('modal_none');
}

export function closeModal() {
    modal.classList.add('modal_none');
    clearForm()
}

function clearForm() {
    console.log(modal.children[1])

}