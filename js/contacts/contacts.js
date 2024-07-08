let contacts = [];
let contactIsValid = false;
let isAnimating = false;

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

    resetContactSelection();

    contact.classList.add('contact_selected');
    contact.classList.add('p-none');
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
    let addContactCtn = document.getElementById('popup-ctn');

    if (isAnimating) return;

    if (window.matchMedia("(min-width: 1000px)").matches &&
        !addContactCtn.classList.contains('d-none')) {

        isAnimating = true;
        animateClosingContactPopup();
    } else if (window.matchMedia("(max-width: 1000px)").matches) {
        closeMobileEditMenu();
        closeSelectedContactInformation();
    }
}

/**
 * Executes the closing animation for the contact popup.
 */
function animateClosingContactPopup() {
    let addContact = document.getElementById('contact-popup');
    let addContactCtn = document.getElementById('popup-ctn');

    addContact.classList.remove('open_animation_contact_popup');
    addContact.classList.add('close_animation_contact_popup');

    setTimeout(() => {
        addContactCtn.classList.toggle('d-none');
        isAnimating = false;
    }, 650);
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