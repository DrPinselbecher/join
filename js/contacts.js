let contacts = [];
let contactIsValid = false;

/**
 * Renders the contacts page with necessary UI adjustments.
 */
async function renderContactsPage() {
    contactsBgrColor();
    addContentCSS();
    removeBgrColorWithoutContacts();
    addJoinLogoClickable();
    returnContactPage();
    renderContacts();
    hideLegalContent();
}

/**
 * Organizes contacts alphabetically by the first letter of their names.
 * @returns {Array} An array of unique first letters.
 */
function setOrganizer() {
    let organizer = [];
    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        let firstCharFromName = contact['name'].charAt(0).toUpperCase();
        organizer.push(firstCharFromName);
        organizer = organizer.filter((item, index) =>
            organizer.indexOf(item) === index);
    }
    organizer.sort((a, b) => { return compareStrings(a, b) });
    return organizer;
}

/**
 * Renders the list of contacts grouped by the first letter of their names.
 */
function renderContacts() {
    let organizer = setOrganizer();
    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';
    for (let i = 0; i < organizer.length; i++) {
        const organizerLetter = organizer[i];
        contactList.innerHTML += returnContactsOrganizer(i, organizerLetter);
        renderMatchedContact(i, organizerLetter);
    }
}

/**
 * Renders contacts that match a specific organizer letter.
 *
 * @param {number} i - The index of the organizer letter.
 * @param {string} organizerLetter - The letter organizing the contacts.
 */
function renderMatchedContact(i, organizerLetter) {
    let contactList = document.getElementById('contact-list');
    let contactMatches = contacts.filter(e => e.name.charAt(0) === organizerLetter);
    contactMatches.sort((a, b) => { return compareStrings(a.name, b.name) });
    for (let j = 0; j < contactMatches.length; j++) {
        contactList.innerHTML += returnContacts(i, contactMatches[j]);
    }
}

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
            jumpToCreatedContact();
            closeMobileContactPopup();
        }
    } else {
        showGuestLoginPopup();
    }
}

/**
 * Scrolls to the last created contact for viewing.
 */
