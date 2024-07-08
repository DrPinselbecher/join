let originalTitle = "";

/**
 * Renders the task editing interface for a specific task in the board view.
 *
 * @param {number} id - The ID of the task to be edited.
 */
function renderEditTaskInBordSite(id) {
    let task = tasks.find(t => t.id === id);
    if (task) {
        let contain = document.getElementById('taskDetails');
        originalTitle = task.title;
        createdSubtaskList = [...task.subtasks];
        selectedContacts = [...task.contacts];

        contain.innerHTML = returnEditTaskHTML(task);
        renderEditComponents(task);
    }
}

/**
 * Renders components related to the task editing process.
 *
 * @param {object} task - The task object being edited.
 */
function renderEditComponents(task) {
    renderAssignedToContactListEdit();
    renderSubtaskForEditOption(task.subtasks);
    renderSelectedContactBadgesForEditOption(task.contacts);
    markAssignedContactsAsSelected();
    changeClassFromDetailsToEdit();
    makeChildrenNonDraggable('taskDetailsContain');
    preventDragOnTextFields('taskDetails');
    checkAndAddSelectedClassesForPriority(task.priority);
    dontEmptyCalender();
    document.querySelector('.taskEdit').addEventListener('click', handleTaskEditClick);
}

/**
 * Handles click events within the task editing interface.
 *
 * @param {Event} event - The click event.
 */
function handleTaskEditClick(event) {
    let contactContainer = document.getElementById('contactContainerEdit');
    let assignBtn = document.getElementById('assignBtnEdit');
    let assignInputContain = document.getElementById('assignInputContainEdit');
    let assignInput = document.getElementById('assignTo-inputEdit');
    let isClickInsideContactContainer = contactContainer.contains(event.target);
    let isClickOnAssignBtn = assignBtn.contains(event.target);
    let isClickInsideAssignInputContain = assignInputContain.contains(event.target);

    if (!isClickInsideContactContainer && !isClickOnAssignBtn && !isClickInsideAssignInputContain) {
        if (assignInput.value) {
            assignInput.value = '';
            searchContactToAssignEdit();
        }

        if (!contactContainer.classList.contains('d-none')) {
            toggleContactsEdit();
        }
    }
}

/**
 * Renders the list of contacts available for assignment during task editing.
 */
function renderAssignedToContactListEdit() {
    let assignedToContactList = document.getElementById('assigned-to-contact-listEdit');
    assignedToContactList.innerHTML = '';

    appendCurrentUserToContactList(assignedToContactList);
    appendContactsToContactList(assignedToContactList);
}

/**
 * Appends the current user to the contact list for task assignment.
 *
 * @param {HTMLElement} assignedToContactList - The container for the contact list.
 */
function appendCurrentUserToContactList(assignedToContactList) {
    if (currentUser) {
        assignedToContactList.innerHTML += returnAssignedToContactListEdit(0, currentUser[0]);
    }
}

/**
 * Appends contacts to the contact list for task assignment.
 *
 * @param {HTMLElement} assignedToContactList - The container for the contact list.
 */
function appendContactsToContactList(assignedToContactList) {
    contacts.sort((a, b) => compareStrings(a.name, b.name));
    contacts.forEach((contact, index) => {
        if (!currentUser || contact.email !== currentUser[0].email) {
            assignedToContactList.innerHTML += returnAssignedToContactListEdit(index + 1, contact);
        }
    });
}

/**
 * Renders subtasks for editing.
 */
function renderSubtaskForEditOption() {
    let subtaskContent = document.getElementById('subtaskContentEdit');
    subtaskContent.innerHTML = '';

    for (let index = 0; index < createdSubtaskList.length; index++) {
        let subtask = createdSubtaskList[index].description;
        subtaskContent.innerHTML += returnSubtaskForEditOption(subtask, index);
    }
}

/**
 * Deletes a subtask from the list during editing.
 *
 * @param {number} i - The index of the subtask to be deleted.
 */
function deleteButtonInEditTask(i) {
    createdSubtaskList.splice(i, 1);
    renderSubtaskForEditOption();
}

/**
 * Adds a new subtask during the task editing process.
 */
function addSubtaskInEditTask() {
    let subtaskInput = document.getElementById('subtaskInputEdit');
    if (subtaskInput.value !== "") {
        let newSubtask = {
            description: escapeHTML(subtaskInput.value),
            subtaskStatus: "unfinished"
        };
        createdSubtaskList.push(newSubtask);
        renderSubtaskForEditOption(createdSubtaskList);
    }
    subtaskInput.value = "";
}

