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