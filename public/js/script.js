
const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker = {};

socket.on('receive-location', (data) => {
    map.setView([data.latitude, data.longitude], 16);
    if (marker[data.id]) {
        marker[data.id].setLatLng([data.latitude, data.longitude]);
    } else {
        marker[data.id] = L.marker([data.latitude, data.longitude]).addTo(map);
    }
});

socket.on('user-disconnected', (id) => {
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});

