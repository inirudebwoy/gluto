var places = require('./places.json');

exports.locations = listAllNames(places);
exports.random = random;
exports.recommend = recommend;
exports.details = details;
exports.exists = exists;

function listAllNames(placesList) {
    return placesList.reduce(function(previousValue, currentValue, currentIndex, array) {
        previousValue.push(currentValue.name);
        return previousValue;
    }, []);
}

function random() {
    return _random(places);
}

function recommend() {
    return _recommend(places);
}

function details(name) {
    return _details(name, places);
}

function _recommend(list) {
    return random(list);
}

function _random(list) {
    return list[Math.floor(Math.random() * list.length)].name;
}

function _details(name, placesList) {
    // TODO: maybe try to add new place if name is not found
    var match = _match(name, placesList);

    if (match.length !== 0) {
        var l = match[0];
        return [`${l.name} ${l.icon}`,
                'address: ' + l.address,
                'menu: ' + l.menu];
    } else {
        return ['Location not found.'];
    }
}

function _match(name, list) {
    return list.filter(
        function(item) {
            return item.name.toLowerCase() === name.toLowerCase();
        });
}

function exists(name) {
    return _exists(name, places);
}

function _exists(name, list) {
    var found = _match(name, list);
    if (found.length > 0) {
        return true;
    } else {
        return false;
    }
}
