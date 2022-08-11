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