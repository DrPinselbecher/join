let lastAnimationTimestamp = 0;
let textSlideAnimationTimer;

/**
 * Checks the length of text in each assigned name element and applies sliding animation if the text overflows.
 */
function checkNameTextLengthToSlideAnimation() {
    let assignedNameElements = document.querySelectorAll('.assignedNameText');

    assignedNameElements.forEach(text => {
        if (text.scrollWidth > text.parentElement.offsetWidth) {
            textSlideAnimation(text);
        } else {
            text.style.animation = 'none';
        }
    });
    resetTimerForTextAnimation();
}

/**
 * Applies a sliding animation to the specified text element.
 *
 * @param {HTMLElement} text - The text element to apply the sliding animation to.
 */
function textSlideAnimation(text) {
    text.style.animation = 'none';
    void text.offsetWidth;
    text.style.animation = 'slideTextToLeftAndStop 1s linear forwards 2s';
    setTimeout(() => {
        text.style.animation = 'none';
        void text.offsetWidth;
        text.style.animation = 'slideTextToRightAndStop 0.2s linear forwards';
    }, 5000);
}

/**
 * Resets and restarts the timer for the text sliding animation.
 */
function resetTimerForTextAnimation() {
    if (textSlideAnimationTimer) {
        clearTimeout(textSlideAnimationTimer);
    }
    textSlideAnimationTimer = setTimeout(checkNameTextLengthToSlideAnimation, 7000);
}

/**
 * Restarts the loading element join animation if the minimum time interval has passed since the last animation.
 */
function restartLoadingElementJoinAnimation() {
    let currentTime = new Date().getTime();
    if (currentTime - lastAnimationTimestamp > minLoadingElementJoinTime) {
        let animation = document.querySelector('animate');
        if (animation) {
            animation.beginElement();
            lastAnimationTimestamp = currentTime;
        }
    }
}

/**
 * Hides the loading animation element.
 */
function hideLoadingElementJoin() {
    let loadingSpinner = document.getElementById('loading_spinner');
    if (loadingSpinner) {
        loadingSpinner.classList.add('d-none');
    }
}


// animations in drag & drop -------------------------------------------------------------------------------------


/**
 * Removes highlighting from a task line.
 *
 * @param {string} taskLineId - The ID of the task line to remove highlight from.
 */
function removeHighlight(taskLineId) {
    let taskLine = document.getElementById(taskLineId);
    if (taskLine) {
        let draggableDiv = taskLine.querySelector('.draggableContain');
        if (draggableDiv) {
            taskLine.removeChild(draggableDiv);
        }
    }
}

/**
 * Removes special dragging styles for touch-based dragging.
 */
function removeTouchDraggingStyles() {
    let draggingElements = document.querySelectorAll('.dragging-style-for-touch');
    draggingElements.forEach(el => el.classList.remove('dragging-style-for-touch'));
}

/**
 * Adds special dragging styles for touch-based dragging.
 *
 * @param {number} taskId - The ID of the task being dragged.
 */
function addTouchDraggingStyles(taskId) {
    let taskElement = document.getElementById(`section${taskId}`);
    if (taskElement) {
        taskElement.classList.add('dragging-style-for-touch');
    }
}

/**
 * Adds additional height to task lines to accommodate for dragging space.
 */
function addHeightFromTaskLine() {
    let taskLines = document.querySelectorAll('.taskLine');
    taskLines.forEach(line => {
        line.classList.add('taskLineHeightAdjust');
    });
}

/**
 * Adds a flashing animation to task lines during dragging.
 */
function addFlashingAnimationInTaskLine() {
    let currentTaskLineId = tasks.find(task => task.id === currentDraggedTaskId)?.status;
    let taskLines = document.querySelectorAll('.taskLine');

    taskLines.forEach(line => {
        if (line.id !== currentTaskLineId) {
            line.classList.add('flashingAnimation');
        }
    });
}

/**
 * Removes the flashing animation from task lines after dragging.
 */
function removeFlashingAnimationInTaskLine() {
    let taskLines = document.querySelectorAll('.taskLine');
    taskLines.forEach(line => {
        line.classList.remove('flashingAnimation');
    });
}

/**
 * Removes the additional height from task lines after dragging.
 */
function removeHeightFromTaskLine() {
    let taskLines = document.querySelectorAll('.taskLine');
    taskLines.forEach(line => {
        line.classList.remove('taskLineHeightAdjust');
    });
}

/**
 * Hides other elements on the page when a task is being dragged.
 *
 * @param {number} exceptTaskId - The ID of the task being dragged.
 */
