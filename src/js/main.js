let requestURL = 'http://localhost:3000/js/dynamic-data.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function () {
    console.log("JSON load complete");
    const dynamicData = request.response;
    populateFeaturedWork(dynamicData);
}

function populateFeaturedWork(obj) {
    const name = obj['name'];
    console.log(name);
}

window.onload = function () {

}