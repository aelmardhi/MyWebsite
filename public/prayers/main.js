/*
* this file is a copy of the files
* prayers.js
* qibla.js
* degHelpers
*
*this is done to import one file 
*/

function prayerTimes( Lng = 32.5486, Lat = 15.6569, TimeZone = 2){ //default to Khartoum North, Sudan
    const unixDate = new Date().getTime()

    const jd = unixDate / 86400000 + 2440587.5;

    const d = jd - 2451545.0;  // jd is the given Julian date 

    const g = ((357.529 + 0.98560028* d)%360+360)%360;//Mean anomaly of the Sun:
    const q = ((280.459 + 0.98564736* d)%360+360)%360;//Mean longitude of the Sun:
    const L = ((q + 1.915* sin(g) + 0.020* sin(2*g))%360+360)%360; //Geocentric apparent ecliptic longitude of the Sun (adjusted for aberration):
    // the eccentricity of the Earth's orbit around the Sun, which is about 0.0167.
    // the obliquity of the ecliptic (the plane of the Earth's annual orbital motion around the Sun), which is inclined by about 23.44
    const R = 1.00014 - 0.01671* cos(g) - 0.00014* cos(2*g); //The distance of the Sun from the Earth
    const e = 23.439 - 0.00000036* d; //First compute the mean obliquity of the ecliptic, in degrees:
    const RA = atan2(cos(e)* sin(L), cos(L))/ 15; //Then the Sun's right ascension, RA

    const D = asin(sin(e)* sin(L));  // declination of the Sun
    const EqT = q/15 - RA;  // equation of time
    
    const SD = 0.2666 / R
    const Dhuhr = 12 + TimeZone - Lng/15 - EqT
    const Sunrise = Dhuhr - T(0.833,Lat, D)
    const Sunset = Dhuhr + T(0.833, Lat ,D)
    const Fajr = Dhuhr - T(18,Lat,D) 
    const Isha = Dhuhr + T(17, Lat,D)
    const  Asr = Dhuhr + A(1, Lat, D)
    // const Maghrib = Dhuhr + T(4) // for sheea
    const Maghrib = Sunset
    const Midnight = 1/2*(24+Sunrise - Sunset)+Sunset
    // console.log(printPrayerTimes({Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha,Midnight}))
    // console.log(printTime(Dhuhr), Sunset, Sunrise, Fajr)
    return printPrayerTimes({Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha,Midnight})
}



function printPrayerTimes({Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha,Midnight}){
    return{
        'Fajr': printTime(Fajr),
        'Sunrise': printTime(Sunrise),
        'Dhuhr': printTime(Dhuhr),
        'Asr': printTime(Asr),
        'Maghrib': printTime(Maghrib),
        'Isha': printTime(Isha),
        'Midnight': printTime(Midnight),
    }
}
function printTime(t){
    t = (t+24)%24
    const temp = ((t - t%1)*60)%1
    const h = Math.floor(t)
    const m = Math.floor((t-h)*60)
    return ((h>9?h:('0'+h))+':' +(m > 9? m: ('0'+m)))
}

function T(a, L, D){
    const dnom = cos(L)*cos(D)
    const nom = -sin(a) - sin(L)*sin(D)
    const arccos = acos((nom 
        /dnom))
    return 1/15* arccos
}
    
function A(t, L, D){
    const dnom = cos(L)*cos(D)
    const nom = sin( acot(t+ tan(Math.abs(L - D)))) - sin(L)*sin(D)
    const arccos = acos((nom 
        /dnom))
    return 1/15* arccos
}


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

function deg2rad(deg){
    return deg * Math.PI/180;
}

function rad2deg(rad){
    return rad / Math.PI*180;
}

function cos(a){
    return Math.cos(deg2rad(a))
}
function sin(a){
    return Math.sin(deg2rad(a))
}
function tan(a){
    return Math.tan(deg2rad(a))
}

function asin(a){
    return rad2deg( Math.asin(a))
}
function acos(a){
    return rad2deg( Math.acos(a))
}
function atan(a){
    return rad2deg( Math.atan(a))
}
function atan2(a,b){
    return rad2deg( Math.atan2(deg2rad(a),deg2rad(b)))
}
function acot(a){
    return (rad2deg( Math.atan(1/a)))
}