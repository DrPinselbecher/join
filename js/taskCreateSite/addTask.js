let isButtonClicked = false;
let selectedContacts = [];
let createdSubtaskList = [];
let iconRotated = false;
let categorys = ['Frontend', 'Backend', 'Web Security', 'UX-UI Design', 'Mobile', 'Web Performance'];

/**
 * Renders the interface for adding a new task.
 */
function renderAddTask() {
    addContentCSS()
    addTaskBgrColor();
    removeBgrColorWithoutAddTask();
    addJoinLogoClickable();
    generateAddTaskHTML();
    renderAssignedToContactList();
    clearSubtaskAndContactsArrays();
    createTaskByStatus = 'to_do';
}

/**
 * Compares two strings for sorting purposes.
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {number} -1, 1, or 0 based on comparison result.
 */
function compareStrings(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

/**
 * Clears arrays holding selected contacts and created subtasks.
 */
function clearSubtaskAndContactsArrays() {
    selectedContacts = [];
    createdSubtaskList = [];
}

/**
 * Rotates an icon, typically used to indicate an expandable section.
 */
function rotateIcon() {
    let icon = document.querySelector('.assign-button img');
    icon.classList.toggle('rotate');
}

/**
 * Gets today's date in the format required for calendar input.
 *
 * @returns {string} The formatted current date.
 */
function getTodaysDateForCalender() {
    let currentDate = new Date();
    let day = currentDate.getDate();
    currentDate.setHours(23, 59, 59, 999);
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let formattedDay = day < 10 ? '0' + day : day;
    let formattedMonth = month < 10 ? '0' + month : month;
    let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
    return formattedDate;
}

/**
 * Changes the styles of priority selection buttons.
 *
 * @param {string} priority - The priority level to apply styling to.
 */
function changeButtonStyles(priority) {
    let button = document.getElementById(`button${priority}`);
    let icon = document.getElementById(`icon${priority}`);
    currentPrioriyToCreateTask = priority;

    if (button.classList.contains('selected')) {
        resetSelectedPrioButton();
    } else {
        resetSelectedPrioButton();
        button.classList.add('selected');
        icon.classList.add('selected_icon');
    }
}

/**
 * Resets the styles of all priority selection buttons.
 */
function resetSelectedPrioButton() {
    let allPrioSelectedButton = document.querySelectorAll('.selected');
    allPrioSelectedButton.forEach((allPrioSelectedButton) => {
        allPrioSelectedButton.classList.remove('selected');
    });
    let allPrioSelectedIcon = document.querySelectorAll('.selected_icon');
    allPrioSelectedIcon.forEach((allPrioSelectedIcon) => {
        allPrioSelectedIcon.classList.remove('selected_icon');
    });
}

/**
 * Clears the value of a specified input field.
 *
 * @param {string} inputsField - The ID of the input field to be cleared.
 */
function clearInputField(inputsField) {
    let inputField = document.getElementById(inputsField);
    if (inputField) {
        inputField.value = "";
    }
}

/**
 * Adds a new subtask based on user input.
 */
function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInput.value !== "") {
        let newSubtask = {
            description: escapeHTML(subtaskInput.value),
            subtaskStatus: "unfinished"
        };
        createdSubtaskList.push(newSubtask);
        renderSubtask(createdSubtaskList);
    }
    subtaskInput.value = "";
}

/**
 * Checks and updates the list of edited subtasks.
 *
 * @param {number} i - The index of the subtask to check and update.
 */
function checkEditedTaskList(i) {
    let editedDescription = escapeHTML(document.getElementById(`editInput${i}`).value);

    if (editedDescription !== "") {
        createdSubtaskList[i] = { ...createdSubtaskList[i], description: editedDescription };
    }

    renderSubtask(createdSubtaskList);
}

/**
 * Toggles subtask images visibility based on user input.
 */
function toggleSubtaskImages() {
    let imageContainer = document.getElementById("imageContainer");
    let newImages = document.getElementById("newImages");
    let subtaskInput = document.getElementById('subtaskInput');

    subtaskInput.focus();
    subtaskInput.select();

    subtaskInput.value = "";

    imageContainer.classList.toggle('d-none');
    newImages.classList.toggle('d-none');
}

/**
 * Shows or hides subtask images based on the content of the subtask input field.
 */
function showSubtaskImagesByInput() {
    let imageContainer = document.getElementById("imageContainer");
    let newImages = document.getElementById("newImages");
    let subtaskInput = document.getElementById('subtaskInput');

    if (!subtaskInput.value == "") {
        imageContainer.classList.add('d-none');
        newImages.classList.remove('d-none');
    } else {
        imageContainer.classList.remove('d-none');
        newImages.classList.add('d-none');
    }
}

