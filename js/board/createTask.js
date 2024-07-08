let tasks = [];
let highestTaskId = 0;
let currentPrioriyToCreateTask = 'Medium';
let createTaskByStatus = 'to_do';

/**
 * Creates and saves a new task based on user input and current settings.
 */
async function setNewTask() {
    if (checkIfGuestOrUserLoged() === false) {
        let creator = currentUser[0].name;
        let id = ++highestTaskId;
        let title = escapeHTML(document.getElementById('titel-input').value);
        let description = escapeHTML(document.getElementById('read-description').value);
        let date = formatToGermanDate(document.getElementById('calender-input').value);
        let priority = currentPrioriyToCreateTask;
        let category = document.getElementById('selectedCategory').value.replace(/\s/g, '_');
        let status = createTaskByStatus;
        let contacts = [...selectedContacts];
        let subtasks = [...createdSubtaskList];

        tasks.push({ creator, id, title, description, date, priority, category, status, contacts, subtasks });
        await setItem('tasks', JSON.stringify(tasks));
        clearSubtaskAndContactsArrays();
        renderBoard();
    } else {
        showGuestLoginPopup();
    }
}

/**
 * Formats a date string into German date format (DD.MM.YYYY).
 *
 * @param {string} dateString - The date string in YYYY-MM-DD format.
 * @returns {string} Formatted date in German format.
 */
function formatToGermanDate(dateString) {
    let dateParts = dateString.split('-');
    return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
}

/**
 * Creates a new task from the popup on the board and then closes the popup.
 */
async function setNewTaskFromPopupInBoard() {
    if (checkIfGuestOrUserLoged() === false) {
        await setNewTask();
        closePopupAddTask();
    } else {
        showGuestLoginPopup();
    }
}