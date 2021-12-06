
function sortArr(arr, parametr) {
    let sortedArr = arr;
    saveParamInLocalStorage(parametr);
    switch (parametr.type) {
        case 'id':
            sortedArr = sortById(arr, parametr.direction)
            break;

        case 'name':
            sortedArr = sortByName(arr, parametr.direction)
            break;

        case 'creative-date':
            sortedArr = sortByCreativeDate(arr, parametr.direction)
            break;

        case 'last-change':
            sortedArr = sortByLasrChange(arr, parametr.direction)
            break;

        default:
            break;
    }
    return sortedArr
}

function sortById(arr, direction) {
    const directionModificator = direction == 'up' ? 1 : -1;

    arr.sort(function (a, b) {
        return (a.id - b.id) * directionModificator
    });

    return arr
}

function sortByName(arr, direction) {
    const directionModificator = direction == 'up' ? 1 : -1;

    arr.forEach(obj => {
        obj.fullName = concatinationFullName(obj.surname, obj.name, obj.lastName)
    });

    arr.sort(function (a, b) {
        if (a.fullName > b.fullName) {
            return 1 * directionModificator;
        }
        if (a.fullName < b.fullName) {
            return -1 * directionModificator;
        }
        return 0;
    });

    return arr
}

function concatinationFullName(surname, name, lastName) {
    const fullName = `${surname.toLowerCase()} ${name.toLowerCase()} ${lastName.toLowerCase()}`;
    return fullName;
}

function sortByCreativeDate(arr, direction) {
    const directionModificator = direction == 'up' ? 1 : -1;
    arr.forEach(item => {
        item.creativeDate = new Date(item.createdAt);
        item.creativeDate = item.creativeDate.getTime()
    });
    arr.sort(function (a, b) {
        return (a.creativeDate - b.creativeDate) * directionModificator
    });

    return arr
}

function sortByLasrChange(arr, direction) {
    const directionModificator = direction == 'up' ? 1 : -1;
    arr.forEach(item => {
        item.lastChange = new Date(item.updatedAt);
        item.lastChange = item.lastChange.getTime()
    });
    arr.sort(function (a, b) {
        return (a.lastChange - b.lastChange) * directionModificator
    });

    return arr
}

function saveParamInLocalStorage(params) {
    localStorage.removeItem('sortParametr');
    localStorage.setItem('sortParametr', JSON.stringify(params))
    return true
}


export default sortArr