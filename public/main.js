const STORAGE_THEME_PEREFERENCE = 'THEME_PEREFERENCE';
const SORAGE_THEME_PALLETE = 'THEME_PALLETE';
const THEME_PREF_ATTRIBUTE = 'data-pref';
const THEME_PALLETE_ATTRIBUTE = 'data-pallete';
const THEME_PANEL_OPEN_CLASS = 'theme_panel_open';


class Theme{
    btn= document.getElementById('theme__btn');
    closeBtn= document.getElementById('theme__close__btn');
    backdrop= document.querySelector('.theme__backdrop');
    panel = document.querySelector('.theme__panel');
    preferenceBtns = document.querySelectorAll('#theme__preference__list input');
    palleteBtns = document.querySelectorAll('#theme__pallete__list input');
    constructor(){
        this.getPrefernce();
        this.getPallete();
        this.btn.onclick = ()=>{
            document.body.classList.add(THEME_PANEL_OPEN_CLASS);
        }
        this.closeBtn.onclick = ()=>{
            document.body.classList.remove(THEME_PANEL_OPEN_CLASS);
        }
        this.backdrop.onclick = ()=>{
            document.body.classList.remove(THEME_PANEL_OPEN_CLASS);
        }
        document.body.addEventListener ('keydown', (e)=>{
            if(e.key == 'Escape')
                document.body.classList.remove(THEME_PANEL_OPEN_CLASS);
        });
        this.preferenceBtns.forEach(btn=>{
            btn.onchange = ()=>{
                if(btn.checked)
                    this.setPreference(btn.getAttribute(THEME_PREF_ATTRIBUTE));
            }
            
        })
        this.palleteBtns.forEach(btn=>{
            btn.onchange = ()=>{
                if(btn.checked)
                    this.setPallete(btn.getAttribute(THEME_PALLETE_ATTRIBUTE));
            }
            
        })
    };
    setPreference = (pref)=> {
        localStorage.setItem(STORAGE_THEME_PEREFERENCE,pref);
        document.body.setAttribute(THEME_PREF_ATTRIBUTE,pref);
    }
    getPrefernce = ()=>{
        const pref= localStorage.getItem(STORAGE_THEME_PEREFERENCE) || 'default';
        document.body.setAttribute(THEME_PREF_ATTRIBUTE,pref);
        this.preferenceBtns.forEach(btn=>{
            if(pref === btn.getAttribute(THEME_PREF_ATTRIBUTE))
                btn.setAttribute('checked', true);
        });
    }
    
    setPallete = (pallete)=> {
        localStorage.setItem(SORAGE_THEME_PALLETE,pallete);
        document.body.setAttribute(THEME_PALLETE_ATTRIBUTE,pallete);
    }
    getPallete = ()=>{
        const pallete= localStorage.getItem(SORAGE_THEME_PALLETE) || '1';
        document.body.setAttribute(THEME_PALLETE_ATTRIBUTE, pallete);
        this.palleteBtns.forEach(btn=>{
            if(pallete === btn.getAttribute(THEME_PALLETE_ATTRIBUTE))
                btn.setAttribute('checked', true);
        });
    }
    
}

function elementFactory(name, classes, id, text, attributes){
    if(!name) return;
    this.element = document.createElement(name);
    if(id) this.element.id = id;
    if(typeof classes === 'string') classes = classes.split(' ');
    if(Array.isArray(classes)) this.element.classList.add(...(classes.filter(item => item)));
    if(text) this.element.textContent = text;
    for( att in attributes){
        this.element.setAttribute(att, attributes[att]);
    }
    return this.element;
}