/**
 * Renders the subtasks list.
 */
function renderSubtask() {
    let subtaskContent = document.getElementById('subtaskContent');
    subtaskContent.innerHTML = '';

    for (let index = 0; index < createdSubtaskList.length; index++) {
        let subtask = createdSubtaskList[index].description;
        subtaskContent.innerHTML += returnSubtask(subtask, index);
    }
}

/**
 * Toggles between viewing and editing a subtask.
 *
 * @param {number} i - The index of the subtask.
 */
function toggleSubtask(i) {
    document.getElementById(`taskList${i}`).classList.toggle('d-none');
    document.getElementById(`editTaskList${i}`).classList.toggle('d-none');

    document.getElementById(`editInput${i}`).focus();
    document.getElementById(`editInput${i}`).select();
}

/**
 * Deletes a subtask from the list.
 *
 * @param {number} i - The index of the subtask to be deleted.
 */
function deleteButton(i) {
    createdSubtaskList.splice(i, 1);

    renderSubtask();
}

/**
 * Adds background color styling for the 'Add Task' view.
 */
function addTaskBgrColor() {
    document.getElementById('add_task').classList.add('currentTemplate', 'p-none');
    document.getElementById('add_task_mobile').classList.add('currentTemplate', 'p-none');
}

/**
 * Removes background color styling from elements not related to the 'Add Task' view.
 */
function removeBgrColorWithoutAddTask() {
    document.getElementById('summary').classList.remove('currentTemplate', 'p-none');
    document.getElementById('board').classList.remove('currentTemplate', 'p-none');
    document.getElementById('contacts').classList.remove('currentTemplate', 'p-none');
    document.getElementById('summary_mobile').classList.remove('currentTemplate', 'p-none');
    document.getElementById('board_mobile').classList.remove('currentTemplate', 'p-none');
    document.getElementById('contacts_mobile').classList.remove('currentTemplate', 'p-none');
}

/**
 * Makes the Join logo clickable in the user interface.
 */
function addJoinLogoClickable() {
    document.getElementById('join_logo').classList.remove('p-none');
    document.getElementById('join_logo_mobile').classList.remove('p-none');
}

/**
 * Displays the category options for task creation or editing.
 */
async function showCategory() {
    let categoryList = document.getElementById('dropdownOptions');
    let categoryListPopup = document.getElementById('dropdownOptionsPopup');

    if (categoryList) {
        fillCategoryList(categoryList);
    } else if (categoryListPopup) {
        fillCategoryList(categoryListPopup);
    }
}

/**
 * Fills the category list dropdown with available categories.
 *
 * @param {HTMLElement} element - The dropdown element to fill with categories.
 */
function fillCategoryList(element) {
    element.innerHTML = '';
    for (let c = 0; c < categorys.length; c++) {
        let category = categorys[c];
        element.innerHTML += renderCategory(category, c);
    }
}

/**
 * Accepts and sets the chosen category for a task.
 *
 * @param {string} category - The chosen category.
 */
function acceptCategory(category) {
    let selectInput = document.getElementById('selectedCategory');
    selectInput.value = category;

    toggleDropdown()
}

/**
 * Toggles the dropdown for category selection.
 */
async function toggleDropdown() {
    await showCategory();
    toggleDropdownElements();
    toggleIconRotation();
}

/**
 * Toggles elements related to the category dropdown.
 */
function toggleDropdownElements() {
    let dropdownOptions = document.getElementById('dropdownOptions');
    let dropdownOptionsPopup = document.getElementById('dropdownOptionsPopup');
    let subtaskContain = document.querySelector('.subtask-container');
    let belowCntain = document.querySelector('.task-below-popup');
    let boardSite = document.querySelector('.contentBoard');

    if (boardSite) {
        subtaskContain.classList.toggle('d-none');
        belowCntain.classList.toggle('d-none');
    }

    let displayStyle = iconRotated ? 'none' : 'block';
    setDisplayStyle(dropdownOptions, displayStyle);
    setDisplayStyle(dropdownOptionsPopup, displayStyle);
}

/**
 * Rotates the dropdown icon to indicate opening or closing of the dropdown.
 */
function toggleIconRotation() {
    let icon = document.getElementById('selectIcon');
    iconRotated = !iconRotated;
    icon.style.transform = iconRotated ? 'rotate(180deg)' : 'rotate(0deg)';
}

/**
 * Sets the display style for an element.
 *
 * @param {HTMLElement} element - The element to set the display style for.
 * @param {string} style - The display style to apply.
 */
function setDisplayStyle(element, style) {
    if (element) {
        element.style.display = style;
    }
}

/**
 * Clears any new task information that has been begun but not completed.
 */
