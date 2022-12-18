//Initialize the game board

//Function Calls
initBoard()
initCatRow()

////Functions 
function randInt() {
  return Math.floor(Math.random() * 5500 + 1)
}

function initCatRow() {
  let catRow = document.querySelector('.categoryRow')

  for (let j = 0; j < 6; j++) {
    let box = document.createElement('div')
    box.className = 'clueBox categoryBox'
    catRow.appendChild(box)
}
}

function initBoard() {
  let board = document.querySelector('.clueBoard')

  for (let i = 1; i < 6; i++) {
    let row = document.createElement('div')
    let boxValue = 200 * i
    row.className = 'clueRow'

    for (let j = 0; j < 6; j++) {
      let box = document.createElement('div')
      box.className = 'clueBox'
      box.textContent = `$${boxValue}`
      //box.appendChild(document.createTextNode(boxValue)) //for older browsers
      box.addEventListener('click', getClue)
      row.appendChild(box)
    }
    board.appendChild(row)   
  }
}


/////API FETCH

document.querySelector('button').addEventListener('click', buildCategories)

let catArray = []

function buildCategories() {

	if (!(document.querySelector('.categoryRow').firstChild.innerText == '')) {
		resetBoard()
	}

  const fetchReq1 = fetch(
    `https://jservice.io/api/category?&id=${randInt()}`
  ).then((res) => res.json());

  const fetchReq2 = fetch(
    `https://jservice.io/api/category?&id=${randInt()}`
  ).then((res) => res.json());

  const fetchReq3 = fetch(
    `https://jservice.io/api/category?&id=${randInt()}`
  ).then((res) => res.json());

  const fetchReq4 = fetch(
    `https://jservice.io/api/category?&id=${randInt()}`
  ).then((res) => res.json());

  const fetchReq5 = fetch(
    `https://jservice.io/api/category?&id=${randInt()}`
  ).then((res) => res.json());

  const fetchReq6 = fetch(
    `https://jservice.io/api/category?&id=${randInt()}`
  ).then((res) => res.json());

    const allData = Promise.all([fetchReq1,fetchReq2,fetchReq3,fetchReq4,fetchReq5,fetchReq6])

    allData.then((res) => {
      console.log(res)
      catArray = res
	  setCategories(catArray)
    })
}

// Reset board and score

function resetBoard(){
	let clueParent = document.querySelector('.clueBoard')
	while (clueParent.firstChild) {
		clueParent.removeChild(clueParent.firstChild)
	}
	let catParent = document.querySelector('.categoryRow')
	while (catParent.firstChild) {
		catParent.removeChild(catParent.firstChild)
	}
	document.getElementById('score').innerText = 0
	initBoard()
	initCatRow()
}


//Load categories to the top category row

function setCategories() {
	let element = document.querySelector('.categoryRow')
	let children = element.children;
		for (let i = 0; i < children.length; i++) {
			children[i].innerText = catArray[i].title;
		}
}

//Find clue from which box was clicked

function getClue(event) {
	let child = event.currentTarget
	// console.log(child)
	child.classList.add('clickedBox')
	let boxValue = child.innerHTML.slice(1)
	let parent = child.parentNode
	let index = Array.prototype.findIndex.call(parent.children, (c) => c === child)
	let cluesList = catArray[index].clues
	let clue = cluesList.find(obj => {
		return obj.value == boxValue
	})
	showQuestion(clue, child, boxValue)
}


//Show question to user, get their answer

function showQuestion(clue, target, boxValue) {
	let userAnswer = prompt(clue.question).toLowerCase()
	let correctAnswer = clue.answer.toLowerCase().replace(/<\/?[^>]+(>|$)/g, "")
	let possiblePoints = +(boxValue)
	target.innerHTML = clue.answer
	target.removeEventListener('click', getClue, false)
	evaluateAnswer(userAnswer, correctAnswer, possiblePoints)
}

//Check user answer

function evaluateAnswer(userAnswer, correctAnswer, possiblePoints) {
	let checkAnswer = (userAnswer == correctAnswer) ? 'correct' : 'incorrect'
	let confirmAnswer = ''
	console.log(checkAnswer)
	if (checkAnswer == 'incorrect') {
	confirmAnswer = 
	confirm(`You answered ${userAnswer} and the correct answer was ${correctAnswer}. Press OK to accept your answer and get points (no one is looking) or Cancel to not cheat.`)
	}
	awardPoints(checkAnswer, confirmAnswer, possiblePoints)
}

//Award points
function awardPoints(checkAnswer, confirmAnswer, possiblePoints) {
	if ((checkAnswer == 'incorrect' && confirmAnswer == true)) {
		let target = document.getElementById('score')
		let currentScore = +(target.innerText)
		currentScore += possiblePoints
		target.innerHTML = currentScore
	} else {
		alert('No points for you!')
	}
}


//////////////////

//Function to test for broken API category ID links. Needs promise or async approach?

function testCategoryIDs() {
  let errorCount = 0;
  let validIDs = []

  for (let i = 5146 ; i <= 5570; i++) {
    fetch(
      `https://jservice.io/api/category?&id=${i}`
    ).then(res => res.json())
     .then(data => {

        if (data.id) {
          validIDs.push(data.id)
        } else {
          errorCount ++
        }
     })
  }
  console.log(`# of errors: ${errorCount}`)
  console.log(validIDs)
}