/**
 * Ensures that the calendar input is not left empty.
 */
function dontEmptyCalender() {
    document.getElementById('calender-inputEdit').addEventListener('input', function (e) {
        if (e.target.value === '') {
            e.target.value = e.target.defaultValue;
        }
    });
}

/**
 * Checks and applies selected classes for task priority during editing.
 *
 * @param {string} priority - The priority of the task.
 */
function checkAndAddSelectedClassesForPriority(priority) {
    let button = document.getElementById(`button${priority}Edit`);
    let icon = document.getElementById(`icon${priority}Edit`);

    button.classList.add('selected');
    icon.classList.add('selected_icon');

    currentPrioriyToCreateTask = priority;
}

/**
 * Prevents dragging on text fields within the task editing interface.
 *
 * @param {string} elementId - The ID of the container element.
 */
function preventDragOnTextFields(elementId) {
    let container = document.getElementById(elementId);
    if (container) {
        let inputElements = container.querySelectorAll('input, textarea');
        inputElements.forEach(function (inputElement) {
            inputElement.addEventListener('dragstart', function (event) {
                event.preventDefault();
            });
        });
    }
}

/**
 * Changes CSS classes from task details view to task editing view.
 */
function changeClassFromDetailsToEdit() {
    let contentContain = document.getElementById('taskDetails');

    contentContain.classList.remove('taskDetails');
    contentContain.classList.add('taskEdit');
}

/**
 * Marks contacts as selected based on their assignment to the task.
 */
function markAssignedContactsAsSelected() {
    selectedContacts.forEach(contact => {
        let contactElement = document.getElementById(`contact-${contact.email}`);
        if (contactElement) {
            styleSelectedContactByEmail(contact.email);
        }
    });
}

/**
 * Styles the contact element as selected based on their email.
 *
 * @param {string} email - The email of the contact.
 */
function styleSelectedContactByEmail(email) {
    let contactElement = document.getElementById(`contact-${email}`);
    let firstImg = contactElement.querySelector('img:first-child');
    let secondImg = contactElement.querySelector('img:nth-child(2)');

    if (contactElement) {
        contactElement.classList.add('contact_selected');
        firstImg.classList.add('d-none');
        secondImg.classList.remove('d-none');
    }
}

/**
 * Renders badges for contacts selected for task assignment during editing.
 *
 * @param {Array} assignedContacts - The list of assigned contacts.
 */
function renderSelectedContactBadgesForEditOption(assignedContacts) {
    let selectedContactCtn = document.getElementById('selected-contact-ctnEdit');
    selectedContactCtn.innerHTML = '';
    for (let i = 0; i < assignedContacts.length; i++) {
        let assignedContact = assignedContacts[i];
        selectedContactCtn.innerHTML += returnSelectedContactBadges(assignedContact);
    }
}

/**
 * Updates the task information based on edits made by the user.
 *
 * @param {number} id - The ID of the task being revised.
 */
async function reviseEditTask(id) {
    if (checkIfGuestOrUserLoged() === false) {
        let index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            let title = escapeHTML(document.getElementById('titel-inputEdit').value);
            let description = escapeHTML(document.getElementById('read-descriptionEdit').value);
            if (title.trim() === '') {
                title = originalTitle;
            }
            let date = document.getElementById('calender-inputEdit').value;
            date = formatToGermanDate(date);
            let priority = currentPrioriyToCreateTask;
            let contacts = [...selectedContacts];
            let creator = currentUser[0].name;
            let subtasks = [...createdSubtaskList];

            tasks[index] = { ...tasks[index], creator, title, description, date, priority, contacts, subtasks };
            await setItem('tasks', JSON.stringify(tasks));
            closeTask();
            clearSubtaskAndContactsArrays();
            renderBoard();
        }
    } else {
        showGuestLoginPopup();
    }
}

/**
 * Searches and displays contacts for assignment based on user input.
 */
function searchContactToAssignEdit() {
    let searchedContact = document.getElementById('assignTo-inputEdit').value.toLowerCase();
    let assignedToContactList = document.getElementById('assigned-to-contact-listEdit');
    let contactContainer = document.getElementById('contactContainerEdit');

    assignedToContactList.innerHTML = '';
    contactContainer.classList.remove('d-none');

    let contactFound = addMatchingContactsToList(assignedToContactList, searchedContact);
    updateContactContainerVisibility(contactContainer, contactFound, searchedContact);
    updateUIStateEdit();
}

