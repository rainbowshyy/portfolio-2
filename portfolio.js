/*eslint-env browser*/

var portfolio;
fetch("portfolio.json")
.then(res => res.json())
.then(data => portfolio = data.hardmode);

//muh api very good nyes
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame;})();


var overPile = false;
function mouseOverPile(isOver)
{
  overPile = isOver;
  if (!waitingInput)
    {
      overPile = false;
    }
  if (overPile)
    {
      pile.frame = 1;
    }
  else
    {
      pile.frame = 0;
    }
}

function clickPile()
{
  if (overPile && waitingInput)
    {
      waitingInput = false;
      simenScratchCount = 0;
      simenStateCount = 0;
      simen.frame = 14;
      pile.frame = 0;
      overPile = false;
    }
}

//Defining the canvas area
var gameArea = {
  canvas : document.getElementById("portfolio"),
  init : function () {
    this.canvas.width = 256;
    this.canvas.height = 240;
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
  },
  clear : function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function visualObject(x,y,width,height,sprites) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.sprites = [];
  this.frame = 0;
  for (var i = 0; i < sprites.length; i++)
  {
    this.sprites.push(new Image());
    this.sprites[i].src = sprites[i];
  }
  this.draw = function () {
    var c = gameArea.context;
    c.drawImage(this.sprites[this.frame], this.x, this.y, this.width, this.height);
  };
}