function hideOtherElements(exceptTaskId) {
    document.querySelectorAll('.section').forEach(task => {
        if (task.id !== `section${exceptTaskId}`) {
            task.style.opacity = '0';
            task.style.pointerEvents = 'none';
        }
    });
    hideEmptyElement();
}

/**
 * Hides empty task line elements.
 */
function hideEmptyElement() {
    document.querySelectorAll('.emptyTaskLine').forEach(line => {
        line.classList.add('d-none');
    });
}

/**
 * Shows empty task line elements that were previously hidden.
 */
function showEmptyElement() {
    document.querySelectorAll('.emptyTaskLine').forEach(line => {
        line.classList.remove('d-none');
    });
}

/**
 * Shows all elements on the page after a task has been dropped.
 */
function showAllElements() {
    document.querySelectorAll('.section').forEach(task => {
        task.style.opacity = '1';
        task.style.pointerEvents = 'auto';
    });
    showEmptyElement();
}

/**
 * Highlights a task line when a task is dragged over it.
 *
 * @param {string} taskLineId - The ID of the task line to highlight.
 * @param {Event} event - The dragging event.
 */
function highlight(taskLineId, event) {
    let taskById = tasks.find(task => task.id === currentDraggedTaskId);
    if (!taskById) return;

    if (taskById.status === taskLineId) {
        return;
    }

    let taskLine = document.getElementById(taskLineId);
    if (!taskLine) return;

    let draggableDiv = createAndAddDraggableDiv(taskLine);
    updateDraggableDivPosition(event, draggableDiv, taskLine);
}

/**
 * Removes all highlights from task lines.
 */
function removeAllHighlights() {
    document.querySelectorAll('.taskLine .draggableContain').forEach(div => {
        div.parentElement.removeChild(div);
    });
}

/**
 * Creates and adds a draggable div to a task line for visual feedback.
 *
 * @param {HTMLElement} taskLine - The task line element.
 * @returns {HTMLElement} The created draggable div element.
 */
function createAndAddDraggableDiv(taskLine) {
    let draggableDiv = taskLine.querySelector('.draggableContain');
    if (!draggableDiv) {
        draggableDiv = document.createElement('div');
        draggableDiv.classList.add('draggableContain');
        taskLine.prepend(draggableDiv);
    }
    return draggableDiv;
}

/**
 * Updates the position of the draggable div based on the dragging event.
 *
 * @param {Event} event - The dragging event.
 * @param {HTMLElement} draggableDiv - The draggable div element.
 * @param {HTMLElement} taskLine - The task line element.
 */
function updateDraggableDivPosition(event, draggableDiv, taskLine) {
    if (window.innerWidth < 1300) {
        positionDivHorizontally(event, draggableDiv, taskLine);
    } else {
        positionDivVertically(event, draggableDiv, taskLine);
    }
}

/**
 * Positions the draggable div horizontally based on the cursor position.
 *
 * @param {Event} event - The dragging event.
 * @param {HTMLElement} draggableDiv - The draggable div element.
 * @param {HTMLElement} taskLine - The task line element.
 */
function positionDivHorizontally(event, draggableDiv, taskLine) {
    let cursorX = event.clientX || event.touches[0].clientX;
    let taskLineRect = taskLine.getBoundingClientRect();
    let taskLineLeft = taskLineRect.left - taskLine.scrollLeft;
    let draggableDivWidth = draggableDiv.offsetWidth;
    let taskLineHeight = taskLineRect.height;
    let draggableDivHeight = draggableDiv.offsetHeight;
    let verticalCenter = (taskLineHeight - draggableDivHeight) / 2;

    draggableDiv.style.left = (cursorX - taskLineLeft - draggableDivWidth / 2) + 'px';
    draggableDiv.style.top = verticalCenter + 'px';
}

/**
 * Positions the draggable div vertically based on the cursor position.
 *
 * @param {Event} event - The dragging event.
 * @param {HTMLElement} draggableDiv - The draggable div element.
 * @param {HTMLElement} taskLine - The task line element.
 */
function positionDivVertically(event, draggableDiv, taskLine) {
    let cursorY = event.clientY || event.touches[0].clientY;
    let taskLineRect = taskLine.getBoundingClientRect();
    let taskLineTop = taskLineRect.top;
    let draggableDivHeight = draggableDiv.offsetHeight;

    draggableDiv.style.top = (cursorY - taskLineTop - draggableDivHeight / 2) + 'px';
}