
/**
 * Adds a new contact to the contact list.
 */
async function addNewContact() {
    if (checkIfGuestOrUserLoged() === false) {
        if (contactIsValid) {
            await setNewContact();
            await renderContactsPage();
            closeContactPopup();
            renderContacts();
            showCreatedNewContact();
            closeMobileContactPopup();
        }
    } else {
        showGuestLoginPopup();
    }
}

/**
 * Adds a new contact to the contacts list.
 */
async function setNewContact() {
    let inputedName = document.getElementById('new-contact-name').value;
    let name = formatName(inputedName);
    let email = document.getElementById('new-contact-email').value;
    let phone = document.getElementById('new-contact-phone').value;
    let initial = returnContactInitialLetter(name);
    let BgColor;

    await loadUsers();
    let matchedUser = users.find(user => user.email === email);

    if (matchedUser) {
        BgColor = matchedUser.BgColor;
    } else if (currentUser && email === currentUser[0].email) {
        BgColor = currentUser[0].BgColor;
    } else {
        BgColor = setRandomColor();
    }

    contacts.push({ name, email, phone, initial, BgColor });
    await setItem('contacts', JSON.stringify(contacts));
}

/**
 * Edits a contact's information and updates the contact list.
 *
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initial - The contact's initial letter.
 * @param {string} BgColor - The contact's background color.
 */
async function editContact(name, email, phone, initial, BgColor) {
    if (checkIfGuestOrUserLoged() === false) {
        let index = contacts.findIndex(e => e.email === email);
        name = document.getElementById(`edited-${name}`).value;
        email = document.getElementById(`edited-${email}`).value;
        phone = document.getElementById(`edited-${phone}`).value;
        initial = returnContactInitialLetter(name);
        contacts.splice(index, 1, { name, email, phone, initial, BgColor });
        await setItem('contacts', JSON.stringify(contacts));
        editSelectedContacts(name, email, phone, initial, BgColor);
        closeContactPopup();
        renderContacts();
        showContactInformation(name, email, phone, initial, BgColor);
    } else {
        showGuestLoginPopup();
    }
}

/**
 * Updates selected contacts in tasks with edited contact information.
 *
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initial - The contact's initial letter.
 * @param {string} BgColor - The contact's background color.
 */
async function editSelectedContacts(name, email, phone, initial, BgColor) {
    for (let i = 0; i < tasks.length; i++) {
        const taskContacts = tasks[i]['contacts'];
        let index = taskContacts.findIndex(e => e.email === email);
        taskContacts.splice(index, 1, { name, email, phone, initial, BgColor });
    }
    await setItem('tasks', JSON.stringify(tasks));
}

/**
 * Show the last created contact for viewing.
 */
function showCreatedNewContact() {
    let lastCreatedContact = contacts[contacts.length - 1];
    let lastCreatedContactEmail = lastCreatedContact['email'];
    let justCreatedContactInformation = document.getElementById(lastCreatedContactEmail);
    justCreatedContactInformation.click();
}

/**
 * Checks if a new contact already exists in the contact list.
 */
function checkExistingContact() {
    resetAddContactCustomValidity();
    let contactName = document.getElementById('new-contact-name');
    let contactEmail = document.getElementById('new-contact-email');
    let contactPhone = document.getElementById('new-contact-phone');
    let inputedName = document.getElementById('new-contact-name').value;
    let name = formatName(inputedName);
    name = contacts.find(u => u.name == name);
    let email = contacts.find(u => u.email == contactEmail.value);
    let phone = contacts.find(u => u.phone == contactPhone.value);
    returnCustomValidityMessage(name, email, phone, contactName, contactEmail, contactPhone);
}

/**
 * Sets custom validity messages for new contact inputs based on existing contacts.
 *
 * @param {object} name - The contact name object.
 * @param {object} email - The contact email object.
 * @param {object} phone - The contact phone object.
 * @param {HTMLElement} contactName - The contact name input element.
 * @param {HTMLElement} contactEmail - The contact email input element.
 * @param {HTMLElement} contactPhone - The contact phone input element.
 */
function returnCustomValidityMessage(name, email, phone, contactName, contactEmail, contactPhone) {
    if (name) {
        contactIsValid = false;
        contactName.setCustomValidity('This Person already exist in your contacts');
    } else if (email) {
        contactIsValid = false;
        contactEmail.setCustomValidity('This E-Mail adress has already been added to your contacts');
    } else if (phone) {
        contactIsValid = false;
        contactPhone.setCustomValidity('This Phone Number is already attributed to a contact');
    } else {
        contactIsValid = true;
    }
}

/**
 * Resets custom validity messages for the add contact form inputs.
 */
function resetAddContactCustomValidity() {
    document.getElementById('new-contact-name').setCustomValidity('');
    document.getElementById('new-contact-email').setCustomValidity('');
    document.getElementById('new-contact-phone').setCustomValidity('');
}

/**
 * Returns the first letter of a name, typically used for sorting or display purposes.
 *
 * @param {string} name - The name to extract the initial from.
 * @returns {string} The first letter of the name.
 */
function returnContactInitialLetter(name) {
    return name.replace(/[^A-Z]+/g, '');
}

/**
 * Formats a name to have each word start with a capital letter.
 *
 * @param {string} name - The name to format.
 * @returns {string} The formatted name.
 */
function formatName(name) {
    return name.replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Generates a random background color.
 *
 * @returns {string} The generated color.
 */
function setRandomColor() {
    const letters = '0123456789ABCDEF';
    let BgColor = '#';
    for (let i = 0; i < 6; i++) {
        BgColor += letters[Math.floor(Math.random() * 16)];
    }
    return BgColor;
}