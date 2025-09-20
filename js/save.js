var player={}
var tmp = {
  params: [],
  currentAction: [],
  timeLeft: 0,
  lasttick: Date.now()/1000,
}
// credit goes to 3pow3equals7 for the saving code

function start(){
  let a={
    tab: "launch site",
    inventory: {
      logs: [0],
      stone: [0],
      stardust: [0],
    },
    xp: {
      all: 100,
      woodcutting: 100,
      mining: 100,
      gathering: 100,
    },
    righttab: 'inventory',
    rocketProg: 0,
  }
  return a
}
function save(){
  localStorage.setItem("untitled save",btoa(JSON.stringify(player)))
}
function fixSave() {
    let defaultData = start();
    fixData(defaultData, player);
}

function fixData(defaultData, newData) {
    for (item in defaultData) {
        if (defaultData[item] == null) {
            if (newData[item] === undefined)
                newData[item] = null;
        }
        else if (Array.isArray(defaultData[item])) {
            if (newData[item] === undefined)
                newData[item] = defaultData[item];
            else
                fixData(defaultData[item], newData[item]);
        }
        else if ((!!defaultData[item]) && (typeof defaultData[item] === "object")) {
            if (newData[item] === undefined || (typeof defaultData[item] !== "object"))
                newData[item] = defaultData[item];
            else
                fixData(defaultData[item], newData[item]);
        }
        else {
            if (newData[item] === undefined)
                newData[item] = defaultData[item];
        }
    }
}

function load() {
	let get = localStorage.getItem("untitled save");
	if (get === null || get === undefined) {
		player = start();
	}
	else {
		player = Object.assign(start(), JSON.parse(decodeURIComponent(escape(atob(get)))));
		fixSave();
	}
  init()
}

setInterval(function () {save()}, 10000);
setInterval(function(){
  localStorage.setItem("untitled backup", btoa(JSON.stringify(player)))
}, 60000)
window.onload=function(){load()};

function exportSave() {
  let str = btoa(JSON.stringify(player)); 
  const el = document.createElement("textarea");	
  el.value = str;	
  document.body.appendChild(el);	
  el.select();
  el.setSelectionRange(0, 999999);
  document.execCommand("copy");
  document.body.removeChild(el);
}

function importSave(imported = undefined) {
  if (imported === undefined) imported = prompt("paste your save here")
  player =JSON.parse(atob(imported))
  save()
  window.location.reload();
}
    
function hardReset(){
  if(confirm("This will reset all game progress! Are you sure??")){
    player=start()
    window.location.reload();
    save()
  }
}