/**
 * Adds matching contacts to the list based on the search query.
 *
 * @param {HTMLElement} assignedToContactList - The container for the contact list.
 * @param {string} searchedContact - The search query.
 * @returns {boolean} True if a matching contact is found, false otherwise.
 */
function addMatchingContactsToList(assignedToContactList, searchedContact) {
    let contactFound = false;
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        if (contact['name'].toLowerCase().startsWith(searchedContact)) {
            assignedToContactList.innerHTML += returnAssignedToContactListEdit(index, contact);
            if (isContactSelectedEdit(contact)) {
                styleSelectedContactEdit(index, contact.email);
            }
            contactFound = true;
        }
    }
    return contactFound;
}

/**
 * Updates the visibility of the contact container based on search results.
 *
 * @param {HTMLElement} contactContainer - The container for the contacts.
 * @param {boolean} contactFound - Indicates if a matching contact was found.
 * @param {string} searchedContact - The search query.
 */
function updateContactContainerVisibility(contactContainer, contactFound, searchedContact) {
    if (!contactFound && searchedContact) {
        contactContainer.classList.add('d-none');
    } else if (searchedContact === '') {
        renderAssignedToContactListWithSelectedEdit();
    }
}

/**
 * Updates the UI state during task editing, especially when dealing with contacts.
 */
function updateUIStateEdit() {
    let contactContainer = document.getElementById('contactContainerEdit');
    let selectedContactContain = document.getElementById('selected-contact-ctnEdit');
    let arrowIcon = document.getElementById('arrowIconEdit');

    arrowIcon.classList.toggle('rotate', !contactContainer.classList.contains('d-none'));
    selectedContactContain.classList.toggle('d-none', !selectedContactContain.querySelectorAll('div').length > 0 || !contactContainer.classList.contains('d-none'));
}

/**
 * Determines if a contact is selected for the task during editing.
 *
 * @param {object} contact - The contact to check.
 * @returns {boolean} True if the contact is selected, false otherwise.
 */
function isContactSelectedEdit(contact) {
    return selectedContacts.some(selected => selected.email === contact.email);
}

/**
 * Renders the assigned contacts list with selected contacts included during editing.
 */
function renderAssignedToContactListWithSelectedEdit() {
    let assignedToContactList = document.getElementById('assigned-to-contact-listEdit');
    assignedToContactList.innerHTML = '';

    appendCurrentUserIfSelected(assignedToContactList);
    appendSelectedAndRemainingContacts(assignedToContactList);
}

/**
 * Appends the current user to the contact list if selected during task editing.
 *
 * @param {HTMLElement} assignedToContactList - The container for the assigned contacts list.
 */
function appendCurrentUserIfSelected(assignedToContactList) {
    if (currentUser) {
        let index = contacts.findIndex(c => c.email === currentUser[0].email);
        assignedToContactList.innerHTML += returnAssignedToContactListEdit(index, currentUser[0]);
        if (selectedContacts.find(c => c.email === currentUser[0].email)) {
            markAssignedContactsAsSelected();
        }
    }
}

/**
 * Appends both selected and remaining contacts to the contact list during task editing.
 *
 * @param {HTMLElement} assignedToContactList - The container for the assigned contacts list.
 */
function appendSelectedAndRemainingContacts(assignedToContactList) {
    selectedContacts.forEach(selectedContact => {
        appendContactIfNotCurrentUser(assignedToContactList, selectedContact);
    });

    contacts.forEach((contact, index) => {
        if (isContactNotSelectedAndNotCurrentUser(contact)) {
            assignedToContactList.innerHTML += returnAssignedToContactListEdit(index, contact);
        }
    });
}

/**
 * Appends a contact to the contact list if it's not the current user during task editing.
 *
 * @param {HTMLElement} assignedToContactList - The container for the assigned contacts list.
 * @param {object} contact - The contact to append.
 */
function appendContactIfNotCurrentUser(assignedToContactList, contact) {
    if (!currentUser || contact.email !== currentUser[0].email) {
        let index = contacts.findIndex(c => c.email === contact.email);
        assignedToContactList.innerHTML += returnAssignedToContactListEdit(index, contact);
        markAssignedContactsAsSelected();
    }
}

/**
 * Checks if a contact is not selected and not the current user.
 *
 * @param {object} contact - The contact to check.
 * @returns {boolean} True if the contact is neither selected nor the current user, false otherwise.
 */
function isContactNotSelectedAndNotCurrentUser(contact) {
    return !selectedContacts.find(c => c.email === contact.email) && (!currentUser || contact.email !== currentUser[0].email);
}

