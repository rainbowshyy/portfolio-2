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
get(child(reference, "matches")).then((snapshot)=>{stats = snapshot.val(); getStats();});

function getStats()
{
  console.log(stats);
  
  var turretTotalBuy = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
  var turretTotalMostBought = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
  var turretTotalMostBoughtWins = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
  
  
  //EACH MATCH
  for (var i = 0; i < stats.length; i++)
    {
      var turretMatchBuy = {"Cone": 0, "Circle": 0, "Aim": 0, "Laser": 0};
      
      
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
                      console.log(stats[i].rounds[r].turrets[t].type + " in match " + i + " round " + r);
                      turretMatchBuy[stats[i].rounds[r].turrets[t].type] += 1;
                      turretTotalBuy[stats[i].rounds[r].turrets[t].type] += 1;
                    }
                }
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
          turretTotalMostBought[mostBought[t]] += 1;
          
          //COUNT WINS MOST BOUGHT TURRET
          if (stats[i].winner == "defender")
            {
              turretTotalMostBoughtWins[mostBought[t]] += 1;
            }
        }
      
    }

  document.getElementById("cone").children[1].innerHTML = turretTotalBuy["Cone"];
  document.getElementById("circle").children[1].innerHTML = turretTotalBuy["Circle"];
  document.getElementById("aim").children[1].innerHTML = turretTotalBuy["Aim"];
  document.getElementById("laser").children[1].innerHTML = turretTotalBuy["Laser"];
  
  document.getElementById("cone").children[2].innerHTML = turretTotalMostBought["Cone"];
  document.getElementById("circle").children[2].innerHTML = turretTotalMostBought["Circle"];
  document.getElementById("aim").children[2].innerHTML = turretTotalMostBought["Aim"];
  document.getElementById("laser").children[2].innerHTML = turretTotalMostBought["Laser"];
  
  document.getElementById("cone").children[3].innerHTML = turretTotalMostBoughtWins["Cone"] / turretTotalMostBought["Cone"];
  document.getElementById("circle").children[3].innerHTML = turretTotalMostBoughtWins["Circle"] / turretTotalMostBought["Circle"];
  document.getElementById("aim").children[3].innerHTML = turretTotalMostBoughtWins["Aim"] / turretTotalMostBought["Aim"];
  document.getElementById("laser").children[3].innerHTML = turretTotalMostBoughtWins["Laser"] / turretTotalMostBought["Laser"];
}