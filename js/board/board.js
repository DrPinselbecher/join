let currentTaskSizeStatus = 'small'

/**
 * Renders the main task board with all its components and visual elements.
 */
function renderBoard() {
    generateBoardHTML();
    changeBoardContent();
    loadingProcess();
    boardBgrColor();
    removeBgrColorWithoutBoard();
    addJoinLogoClickable();
}

/**
 * Manages the loading process and animations for the board content.
 */
function loadingProcess() {
    if (!document.querySelector('#content').classList.contains('contentBoard')) {
        return;
    }
    restartLoadingElementJoinAnimation();
    hideWidthHTML();
    showLoadingElementJoin();
    delayedWidthCheckAndHide();
}

/**
 * Changes the main content area to display the board view.
 */
function changeBoardContent() {
    content.classList.remove('content_section');
    content.classList.remove('content');
    content.classList.add('contentBoard');
    document.getElementById('legal-content-section').classList.add('d-none');
}

/**
 * Sets the background color for the board.
 */
function boardBgrColor() {
    document.getElementById('board').classList.add('currentTemplate', 'p-none');
    document.getElementById('board_mobile').classList.add('currentTemplate', 'p-none');
}

/**
 * Removes background color from elements not related to the board view.
 */
function removeBgrColorWithoutBoard() {
    document.getElementById('add_task').classList.remove('currentTemplate', 'p-none');
    document.getElementById('summary').classList.remove('currentTemplate', 'p-none');
    document.getElementById('contacts').classList.remove('currentTemplate', 'p-none');
    document.getElementById('add_task_mobile').classList.remove('currentTemplate', 'p-none');
    document.getElementById('summary_mobile').classList.remove('currentTemplate', 'p-none');
    document.getElementById('contacts_mobile').classList.remove('currentTemplate', 'p-none');
}

/**
 * Makes the Join logo clickable in the board view.
 */
function addJoinLogoClickable() {
    document.getElementById('join_logo').classList.remove('p-none');
    document.getElementById('join_logo_mobile').classList.remove('p-none');
}

/**
 * Adds a new task with a specified status from a button click.
 * 
 * @param {string} status - The status to set for the new task.
 */
function addTaskFromBtn(status) {
    createTaskByStatus = status;
    currentPrioriyToCreateTask = 'Medium';
    checkWidthForPopup();
}

/**
 * Shows the loading animation element.
 */
function showLoadingElementJoin() {
    document.getElementById('loading_spinner').classList.remove('d-none');
}

/**
 * Hides the width display in the HTML.
 */
function hideWidthHTML() {
    let widthHTML = document.getElementById('width_HTML');
    if (widthHTML) {
        widthHTML.style.display = 'none';
    }
}

/**
 * Displays the width information in the HTML.
 */
function showWidthHTML() {
    let widthHTML = document.getElementById('width_HTML');
    if (widthHTML) {
        widthHTML.style.display = 'block';
    }
}

/**
 * Opens and displays details for a specific task.
 *
 * @param {number} id - The ID of the task to open.
 */
function openTask(id) {
    if (isDragging) {
        return;
    }
    let task = tasks.find(t => t.id === id);
    let contain = document.getElementById('taskDetailsContain');
    currentTaskSizeStatus = 'big';
    contain.innerHTML = `
        ${renderTaskHTMLDetails(task)}
    `;
    contain.classList.remove('d-none');
    checkNameTextLengthToSlideAnimation();
    checkWidthFromTitleAndDescription();
    makeChildrenNonDraggable('taskDetailsContain');
}

/**
 * Checks and adjusts the width for task titles and descriptions.
 */
function checkWidthFromTitleAndDescription() {
    let taskTitle = document.getElementById('taskTitleDetails');
    let taskDescription = document.getElementById('taskDescriptionDetails');

    if (window.innerWidth > 730) {
        setOverflowForTitle(taskTitle, 49);
        setOverflowForDescription(taskDescription, 201);
    } else {
        setOverflowForTitle(taskTitle, 43);
        setOverflowForDescription(taskDescription, 106);
    }
}

/**
 * Sets overflow style for task titles if they exceed a certain length.
 *
 * @param {HTMLElement} taskTitle - The title element of the task.
 * @param {number} lengthThreshold - The maximum length before overflow is applied.
 */
function setOverflowForTitle(taskTitle, lengthThreshold) {
    if (taskTitle.textContent.length >= lengthThreshold) {
        taskTitle.style.overflowY = 'scroll';
    }
}

/**
 * Sets overflow style for task descriptions if they exceed a certain length.
 *
 * @param {HTMLElement} taskDescription - The description element of the task.
 * @param {number} lengthThreshold - The maximum length before overflow is applied.
 */
