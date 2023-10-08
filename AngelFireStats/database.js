/*eslint-env es6*/
const firebaseConfig = {
  apiKey: "AIzaSyCxX2GbWt_gSBXlI_3Tgjhqdmgswxo-K6I",
  authDomain: "angel-fire-stats.firebaseapp.com",
  databaseURL: "https://angel-fire-stats-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "angel-fire-stats",
  storageBucket: "angel-fire-stats.appspot.com",
  messagingSenderId: "143124332727",
  appId: "1:143124332727:web:a10af184ddc16923fecd32"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase();
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set, child, update, get } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

var reference = ref(db);
var stats;
get(child(reference, "matches")).then((snapshot)=>{stats = snapshot.val(); GetStats();});

var turrets = ["Cone", "Circle", "Aim", "Laser"];
var levels = ["classic", "cave", "black holes", "darkness", "portals"];

var turretTotalBuy = {};
var turretTotalMostBought = {};
var turretTotalMostBoughtWins = {};
var turretTotalHits = {};
var turretCoordinates = {};
var turretWinCoordinates = {};
var matches = {"classic": 0, "cave": 0, "black holes": 0, "darkness": 0, "portals": 0};

function GetStats()
{
  console.log(stats);
  
  //RESET VALUES AND FILL
  turretTotalBuy = {};
  turretTotalMostBought = {};
  turretTotalMostBoughtWins = {};
  turretTotalHits = {};
  turretCoordinates = {};
  turretWinCoordinates = {};
  
  for (var i = 0; i < levels.length; i++)
    {
      turretTotalBuy[levels[i]] = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
      turretTotalMostBought[levels[i]] = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
      turretTotalMostBoughtWins[levels[i]] = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};

      turretTotalHits[levels[i]] = {"cone": 0, "circle": 0, "aim": 0, "laser": 0, "ground": 0};

      turretCoordinates[levels[i]] = [];
      for (var x = 0; x < 130; x++)
        {
          turretCoordinates[levels[i]].push([]);
          for (var y = 0; y < 12; y++)
            {
              turretCoordinates[levels[i]][x].push({"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0});
            }
        }
      turretWinCoordinates[levels[i]] = [];
      for (var x = 0; x < 130; x++)
        {
          turretWinCoordinates[levels[i]].push([]);
          for (var y = 0; y < 12; y++)
            {
              turretWinCoordinates[levels[i]][x].push({"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0});
            }
        }
    }

  
  //EACH MATCH
  for (var i = 0; i < stats.length; i++)
    {
      var turretMatchBuy = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
      
      matches[stats[i].level] += 1;
      
      //EACH ROUND
      for (var r = 0; r < stats[i].rounds.length; r++)
        {
          
          //EACH TURRET ACTION (IF ANY)
          if (stats[i].rounds[r].turrets != undefined)
            {
              for (var t = 0; t < stats[i].rounds[r].turrets.length; t++)
                {
                  
                  //IF BUILD TURRET
                  if (stats[i].rounds[r].turrets[t].action == "build")
                    {
                      turretMatchBuy[stats[i].rounds[r].turrets[t].type] += 1;
                      turretTotalBuy[stats[i].level][stats[i].rounds[r].turrets[t].type] += 1;
                      turretCoordinates[stats[i].level][20 + stats[i].rounds[r].turrets[t].x][(stats[i].rounds[r].turrets[t].y * -1) + 3][stats[i].rounds[r].turrets[t].type] += 1;
                      if (stats[i].rounds[r].winner == "defender")
                        {
                          turretWinCoordinates[stats[i].level][20 + stats[i].rounds[r].turrets[t].x][(stats[i].rounds[r].turrets[t].y * -1) + 3][stats[i].rounds[r].turrets[t].type] += 1;
                        }
                    }
                  }
            }
          //EACH ATTACKER HIT
          if (stats[i].rounds[r].attackerHits != undefined)
            {
              for (var a = 0; a < stats[i].rounds[r].attackerHits.length; a++)
                {
                  turretTotalHits[stats[i].level][stats[i].rounds[r].attackerHits[a].turretType] += 1;
                }
             }
      
          //FIND MOST BOUGHT TURRETS IN MATCH
          var mostAmount = 0;
          var mostBought = [];
          for (var t = 0; t < Object.keys(turretMatchBuy).length; t++)
            {
              if (mostAmount < turretMatchBuy[Object.keys(turretMatchBuy)[t]])
                {
                  mostAmount = turretMatchBuy[Object.keys(turretMatchBuy)[t]];
                  mostBought = [Object.keys(turretMatchBuy)[t]];
                }
              else if (mostAmount == turretMatchBuy[Object.keys(turretMatchBuy)[t]])
                 {
                   mostBought.push(Object.keys(turretMatchBuy)[t]);
                 }
            }

          for (var t = 0; t < mostBought.length; t++)
            {
              turretTotalMostBought[stats[i].level][mostBought[t]] += 1;

              //COUNT WINS MOST BOUGHT TURRET
              if (stats[i].winner == "defender")
                {
                  turretTotalMostBoughtWins[stats[i].level][mostBought[t]] += 1;
                }
            }
      
        }
  }
  Update([true, true, true, true, true], false);
}

function Update(levelsShown, average)
{
  
  var resTurretTotalBuy = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
  var resTurretTotalMostBought = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
  var resTurretTotalMostBoughtWins = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
  var resTurretTotalHits = {"cone": 0, "circle": 0, "aim": 0, "laser": 0};
  
  var resWinrate = {};
  var calcWinrate = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
  
  if (average)
    {
      for (var i = 0; i < levels.length; i++)
        {
          resWinrate[levels[i]] = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
        }
    }
  
  var levelShowCount = 0;
  var matchesShown = 0;
  
  for (var i = 0; i < levels.length; i++)
    {
      if (levelsShown[i] == true)
        {
          matchesShown += matches[levels[i]];
          levelShowCount += 1;
          for (var t = 0; t < turrets.length; t++)
            {
              resTurretTotalBuy[turrets[t]] += turretTotalBuy[levels[i]][turrets[t]];
              resTurretTotalMostBought[turrets[t]] += turretTotalMostBought[levels[i]][turrets[t]];
              resTurretTotalMostBoughtWins[turrets[t]] += turretTotalMostBoughtWins[levels[i]][turrets[t]];
              resTurretTotalHits[turrets[t].toLowerCase()] += turretTotalHits[levels[i]][turrets[t].toLowerCase()];
              if (average)
                {
                resWinrate[levels[i]][turrets[t]] = turretTotalMostBoughtWins[levels[i]][turrets[t]] / turretTotalMostBought[levels[i]][turrets[t]];
                }
            }
        }
    }
  
  for (var t = 0; t < turrets.length; t++)
  {
    if (average)
      {
        var total = 0;
        for (var i = 0; i < levels.length; i++)
          {
            if (levelsShown[i] == true && !isNaN(resWinrate[levels[i]][turrets[t]]) && resWinrate[levels[i]][turrets[t]] != 0)
              {;
                total += resWinrate[levels[i]][turrets[t]];
              }
          }
        calcWinrate[turrets[t]] = total / levelShowCount;
        resTurretTotalBuy[turrets[t]] *= 1 / levelShowCount;
        resTurretTotalHits[turrets[t].toLowerCase()] *= 1 / levelShowCount;
        resTurretTotalMostBought[turrets[t]] *= 1 / levelShowCount;
      }
    else
      {
        calcWinrate[turrets[t]] = resTurretTotalMostBoughtWins[turrets[t]] / resTurretTotalMostBought[turrets[t]]
      }
  }
  
  document.getElementById("matchesAmount").innerHTML = "Data from " + matchesShown + " matches.";
  
  document.getElementById("cone").children[1].innerHTML = 0.1 * Math.round(10 * resTurretTotalBuy["Cone"]);
  document.getElementById("circle").children[1].innerHTML = 0.1 * Math.round(10 * resTurretTotalBuy["Circle"]);
  document.getElementById("aim").children[1].innerHTML =  0.1 * Math.round(10 * resTurretTotalBuy["Aim"]);
  document.getElementById("laser").children[1].innerHTML =  0.1 * Math.round(10 * resTurretTotalBuy["Laser"]);
  
  document.getElementById("cone").children[2].innerHTML =  0.1 * Math.round(10 * resTurretTotalMostBought["Cone"]);
  document.getElementById("circle").children[2].innerHTML =  0.1 * Math.round(10 * resTurretTotalMostBought["Circle"]);
  document.getElementById("aim").children[2].innerHTML =  0.1 * Math.round(10 * resTurretTotalMostBought["Aim"]);
  document.getElementById("laser").children[2].innerHTML =  0.1 * Math.round(10 * resTurretTotalMostBought["Laser"]);
  
  document.getElementById("cone").children[3].innerHTML = Math.round(calcWinrate["Cone"] * 100) + "%";
  document.getElementById("circle").children[3].innerHTML = Math.round(calcWinrate["Circle"] * 100) + "%";
  document.getElementById("aim").children[3].innerHTML = Math.round(calcWinrate["Aim"] * 100) + "%";
  document.getElementById("laser").children[3].innerHTML = Math.round(calcWinrate["Laser"] * 100) + "%";
  
  document.getElementById("cone").children[4].innerHTML =  0.1 * Math.round(10 * resTurretTotalHits["cone"]);
  document.getElementById("circle").children[4].innerHTML =  0.1 * Math.round(10 * resTurretTotalHits["circle"]);
  document.getElementById("aim").children[4].innerHTML =  0.1 * Math.round(10 * resTurretTotalHits["aim"]);
  document.getElementById("laser").children[4].innerHTML =  0.1 * Math.round(10 * resTurretTotalHits["laser"]);
  
  for (var i = 0; i < levels.length; i++)
    {
      document.getElementById(levels[i]).innerHTML = "<img src='Images/" + levels[i] + ".png' class='map'>";
      for (var x = 0; x < turretCoordinates[levels[i]].length; x++)
        {
          for (var y = 0; y < turretCoordinates[levels[i]][x].length; y++)
            {
              var create = false;
              for (var t = 0; t < Object.keys(turretCoordinates[levels[i]][x][y]).length; t++)
                {
                  if (turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[t]] > 0)
                    {
                      create = true;
                    }
                }
              if (create)
                {
                  var newDiv = document.createElement("div");
                  newDiv.classList.add("mapElement");
                  newDiv.style.top = y * 40;
                  newDiv.style.left = x * 40;
                  newDiv.content = [
                    turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[0]],
                    turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[1]],
                    turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[2]],
                    turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[3]],
                    turretWinCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[0]],
                    turretWinCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[1]],
                    turretWinCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[2]],
                    turretWinCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[3]]
                  ];
                  var total = 0;
                  var totalWins = 0;
                  var highest = 0;
                  var highestIndex = 0;
                  for (var a = 0; a < 4; a++)
                    {
                      if (!isNaN(turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[a]]))
                        {
                          if (turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[a]] > highest)
                            {
                              highest = turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[a]];
                              highestIndex = a;
                            }
                          total += turretCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[a]]
                        }
                      if (!isNaN(turretWinCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[a]]))
                        {
                          totalWins += turretWinCoordinates[levels[i]][x][y][Object.keys(turretCoordinates[levels[i]][x][y])[a]];
                        }
                    }
                  newDiv.style.backgroundColor = "rgb( " + ((1 - totalWins / total) * 255) + ", " + ((totalWins / total) * 255) + ", 0)";
                  newDiv.style.opacity = total * 0.2;
                  newDiv.addEventListener("mouseover", TurretHover);
                  newDiv.addEventListener("mouseout", StopHover);
                  
                  newDiv.innerHTML = "<img src='Images/" + turrets[highestIndex] + ".png'><div class='mapElement' style='opacity: " + total * 0.1 + "; top: 0; background-color: rgb( " + ((1 - totalWins / total) * 255) + ", " + ((totalWins / total) * 255) + ", 0)'></div>";
                  document.getElementById(levels[i]).appendChild(newDiv);
                }
            }
        }
    }
}

function TurretHover(e)
  {
    var numbers = e.currentTarget.content;
    var content = ""
    for (var i = 0; i < 4; i++)
      {
        if (numbers[i] > 0)
          {
            content += "<p>" + turrets[i] + ": " + numbers[i] + " placed, " + (numbers[i + 4] / numbers[i] * 100) + "% winrate</p>";
          }
      }
    document.getElementById("hoverInfo").innerHTML = content;
    document.getElementById("hoverInfo").style.visibility = "visible";
    document.getElementById("hoverInfo").style.left = e.pageX;
    document.getElementById("hoverInfo").style.top = e.pageY;
  }

function StopHover(e)
{
  document.getElementById("hoverInfo").style.visibility = "hidden";
}