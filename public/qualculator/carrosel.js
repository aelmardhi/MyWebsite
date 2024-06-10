function Carrosel(parent, children){
    this.children = children;
    this.index = 0;
    this.onchange = ()=>{};
    this.length = children.length;
    this.element = document.createElement('div');
    this.element.classList.add('carrosel');
    this.previous = document.createElement('button');
    this.previous.classList.add('previous');
    this.next = document.createElement('button');
    this.next.classList.add('next');
    this.textElement = document.createElement('div');
    this.textElement.classList.add('text');
    this.textElement.textContent = this.children[this.index];
    this.previous.textContent = '◄';
    this.next.textContent = '►';
    this.previous.onclick = ()=>{this.index = (this.length + this.index -1 )% this.length; this.textElement.textContent = this.children[this.index]; this.onchange(this.index);}
    this.next.onclick = ()=>{this.index = ++this.index % this.length; this.textElement.textContent = this.children[this.index];  this.onchange(this.index);}

    this.element.appendChild(this.previous);
    this.element.appendChild(this.textElement);
    this.element.appendChild(this.next);
    parent.appendChild(this.element);
}