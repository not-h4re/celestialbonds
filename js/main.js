// vscode please let me access the top of my code
let htmlThings = {
  "launch site": [
    `You arrive at an abandoned clearing. There is an empty rocket with no fuel inside.<br>
    There are small piles of stardust around the rocket, and a few rocks and trees.<br>
    <br>
    <br>
    <br>
    <button class="action" onclick="doAction('wood', 1)">
      Chop some logs
    </button><br>
    <button class="action" onclick="doAction('mining', 1)">
      Mine some stone
    </button><br>
    <button class="action" onclick="doAction('stardust', 1)">
      Gather some of the stardust
    </button>`
  ],
  inventory: {
    inv: [""]
  }
}
function updateMainContainer(tab){
  document.getElementById("main").innerHTML = htmlThings[tab][0]
}
function tab(tab){
  player.tab = tab
  updateMainContainer(tab)
}

function doAction(type, tier){
  // times per tier
  tier -= 1
  let array1 = ["wood", "mining", "stardust"]
  let index = array1.indexOf(type)
  if(index == -1) array1 = ["logs", "stone", "stardust"]
  index = array1.indexOf(type)
  let array2 = ["logs", "stone", "stardust"]
  let playerIdentifier = array2[index]
  tmp.params = [playerIdentifier, tier, 1, true]
  tmp.timeLeft = 5 + tier*3
  tmp.currentAction = [playerIdentifier, tier]
}

function updateInventory(){
  let html = ""
  for(i in player.inventory){
    let x = player.inventory[i].length-1
    console.log(x)
    for(j=-1;j++;j<=x){
      if(player.inventory[i][j] > 0){
        html += player.inventory[i][j]+" "+itemNames[i][j]+"<br>"
      }
    }
  }
  document.getElementById("inventory").innerHTML = html
}
const itemNames = {
  logs: ["logs"],
  stone: ["stone"],
  stardust: ["weakened stardust"],
}
function addItem(type, tier, amount, action=false){
  console.log(type)
  player.inventory[type][tier] += Math.round(amount)
  updateInventory()
  if(action){
    tmp.params = []
    doAction(tmp.currentAction[0], tmp.currentAction[1]+1)
  }
}
function init(){
  updateMainContainer("launch site")
  updateInventory()
}
function update(diff){
  if(tmp.timeLeft > 0) {
    tmp.timeLeft = Math.max(0, tmp.timeLeft - diff)
  }
  if(tmp.currentAction.length > 1){
    updateProgress(tmp.currentAction[0], tmp.currentAction[1])
  }
  if(tmp.timeLeft == 0 && tmp.params.length > 1){
    addItem(tmp.params[0], tmp.params[1], tmp.params[2], tmp.params[3])
  }

}
function updateProgress(type, tier){
  document.getElementById("progress").innerHTML = String(itemNames[type][tier]).charAt(0).toUpperCase() + String(itemNames[type][tier]).slice(1) + " - "+tmp.timeLeft.toFixed(3)+"s/"+((5+3*tier)/timeBoost()).toFixed(3)+"s"
}
function timeBoost() {
  return 1
}
setInterval(function() {
  let diff = Date.now()/1000 - tmp.lasttick
  update(diff)
  tmp.lasttick = Date.now()/1000
})