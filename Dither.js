/*eslint-env browser*/

var grid = {
    pixels : [],
    weight : [],
    init : function()
    {
        for (var y = 0; y < 240; y++)
            {
                this.pixels.push([]);
                this.weight.push([]);
                for (var x = 0; x < 240; x++)
                    {
                        this.pixels[y].push(0);
                        var rand = Math.random();
                        this.weight[y].push(rand * rand + 0.08);
                    }
            }
    },
    draw : function()
    {
        c = gameArea.context;
        for (var x = 0; x < this.pixels.length; x++)
            {
                for (var y = 0; y < this.pixels.length; y++)
                    {
                        if (this.pixels[x][y] < 1) 
                        {
                            //c.fillStyle = "rgb(" + this.pixels[x][y] + " " + this.pixels[x][y] + " " + this.pixels[x][y] + ")";
                            c.fillStyle = "rgb(0,0,0)";
                            c.fillRect(x,y,1,1);
                        }
                    }
            }
    },
    step : function()
    {
        var vert = 1 / this.pixels.length;
        for (var x = 0; x < this.pixels.length; x++)
            {
                for (var y = 0; y < this.pixels.length; y++)
                    {
                        if (this.pixels[x][y] < 1)
                            {
                                this.pixels[x][y] += this.weight[x][y] * y * vert + 0.001;
                            }
                    }
            }
    }
};

//Defining the canvas area
var gameArea = {
    canvas : document.getElementById("dither"),
    init : function () {
        this.canvas.width = 240;
        this.canvas.height = 240;
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        var scale = Math.max(document.documentElement.clientWidth / 960, document.documentElement.clientHeight / 540);
        this.canvas.style.transform = "scale(" + scale + "," + scale + ")";
    },
    clear : function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame;})();


function animateFrame()
{
    gameArea.clear();
    grid.step();
    grid.draw();
    requestAnimFrame(animateFrame);
}

grid.init();
gameArea.init();
grid.draw();
window.addEventListener('load', function () {
    setTimeout(animateFrame, 300);
});
