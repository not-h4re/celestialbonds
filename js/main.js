// vscode please let me access the top of my code
let htmlThings = {
  "launch site": [
    `You arrive at an abandoned clearing. There is an empty rocket with no fuel inside.<br>
    There are small piles of stardust around the rocket, and a few rocks and trees.<br>
    <br>
    <br>
    <br>
    <button class="action" onclick="doAction('logs', 1)">
      Chop some logs
    </button><br>
    <button class="action" onclick="doAction('stone', 1)">
      Mine some stone
    </button><br>
    <button class="action" onclick="doAction('stardust', 1)">
      Gather some of the stardust
    </button><br>
    <button class="action tooltip" onclick="fuelRocket()">
      <span class="tooltiptext">Consumes 1 weakened stardust and 1 log</span>
      Fuel the rocket <span id="rocketprogress">(0/25)</span>
    </button>`
  ]
}
function updateMainContainer(tab){
  document.getElementById("main").innerHTML = htmlThings[tab][0]
  if(tab == "launch site") document.getElementById("rocketprogress").innerHTML = "("+player.rocketProg.toFixed(0)+"/25)"
}
function updateRightTab(tab){
  switch(tab){
    case "inventory":
      updateInventory()
      break
    case "levels":
      updateLevels()
      break
    default:
      updateInventory()
      break
  }
}
function tab(tab){
  player.tab = tab
  updateMainContainer(tab)
}
function righttab(tab){
  player.righttab = tab
  updateRightTab(tab)
}
function getSkillLevel(skill){
  // xp req = 100*1.25^n
  let xp = player.xp[skill]
  return Math.floor(1+log(xp/100, 1.25))
}
function getXpReq(level){
  return 100*1.25**(level-1)
}
function log(n, base=10){
  if(n < 1 && base > 1) n = 1
  return Math.log(n)/Math.log(base)
}

function doAction(type, tier){
  // times per tier
  tier -= 1
  let array2 = ["logs", "stone", "stardust"]
  let index = array2.indexOf(type)
  let playerIdentifier = array2[index]
  let skillNames = ["woodcutting", "mining", "gathering"]
  let xpType = skillNames[index]
  tmp.params = [playerIdentifier, tier, 1, true]
  tmp.timeLeft = (5 + (tier**1.5)*3)/timeBoost(xpType)
  tmp.currentAction = [playerIdentifier, tier, xpType]
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
function updateLevels(){
  let html = ""
  let skills = ["all", "gathering","woodcutting","mining"]
  let displaySkills = ["Player Level", "Gathering", "Woodcutting", "Mining"]
  for(i in skills){
    html += displaySkills[i]+" "+getSkillLevel(skills[i])+", "+(player.xp[skills[i]]-100).toFixed(0)+"/"+(getXpReq(getSkillLevel(skills[i])+1)-100).toFixed(0)+` XP<br>
    <div class="progressbar">
      <div class="progressbarfill" style="width: `+(100*(player.xp[skills[i]]-100))/(getXpReq(getSkillLevel(skills[i])+1)-100).toFixed(1)+`%;"></div>
    </div>`
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
  updateRightTab(player.righttab)
  if(action){
    tmp.params = []
    doAction(tmp.currentAction[0], tmp.currentAction[1]+1)
  }
}
function init(){
  updateMainContainer("launch site")
  updateRightTab(player.righttab)
}
function update(diff){
  if(tmp.timeLeft > 0) {
    tmp.timeLeft = Math.max(0, tmp.timeLeft - diff)
  }
  if(tmp.currentAction.length > 1){
    updateProgress(tmp.currentAction[0], tmp.currentAction[1], tmp.currentAction[2])
  }
  if(tmp.timeLeft == 0 && tmp.params.length > 1){
    addXP(tmp.currentAction[1], tmp.currentAction[2])
    addItem(tmp.params[0], tmp.params[1], tmp.params[2], tmp.params[3])
  }

}
function updateProgress(type, tier, skill){
  document.getElementById("progress").innerHTML = String(itemNames[type][tier]).charAt(0).toUpperCase() + String(itemNames[type][tier]).slice(1) + " - "+tmp.timeLeft.toFixed(3)+"s/"+((5+3*tier)/timeBoost(skill)).toFixed(3)+"s"
}
function timeBoost(skill="none", showAll=true) {
  let time = 1
  if(skill != "none") time *= (1.01**getSkillLevel(skill))
  if(showAll) time *= (1.006**getSkillLevel("all"))
  return time
}
setInterval(function() {
  let diff = Date.now()/1000 - tmp.lasttick
  update(diff)
  tmp.lasttick = Date.now()/1000
})
function addXP(tier, actionType){
  let amount = 5 * 1.3**tier
  player.xp[actionType] += amount
  player.xp.all += amount
}
function fuelRocket(){
  if(player.inventory.logs[0] < 1 && player.inventory.stardust[0] < 1) return
  if(player.rocketProg > 24) return
  player.inventory.logs[0]--
  player.inventory.stardust[0]--
  player.rocketProg++
  document.getElementById("rocketprogress").innerHTML = "("+player.rocketProg.toFixed(0)+"/25)"
  updateRightTab()
}