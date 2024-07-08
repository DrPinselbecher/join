let currentDraggedTaskId;
let isDragging = false;
let scrollIntervalInDragAndDrop = null;
let longPressTimer;
let isScrolling = false;
let currentTouchedTaskLineId = null;

/**
 * Prevents the default handling of an element to allow dropping.
 *
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Initiates the dragging process for a task element.
 *
 * @param {number} id - The ID of the task being dragged.
 * @param {boolean} isTouch - Indicates if the drag operation is initiated via touch.
 */
function startDragging(id, isTouch = false) {
    if (!isDragging) {
        isDragging = true;
        currentDraggedTaskId = id;
        hideOtherElements(id);
        if (isTouch) {
            addTouchDraggingStyles(id);
            addFlashingAnimationInTaskLine();
        }
    }
}

/**
 * Handles the dropping of a task element into a new status category.
 *
 * @param {string} status - The status category to drop the task into.
 */
async function dropTo(status) {
    if (currentDraggedTaskId === null) return;

    if (checkIfGuestOrUserLoged()) {
        handleGuestUserDrop(status);
    } else {
        await handleRegisteredUserDrop(status);
    }

    resetDragState(status);

    if (window.innerWidth < 1300) {
        resetScrollPositionHorizontal();
    } else {
        resetScrollPositionVertical();
    }
}

/**
 * Resets the scroll position of the scrollbar to the top for vertical layout.
 */
function resetScrollPositionVertical() {
    let scrollbar = document.querySelector('.scrollbar');
    if (scrollbar) {
        scrollbar.scrollTop = 0;
    }
}

/**
 * Resets the scroll position of task lines to the left for horizontal layout.
 */
function resetScrollPositionHorizontal() {
    let taskLines = document.querySelectorAll('.taskLine');
    taskLines.forEach(line => {
        line.scrollLeft = 0;
    });
}

/**
 * Handles the drop operation for a registered user, updating the task status.
 *
 * @param {string} status - The new status for the dropped task.
 */
async function handleRegisteredUserDrop(status) {
    let taskById = tasks.find(task => task.id === currentDraggedTaskId);
    if (taskById) {
        taskById.status = status;
        await setItem('tasks', JSON.stringify(tasks));
        renderAllTasks();
    }
    resetDragState(status);
}

/**
 * Handles the drop operation for a guest user by showing a login popup.
 *
 * @param {string} status - The status category the task was dropped into.
 */
function handleGuestUserDrop(status) {
    showGuestLoginPopup();
    resetDragState(status);
}

/**
 * Resets the drag state and UI elements after a task has been dropped.
 *
 * @param {string} status - The status category the task was dropped into.
 */
function resetDragState(status) {
    removeHighlight(status);
    removeFlashingAnimationInTaskLine();
    showAllElements();
    currentDraggedTaskId = null;
}

/**
 * Completes the dragging process, resetting UI elements and stopping any ongoing scroll.
 *
 * @param {boolean} isTouch - Indicates if the drag operation is ending via touch.
 */
function endDragging(isTouch = false) {
    if (isDragging) {
        isDragging = false;
        removeHeightFromTaskLine();
        removeFlashingAnimationInTaskLine();
        if (isTouch) {
            removeTouchDraggingStyles();
        }
        stopScrollInterval();
        showAllElements();
    }
}

/**
 * Adds an event listener for dragover events to handle scrolling and visual effects during dragging.
 */
document.addEventListener('dragover', function (event) {
    if (window.innerWidth < 1300 && window.innerWidth > 999) {
        scrollBehaviorOver1000(event);
        addHeightFromTaskLine();
        addFlashingAnimationInTaskLine();
    } else if (window.innerWidth < 1000) {
        scrollBehaviorBelow1000(event);
        addHeightFromTaskLine();
        addFlashingAnimationInTaskLine();
    }
    addHeightFromTaskLine();
    addFlashingAnimationInTaskLine();
});

/**
 * Defines scrolling behavior for screens below 1000 pixels width during dragging.
 *
 * @param {Event} ev - The drag event.
 */
