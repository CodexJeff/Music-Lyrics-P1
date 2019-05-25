let words = [] //keep this line

let chords1 = ["[A]", "[A#]"]
let chords2 = ["[B]", "[B#]"]
let chords3 = ["[C]", "[C#]"]
let chords4 = ["[D]", "[D#]"]
let chords5 = ["[E]", "[E#]"]
let chords6 = ["[F]", "[F#]"]
let chords7 = ["[G]", "[G#]"]
let chords8 = ["[C#min]", "[D]"]
let chords9 = ["[G#min]", "[A]"]
let chords10 = ["[F#min]", "[G]"]
let chords11 = ["[Em]", "[F]"]
let chords12 = ["[B7]", "[B]"]
let chords13 = ["[F/A]", "[F]"]
let chords14 = ["[G/B]", "[G#]"]
let chords15 = ["[C/G]", "[C#]"]
let chords16 = ["[Bb]", "[B]"]
let chords17 = ["[Esus2]", "[E#]"]
let chords18 = ["[A#]", "[B]"]
let chords19= ["[B#]", "[C]"]
let chords20= ["[C#]", "[D]"]
let chords21 = ["[D#]", "[E]"]
let chords22 = ["[E#]", "[F]"]
let chords23 = ["[F#]", "[G]"]
let chords24 = ["[G#]", "[A]"]
let chords25 = ["[Am]", "[Bb]"]
let chords26 = ["[F]", "[F#min]"]
let chords27 = ["[C#min]", "[B7]"]
let chords28 = ["[C]", "[C#min]"]
let chords29 = ["[Bb]", "[Em]"]
let chords30 = ["[G]", "[G#min]"]
let chords31 = ["[E#]", "[Esus2]"]
let chords32 = ["[G#]", "[Am]"]

let wayPoints = [] //used for locations where the moving box has been
let timer //use for animation motion
let wordBeingMoved
let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {
  let context = canvas.getContext('2d')
  //checking bounds of words
  for (let i = 0; i < words.length; i++) {
    wordSize = context.measureText(words[i].word)
    if ((aCanvasX > words[i].x) && (aCanvasX < words[i].x + wordSize.width) && (aCanvasY > words[i].y - 20) && (aCanvasY < words[i].y)) {
      return words[i]
    }
  }
  return null
}

function drawCanvas() {
  let context = canvas.getContext('2d')
  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas
  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) {
    let data = words[i]
    context.fillText(data.word, data.x, data.y);
    context.strokeText(data.word, data.x, data.y)
  }
}

function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.clientX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.clientY - rect.top
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY - 15
    //document.addEventListener("mousemove", handleMouseMove, true)
    //document.addEventListener("mouseup", handleMouseUp, true)
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)
  }
  // Stop propagation of the event // TODO:  stop any default
  // browser behaviour
  e.stopPropagation()
  e.preventDefault()
  drawCanvas()
}

function handleMouseMove(e) {
  console.log("mouse move")
  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top
  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY
  e.stopPropagation()
  drawCanvas()
}

function handleMouseUp(e) {
  console.log("mouse up")
  e.stopPropagation()
  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler
  drawCanvas() //redraw the canvas
}

function handleTimer() {
  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

function handleKeyDown(e) {
  console.log("keydown code = " + e.which)
  let dXY = 5 //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
  movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
  movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
  movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
  movingBox.y += dXY //down arrow

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }
}

function handleKeyUp(e) {
  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)

    $.post("positionData", jsonString, function(data, status) {
      console.log("data: " + data)
      console.log("typeof: " + typeof data)
      let wayPoint = JSON.parse(data)
      wayPoints.push(wayPoint)
      for (let i in wayPoints) console.log(wayPoints[i])
    })
  }

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    $('#userTextField').val('') //clear the user text field
  }
  e.stopPropagation()
  e.preventDefault()
}

