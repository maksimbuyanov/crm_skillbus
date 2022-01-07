const API = 'http://localhost:3000/api/clients'

export async function deletePerson(id) {
  let url = API+`/${id}`
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return response
}

export async function addNewPerson(obj) {
  let url = API
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...obj})
  });
  return response
}

export async function patchPerson(obj, id) {
  let url = API+`/${id}`
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...obj})
  });
  return response
}