var ohno = false;
var look = false;
var simenStateCount = 0;
var simenScratchCount = 0;
var waitingInput = false;
var foundIndex;
function simenState()
{
  simenStateCount += 1;
  if (simen.frame == 0 && simenStateCount > 100)
    {
      simen.frame = 1;
      simenStateCount = 0;
    }
  else if (simen.frame == 1 && simenStateCount > 50)
    {
      simen.frame = 2;
      simenStateCount = 0;
    }
  else if (simen.frame == 2 && simenStateCount > 8)
    {
      simen.frame = 3;
      simenStateCount = 0;
    }
  else if (simen.frame == 3 && simenStateCount > 50)
    {
      simen.frame = 4;
      simenStateCount = 0;
    }
  else if (simen.frame == 4 && simenStateCount > 60)
    {
      simen.frame = 5;
      simenStateCount = 0;
    }
  else if (simen.frame == 5 && simenStateCount > 16 && !waitingInput)
    {
      simen.frame = 6;
      simenStateCount = 0;
    }
  else if (simen.frame == 6 && simenStateCount > 60 && !waitingInput)
    {
      simen.frame = 7;
      simenStateCount = 0;
    }
  else if (simen.frame == 7 && simenStateCount > 12)
    {
      simen.frame = 8;
      simenStateCount = 0;
    }
  else if (simen.frame == 8 && simenStateCount > 12)
    {
      simen.frame = 7;
      simenStateCount = 0;
      simenScratchCount += 1;
      if (simenScratchCount > 4)
        {
          simenScratchCount = 0;
          simen.frame = 9;
        }
    }
  else if (simen.frame == 9 && simenStateCount > 40)
    {
      simen.frame = 10;
      simenStateCount = 0;
    }
  else if (simen.frame == 10 && simenStateCount > 8)
    {
      simen.frame = 11;
      simenStateCount = 0;
    }
  else if (simen.frame == 11 && simenStateCount > 40)
    {
      simen.frame = 12;
      simenStateCount = 0;
    }
  else if (simen.frame == 12 && simenStateCount > 8)
    {
      ohno = true;
      simen.frame = 13;
      simenStateCount = 0;
    }
  else if (simen.frame == 13 && simenStateCount > 8)
    {
      simen.frame = 12;
      simenStateCount = 0;
      simenScratchCount += 1;
      if (simenScratchCount > 8)
        {
          simenScratchCount = 0;
          simen.frame = 5;
          waitingInput = true;
          ohno = false;
        }
    }
  else if (simen.frame == 5 && simenStateCount > 16 && waitingInput)
    {
      simen.frame = 6;
      simenStateCount = 0;
    }
  else if (simen.frame == 14 && simenStateCount > 40)
    {
      simen.frame = 15;
      simenStateCount = 0;
    }
  else if (simen.frame == 15 && simenStateCount > 16)
    {
      simen.frame = 16;
      simenStateCount = 0;
    }
  else if (simen.frame == 16 && simenStateCount > 16)
    {
      simen.frame = 15;
      simenStateCount = 0;
      simenScratchCount += 1;
      if (simenScratchCount > 6)
        {
          simenScratchCount = 0;
          simen.frame = 17;
        }
    }
  else if (simen.frame == 17 && simenStateCount > 8)
    {
      simen.frame = 18;
      simenStateCount = 0;
    }
  else if (simen.frame == 18 && simenStateCount > 8)
    {
      simen.frame = 19;
      simenStateCount = 0;
      var random = Math.floor(Math.random() * pool.length);
      foundIndex = pool[random];
      pool.splice(random, 1);
      found = new visualObject(170 - portfolio[foundIndex].width / 8, 8, portfolio[foundIndex].width / 4, portfolio[foundIndex].height / 4, [portfolio[foundIndex].image]);
    }
  else if (simen.frame == 19 && simenStateCount > 16)
    {
      simen.frame = 20;
      simenStateCount = 0;
    }
  else if (simen.frame == 20 && simenStateCount > 16)
    {
      simen.frame = 21;
      simenStateCount = 0;
    }
  else if (simen.frame == 21 && simenStateCount > 8)
    {
      look = true;
      simen.frame = 22;
      simenStateCount = 0;
    }
  else if (simen.frame == 22 && simenStateCount > 8)
    {
      simen.frame = 21;
      simenStateCount = 0;
      simenScratchCount += 1;
      if (simenScratchCount > 6)
        {
          simenScratchCount = 0;
          simen.frame = 23;
          look = false;
          found.width = portfolio[foundIndex].width / 2;
          found.height = portfolio[foundIndex].height / 2;
          found.x = 130 - portfolio[foundIndex].width / 4;
          found. y = 16;
        }
    }
  else if (simen.frame == 23 && simenStateCount > 16)
    {
      simen.frame = 12;
      simenStateCount = 0;
      var rectElement;
      for (var x = 0; x < document.getElementsByClassName(portfolio[foundIndex].visibility).length; x++)
        {
          document.getElementsByClassName(portfolio[foundIndex].visibility)[x].classList.remove("zeroHeight");
          document.getElementsByClassName(portfolio[foundIndex].visibility)[x].style.transform = "scale(1,1.1)";
          document.getElementsByClassName(portfolio[foundIndex].visibility)[x].style.transformOrigin = "center";
          //document.getElementsByClassName(portfolio[foundIndex].visibility)[x].style.zIndex = 120;
          if (x == 0 || (portfolio[foundIndex].visibility == "vMoney" && x == document.getElementsByClassName(portfolio[foundIndex].visibility).length - 1))
            {
              rectElement = document.getElementsByClassName(portfolio[foundIndex].visibility)[x];
            }
        }
      setTimeout(function() {
        for (var x = 0; x < document.getElementsByClassName(portfolio[foundIndex].visibility).length; x++)
        {
          document.getElementsByClassName(portfolio[foundIndex].visibility)[x].style.opacity = 1.0;
          document.getElementsByClassName(portfolio[foundIndex].visibility)[x].style.transform = "scale(1,1)";
        }
      }, 500);
      setTimeout(function() {
        document.getElementById(portfolio[foundIndex].id).scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
      }, 500);
      setTimeout(function() {
        cameraShakeStep = 96;
        var rect = rectElement.getBoundingClientRect();
        grid.doParticles(rect, 100, null, 1);
      }, 1250);
      found = null;
    }
}

function gameTick() {
  simenState();
}

var cameraShakeStep = 0;
function cameraShake(x)
{
  if (x == 0)
    {
      document.body.style.top = 0;
      document.body.style.left = 0;
      return;
    }
  
  var vert = (Math.floor(x / 12) % 2 == 0) ? 1 : -1;
  var hor = (Math.floor(x / 8) % 2 == 0) ? 1 : -1;
  var intensity = Math.ceil((1 - (96 - x) / 96) * 3);
  
  document.body.style.top = intensity * 4 * vert;
  document.body.style.left = intensity * 4 * hor;
}

