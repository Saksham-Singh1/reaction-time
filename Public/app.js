// Select DOM elements
const arrowElement = document.getElementById('arrow');
const resultElement = document.getElementById('result');

// Initialize variables
let arrowDisplayedTime; // Time the arrow was displayed
let lastClickTime; // Time of the last arrow click

// Utility function to show the recover arrow for one second
function showRecoverArrow(recoveryElapsedTime) {
    arrowElement.textContent = '↑'; // Display the recover arrow
    arrowElement.style.color = 'black'; // Set color to black
    resultElement.textContent = `Recover! Elapsed time: ${recoveryElapsedTime} ms. No click needed.`;
    
    // Automatically show a new random arrow after 1 second
    setTimeout(showRandomArrow, 1000);
}

// Utility function to display a random arrow (left or right)
function showRandomArrow() {
    const arrowType = Math.random();
    let arrow;

    if (arrowType < 0.5) {
        arrow = '←';  // Left arrow
        resultElement.textContent = 'Click the left mouse button!';
    } else {
        arrow = '→';  // Right arrow
        resultElement.textContent = 'Click the right mouse button!';
    }

    // Set the arrow display
    arrowElement.textContent = arrow;
    arrowElement.style.color = 'red'; // Set color to red for left/right arrows
    
    // Record the time the arrow was displayed
    arrowDisplayedTime = Date.now(); // Time for the displayed arrow
}

// Event listener for mouse clicks
document.addEventListener('mousedown', (event) => {
    const elapsedTime = Date.now() - arrowDisplayedTime; // Time since the arrow was displayed
    const arrowType = arrowElement.dataset.arrowType; // Retrieve the current arrow type

    if (arrowType === '↑') {
        resultElement.textContent = 'You clicked on the straight arrow! No reaction time measured.';
    } else {
        // Display reaction time for left/right arrows
        resultElement.textContent = `You clicked! Time taken to click: ${elapsedTime} ms`;
    }

    lastClickTime = Date.now(); // Record the time of the last click
    const recoveryElapsedTime = lastClickTime - arrowDisplayedTime; // Calculate elapsed time since last arrow displayed

    // Show the recover arrow after a click
    showRecoverArrow(recoveryElapsedTime); // Pass elapsed time to showRecoverArrow
});

// Prevent default right-click context menu
document.addEventListener('contextmenu', (event) => event.preventDefault());

// Start the game by showing the initial up arrow
showRecoverArrow(0); // Start with the up arrow, initial elapsed time is 0