function scrollBehaviorBelow1000(ev) {
    let scrollbar = document.querySelector('.scrollbar');
    let bounds = scrollbar.getBoundingClientRect();
    let topBoundary = bounds.top + 40;
    let bottomBoundary = bounds.bottom - 400;
    let scrollSpeed = 5;

    if (ev.clientY < topBoundary || ev.clientY > bottomBoundary) {
        startScrollInterval(scrollbar, topBoundary, scrollSpeed, ev.clientY);
    } else {
        stopScrollInterval();
    }
}

/**
 * Defines scrolling behavior for screens over 1000 pixels width during dragging.
 *
 * @param {Event} ev - The drag event.
 */
function scrollBehaviorOver1000(ev) {
    let scrollbar = document.querySelector('.scrollbar');
    let bounds = scrollbar.getBoundingClientRect();
    let topBoundary = bounds.top + 60;
    let bottomBoundary = bounds.bottom - 150;
    let scrollSpeed = 5;

    if (ev.clientY < topBoundary || ev.clientY > bottomBoundary) {
        startScrollInterval(scrollbar, topBoundary, scrollSpeed, ev.clientY);
    } else {
        stopScrollInterval();
    }
}

/**
 * Starts an interval to scroll the page during dragging.
 *
 * @param {HTMLElement} scrollbar - The scrollbar element.
 * @param {number} topBoundary - The top boundary for scrolling.
 * @param {number} scrollSpeed - The speed of scrolling.
 * @param {number} mouseY - The Y-coordinate of the mouse.
 */
function startScrollInterval(scrollbar, topBoundary, scrollSpeed, mouseY) {
    if (scrollIntervalInDragAndDrop === null) {
        scrollIntervalInDragAndDrop = setInterval(() => {
            let scrollDirection;
            if (mouseY < topBoundary) {
                scrollDirection = -1;
            } else {
                scrollDirection = 1;
            }
            scrollbar.scrollBy(0, scrollSpeed * scrollDirection);
        }, 10);
    }
}

/**
 * Adds an event listener for ending drag operations and stopping scrolling.
 */
document.addEventListener('dragend', stopScrollInterval);

/**
 * Stops the scroll interval initiated during dragging.
 */
function stopScrollInterval() {
    if (scrollIntervalInDragAndDrop !== null) {
        clearInterval(scrollIntervalInDragAndDrop);
        scrollIntervalInDragAndDrop = null;
    }
}

document.addEventListener('touchmove', handleTouchMove, { passive: false });

/**
 * Handles touch move events during dragging.
 *
 * @param {TouchEvent} event - The touch event.
 */
function handleTouchMove(event) {
    isScrolling = true;
    clearTimeout(longPressTimer);

    if (isDragging) {
        let touch = event.touches[0];
        highlightTaskLineUnderTouch(touch);
        handleScrollBehaviorOnTouch(touch);
        event.preventDefault();
    }
}

/**
 * Highlights the task line under touch during dragging.
 *
 * @param {Touch} touch - The touch event details.
 */
function highlightTaskLineUnderTouch(touch) {
    let targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement && targetElement.classList.contains('taskLine')) {
        let taskLineId = targetElement.id;
        highlight(taskLineId, touch);
    } else {
        removeAllHighlights();
    }
}

/**
 * Handles task line highlighting on touch move.
 *
 * @param {Touch} touch - The touch event details.
 */
function updateHighlightOnTouchMove(touch) {
    let targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement && targetElement.classList.contains('taskLine')) {
        let taskLineId = targetElement.id;
        highlight(taskLineId, touch);
    }
}

/**
 * Handles the highlighting of a task line based on touch position and movement.
 *
 * @param {Touch} touch - The touch event details.
 * @param {Event} event - The touch event.
 */
function handleTaskLineHighlight(touch, event) {
    let targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

    if (targetElement && targetElement.classList.contains('taskLine')) {
        let taskLineId = targetElement.id;
        highlight(taskLineId, event);
    }

    handleTaskLineHighlightOnTouchMove(touch);
}

