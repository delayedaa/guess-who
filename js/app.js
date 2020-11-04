// document.addEventListener('DOMContentLoaded', () => {


// Variables and DOM elements

let twoPlayers = false;
let gameOver = false;
let player1 = true;
let player1Score = 0;
let player2Score = 0;
let player1MysteryPerson;
let player2MysteryPerson;
let possibilities = allPeople;
let computerFirstQuestion = true;
let feature;
let adjective;

let inputFeature = document.getElementById('user-feature');
let inputAdjective = document.getElementById('user-adjective');
let inputResponse = document.getElementById('user-response');
let inputGuess = document.getElementById('user-guess');
let buttonStart = document.getElementById('button-start');
let buttonAsk = document.getElementById('button-ask');
let buttonNext = document.getElementById('button-next');
let buttonAnswer = document.getElementById('button-answer');
let buttonGuess = document.getElementById('button-guess');
let secMysteryPerson = document.getElementById('sec-mystery-person');
let secQuestion = document.getElementById('sec-question');
let secGuess = document.getElementById('sec-guess');
let divUserQuestion = document.getElementById('div-user-question');
let divNextQuestion = document.getElementById('div-next-question');
let divUserResponse = document.getElementById('div-user-response');
let mysteryPerson = document.querySelector('#sec-mystery-person h3');
let currentQuestion = document.getElementById('current-question');
let currentResponse = document.getElementById('current-response');
let outcome = document.getElementById('outcome');

let searchableKeys = Object.keys(allPeople[0]).filter(key => {
  if (key !== 'name' && key !== 'gender') {
    return true;
  } else {
    return false;
  }
});



// Helper functions

let pickRandomNum = maxNum => {
  return Math.floor(Math.random() * maxNum);
};

let displayQuestion = () => {
  if (feature === 'gender') {
    currentQuestion.textContent = `Is your person a ${adjective}?`;
  } else if (feature.endsWith('s') || feature === 'hair') {
    if (!adjective) {
      currentQuestion.textContent = `Does your person have ${feature}?`;
    } else {
      currentQuestion.textContent = `Does your person have ${adjective} ${feature}?`;
    }
  } else {
    if (!adjective) {
      currentQuestion.textContent = `Does your person have a ${feature}?`;
    } else {
      currentQuestion.textContent = `Does your person have a ${adjective} ${feature}?`;
    }
  }
};

let checkForValidQuestion = () => {
  let test1 = possibilities.some(person => person[feature].length);
  let test2 = possibilities.every(person => person[feature].includes(adjective));
  if (!test1) {
    return false;
  } else if (test2) {
    return false;
  } else {
    return true;
  }
};

let displayGuess = (string) => {
  outcome.innerText = string;
  secMysteryPerson.classList.add('hidden');
  secQuestion.classList.add('hidden');
  inputGuess.classList.add('hidden');
  buttonGuess.classList.add('hidden');
};



// Primary functions

let assignMysteryPerson = () => {
  let randomNum1 = pickRandomNum(allPeople.length);
  let randomNum2 = pickRandomNum(allPeople.length);
  while (randomNum2 === randomNum1) {
    randomNum2 = pickRandomNum(allPeople.length);
  }
  player1MysteryPerson = allPeople[randomNum1];
  player2MysteryPerson = allPeople[randomNum2];
  // Handle display ————————————————————
  mysteryPerson.textContent = `Your Mystery Person is ${player1MysteryPerson.name}.`;
  buttonStart.classList.add('hidden');
  secQuestion.classList.remove('hidden');
  secGuess.classList.remove('hidden');
  console.log(player1MysteryPerson, player2MysteryPerson); // Test
};

let handleUserQuestion = () => {
  feature = inputFeature.value;
  adjective = inputAdjective.value;
  if (player2MysteryPerson[feature].includes(adjective) || (!adjective && player2MysteryPerson[feature].length > 0)) {
    currentResponse.textContent = 'Yes.';
  } else {
    currentResponse.textContent = 'No.';
  }
  // Handle display ————————————————————
  displayQuestion();
  divUserQuestion.classList.add('hidden');
  divNextQuestion.classList.remove('hidden');
};

let handleComputerQuestion = () => {
  if (computerFirstQuestion) {
    feature = 'gender';
    adjective = 'man';
    computerFirstQuestion = false;
  } else {
    // Pick a feature ————————————————————
    feature = searchableKeys[pickRandomNum(searchableKeys.length)];
    // Pick an adjective ————————————————————
    let searchableValues = [];
    possibilities.forEach(person => {
      searchableValues = searchableValues.concat(person[feature]);
    });
    adjective = searchableValues[pickRandomNum(searchableValues.length)];
    // Check if the feature and adjective are valid ————————————————————
    let validQuestion = checkForValidQuestion();
    while (!validQuestion) {
      feature = searchableKeys[pickRandomNum(searchableKeys.length)];
      let searchableValues = [];
      possibilities.forEach(person => {
        searchableValues = searchableValues.concat(person[feature]);
      });
      adjective = searchableValues[pickRandomNum(searchableValues.length)];
      validQuestion = checkForValidQuestion();
    }
  }
  // Handle display ————————————————————
  displayQuestion();
  divNextQuestion.classList.add('hidden');
  divUserResponse.classList.remove('hidden');
  currentResponse.textContent = '';
  inputResponse.value = '';
};

let handleUserResponse = () => {
  if (inputResponse.value === 'yes') {
    possibilities = possibilities.filter(person => person[feature].includes(adjective));
  } else {
    possibilities = possibilities.filter(person => !person[feature].includes(adjective));
  }
  if (possibilities.length === 1) {
    displayGuess(`I want to make a guess: ${player1MysteryPerson.name} is your Mystery Person! I win!`); // Future feature 1
  } else {
    // Handle display ————————————————————
    divUserResponse.classList.add('hidden');
    divUserQuestion.classList.remove('hidden');
    currentQuestion.textContent = '';
    inputFeature.value = '';
    inputAdjective.value = '';
    console.log(possibilities); // Test
  }
};

let handleUserGuess = () => {
  if (inputGuess.value === player2MysteryPerson.name) {
    displayGuess(`${player2MysteryPerson.name} is correct! You win!`);
  } else {
    displayGuess(`${inputGuess.value} is not correct. My Mystery Person is ${player2MysteryPerson.name}. Sorry, you lose.`);
  }
};

let handleComputerGuess = () => {
}



// Event listeners

buttonStart.addEventListener('click', assignMysteryPerson);
buttonAsk.addEventListener('click', handleUserQuestion);
buttonNext.addEventListener('click', handleComputerQuestion);
buttonAnswer.addEventListener('click', handleUserResponse);
buttonGuess.addEventListener('click', handleUserGuess);



// });





// Future features
// 1. Have the computer guess its last possibility, instead of the actual solution. In order for this to work, you'll need to check the accuracy of every question the user asked.