/**
 * Assigns a contact to the task during editing.
 *
 * @param {number} i - The index of the contact in the list.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} initial - The initial of the contact.
 * @param {string} BgColor - The background color associated with the contact.
 */
function assignToEdit(i, name, email, phone, initial, BgColor) {
    let index = selectedContacts.findIndex(c => c.email === email);
    styleSelectedContactEdit(i, email);
    if (index > -1) {
        selectedContacts.splice(index, 1);
        renderSelectedContactBadgesForEditOption(selectedContacts)
    } else {
        selectedContacts.push({ name, email, phone, initial, BgColor });
        renderSelectedContactBadgesForEditOption(selectedContacts);
    }
}

/**
 * Styles the selected contact in the editing interface.
 *
 * @param {number} index - The index of the contact in the list.
 * @param {string} email - The email of the contact.
 */
function styleSelectedContactEdit(index, email) {
    let checkIcon = document.getElementById(`check-contact${index}-image`);
    let checkedIcon = document.getElementById(`checked-contact${index}-image`);
    let contactElement = document.getElementById(`contact-${email}`);

    if (contactElement) {
        contactElement.classList.toggle('contact_selected');
    }
    if (checkIcon && checkedIcon) {
        checkIcon.classList.toggle('d-none');
        checkedIcon.classList.toggle('d-none');
    }
}

/**
 * Rotates the icon in the task editing interface.
 */
function rotateIconEdit() {
    let icon = document.querySelector('.assign-button img');
    icon.classList.toggle('rotate');
}

/**
 * Toggles the visibility of the contacts container in the task editing interface.
 */
function toggleContactsEdit() {
    let contactContainer = document.getElementById('contactContainerEdit');
    let input = document.getElementById('assignTo-inputEdit');
    contactContainer.classList.toggle('d-none');
    input.value = '';
    updateUIStateEdit();
    renderAssignedToContactListWithSelectedEdit();
}

/**
 * Changes the styles of the priority selection buttons in the task editing interface.
 *
 * @param {string} priority - The priority to set for the task.
 */
function changeButtonStylesEdit(priority) {
    let button = document.getElementById(`button${priority}Edit`);
    let icon = document.getElementById(`icon${priority}Edit`);
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
 * Shows or hides subtask images based on input in the task editing interface.
 */
function showSubtaskImagesByInputEdit() {
    let imageContainer = document.getElementById("imageContainerEdit");
    let newImages = document.getElementById("newImagesEdit");
    let subtaskInput = document.getElementById('subtaskInputEdit');

    if (!subtaskInput.value == "") {
        imageContainer.classList.add('d-none');
        newImages.classList.remove('d-none');
    } else {
        imageContainer.classList.remove('d-none');
        newImages.classList.add('d-none');
    }
}

/**
 * Checks the edited task list and updates subtask descriptions.
 *
 * @param {number} i - The index of the subtask being checked.
 */
function checkEditedTaskListEdit(i) {
    let editedDescription = escapeHTML(document.getElementById(`editInputEdit${i}`).value);

    if (editedDescription !== "") {
        createdSubtaskList[i] = { ...createdSubtaskList[i], description: editedDescription };
    }

    renderSubtaskForEditOption(createdSubtaskList);
}

/**
 * Toggles between view and edit mode for a subtask.
 *
 * @param {number} i - The index of the subtask.
 */
function toggleSubtaskEdit(i) {
    document.getElementById(`taskListEdit${i}`).classList.toggle('d-none');
    document.getElementById(`editTaskListEdit${i}`).classList.toggle('d-none');

    document.getElementById(`editInputEdit${i}`).focus();
    document.getElementById(`editInputEdit${i}`).select();
}

/**
 * Toggles the visibility of subtask images in the task editing interface.
 */
function toggleSubtaskImagesEdit() {
    let imageContainer = document.getElementById("imageContainerEdit");
    let newImages = document.getElementById("newImagesEdit");
    let subtaskInput = document.getElementById('subtaskInputEdit');

    subtaskInput.focus();
    subtaskInput.select();

    subtaskInput.value = "";

    imageContainer.classList.toggle('d-none');
    newImages.classList.toggle('d-none');
}

/**
 * Sets a required border style if the title field is empty during editing.
 */
function ifEmptySetRequiredBorder() {
    let titleInput = document.getElementById('titel-inputEdit');
    let errorWarning = document.getElementById('title-warning-text');

    if (titleInput.value.trim() === '') {
        titleInput.classList.add('titleEmptyEdit');
        errorWarning.style.display = 'block';
    } else {
        titleInput.classList.remove('titleEmptyEdit');
        errorWarning.style.display = 'none';
    }
}