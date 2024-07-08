/**
 * Renders the list of contacts available for assignment to the task.
 */
function renderAssignedToContactList() {
    let assignedToContactList = document.getElementById('assigned-to-contact-list');
    assignedToContactList.innerHTML = '';

    appendCurrentUser(assignedToContactList);
    appendOtherContacts(assignedToContactList);
}

/**
 * Appends the current user to the contact list for task assignment.
 *
 * @param {HTMLElement} assignedToContactList - The container for the contact list.
 */
function appendCurrentUser(assignedToContactList) {
    if (currentUser) {
        assignedToContactList.innerHTML += returnAssignedToContactList(0, currentUser[0]);
    }
}

/**
 * Appends other contacts to the contact list for task assignment.
 *
 * @param {HTMLElement} assignedToContactList - The container for the contact list.
 */
function appendOtherContacts(assignedToContactList) {
    contacts.sort((a, b) => compareStrings(a.name, b.name));
    contacts.forEach((contact, index) => {
        if (!currentUser || contact.email !== currentUser[0].email) {
            assignedToContactList.innerHTML += returnAssignedToContactList(index + 1, contact);
        }
    });
}

/**
 * Renders the contact list with selected contacts included.
 */
function renderAssignedToContactListWithSelected() {
    let assignedToContactList = document.getElementById('assigned-to-contact-list');
    assignedToContactList.innerHTML = '';

    appendCurrentUserWithSelection(assignedToContactList);
    appendSelectedContacts(assignedToContactList);
    appendRemainingContacts(assignedToContactList);
}

/**
 * Appends the current user to the contact list with selection status.
 *
 * @param {HTMLElement} assignedToContactList - The container for the contact list.
 */
function appendCurrentUserWithSelection(assignedToContactList) {
    if (currentUser) {
        let index = contacts.findIndex(c => c.email === currentUser[0].email);
        assignedToContactList.innerHTML += returnAssignedToContactList(index, currentUser[0]);
        if (selectedContacts.find(c => c.email === currentUser[0].email)) {
            styleSelectedContact(index);
        }
    }
}

/**
 * Appends selected contacts to the contact list.
 *
 * @param {HTMLElement} assignedToContactList - The container for the contact list.
 */
function appendSelectedContacts(assignedToContactList) {
    selectedContacts.forEach(selectedContact => {
        if (!currentUser || selectedContact.email !== currentUser[0].email) {
            let index = contacts.findIndex(c => c.email === selectedContact.email);
            assignedToContactList.innerHTML += returnAssignedToContactList(index, selectedContact);
            styleSelectedContact(index);
        }
    });
}

/**
 * Appends remaining contacts to the contact list, excluding selected ones.
 *
 * @param {HTMLElement} assignedToContactList - The container for the contact list.
 */
function appendRemainingContacts(assignedToContactList) {
    contacts.forEach((contact, index) => {
        if (!selectedContacts.find(c => c.email === contact.email) && (!currentUser || contact.email !== currentUser[0].email)) {
            assignedToContactList.innerHTML += returnAssignedToContactList(index, contact);
        }
    });
}

/**
 * Assigns a contact to the task, toggling their selection status.
 *
 * @param {number} i - The index of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} initial - The initial letter of the contact's name.
 * @param {string} BgColor - The background color associated with the contact.
 */
function assignTo(i, name, email, phone, initial, BgColor) {
    let index = selectedContacts.findIndex(c => c.email === email);
    styleSelectedContact(i);
    if (index > -1) {
        selectedContacts.splice(index, 1);
        renderSelectedContactBadges(selectedContacts)
    } else {
        selectedContacts.push({ name, email, phone, initial, BgColor });
        renderSelectedContactBadges(selectedContacts);
    }
}

/**
 * Renders badges for selected contacts.
 *
 * @param {Array} selectedContacts - The list of selected contacts.
 */
function renderSelectedContactBadges(selectedContacts) {
    let selectedContactCtn = document.getElementById('selected-contact-ctn');
    selectedContactCtn.innerHTML = '';
    for (let i = 0; i < selectedContacts.length; i++) {
        let selectedContact = selectedContacts[i];
        selectedContactCtn.innerHTML += returnSelectedContactBadges(selectedContact);
    }
}

/**
 * Styles a contact as selected or unselected based on their index.
 *
 * @param {number} index - The index of the contact in the list.
 */
function styleSelectedContact(index) {
    let checkIcon = document.getElementById(`check-contact${index}-img`);
    let checkedIcon = document.getElementById(`checked-contact${index}-img`);
    let contactElement = document.getElementById(`contact-${index}`);

    if (contactElement) {
        contactElement.classList.toggle('contact_selected');
    }
    if (checkIcon && checkedIcon) {
        checkIcon.classList.toggle('d-none');
        checkedIcon.classList.toggle('d-none');
    }
}

/**
 * Toggles the contact assignment container.
 */
function toggleContacts() {
    let contactContainer = document.getElementById('contactContainer');
    let input = document.getElementById('assignTo-input');
    contactContainer.classList.toggle('d-none');
    input.value = '';
    updateUIState();
    renderAssignedToContactListWithSelected();
}

/**
 * Searches for and displays contacts based on user input.
 */
function searchContactToAssign() {
    let searchedContact = document.getElementById('assignTo-input').value.toLowerCase();
    let assignedToContactList = document.getElementById('assigned-to-contact-list');
    let contactContainer = document.getElementById('contactContainer');

    assignedToContactList.innerHTML = '';
    contactContainer.classList.remove('d-none');

    let contactFound = addContactsToContactList(assignedToContactList, searchedContact);
    updateContactListVisibility(contactContainer, contactFound, searchedContact);
    updateUIState();
}

/**
 * Adds contacts to the contact list based on a search query.
 *
 * @param {HTMLElement} assignedToContactList - The list to add contacts to.
 * @param {string} searchedContact - The search query.
 * @returns {boolean} True if a matching contact was found, false otherwise.
 */
function addContactsToContactList(assignedToContactList, searchedContact) {
    let contactFound = false;
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        if (contact['name'].toLowerCase().startsWith(searchedContact)) {
            assignedToContactList.innerHTML += returnAssignedToContactList(index, contact);
            if (isContactSelected(contact)) {
                styleSelectedContact(index);
            }
            contactFound = true;
        }
    }
    return contactFound;
}

/**
 * Updates the visibility of the contact list based on the presence of matching contacts.
 *
 * @param {HTMLElement} contactContainer - The container for the contact list.
 * @param {boolean} contactFound - Indicates if a matching contact was found.
 * @param {string} searchedContact - The search query.
 */
function updateContactListVisibility(contactContainer, contactFound, searchedContact) {
    if (!contactFound && searchedContact) {
        contactContainer.classList.add('d-none');
    } else if (searchedContact === '') {
        renderAssignedToContactListWithSelected();
    }
}

/**
 * Checks if a contact is selected for the task.
 *
 * @param {object} contact - The contact to check.
 * @returns {boolean} True if the contact is selected, false otherwise.
 */
function isContactSelected(contact) {
    return selectedContacts.some(selected => selected.email === contact.email);
}
