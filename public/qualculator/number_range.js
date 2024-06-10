function NumberRange(parent, min, max){
    this.value = 0;
    this.element = document.createElement('div');
    this.numberElement = document.createElement('input');
    this.numberElement.type = 'number';
    this.rangeElement = document.createElement('input');
    this.rangeElement.type = 'range';
    this.element.appendChild(this.numberElement);
    this.element.appendChild(this.rangeElement);
    parent.appendChild(this.element);
    this.numberElement.value = this.value;
    this.rangeElement.value = this.value;
    this.element.classList.add('number_range');
    this.numberElement.onchange = this.onchange.bind(this);
    this.rangeElement.onchange = this.onchange.bind(this);

    if(min){
        this.rangeElement.min = min;
        this.numberElement.min = min;
    }
    if(max){
        this.rangeElement.max = max;
        this.numberElement.max = max;
    }
}

NumberRange.prototype.onchange = function(e){
    this.value = e.target.value;
    this.numberElement.value = this.value;
    this.rangeElement.value = this.value;
    this.rangeElement.style.backgroundSize = (this.rangeElement.value - this.rangeElement.min) / (this.rangeElement.max - this.rangeElement.min) *100 +'% 100%';
}

NumberRange.prototype.get = function(){
    return this.value;
}
