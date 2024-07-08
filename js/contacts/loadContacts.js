
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

