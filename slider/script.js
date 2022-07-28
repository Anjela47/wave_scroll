const images = ["url(./image1.jpeg)","url(./image2.jpg)","url(./image3.jpg)"]
const parts = 30
const partDivs = document.querySelectorAll(".partDiv")
const slider = document.querySelector(".slider")
let currentPage = 1;
const countOfPages = partDivs.length
let startY = 0
let deltaY = 0
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight
console.log(windowHeight)
let index = 0
const staggerVal = 65
const staggerStep = 4 
const changeAT = 0.5
const waveStagger = 0.013

const generateParts = ()=>{
    for(let i=0;i<partDivs.length;i++){
        for(let j=0;j<parts;j++){
            const div = document.createElement("div")
            let leftPart = j*windowWidth/parts+"px" 
            div.style.left = leftPart
            div.classList.add("part")
            div.classList.add(`part-${j}`) 
            div.style.width = windowWidth/parts + "px"
            div.style.backgroundImage = images[i]
            div.style.backgroundPosition = "-" + leftPart
            partDivs[i].appendChild(div)
        }
    }
}
window.onload = generateParts
document.addEventListener("mousedown",mouseDown)

function mouseDown(event){    startY = event.clientY
    deltaY = 0;
    document.addEventListener("mousemove",mouseMove)
    document.addEventListener("mouseup",mouseUp)
}

const mouseMove = (event)=>{
    const y = event.clientY
    const x = event.clientX
    index = Math.ceil(x / windowWidth * parts)
    deltaY = y - startY
    moveParts(deltaY, index)
}

const mouseUp = ()=>{
    document.removeEventListener("mousemove",mouseMove)
    document.removeEventListener("mouseup",mouseUp)
    if (!deltaY) return
    if (deltaY / windowHeight >= 0.5) navigateUp()
    if (deltaY / windowHeight <= -0.5) navigateDown()
    changePages()
}

function navigateUp() {
  if (currentPage > 1) currentPage--
};

function navigateDown() {
  if (currentPage < countOfPages) currentPage++
};

function moveParts(y, index) { 
  let leftMax = index - 1
  let rightMin = index - 1
  let stagLeft = 0
  let stagRight = 0
  let stagStepL = 0
  let stagStepR = 0
  let sign = (y > 0) ? -1 : 1
  let part1 = document.querySelectorAll(".part-"+index)
  movePart(part1, y)

  for (let i = leftMax; i >= 0; i--) { 
    const step = index - i
    let sVal = staggerVal - stagStepL
    stagStepL += (step <= 15) ? staggerStep : 1

    if (sVal < 0) sVal = 0
    stagLeft += sVal
    let nextY = y + stagLeft * sign 

    if (Math.abs(y) < Math.abs(stagLeft)) nextY = 0
    const part2 = document.querySelectorAll(".part-"+i)
    movePart(part2, nextY)
  }

 
  for (let j = rightMin; j <= parts; j++) {
    const step = j - index
    let sVal = staggerVal - stagStepR
    stagStepR += (step <= 15) ? staggerStep : 1
    if (sVal < 0) sVal = 0
    stagRight += sVal
    let nextY = y + stagRight * sign
    if (Math.abs(y) < Math.abs(stagRight)) nextY = 0
    const part3 = document.querySelectorAll(".part-"+j)
    movePart(part3, nextY);
  }
};

function movePart(part, y) {
  y = y - (currentPage - 1) * windowHeight
  TweenLite.to(part, changeAT, {y: y, ease: Back.easeOut.config(4)})
};

function changePages() {
  const y = (currentPage - 1) * windowHeight* -1
  const leftMax = index - 1
  const rightMin = index - 1
  let part = document.querySelectorAll(".part-"+index)
  TweenLite.to(part, changeAT, {y: y})

  for (let i = leftMax; i >= 0; i--) {
    const d = (index - i) * waveStagger
    part = document.querySelectorAll(".part-"+i)
    TweenLite.to(part, changeAT , {y: y, delay: d})
  }

  for (let j = rightMin; j <= parts; j++) {
    const d = (j - index) * waveStagger
    part = document.querySelectorAll(".part-"+j)
    TweenLite.to(part, changeAT , {y: y, delay: d})
  }
}