function handleSubmitButton() {
  //console.log('handleSubmitButton:'); //primary debugging strategy

  let userText = $('#userTextField').val(); //get text from user text input field
  if (userText && userText != '') {
    let textDiv = document.getElementById("text-area")
    //textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`
    //console.log(words)
    //user text was not empty
    console.log(userText)

    let userRequestObj = {
      text: userText
    } //make object to send to server
    console.log(userRequestObj)
    let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
    $('#userTextField').val('') //clear the user text field

    //Prepare a POST message for the server and a call back function
    //to catch the server repsonse.
    //alert ("You typed: " + userText)
    $.post("userText", userRequestJSON, function(data, status) {
      let responseObj = JSON.parse(data)
      let array = responseObj.wordArray.split("\n") //splitting the array into separate lines
      let newArray = []
      let ycord = 20; //setting the start value for x coordinate
      let xcord = 5; //setting the start value for y coordinate
      let newWords = []
      for (let i = 0; i < array.length; i++) {
        newArray = array[i].split(' ')
        responseObj.wordArray = newArray
        xcord = -100;
        ycord += 40;
        for (let j = 0; j < newArray.length; j++) {
          xcord += newArray[j].length + 10
          xcord += 90;
          newWords.push({
            word: newArray[j],
            x: xcord,
            y: ycord
          })
        }
        responseObj.wordArray = newWords
      }

      //clear text fields
      textDiv.innerHTML = $('#userTextField').val()
      textDiv.innerHTML = textDiv.innerHTML + `<p>${array}</p>`

      //replace word array with new words if there are any
      if (responseObj.wordArray) words = responseObj.wordArray
    })
  }
}

//deals with transposing up
function transposeUp() {
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < words.length; j++) {
      if (words[j].word === chords1[i]){
        words[j].word = chords1[i+1]
      }
      else if (words[j].word === chords2[i]){
        words[j].word = chords2[i+1]
      }
      else if (words[j].word === chords3[i]){
        words[j].word = chords3[i+1]
      }
      else if (words[j].word === chords4[i]){
        words[j].word = chords4[i+1]
      }
      else if (words[j].word === chords5[i]){
        words[j].word = chords5[i+1]
      }
      else if (words[j].word === chords6[i]){
        words[j].word = chords6[i+1]
      }
      else if (words[j].word === chords7[i]){
        words[j].word = chords7[i+1]
      }
      else if (words[j].word === chords8[i]){
        words[j].word = chords8[i+1]
      }
      else if (words[j].word === chords9[i]){
        words[j].word = chords9[i+1]
      }
      else if (words[j].word === chords10[i]){
        words[j].word = chords10[i+1]
      }
      else if (words[j].word === chords11[i]){
        words[j].word = chords11[i+1]
      }
      else if (words[j].word === chords12[i]){
        words[j].word = chords12[i+1]
      }
      else if (words[j].word === chords13[i]){
        words[j].word = chords13[i+1]
      }
      else if (words[j].word === chords14[i]){
        words[j].word = chords14[i+1]
      }
      else if (words[j].word === chords15[i]){
        words[j].word = chords15[i+1]
      }
      else if (words[j].word === chords16[i]){
        words[j].word = chords16[i+1]
      }
      else if (words[j].word === chords17[i]){
        words[j].word = chords17[i+1]
      }
      else if (words[j].word === chords18[i]){
        words[j].word = chords18[i+1]
      }
      else if (words[j].word === chords19[i]){
        words[j].word = chords19[i+1]
      }
      else if (words[j].word === chords20[i]){
        words[j].word = chords20[i+1]
      }
      else if (words[j].word === chords21[i]){
        words[j].word = chords21[i+1]
      }
      else if (words[j].word === chords22[i]){
        words[j].word = chords22[i+1]
      }
      else if (words[j].word === chords23[i]){
        words[j].word = chords23[i+1]
      }
      else if (words[j].word === chords24[i]){
        words[j].word = chords24[i+1]
      }
      else if (words[j].word === chords25[i]){
        words[j].word = chords25[i+1]
      }
      else if (words[j].word === chords26[i]){
        words[j].word = chords26[i+1]
      }
      else if (words[j].word === chords27[i]){
        words[j].word = chords27[i+1]
      }
      else if (words[j].word === chords28[i]){
        words[j].word = chords28[i+1]
      }
      else if (words[j].word === chords29[i]){
        words[j].word = chords29[i+1]
      }
      else if (words[j].word === chords30[i]){
        words[j].word = chords30[i+1]
      }
      else if (words[j].word === chords31[i]){
        words[j].word = chords31[i+1]
      }
      else if (words[j].word === chords32[i]){
        words[j].word = chords32[i+1]
      }
    }
  }
}