function jumpToCreatedContact() {
    let lastCreatedContact = contacts[contacts.length - 1];
    let lastCreatedContactEmail = lastCreatedContact['email'];
    let justCreatedContactInformation = document.getElementById(lastCreatedContactEmail);
    justCreatedContactInformation.click();
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
 * Deletes a contact from the contact list and updates tasks.
 *
 * @param {string} email - The email of the contact to be deleted.
 */
async function deleteContact(email) {
    let index = contacts.findIndex(e => e.email === email);
    if (index > -1) {
        contacts.splice(index, 1);
        await setItem('contacts', JSON.stringify(contacts));
    }

    await removeContactFromTasks(email);
    closeContactPopup();
    closeConfirmationPopup();
    closeMobileContactPopup();
    renderContactsPage();
}

/**
 * Removes a contact from all tasks.
 *
 * @param {string} email - The email of the contact to be removed.
 */
async function removeContactFromTasks(email) {
    tasks.forEach(task => {
        let contactIndex = task.contacts.findIndex(c => c.email === email);
        while (contactIndex !== -1) {
            task.contacts.splice(contactIndex, 1);
            contactIndex = task.contacts.findIndex(c => c.email === email);
        }
    });
    await setItem('tasks', JSON.stringify(tasks));
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
 * Loads contacts from storage.
 */
async function loadContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch {
        console.log('the contatcs were not loaded');
    }
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

/**
 * Displays detailed information for a selected contact.
 *
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initial - The contact's initial letter.
 * @param {string} BgColor - The contact's background color.
 */
function showContactInformation(name, email, phone, initial, BgColor) {
    let width = window.innerWidth;

    if (width < 1000) {
        showSelectedContactInformations(name, email, phone, initial, BgColor);
        toggleCSSContactInformation()
        toggleAddcontactMobileMenu();
    } else {
        showSelectedContactInformations(name, email, phone, initial, BgColor);
        showSelectedContactAnimation();
    }
}

/**
 * Displays detailed information for a selected contact.
 *
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initial - The contact's initial letter.
 * @param {string} BgColor - The contact's background color.
 */
function showSelectedContactInformations(name, email, phone, initial, BgColor) {
    let width = window.innerWidth;
    let contactInformations = document.getElementById('selected-contact-content');

    contactInformations.innerHTML = returnContactInformations(name, email, phone, initial, BgColor);
    width > 1000 ? setSelectedContactOnClick(email) : '';
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
 * Triggers an animation for the selected contact information.
 */
function showSelectedContactAnimation() {
    let content = document.getElementById('selected-contact-content');

    content.classList.add('slide_selected_contact');
    setTimeout(() =>
        content.classList.remove('slide_selected_contact')
        , 400);
}

/**
 * Sets a selected contact as active and resets other contacts' selection.
 *
 * @param {string} email - The email of the contact to be set as selected.
 */
function setSelectedContactOnClick(email) {
    let contact = document.getElementById(email);

    contact.classList.add('contact_selected');
    contact.classList.add('p-none');
    resetContactSelection();
}

/**
 * Resets the selection state for all contacts.
 */
function resetContactSelection() {
    let contactSelection = document.querySelectorAll('.contact_div');

    contactSelection.forEach((contactSelection) => {
        contactSelection.classList.remove('contact_selected');
        contactSelection.classList.remove('p-none');
    })
}

/**
 * Closes the detailed information view of a selected contact.
 */
function closeSelectedContactInformation() {
    toggleAddcontactMobileMenu();
    toggleCSSContactInformation();
}

/**
 * Toggles the CSS styles for displaying contact information.
 */
function toggleCSSContactInformation() {
    let contactList = document.getElementById('contact-list-section');
    let contactInformations = document.getElementById('contactInformations');

    contactList.classList.toggle('d-none');
    contactInformations.classList.toggle('selected_contact_infos');
    contactInformations.classList.toggle('mobile_selected_contact_infos');
}

/**
 * Opens the interface for adding a new contact.
 */
function openAddContact() {
    let width = window.innerWidth;
    let addContactCtn = document.getElementById('popup-ctn');

    addContactCtn.innerHTML = returnAddContactPopup();
    openContactPopup();
    if (width < 1000) {
        document.getElementById('contact-popup-left-button').classList.add('d-none');
    }
}

/**
 * Opens the contact addition or editing popup.
 */
function openContactPopup() {
    let width = window.innerWidth;
    let addContactCtn = document.getElementById('popup-ctn');
    let addContact = document.getElementById('contact-popup');

    if (width <= 1000) {
        addContact.classList.add('open_mobile_animation_contact_popup')
    } else {
        addContact.classList.add('open_animation_contact_popup');
    }
    addContactCtn.classList.toggle('d-none');
}

/**
 * Closes the contact addition or editing popup.
 */
function closeContactPopup() {
    let addContact = document.getElementById('contact-popup');
    let addContactCtn = document.getElementById('popup-ctn');

    if (window.matchMedia("(min-width: 1000px)").matches &&
        !addContactCtn.classList.contains('d-none')) {
        addContact.classList.remove('open_animation_contact_popup');
        addContact.classList.add('close_animation_contact_popup');
        setTimeout(() => addContactCtn.classList.toggle('d-none'), 650);
    } else if (window.matchMedia("(max-width: 1000px)").matches) {
        closeMobileEditMenu();
        closeSelectedContactInformation();
    }
}

/**
 * Closes the contact popup based on the screen width.
 */
function closePopupContact() {
    if (window.matchMedia("(min-width: 1000px)").matches) {
        closeContactPopup();
    } else if (window.matchMedia("(max-width: 1000px)").matches) {
        closeMobileContactPopup();
    }
}

/**
 * Closes the mobile view of the contact addition or editing popup.
 */
function closeMobileContactPopup() {
    let addContactPopup = document.getElementById('contact-popup');

    if (addContactPopup) {
        addContactPopup.classList.remove('open_mobile_animation_contact_popup');
        addContactPopup.classList.add('close_mobile_animation_contact_popup');
        setTimeout(() => {
            let addContactCtn = document.getElementById('popup-ctn');
            if (addContactCtn) {
                addContactCtn.classList.add('d-none');
            }
        }, 650);
    }
}

/**
 * Toggles the mobile menu for adding a contact.
 */
function toggleAddcontactMobileMenu() {
    let mobileAddContactButton = document.getElementById('mobile-add-contact-button');
    let mobileContactEditMenu = document.getElementById('mobile-contact-edit-menu');

    if (mobileAddContactButton) {
        mobileAddContactButton.classList.toggle('d-none');
    }

    if (mobileContactEditMenu) {
        mobileContactEditMenu.classList.toggle('d-none');
    }
}

/**
 * Confirms the deletion of a contact with a popup.
 *
 * @param {string} email - The email of the contact to be deleted.
 * @param {string} name - The name of the contact to be deleted.
 */
function confirmTaskDeletionContacts(email, name) {
    createConfirmPopupContacts(email, name);
    createConfirmBackground();
}

/**
 * Creates a confirmation popup for contact deletion.
 *
 * @param {string} email - The email of the contact to be deleted.
 * @param {string} name - The name of the contact to be deleted.
 */
function createConfirmPopupContacts(email, name) {
    let confirmationMessage = `${returnConfirmationMessageHTML(name)}`;
    let confirmationPopup = document.createElement('div');

    confirmationPopup.className = 'confirmationPopup';
    confirmationPopup.innerHTML = `
        ${returnConfirmationPopupContactsHTML(email, confirmationMessage)}
    `;
    document.body.appendChild(confirmationPopup);
}

/**
 * Opens the contact editing interface.
 *
 * @param {Event} event - The event triggering the edit.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initial - The contact's initial letter.
 * @param {string} BgColor - The contact's background color.
 */
function openEditContact(event, name, email, phone, initial, BgColor) {
    let editContactCtn = document.getElementById('popup-ctn');

    editContactCtn.innerHTML = returnEditContactPopup(name, email, phone, initial, BgColor);
    setMobileEditContact(event);
    openContactPopup();
    closeMobileEditMenu();
}

/**
 * Sets the mobile view for contact editing.
 *
 * @param {Event} event - The event triggering the mobile edit.
 */
function setMobileEditContact(event) {
    let width = window.innerWidth;
    if (width < 1000) {
        stop(event);
        let editContact = document.getElementById('edit-contact');
        editContact.classList.add('curent_selected_mobile_contact_editor');
    }
}

/**
 * Opens the mobile menu for editing a contact.
 *
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @param {string} initial - The contact's initial letter.
 * @param {string} BgColor - The contact's background color.
 */
function openMobileEditMenu(name, email, phone, initial, BgColor) {
    let mobileEditMenuCtn = document.getElementById('mobile-edit-contact-menu-ctn');

    mobileEditMenuCtn.innerHTML = returnMobileEditContactMenu(name, email, phone, initial, BgColor);
    mobileEditMenuCtn.classList.remove('d-none');
}

/**
 * Closes the mobile menu for editing a contact.
 */
function closeMobileEditMenu() {
    removeClassFromEditContact();
    animateAndHideMobileEditMenu();
}

/**
 * Removes a CSS class from the contact being edited in the mobile view.
 */
function removeClassFromEditContact() {
    let editContact = document.getElementById('edit-contact');
    if (editContact) {
        editContact.classList.remove('curent_selected_mobile_contact_editor');
    }
}

/**
 * Initiates an animation to hide the mobile contact editing menu and subsequently hides it.
 */
function animateAndHideMobileEditMenu() {
    let mobileEditMenu = document.getElementById('mobile-edit-contact-menu');
    let mobileEditMenuCtn = document.getElementById('mobile-edit-contact-menu-ctn');

    if (mobileEditMenu) {
        mobileEditMenu.classList.remove('animate_edit_contact_menu');
        mobileEditMenu.classList.add('close_edit_contact_menu');
        setTimeout(() => {
            if (mobileEditMenuCtn) {
                mobileEditMenuCtn.classList.add('d-none');
            }
        }, 300);
    }
}

/**
 * Sets the background color for the contacts section.
 */
function contactsBgrColor() {
    document.getElementById('contacts').classList.add('currentTemplate', 'p-none');
    document.getElementById('contacts_mobile').classList.add('currentTemplate', 'p-none');
}

/**
 * Removes background color styling from non-contact sections.
 */
function removeBgrColorWithoutContacts() {
    document.getElementById('add_task').classList.remove('currentTemplate', 'p-none');
    document.getElementById('board').classList.remove('currentTemplate', 'p-none');
    document.getElementById('summary').classList.remove('currentTemplate', 'p-none');
    document.getElementById('add_task_mobile').classList.remove('currentTemplate', 'p-none');
    document.getElementById('board_mobile').classList.remove('currentTemplate', 'p-none');
    document.getElementById('summary_mobile').classList.remove('currentTemplate', 'p-none');
}

/**
 * Makes the Join logo clickable.
 */
function addJoinLogoClickable() {
    document.getElementById('join_logo').classList.remove('p-none');
    document.getElementById('join_logo_mobile').classList.remove('p-none');
}

/**
 * Adds CSS styling to the content section.
 */
function addContentCSS() {
    content.classList.remove('contentBoard');
    content.classList.add('content_section');
}