function draw() {
  gameArea.clear();
  
  simen.draw();
  if (simen.frame == 14)
    {
      pile.y = 146;
    }
  else if (simen.frame > 14)
    {
      if (simenStateCount > 8)
        {
          pile.y = 166;
        }
      else
        {
          pile.y = 158;
        }
    }
  else
    {
      pile.y = 140;
    }
  pile.draw();
  if (overPile)
    {
      rummage.draw();
    }
  if (ohno)
    {
      ohnoText.draw();
    }
  if (found != null || found != undefined)
    {
      found.draw();
    }
  if (look)
    {
      lookText.draw();
    }
  
  if (cameraShakeStep > 0)
    {
      cameraShakeStep -= 1;
      cameraShake(cameraShakeStep);
    }
  
  window.requestAnimFrame(draw);
}

gameArea.init();
var simen = new visualObject(0, 0, 256, 240, [
  "Images/hardmode/def1.png",
  "Images/hardmode/notice1.png",
  "Images/hardmode/notice2.png",
  "Images/hardmode/notice3.png",
  "Images/hardmode/notice4.png",
  "Images/hardmode/think1.png",
  "Images/hardmode/think2.png",
  "Images/hardmode/scratch1.png",
  "Images/hardmode/scratch2.png",
  "Images/hardmode/exclaim1.png",
  "Images/hardmode/exclaim2.png",
  "Images/hardmode/exclaim3.png",
  "Images/hardmode/complain1.png",
  "Images/hardmode/complain2.png",
  "Images/hardmode/dig1.png",
  "Images/hardmode/dig2.png",
  "Images/hardmode/dig3.png",
  "Images/hardmode/pickup1.png",
  "Images/hardmode/pickup2.png",
  "Images/hardmode/pickup3.png",
  "Images/hardmode/pickup5.png",
  "Images/hardmode/pickup3.png",
  "Images/hardmode/pickup4.png",
  "Images/hardmode/show1.png"
]);

var pile = new visualObject(53, 140, 140, 100, ["Images/hardmode/pile1.png", "Images/hardmode/pile2.png"]);
var rummage = new visualObject(40, 120, 176, 11, ["Images/hardmode/rummage.png"]);
var ohnoText = new visualObject(56, 80, 144, 22, ["Images/hardmode/ohno.png"]);
var lookText = new visualObject(51, 80, 164, 11, ["Images/hardmode/look.png"]);
var found;

var pool = [];
var started = false;
var coinFuncs = [];
function createCoinFunc(element) {
  return function()
  {
    addMoney(element.getBoundingClientRect());
  };
}
function hardmodeStart()
{
  if (started)
    {
      return;
    }
  document.getElementById("hardmodeButton").remove();
  started = true;
  for (var x = 0; x < document.getElementsByClassName("hardmodeTextContainer").length; x++)
        {
          document.getElementsByClassName("hardmodeTextContainer")[x].style.visibility = "visible";
        }
  for (var i = 0; i < portfolio.length; i++)
    {
      for (x = 0; x < document.getElementsByClassName(portfolio[i].visibility).length; x++)
        {
          document.getElementsByClassName(portfolio[i].visibility)[x].style.opacity = 0.0;
          document.getElementsByClassName(portfolio[i].visibility)[x].classList.add("zeroHeight");
        }
      pool.push(i);
    }
  
  var coins = document.getElementsByClassName("vMoney");
  for (let c = 0; c < coins.length; c++)
    {
      if (coins[c].id != "pMoney")
        {
          coins[c].style.top = (Math.random() * 60 + 20) + "%";
          coins[c].style.left = (Math.random() * 60 + 20) + "%";
          var element = coins[c];
          coins[c].addEventListener("click", addMoney.bind(this, coins[c]), false);
        }
    }
  
  cameraShakeStep = 96;
  
  document.getElementById("hardmode").scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
  
  setInterval(gameTick, 18);
  window.requestAnimFrame(draw);
}