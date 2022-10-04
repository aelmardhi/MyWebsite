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
    const Isha = Dhuhr + T(17.5, Lat,D)
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
