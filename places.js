var places = [
    {
        icon: ':burrito:',
        name: 'El Burrito',
        address: '5 Charlotte Place, W1T 1SF London',
        gmaps: 'https://goo.gl/maps/VNYtkEAjCRp',
        menu: 'http://elburritomestizo.com/menu_1.html',
        coord: '51.5188173,-0.1363211,20'
    },
    {
        icon: ':office:',
        name: 'The Cafe',
        address: 'You are already here',
        gmaps: 'https://goo.gl/maps/WzCgpZGz3382',
        menu: 'https://sites.google.com/a/imagination.com/fyi-europe/support-services/house-management/the-cafe',
        coord: '51.5181298,-0.1337517,18'
    },
    {name: 'Papaya',
     icon: ':rice:',
     address: '27 Goodge St, London W1T 2LD',
     gmaps: 'https://goo.gl/maps/wD7ZUcNxqon',
     menu: 'Cashew chicken makes you sleepy.',
     coord: '51.5196054,-0.1349551,21'},
    {name: 'Tesco',
     address: '10-16 Goodge St, London W1T 2QB',
     gmaps: 'https://goo.gl/maps/fXqBG2J6wHw',
     menu: "It's a salad club!",
     coord: '51.5199634,-0.1346351,21'},
    {name: 'Wasabi',
     icon: ':sushi:',
     address: '6-17 Tottenham Court Rd, Fitzrovia, London W1T 1BG',
     gmaps: 'https://goo.gl/maps/bE7rgxSM2iT2',
     menu: 'https://www.wasabi.uk.com/food',
     coord: '51.5172687,-0.1313764,21'},
    {name: 'Byron',
     icon: ':hamburger:',
     menu: 'https://www.byronhamburgers.com/menu/',
     address: '6 Store St, London WC1E 7DQ',
     gmaps: 'https://goo.gl/maps/QMJmK9JTVds',
     coord: '51.5202224,-0.1309785,21'},
    {name: 'Pizza Express',
     icon: ':pizza:',
     address: '7-9 Charlotte St, Fitzrovia, London W1T 1RG',
     gmaps: 'https://goo.gl/maps/DYn97duvHgJ2',
     menu: 'http://www.pizzaexpress.com/our-food/our-restaurant-menu/',
     coord: '51.5181619,-0.1347565,21'},
    {name: 'Wahaca',
     icon: ':burrito:',
     menu: 'http://www.wahaca.co.uk/menu/food/',
     address: '19-23 Charlotte St, London W1T 1RL',
     gmaps: 'https://goo.gl/maps/XXRJNJy2gs12',
     coord: '51.5186322,-0.1352403,21'},
    {name: 'Japanese Canteen',
     icon: ':ramen: :bento:',
     menu: 'http://www.thejapanesecanteen.co.uk/menu.html',
     address: '162 Tottenham Court Rd, London W1T 7NW',
     gmaps: 'https://goo.gl/maps/TX7pBrWtDNA2',
     coord: '51.5231317,-0.1365908,21'}];

var url = require('url');
exports.locations = listAllNames(places);
exports.random = random;
exports.recommend = recommend;
exports.details = details;

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
        // TODO: this needs to be secured for objects with missing attributes
        return [`${l.name} ${l.icon}`,
                'address: ' + l.address,
                'menu: ' + l.menu,
                'map: ' + l.gmaps,
                'citymapper: ' + _citymapperLink(l.coord)];
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

function _citymapperLink(endcoord, endname, endaddress) {
    if (typeof(endcoord) === 'undefined') {
        return null;
    }
    var query = {endcoord: endcoord};

    if (typeof(endname) !== 'undefined') {
        query.endname = endname;
    }
    if (typeof(endaddress) !== 'undefined') {
        query.endaddress = endaddress;
    }

    return url.format({protocol: 'https:',
                       slashes: true,
                       auth: null,
                       host: 'citymapper.com',
                       hash: null,
                       hostname: 'citymapper.com',
                       port: null,
                       query: query,
                       pathname: '/directions'});
}