function clearBegonnenNewTask() {
    clearSubtaskAndContactsArrays();
    renderAddTask();
}

/**
 * Initiates the creation of a new task.
 */
function createTask() {
    if (!isButtonClicked) {
        isButtonClicked = true;

        let createButton = document.querySelector('.create-button');
        createButton.disabled = true;
        setNewTask();
        setTimeout(() => {
            isButtonClicked = false;
            createButton.disabled = false;
        }, 1000);
    }
}

/**
 * Updates the user interface state, particularly for contact assignment.
 */
function updateUIState() {
    let contactContainer = document.getElementById('contactContainer');
    let selectedContactContain = document.getElementById('selected-contact-ctn');
    let arrowIcon = document.getElementById('arrowIcon');

    arrowIcon.classList.toggle('rotate', !contactContainer.classList.contains('d-none'));
    selectedContactContain.classList.toggle('d-none', !selectedContactContain.querySelectorAll('div').length > 0 || !contactContainer.classList.contains('d-none'));
}

/**
 * Handles click events to manage interactions outside of specific areas, like the contact container.
 */
document.addEventListener('click', function (event) {
    let addTaskSite = document.getElementById('taskContainerContent');
    if (!addTaskSite) return;

    let contactContainer = document.getElementById('contactContainer');
    let assignBtn = document.getElementById('assignBtn');
    let assignInputContain = document.getElementById('assignInputContain');
    let assignInput = document.getElementById('assignTo-input');

    if (isClickOutsideContactArea(event, contactContainer, assignBtn, assignInputContain)) {
        clearInputAndSearch(assignInput);
        toggleContactContainer(contactContainer);
    }
});

/**
 * Determines if a click event occurred outside the contact assignment area.
 *
 * @param {Event} event - The click event.
 * @param {HTMLElement} contactContainer - The contact container element.
 * @param {HTMLElement} assignBtn - The assign button element.
 * @param {HTMLElement} assignInputContain - The container for the assignment input.
 * @returns {boolean} True if the click was outside the contact area, false otherwise.
 */
function isClickOutsideContactArea(event, contactContainer, assignBtn, assignInputContain) {
    return !contactContainer.contains(event.target) &&
        !assignBtn.contains(event.target) &&
        !assignInputContain.contains(event.target);
}

/**
 * Clears the input field and performs a contact search if necessary.
 *
 * @param {HTMLInputElement} assignInput - The input field for contact assignment.
 */
function clearInputAndSearch(assignInput) {
    if (assignInput.value) {
        assignInput.value = '';
        searchContactToAssign();
    }
}

/**
 * Toggles the visibility of the contact container.
 *
 * @param {HTMLElement} contactContainer - The contact container element.
 */
function toggleContactContainer(contactContainer) {
    if (!contactContainer.classList.contains('d-none')) {
        toggleContacts();
    }
}

/**
 * Adds an event listener to the document to handle clicks outside the category area.
 * If a click outside the category area is detected, the category dropdown is closed and the icon is rotated back.
 */
document.addEventListener('click', function (event) {
    let addTaskSite = document.getElementById('taskContainerContent');
    if (!addTaskSite) return;

    let categoryBox = document.getElementById('categoryBox');
    let dropdownOptions = document.getElementById('dropdownOptions');

    if (!isClickOutsideCategoryArea(event, categoryBox, dropdownOptions)) {
        return;
    }

    setDisplayStyle(dropdownOptions, 'none');
    toggleIconRotationBack();
});

/**
 * Checks if a click event occurred outside the category box and dropdown options.
 *
 * @param {Event} event - The click event.
 * @param {HTMLElement} categoryBox - The category box element.
 * @param {HTMLElement} dropdownOptions - The dropdown options element.
 * @returns {boolean} True if the click was outside the category area, false otherwise.
 */
function isClickOutsideCategoryArea(event, categoryBox, dropdownOptions) {
    return !categoryBox.contains(event.target) && !dropdownOptions.contains(event.target);
}

/**
 * Sets the display style of an HTML element.
 *
 * @param {HTMLElement} element - The element to set the display style for.
 * @param {string} style - The display style to apply (e.g., 'none', 'block').
 */
function setDisplayStyle(element, style) {
    if (element) {
        element.style.display = style;
    }
}

/**
 * Toggles the rotation of the select icon back to its original state.
 */
function toggleIconRotationBack() {
    let icon = document.getElementById('selectIcon');
    if (iconRotated) {
        iconRotated = false;
        icon.style.transform = 'rotate(0deg)';
    }
}

/**
 * Prevents selection of placeholder text.
 *
 * @param {Event} event - The event that triggers the placeholder selection.
 */
function preventPlaceholderSelection(event) {
    event.preventDefault();
}