/*eslint-env browser*/

var grid = {
    pixels : [],
    weight : [],
    particles : [],
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
                        this.weight[y].push(rand * rand * 0.5 + 0.1);
                    }
            }
    },
    draw : function()
    {
        c = ditherArea.context;
        c.fillStyle = "rgb(0,0,0)";
        for (var x = 0; x < this.pixels.length; x++)
            {
                for (var y = 0; y < this.pixels.length; y++)
                    {
                        if (this.pixels[x][y] < 1) 
                        {
                            //c.fillStyle = "rgb(" + this.pixels[x][y] + " " + this.pixels[x][y] + " " + this.pixels[x][y] + ")";
                            c.fillRect(x,y,1,1);
                        }
                    }
            }
        c.fillStyle = "rgb(255,255,255)";
        for (var i = this.particles.length - 1; i >= 0; i--)
            {
                this.particles[i].Draw();
            }
    },
    step : function()
    {
        for (var x = 0; x < this.pixels.length; x++)
            {
                for (var y = 0; y < this.pixels.length; y++)
                    {
                        if (this.pixels[x][y] < 1)
                            {
                                var step = (ditherArea.landscape ? x : y) / this.pixels.length;
                                this.pixels[x][y] += ditherArea.landscape ? this.weight[x][y] * (-1 * Math.pow(step, 2) + 1 * step) * 0.6 + 0.01 : this.weight[x][y] * (Math.pow(step, 2) + 0.01);
                            }
                    }
            }
        for (var i = this.particles.length - 1; i >= 0; i--)
            {
                this.particles[i].Update();
                if (this.particles[i].ShouldDie())
                    {
                        this.particles.pop();
                    }
            }
    },
    doParticles : function(rect, instensity, target, speed)
    {
        var rand = Math.floor(Math.random() * instensity) + instensity;
        
        var xCenter = rect.left + rect.width / 2;
        var yCenter = rect.top + rect.height / 2;
        
        for (var i = 0; i < rand; i++)
            {
                var randomX = Math.random() < 0.5;
                var xOffset = randomX ? Math.random() : 0;
                var yOffset = randomX ? 0 : Math.random();
                
                var x = i < rand / 2 ? rect.right - xOffset * rect.width : rect.left + xOffset * rect.width;
                var y = (i > rand / 4 && i < 3 * rand / 4) ? rect.bottom - yOffset * rect.height : rect.top + yOffset * rect.height;
                
                var xDir = x - xCenter;
                var yDir = y - yCenter;
                
                var magnitude = Math.sqrt(xDir * xDir + yDir * yDir);
                
                xDir /= magnitude;
                yDir /= magnitude;
                
                var coords = ditherArea.screenToDither(x, y);
                this.particles.push(new particle(coords[0], coords[1], Math.random() * xDir * speed, Math.random() * yDir * speed, target));
            }
    }
};

function particle(x,y,xVel,yVel, target)
{
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.target = target !=  null ? ditherArea.screenToDither(target[0], target[1]) : null;
    this.time = 0;
    this.Update = function()
    {
        this.x += this.xVel;
        this.y += this.yVel;
        this.yVel += 0.01;
        if (this.target != null && this.time > 50)
            { 
                var xDir = this.target[0] - this.x;
                var yDir = this.target[1] - this.y;
                
                var magnitude = Math.sqrt(xDir * xDir + yDir * yDir);
                
                xDir /= magnitude;
                yDir /= magnitude;
                
                this.xVel *= 0.99;
                this.yVel *= 0.99;
                
                this.xVel += xDir / Math.ceil(magnitude * 0.5) + xDir * 0.02;
                this.yVel += yDir / Math.ceil(magnitude * 0.5) + yDir * 0.02;
            }
        this.time += 1;
    };
    
    this.ShouldDie = function()
    {
        if (this.target != null)
            {
                if (Math.abs(this.target[0] - this.x) < 5 && Math.abs(this.target[1] - this.y) < 5)
                    {
                        return true;
                    }
                return this.y > 240 || this.time > 1000;
            }
    };
    
    this.Draw = function()
    {
        c = ditherArea.context;
        c.fillRect(Math.round(this.x),Math.round(this.y),1,1);
    };
}

//Defining the canvas area
var ditherArea = {
    canvas : document.getElementById("dither"),
    init : function () {
        this.canvas.width = 240;
        this.canvas.height = 240;
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.landscape = document.documentElement.clientWidth > document.documentElement.clientHeight;
        this.scale = Math.max(document.documentElement.clientWidth / 240, document.documentElement.clientHeight / 240);
        this.widthToHeightRatio = document.documentElement.clientHeight / document.documentElement.clientWidth;
        this.heightToWidthRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;
        this.canvas.style.transform = "scale(" + this.scale + "," + this.scale + ")";
        this.canvas.parentElement.style.backgroundColor = "transparent";  
    },
    clear : function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    screenToDither : function(x, y) {
        return [
            (x / document.documentElement.clientWidth) * 240 * (this.landscape ? 1 : ditherArea.heightToWidthRatio),
            (y / document.documentElement.clientHeight) * 240 * (this.landscape ? ditherArea.widthToHeightRatio : 1)
        ];
    }
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame;})();


function animateFrame()
{
    ditherArea.clear();
    grid.step();
    grid.draw();
    requestAnimFrame(animateFrame);
}

grid.init();
ditherArea.init();
grid.draw();

var fadedOut = false;

window.addEventListener("DOMContentLoaded", function() {
    setTimeout(function(){
        if (fadedOut) {
            return;
        }
        fadedOut = true;
        setTimeout(animateFrame, 300);
    }, 3000);
});

window.addEventListener('load', function () {
    if (fadedOut) {
        return;
    }
    fadedOut = true;
    setTimeout(animateFrame, 300);
});
