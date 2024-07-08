
/**
 * Renders the popup for adding a task and sets up its related elements.
 */
function renderAddTaskPopUp() {
    let popupCtn = document.getElementById('popup-addTask-ctn');
    popupCtn.classList.remove('d-none');
    popupCtn.innerHTML = returnAddTaskPopupHTML();
    renderAssignedToContactList();
    clearSubtaskAndContactsArrays();

    setupPopupClickListener();
}

/**
 * Sets up a click listener for the task addition popup.
 * It handles clicks for both the general popup and category-specific interactions.
 */
function setupPopupClickListener() {
    document.getElementById('popup-addTask').addEventListener('click', function (event) {
        handlePopupClick(event);
        handlePopupClickCategory(event);
    });
}

/**
 * Handles click events within the task addition popup, specifically for category interactions.
 *
 * @param {Event} event - The click event.
 */
function handlePopupClickCategory(event) {
    let categoryBox = document.getElementById('categoryBox');
    let dropdownOptionsPopup = document.getElementById('dropdownOptionsPopup');
    let subtaskContain = document.querySelector('.subtask-container');
    let belowContain = document.querySelector('.task-below-popup');

    if (!isClickOutsideCategoryArea(event, categoryBox, dropdownOptionsPopup)) {
        return;
    }

    if (getDisplayStyle(dropdownOptionsPopup) !== 'none') {
        setDisplayStyle(dropdownOptionsPopup, 'none');
        toggleElementsVisibility(subtaskContain, belowContain, true);
        toggleIconRotationBack();
    }
}

/**
 * Toggles the visibility of given elements.
 *
 * @param {HTMLElement} subtaskContain - The container element for subtasks.
 * @param {HTMLElement} belowContain - The container element below the task popup.
 * @param {boolean} visible - Indicates whether the elements should be visible or not.
 */
function toggleElementsVisibility(subtaskContain, belowContain, visible) {
    if (subtaskContain) {
        subtaskContain.classList.toggle('d-none', !visible);
    }
    if (belowContain) {
        belowContain.classList.toggle('d-none', !visible);
    }
}

/**
 * Retrieves the display style of an HTML element.
 *
 * @param {HTMLElement} element - The element to get the display style of.
 * @returns {string} The display style of the element.
 */
function getDisplayStyle(element) {
    return element ? element.style.display : '';
}

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
 * Handles click events inside the task adding popup.
 *
 * @param {Event} event - The event object for the click.
 */
function handlePopupClick(event) {
    let contactContainer = document.getElementById('contactContainer');
    let assignBtn = document.getElementById('assignBtn');
    let assignInputContain = document.getElementById('assignInputContain');
    let assignInput = document.getElementById('assignTo-input');
    let isClickInsideContactContainer = contactContainer.contains(event.target);
    let isClickOnAssignBtn = assignBtn.contains(event.target);
    let isClickInsideAssignInputContain = assignInputContain.contains(event.target);

    if (!isClickInsideContactContainer && !isClickOnAssignBtn && !isClickInsideAssignInputContain) {
        if (assignInput.value) {
            assignInput.value = '';
            searchContactToAssign();
        }

        if (!contactContainer.classList.contains('d-none')) {
            toggleContacts();
        }
    }
}

/**
 * Closes the add task popup with an animation.
 */
function closePopupAddTask() {
    let contain = document.getElementById('popup-addTask-ctn');
    let popup = document.getElementById('popup-addTask');
    let background = document.getElementById('backgroundFromTaskPopup');

    popup.classList.add('slideOutToRight');
    background.classList.add('fadeOutBackground');
    popup.addEventListener('animationend', function () {
        contain.classList.add('d-none');
    }, { once: true });
}