/**
 * Manages scroll behavior based on touch interaction.
 *
 * @param {Touch} touch - The touch event details.
 */
function handleScrollBehaviorOnTouch(touch) {
    scrollBehaviorTouch(touch);
}

/**
 * Defines the scroll behavior for touch interaction.
 *
 * @param {Touch} touch - The touch event details.
 */
function scrollBehaviorTouch(touch) {
    let scrollbar = getScrollbarElement();
    if (!scrollbar) return;

    let bounds = scrollbar.getBoundingClientRect();
    let scrollParameters = calculateScrollParameters(bounds);
    handleScroll(scrollbar, scrollParameters, touch.clientY);
}

/**
 * Retrieves the scrollbar element, catering for different browsers.
 *
 * @returns {HTMLElement|null} The scrollbar element if found, otherwise null.
 */
function getScrollbarElement() {
    return document.querySelector('.scrollbar') || document.querySelector('.scrollbarForSafari');
}

/**
 * Calculates scroll parameters based on the scrollbar's boundaries.
 *
 * @param {DOMRect} bounds - The bounding rectangle of the scrollbar.
 * @returns {Object} The calculated scroll parameters.
 */
function calculateScrollParameters(bounds) {
    return {
        topBoundary: bounds.top + 70,
        bottomBoundary: bounds.bottom - 460,
        scrollSpeed: 4
    };
}

/**
 * Handles the automatic scrolling based on touch position.
 *
 * @param {HTMLElement} scrollbar - The scrollbar element.
 * @param {Object} scrollParameters - The parameters defining scroll behavior.
 * @param {number} touchY - The Y-coordinate of the touch event.
 */
function handleScroll(scrollbar, scrollParameters, touchY) {
    if (touchY < scrollParameters.topBoundary || touchY > scrollParameters.bottomBoundary) {
        startScrollInterval(scrollbar, scrollParameters.topBoundary, scrollParameters.scrollSpeed, touchY);
    } else {
        stopScrollInterval();
    }
}

/**
 * Initiates dragging on a long press touch event.
 *
 * @param {number} taskId - The ID of the task.
 */
function handleTouchStart(taskId) {
    isScrolling = false;
    longPressTimer = setTimeout(() => {
        if (!isScrolling) {
            startDragging(taskId, true);
            highlightCurrentDraggedTask(taskId);
        }
    }, 300);
}

/**
 * Handles the touch end event during dragging.
 *
 * @param {TouchEvent} event - The touch event.
 */
function handleTouchEnd(event) {
    clearTimeout(longPressTimer);
    if (isDragging) {
        let touch = event.changedTouches[0];
        let dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        endDragging();
        if (dropTarget && dropTarget.classList.contains('taskLine')) {
            dropTo(dropTarget.id);
        }
    }
}

/**
 * Manages task line highlighting during a touch move event.
 *
 * @param {Touch} touch - The touch event details.
 */
function handleTaskLineHighlightOnTouchMove(touch) {
    let targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement && targetElement.classList.contains('taskLine')) {
        let taskLineId = targetElement.id;
        if (currentTouchedTaskLineId !== taskLineId) {
            if (currentTouchedTaskLineId) {
                removeHighlight(currentTouchedTaskLineId);
            }
            highlight(taskLineId, touch);
            currentTouchedTaskLineId = taskLineId;
        }
    }
}

/**
 * Handles task line highlighting and dropping on touch end.
 *
 * @param {Touch} touch - The touch event details.
 * @param {number} taskId - The ID of the task.
 */
function handleDropOnTouchEnd(touch, taskId) {
    let targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement && targetElement.classList.contains('taskLine')) {
        let taskLineId = targetElement.id;
        dropTo(taskLineId);
    }
}

/**
 * Clears the current touched task line highlight.
 */
function clearCurrentTouchedTaskLine() {
    if (currentTouchedTaskLineId) {
        removeHighlight(currentTouchedTaskLineId);
        currentTouchedTaskLineId = null;
    }
}