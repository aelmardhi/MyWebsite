function NumberDial(parent){
    this.value = 1;
    this.element = document.createElement('div');
    this.topElement = document.createElement('button');
    this.inputElement = document.createElement('input');
    this.bottomElement = document.createElement('button');
    this.element.classList.add('number_dial');
    this.inputElement.type = 'number';
    this.inputElement.value = this.value;
    this.topElement.innerText = '▲';
    this.bottomElement.innerText = '▼';

    this.onchange = ()=>{};
    this.topElement.onclick = ()=>{this.value++;this.inputElement.value = this.value; this.onchange(this.value);}
    this.bottomElement.onclick = ()=>{this.value--;this.inputElement.value = this.value; this.onchange(this.value);}
    this.inputElement.onchange = ()=> {this.value = this.inputElement.value; this.onchange(this.value);}

    this.element.appendChild(this.topElement);
    this.element.appendChild(this.inputElement);
    this.element.appendChild(this.bottomElement);
    parent.appendChild(this.element);
}