// Game configuration and state variables
const GOAL_CANS = 20;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timer = document.getElementById('timer'); // Reference to the timer display element
let score = document.getElementById('current-cans'); // Reference to the score display element
let instructions = document.querySelector('.game-instructions'); // Reference to the instructions element

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
      score.textContent = currentCans; // Update the score display
      cells.forEach(cell => (cell.innerHTML = '')); // Clear the grid to remove the collected item
      if (currentCans >= GOAL_CANS) {
        endGame(); // End the game if the goal is reached
        alert(`Congratulations! You collected ${currentCans} water cans!`);
      }
    }
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
  let startGameButton = document.getElementById('start-game');
  startGameButton.textContent = 'Game In Progress!'; // Reset the start button text
  startGameButton.style.backgroundColor = '#cf2222'; // Change button color to indicate game is active
  timer.textContent = '30'; // Reset the timer display to 30 seconds
  score.textContent = '0'; // Reset the score display to 0
  currentCans = 0; // Reset the count of collected items
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
  timeInterval = setInterval(() => {
    // Update the timer display
    if (gameActive) {
        timer.textContent = parseInt(timer.textContent) - 1;
    }
  }, 1000); // Placeholder for any time-based updates (e.g., timer display)

  // Timer to end the game after 30 seconds
  gameTimeout = setTimeout(() => {
    if (gameActive) {
      endGame();
      alert(`Time's up! You collected ${currentCans} water cans. Try again!`);
    }
    grid.innerHTML = ''; // Clear the grid after the game ends
  }, 31000);
  
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timeInterval); // Stop the timer interval
  clearTimeout(gameTimeout); // Stop the game timeout
  let startGameButton = document.getElementById('start-game');
  startGameButton.textContent = 'Restart Game'; // Reset the start button text
  startGameButton.style.backgroundColor = '#4CAF50'; // Change button color back to default
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
