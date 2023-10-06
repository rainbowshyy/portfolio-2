/*eslint-env browser*/

var name = "imen Barstad Skjevdal";
var characterCurrent = 0;

function TypeCharacter()
{
  document.getElementById("name_title").textContent += name[characterCurrent];
  characterCurrent += 1;
  if (characterCurrent < name.length)
    {
      setTimeout(TypeCharacter, 40 + Math.random() * 40);
    }
}
document.getElementById("name_title").textContent = "S";
setTimeout(TypeCharacter, 100);