const panel = document.getElementById('numbersPanel');
const cube = document.querySelector('.cube');
const carroselPanel = document.getElementById('carrosel_panel');

let length = 1, width = 1, height = 1, index=0;


function addSpan(parent, text){
    const element = document.createElement('span');
    element.innerText = text;
    parent.appendChild(element);
}

const lengthElement =new NumberDial(panel);
addSpan(panel,'X');
const widthElement =new NumberDial(panel);
addSpan(panel,'X');
const heightElement =new NumberDial(panel);

const carrosel = new Carrosel(carroselPanel, Object.values(BrickType))

function calculate(){
    const brickType = Object.values(BrickType)[index];
    const bricks = briksQuantity(length, width, height, brickType);
    const cement = cementQuantity(length, width, height, brickType);
    const sand = sandQuantity(length, width, height, brickType); 

    document.getElementById('brick_result').textContent = bricks;
    document.getElementById('cement_result').textContent = cement;
    document.getElementById('sand_result').textContent = sand;

}

lengthElement.onchange = (value)=>{length = value; cube.style.setProperty('--_length', 20*length+'px');calculate();}
widthElement.onchange = (value)=>{width = value; cube.style.setProperty('--_width', 20*width+'px');calculate();}
heightElement.onchange = (value)=>{height = value; cube.style.setProperty('--_height', 20*height+'px');calculate();}
carrosel.onchange = (value)=>{index=value;calculate();}

calculate();
