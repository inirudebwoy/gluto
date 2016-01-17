var list = ['El Burrito', 'The Cafe', 'Papaya', 'Tesco', 'Wasabi', 'Byron',
            'Pizza Express', 'Wahaca'];
// var places = {
//     name: 'El Burrito',
//     address: 'adres'};

exports.places = list;
exports.random = random;
exports.recommend = recommend;


function recommend() {
    return random();
}

function random() {
    return list[Math.floor(Math.random() * list.length)];
}
