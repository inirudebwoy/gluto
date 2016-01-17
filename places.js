var places = [
    {icon: ':burrito:',
    name: 'El Burrito',
    address: '5 Charlotte Place, W1T 1SF London https://goo.gl/maps/VNYtkEAjCRp',
    menu: 'http://elburritomestizo.com/menu_1.html',
    price_range: '4-9'},
    {icon: ':office:',
    name: 'The Cafe',
    address: 'You are already here https://goo.gl/maps/WzCgpZGz3382',
    menu: 'https://sites.google.com/a/imagination.com/fyi-europe/support-services/house-management/the-cafe',
    price_range: '4.25'},
    {name: 'Papaya',
     icon: ':rice:',
     address: '27 Goodge St, London W1T 2LD https://goo.gl/maps/wD7ZUcNxqon',
     menu: 'Cashew chicken makes you sleepy.'},
    {name: 'Tesco',
     address: '10-16 Goodge St, London W1T 2QB https://goo.gl/maps/fXqBG2J6wHw',
     menu: "It's a salad club!"},
    {name: 'Wasabi',
     icon: ':sushi:',
     address: '6-17 Tottenham Court Rd, Fitzrovia, London W1T 1BG https://goo.gl/maps/bE7rgxSM2iT2',
     menu: 'https://www.wasabi.uk.com/food'},
    {name: 'Byron',
     icon: ':hamburger:',
     menu: 'https://www.byronhamburgers.com/menu/',
     address: '6 Store St, London WC1E 7DQ https://goo.gl/maps/QMJmK9JTVds'},
    {name: 'Pizza Express',
     icon: ':pizza:',
     address: '7-9 Charlotte St, Fitzrovia, London W1T 1RG https://goo.gl/maps/DYn97duvHgJ2',
     menu: 'http://www.pizzaexpress.com/our-food/our-restaurant-menu/'},
    {name: 'Wahaca',
     icon: ':burrito:',
     menu: 'http://www.wahaca.co.uk/menu/food/',
     address: '19-23 Charlotte St, London W1T 1RL https://goo.gl/maps/XXRJNJy2gs12'},
    {name: 'Japanese Canteen',
     icon: ':ramen: :bento:',
     menu: 'http://www.thejapanesecanteen.co.uk/menu.html',
     address: '162 Tottenham Court Rd, London W1T 7NW https://goo.gl/maps/TX7pBrWtDNA2'}];

exports.locations = listAll();
exports.random = random;
exports.recommend = recommend;
exports.details = details;

function listAll() {
    return places.reduce(function(previousValue, currentValue, currentIndex, array) {
        previousValue.push(currentValue.name);
        return previousValue;
    }, []);
}

function recommend() {
    return random();
}

function random() {
    var list = listAll();
    return list[Math.floor(Math.random() * list.length)];
}

function details(name) {
    // TODO: maybe try to add new place if name is not found
    var match = places.filter(function(item) {
        return item.name.toLowerCase() === name.toLowerCase()
    });

    if (match.length !== 0) {
        var l = match[0];
        return [`${l.name} ${l.icon}`,
                'address: ' + l.address,
                'menu: ' + l.menu];
    } else {
        return ['Location not found.'];
    }
}