//deals with transposing down
function transposeDown() {
  for (let i = 1; i > 0; i--) {
    for (let j = 0; j < words.length; j++) {
      if (words[j].word === chords1[i]){
        words[j].word = chords1[i-1]
      }
      else if (words[j].word === chords2[i]){
        words[j].word = chords2[i-1]
      }
      else if (words[j].word === chords3[i]){
        words[j].word = chords3[i-1]
      }
      else if (words[j].word === chords4[i]){
        words[j].word = chords4[i-1]
      }
      else if (words[j].word === chords5[i]){
        words[j].word = chords5[i-1]
      }
      else if (words[j].word === chords6[i]){
        words[j].word = chords6[i-1]
      }
      else if (words[j].word === chords7[i]){
        words[j].word = chords7[i-1]
      }
      else if (words[j].word === chords8[i]){
        words[j].word = chords8[i-1]
      }
      else if (words[j].word === chords9[i]){
        words[j].word = chords9[i-1]
      }
      else if (words[j].word === chords10[i]){
        words[j].word = chords10[i-1]
      }
      else if (words[j].word === chords11[i]){
        words[j].word = chords11[i-1]
      }
      else if (words[j].word === chords12[i]){
        words[j].word = chords12[i-1]
      }
      else if (words[j].word === chords13[i]){
        words[j].word = chords13[i-1]
      }
      else if (words[j].word === chords14[i]){
        words[j].word = chords14[i-1]
      }
      else if (words[j].word === chords15[i]){
        words[j].word = chords15[i-1]
      }
      else if (words[j].word === chords16[i]){
        words[j].word = chords16[i-1]
      }
      else if (words[j].word === chords17[i]){
        words[j].word = chords17[i-1]
      }
      else if (words[j].word === chords18[i]){
        words[j].word = chords18[i-1]
      }
      else if (words[j].word === chords19[i]){
        words[j].word = chords19[i-1]
      }
      else if (words[j].word === chords20[i]){
        words[j].word = chords20[i-1]
      }
      else if (words[j].word === chords21[i]){
        words[j].word = chords21[i-1]
      }
      else if (words[j].word === chords22[i]){
        words[j].word = chords22[i-1]
      }
      else if (words[j].word === chords23[i]){
        words[j].word = chords23[i-1]
      }
      else if (words[j].word === chords24[i]){
        words[j].word = chords24[i-1]
      }
      else if (words[j].word === chords25[i]){
        words[j].word = chords25[i-1]
      }
      else if (words[j].word === chords26[i]){
        words[j].word = chords26[i-1]
      }
      else if (words[j].word === chords27[i]){
        words[j].word = chords27[i-1]
      }
      else if (words[j].word === chords28[i]){
        words[j].word = chords28[i-1]
      }
      else if (words[j].word === chords29[i]){
        words[j].word = chords29[i-1]
      }
      else if (words[j].word === chords30[i]){
        words[j].word = chords30[i-1]
      }
      else if (words[j].word === chords31[i]){
        words[j].word = chords31[i-1]
      }
      else if (words[j].word === chords32[i]){
        words[j].word = chords32[i-1]
      }
    }
  }
}

$(document).ready(function() {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  $(document).keydown(handleKeyDown)
  $(document).keyup(handleKeyUp)

  timer = setInterval(handleTimer, 100)
  //clearTimeout(timer) //to stop

  drawCanvas()
})
