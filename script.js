// Game configuration and state variables
const GOAL_CANS = 20;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let easyTime = 30;         // Time limit for the game in seconds
let hardTime = 20;         // Time limit for hard mode
let veryHardTime = 10;
let easyInterval = 1000;      // Spawn interval for easy mode in milliseconds
let hardInterval = 700;      // Spawn interval for hard mode in milliseconds
let veryHardInterval = 200;
let timeSetting = easyTime; // Default time setting
let spawnIntervalTime = easyInterval; // Default spawn interval
let timer = document.getElementById('timer'); // Reference to the timer display element
let score = document.getElementById('current-cans'); // Reference to the score display element
let instructions = document.querySelector('.game-instructions'); // Reference to the instructions element
let popupContainer = document.querySelector('.game-over-popup-container'); // Reference to the game over popup container
let popup = document.querySelector('.game-over-popup'); // Reference to the game over popup element
let timeBar = document.querySelector('.timer-bar'); // Reference to the timer bar element
let backgroundFill = document.querySelector('.background-fill'); // Reference to the background fill element

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  instructions.textContent = `Collect ${GOAL_CANS} water cans to complete the game!`;
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Set up click handler for collecting water cans
  document.querySelector('.game-grid').addEventListener('click', function(event) {
    if (event.target.classList.contains('water-can')) {
      const cells = document.querySelectorAll('.grid-cell');
      currentCans++; // Increment the count of collected items
      backgroundFill.style.height = `${(currentCans - 1) / GOAL_CANS * 80}%`; // Update the background fill based on progress
      backgroundFill.style.animation = 'none'; // Reset animation to allow it to restart
      backgroundFill.offsetHeight; // Trigger reflow to restart the animation
      backgroundFill.style.animation = 'slideUp 0.5s ease-in-out forwards'; // Add slide-up animation when collecting an item
      score.textContent = currentCans; // Update the score display
      cells.forEach(cell => (cell.innerHTML = '')); // Clear the grid to remove the collected item
      if (currentCans >= GOAL_CANS) {
        endGame(); // End the game if the goal is reached
      }
    }
  });

// Set up change handler for difficulty selection
document.getElementById('difficulty').addEventListener('change', function() {
  if (this.value === 'easy') {
    timeSetting = easyTime; // Set time limit for easy mode
    spawnIntervalTime = easyInterval; // Set spawn interval for easy mode
  } else if (this.value === 'hard') {
    timeSetting = hardTime; // Set time limit for hard mode
    spawnIntervalTime = hardInterval; // Set spawn interval for hard mode
  } else if (this.value === 'very-hard') {
    timeSetting = veryHardTime; // Set time limit for very hard mode
    spawnIntervalTime = veryHardInterval; // Set spawn interval for very hard mode
  }
  console.log(`Difficulty set to ${this.value}. Time: ${timeSetting}s, Spawn Interval: ${spawnIntervalTime}ms`); // Log the selected difficulty and settings
});


// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  backgroundFill.style.height = '0%'; // Reset the background fill to empty
  let startGameButton = document.getElementById('start-game');
  document.getElementById('difficulty').disabled = true; // Disable difficulty selection during the game
  timeBar.style.animation = 'none'; // Ensure the timer bar animation is running
  timeBar.offsetHeight; // Trigger reflow to restart the animation
  startGameButton.textContent = 'Game In Progress!'; // Reset the start button text
  startGameButton.style.backgroundColor = '#cf2222'; // Change button color to indicate game is active
  timer.textContent = timeSetting; // Reset the timer display to the current time setting
  score.textContent = '0'; // Reset the score display to 0
  timeBar.style.animation = `timerBar ${timeSetting}s linear forwards`; // Start the timer bar animation
  currentCans = 0; // Reset the count of collected items
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, spawnIntervalTime); // Spawn water cans based on difficulty
  timeInterval = setInterval(() => {
    // Update the timer display
    if (gameActive) {
        timer.textContent = parseInt(timer.textContent) - 1;
    }
  }, 1000); // Placeholder for any time-based updates (e.g., timer display)

  // Timer to end the game after the time setting expires
  gameTimeout = setTimeout(() => {
    if (gameActive) {
      endGame(); // End the game when time runs out
    }
    grid.innerHTML = ''; // Clear the grid after the game ends
  }, timeSetting*1000+900);
  
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  timeBar.style.animationPlayState = 'paused'; // Pause the timer bar animation
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timeInterval); // Stop the timer interval
  clearTimeout(gameTimeout); // Stop the game timeout
  document.getElementById('difficulty').disabled = false; // Enable difficulty selection after the game ends
  let startGameButton = document.getElementById('start-game');
  startGameButton.textContent = 'Restart Game'; // Reset the start button text
  startGameButton.style.backgroundColor = '#4CAF50'; // Change button color back to default
  popupContainer.style.display = 'flex'; // Show the game over popup
  popup.style.animation = 'slideDown 0.5s'; // Add slide-down animation to the popup
  if (currentCans >= GOAL_CANS) {
    document.getElementById('popup-text').textContent = `You Win!`; // Update popup title for winning
    document.getElementById('final-score').textContent = `You collected all ${currentCans} water cans! Congratulations!`; // Update popup title for winning
  } else {
    document.getElementById('popup-text').textContent = `Game Over!`;
    document.getElementById('final-score').textContent = `You collected ${currentCans} out of ${GOAL_CANS} water cans! Better luck next time!`; // Display the final score in the popup
  }
  
  document.getElementById('game-over-button').addEventListener('click', () => {
    popupContainer.style.display = 'none'; // Hide the popup when "Close" is clicked
  });
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
