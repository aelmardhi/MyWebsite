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

function ToEulerAngles( q) {
    let angles = {};
    q = {x:q[0], y:q[1], z:q[2], w:q[3]}
    // roll (x-axis rotation)
    let sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
    let cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
    angles.roll = rad2deg(Math.atan2(sinr_cosp, cosr_cosp));

    // pitch (y-axis rotation)
    let sinp = 2 * (q.w * q.y - q.z * q.x);
    if (Math.abs(sinp) >= 1)
        angles.pitch = rad2deg(Math.abs(Math.PI / 2)* Math.sign( sinp)); // use 90 degrees if out of range
    else
        angles.pitch = rad2deg(Math.asin(sinp));

    // yaw (z-axis rotation)
    let siny_cosp = 2 * (q.w * q.z + q.x * q.y);
    let cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
    angles.yaw = rad2deg(Math.atan2(siny_cosp, cosy_cosp));

    return angles;
}