function setOverflowForDescription(taskDescription, lengthThreshold) {
    if (taskDescription.textContent.length >= lengthThreshold) {
        taskDescription.style.overflowY = 'scroll';
    }
}

/**
 * Prevents all children elements of a specified element from being draggable.
 *
 * @param {string} elementId - The ID of the parent element.
 */
function makeChildrenNonDraggable(elementId) {
    let container = document.getElementById(elementId);
    if (container) {
        let allChildren = container.getElementsByTagName('*');
        for (let i = 0; i < allChildren.length; i++) {
            allChildren[i].setAttribute('draggable', false);
        }
    }
}

/**
 * Closes the task details view.
 */
function closeTask() {
    let contain = document.getElementById('taskDetailsContain');
    let popup = document.getElementById('taskDetails');
    let background = document.getElementById('backgroundFromTaskPopup');
    currentTaskSizeStatus = 'small';
    popup.classList.add('slideOutToRight');
    background.classList.add('fadeOutBackground');
    popup.addEventListener('animationend', function () {
        contain.classList.add('d-none');
    }, { once: true });
}

/**
 * Searches for tasks based on input and displays relevant results.
 */
function searchTaskFromInput() {
    let value = escapeHTML(document.getElementById('find_task').value.toLowerCase());

    tasks.forEach(task => {
        let taskSection = document.getElementById(`section${task.id}`);

        if (!taskSection) return;

        showOrHideTask(taskSection, task, value);
    });
}

/**
 * Displays or hides a task section based on search criteria.
 *
 * @param {HTMLElement} taskSection - The section element of the task.
 * @param {object} task - The task object.
 * @param {string} value - The search input value.
 */
function showOrHideTask(taskSection, task, value) {
    let title = task.title.toLowerCase();
    let description = task.description.toLowerCase();

    if (title.includes(value) || description.includes(value)) {
        taskSection.style.display = '';
    } else {
        taskSection.style.display = 'none';
    }
}

/**
 * Confirms the deletion of a task and displays a confirmation popup.
 *
 * @param {number} taskId - The ID of the task to be deleted.
 * @param {string} taskTitle - The title of the task.
 */
function confirmTaskDeletion(taskId, taskTitle) {
    createConfirmPopup(taskId, taskTitle);
    createConfirmBackground();
}

/**
 * Creates a confirmation popup for task deletion.
 *
 * @param {number} taskId - The ID of the task to be deleted.
 * @param {string} taskTitle - The title of the task.
 */
function createConfirmPopup(taskId, taskTitle) {
    let confirmationMessage = `${returnConfirmationMessageHTML(taskTitle)}`;
    let confirmationPopup = document.createElement('div');
    confirmationPopup.className = 'confirmationPopup';
    confirmationPopup.innerHTML = `
        ${returnConfirmationPopupHTML(taskId, confirmationMessage)}
    `;
    document.body.appendChild(confirmationPopup);
}

/**
 * Creates a modal background for the confirmation popup.
 */
function createConfirmBackground() {
    let modalBackground = document.createElement('div');
    modalBackground.className = 'modalBackground';
    document.body.appendChild(modalBackground);
}

/**
 * Deletes a task after confirmation and updates the task view.
 *
 * @param {number} taskId - The ID of the task to be deleted.
 */
async function deleteTask(taskId) {
    if (checkIfGuestOrUserLoged() === false) {
        let index = tasks.findIndex(task => task.id == taskId);
        tasks.splice(index, 1);
        await setItem('tasks', JSON.stringify(tasks));
        closeTask();
        closeConfirmationPopup();
        renderAllTasks();
    } else {
        showGuestLoginPopup();
    }
}

/**
 * Closes the confirmation popup for task deletion.
 */
function closeConfirmationPopup() {
    let popup = document.querySelector('.confirmationPopup');
    let modalBackground = document.querySelector('.modalBackground');
    if (popup) {
        popup.remove();
    }
    if (modalBackground) {
        modalBackground.remove();
    }
}

/**
 * Renders contact information in tasks based on the current task size status.
 *
 * @param {Array} contacts - The array of contacts associated with the task.
 * @returns {string} The HTML string for contacts display.
 */
function checkContactsInTask(contacts) {
    return contacts.map((contact, i) =>
        currentTaskSizeStatus === 'small' ? returnSmallContactHTML(contact) : returnBigContactHTML(contact, i, contacts.length)
    ).join('');
}

/**
 * Renders subtask information in tasks based on the current task size status.
 *
 * @param {Array} subtasks - The array of subtasks associated with the task.
 * @param {number} taskId - The ID of the task.
 * @returns {string} The HTML string for subtasks display.
 */
