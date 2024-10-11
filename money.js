var money = 0;

function addMoney(rect)
{
    targetRect = document.getElementById("pMoney").getBoundingClientRect();
    target = [targetRect.left + (targetRect.right - targetRect.left) / 3, targetRect.top + (targetRect.bottom - targetRect.top) / 2];
    grid.doParticles(rect.getBoundingClientRect(), 40, target, 0.5);
    rect.style.display = "none";
    
    elem = document.getElementById("pMoney").getElementsByClassName("moneyAnim");
    for (var i = 0; i < elem.length; i++)
        {
            elem[i].classList.remove("moneyAdd");
            elem[i].style.animationDelay = (i * 0.03) + "s";
            void elem[i].offsetWidth; // trigger reflow
            elem[i].classList.add("moneyAdd");
        }
    
    money += 1;
    document.getElementById("moneyCount").innerHTML = money;
    
}