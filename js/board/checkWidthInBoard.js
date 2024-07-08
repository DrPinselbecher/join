let resizeTimer;
let minLoadingElementJoinTime = 1000;

/**
 * Checks and adjusts the layout of the board based on the current window width.
 */
async function checkWidthInBoard() {
    let contentDiv = document.querySelector('.contentBoard');
    if (!contentDiv) return;

    adjustBoardWidth();
    closeOpenTaskDetails();
    await performBoardTasks();
}

/**
 * Adjusts the board's layout depending on whether the window width is above or below 1300 pixels.
 */
function adjustBoardWidth() {
    if (window.innerWidth >= 1300) {
        generateBoardWidthPlus1300HTML();
    } else {
        generateBoardWidthMinus1300HTML();
    }
}

/**
 * Closes the task details view if it is currently open.
 */
function closeOpenTaskDetails() {
    let ifTaskOpen = document.querySelector('#taskDetails');
    if (ifTaskOpen) {
        closeTask();
    }
}

/**
 * Performs a series of tasks related to board adjustments and rendering after resizing the window.
 */
async function performBoardTasks() {
    checkTaskStatusWhetherBig();
    await renderAllTasks();
    await checkMinLoadingTime();
    showWidthHTML();
}

/**
 * Delays the check for board width adjustment and hides the width display after a specified time interval.
 */
function delayedWidthCheckAndHide() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        checkWidthInBoard();
    }, minLoadingElementJoinTime);
}

/**
 * Checks and adjusts the current task status if it is set to 'big'.
 */
function checkTaskStatusWhetherBig() {
    if (currentTaskSizeStatus == 'big') {
        currentTaskSizeStatus = 'small';
    }
}

/**
 * Waits for a minimum loading time before executing subsequent actions.
 */
async function checkMinLoadingTime() {
    let currentTime = new Date().getTime();
    if (currentTime - lastAnimationTimestamp < minLoadingElementJoinTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingElementJoinTime - (currentTime - lastAnimationTimestamp)));
    }
}

/**
 * Event listener for window resize to handle the loading process during resizing.
 */
window.addEventListener('resize', loadingProcess);
