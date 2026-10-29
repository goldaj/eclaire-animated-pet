const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function mount(reduceMotion) {
  const buttons = [], jobs = [];
  const img = {src:'',alt:'',addEventListener(type, handler){this[type] = handler}};
  const demo = {disabled:false,textContent:'',attributes:{},setAttribute(k,v){this.attributes[k]=v}};
  const speed = {value:'750'};
  const status = {textContent:''};
  const nav = {appendChild(b){buttons.push(b)},querySelectorAll(){return buttons}};
  const elements = {pet:img,demo,'cycle-speed':speed,'cycle-status':status,states:nav};
  const document = {
    getElementById:id=>elements[id],
    createElement:tag=>({textContent:'',attributes:{},setAttribute(k,v){this.attributes[k]=v}}),
    addEventListener(){}
  };
  const context = {
    document,window:{matchMedia:()=>({matches:reduceMotion})},
    setTimeout:fn=>{jobs.push(fn);return jobs.length;},
    clearTimeout:()=>{}
  };
  vm.runInNewContext(source,context);
  return {buttons,jobs,img,demo,status,speed};
}

const active = mount(false);
assert.equal(active.buttons.length,9);
assert.equal(active.img.src,'assets/idle.gif');
active.buttons[1].onclick();
assert.equal(active.img.src,'assets/jump.gif');
active.demo.onclick();
assert.equal(active.demo.attributes['aria-pressed'],'true');
assert.equal(active.img.src,'assets/idle.gif');
for (let i=0;i<4;i++) active.jobs[i]();
assert.equal(active.status.textContent,'Cycle terminé');
assert.equal(active.demo.attributes['aria-pressed'],'false');

const reduced = mount(true);
assert.equal(reduced.demo.disabled,true);
reduced.buttons[2].onclick();
assert.equal(reduced.img.src,'assets/wave-00.png');
console.log('OK: interactive cycle, manual state selection and reduced motion');
