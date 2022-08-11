const MAKKA = {
    lng: 39.82621,
    lat: 21.42252,
};

function getQibla(Lng = 32.5486, Lat = 15.6569){
    const dLng = Lng-MAKKA.lng;
    return (360-rad2deg(getDirectionRad(deg2rad(Lat), deg2rad(MAKKA.lat), deg2rad(dLng))))%360;
}
function getDirectionRad(lat1, lat2, dLng) {
    return Math.atan2(Math.sin(dLng), Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng));
}

console.log(getQibla());