function checkSubtasksInTask(subtasks, taskId) {
    if (subtasks.length === 0) {
        return returnNoSubtasksHTML(currentTaskSizeStatus);
    }

    if (currentTaskSizeStatus === 'small') {
        return returnSmallSubtasksHTML(subtasks, taskId);
    } else if (currentTaskSizeStatus === 'big') {
        return returnBigSubtasksHTML(subtasks, taskId);
    }

    return '';
}

/**
 * Updates the subtasks count display for a specific task.
 *
 * @param {number} taskId - The ID of the task to update the subtasks count for.
 */
function updateSubtasksCount(taskId) {
    let task = tasks.find(t => t.id === taskId);
    if (task) {
        let completedCount = subtasksCompleted(task.subtasks);
        let totalSubtasks = task.subtasks.length;

        updateSubtaskText(taskId, completedCount, totalSubtasks);
        updateProgressbar(taskId, completedCount, totalSubtasks);
    }
}

/**
 * Updates the text display of subtask completion status for a specific task.
 *
 * @param {number} taskId - The ID of the task.
 * @param {number} completedCount - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 */
function updateSubtaskText(taskId, completedCount, totalSubtasks) {
    let subtaskTxtElement = document.getElementById(`subtaskTxt${taskId}`);
    if (subtaskTxtElement) {
        subtaskTxtElement.textContent = `${completedCount}/${totalSubtasks}`;
    }
}

/**
 * Updates the progress bar for a specific task based on the completion status of its subtasks.
 *
 * @param {number} taskId - The ID of the task.
 * @param {number} completedCount - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 */
function updateProgressbar(taskId, completedCount, totalSubtasks) {
    let progressbarElement = document.getElementById(`progressbar${taskId}`);
    if (progressbarElement) {
        updateCurrentProgressbar(progressbarElement, completedCount, totalSubtasks);
    }
}

/**
 * Directly updates the styling of the progress bar element based on the completion percentage of subtasks.
 *
 * @param {HTMLElement} progressbarElement - The progress bar element.
 * @param {number} completedCount - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 */
function updateCurrentProgressbar(progressbarElement, completedCount, totalSubtasks) {
    let progressPercentage = totalSubtasks > 0 ? (completedCount / totalSubtasks) * 100 : 0;
    progressbarElement.style.width = `${progressPercentage}%`;
    progressbarElement.style.height = '100%';
    progressbarElement.style.backgroundColor = '#4589FF';
    progressbarElement.style.borderRadius = '16px';
}

/**
 * Calculates the number of completed subtasks for a given set of subtasks.
 *
 * @param {Array} subtasks - The array of subtasks.
 * @returns {number} The count of completed subtasks.
 */
function subtasksCompleted(subtasks) {
    let completedCount = 0;
    for (let i = 0; i < subtasks.length; i++) {
        if (subtasks[i].subtaskStatus === 'finished') {
            completedCount++;
        }
    }
    return completedCount;
}

/**
 * Selects a subtask in task details, toggling its status between finished and unfinished.
 *
 * @param {number} subtaskId - The ID of the subtask.
 * @param {number} taskId - The ID of the parent task.
 */
async function selectSubtaskInDetails(subtaskId, taskId) {
    let task = tasks.find(t => t.id === taskId);
    if (task) {
        let subtask = task.subtasks[subtaskId];
        subtask.subtaskStatus = subtask.subtaskStatus === 'finished' ? 'unfinished' : 'finished';
        await setItem('tasks', JSON.stringify(tasks));
        updateSubtasksInDetails(task);
    }
}

/**
 * Updates the display of subtasks in the task details view.
 *
 * @param {object} task - The task object containing subtasks.
 */
function updateSubtasksInDetails(task) {
    let subtasksContainer = document.getElementById(`allSubtasksContainDetails${task.id}`);
    if (subtasksContainer) {
        subtasksContainer.innerHTML = checkSubtasksInTask(task.subtasks, task.id);
        updateSubtasksCount(task.id);
    }
}

/**
 * Determines the layout for adding a task based on the current window width.
 */
function checkWidthForPopup() {
    if (window.innerWidth <= 500) {
        renderAddTask();
    } else {
        renderAddTaskPopUp();
    }
}

/**
 * Displays creator information in a tooltip for a specified duration.
 *
 * @param {string} creator - The name of the task creator.
 */
function openCreatorInformation(creator) {
    let svgElement = document.getElementById('creator_svg');
    let tooltip = document.createElement('div');

    tooltip.classList.add('creator-tooltip');
    tooltip.innerText = `Creator: ${creator}`;
    svgElement.parentNode.insertBefore(tooltip, svgElement.nextSibling);
    setTimeout(() => tooltip.remove(), 2000);
}