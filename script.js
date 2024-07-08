let content = document.getElementById('content');
let isGuestLoginPopupShown = false;

window.addEventListener("orientationchange", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);

/**
 * Initializes the application by loading necessary data and rendering the user interface.
 */
async function init() {
    await includeHTML();
    await loadContacts();
    getCurrentUser();
    renderUserInitial();
    renderSummary();
}

/**
 * Retrieves the current user from local storage.
 */
function getCurrentUser() {
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'))
    } catch (e) {
        console.log(`Current User is a guest.`);
    }
}

/**
 * Checks if a guest or a registered user is logged in.
 *
 * @returns {boolean} True if a guest user is logged in, false otherwise.
 */
function checkIfGuestOrUserLoged() {
    let guestLog = localStorage.getItem('guestLog');
    return guestLog === 'true';
}

/**
 * Renders the initial letter of the current user's name, or 'G' for a guest.
 */
function renderUserInitial() {
    if (currentUser) {
        document.getElementById('log-out-menu').innerHTML = currentUser[0]['initial'];
        document.getElementById('mobile-log-out-menu').innerHTML = currentUser[0]['initial'];
    } else {
        document.getElementById('log-out-menu').innerHTML = 'G';
        document.getElementById('mobile-log-out-menu').innerHTML = 'G';
        localStorage.setItem('guestLog', 'true');
    }
}

/**
 * Compares two strings alphabetically.
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {number} -1, 0, or 1 based on the comparison.
 */
function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

/**
 * Opens the profile menu.
 */
function openProfilMenu() {
    document.getElementById('profile_menu_contain').classList.remove('d-none');
}

/**
 * Closes the profile menu.
 */
function closeProfilMenu() {
    document.getElementById('profile_menu_contain').classList.add('d-none');
}

/**
 * Stops the propagation of an event.
 *
 * @param {Event} event - The event to stop.
 */
function stop(event) {
    event.stopPropagation();
}

/**
 * Renders the legal notice page and updates the UI accordingly.
 */
function renderLegalNoticePage() {
    let legalContent = document.getElementById('legal-content-section');
    legalContent.innerHTML = returnLegalNoticeHTML();
    legalContent.classList.remove('d-none');
    closeProfilMenu();
    removePNoneClassFromElements();
}

/**
 * Renders the privacy policy page and updates the UI accordingly.
 */
function renderPrivacyPolicyPage() {
    let legalContent = document.getElementById('legal-content-section');
    legalContent.innerHTML = returnPrivacyPolicyHTML();
    legalContent.classList.remove('d-none');
    closeProfilMenu();
    removePNoneClassFromElements();
}

/**
 * Removes the 'p-none' class from specified elements, typically to show them.
 */
function removePNoneClassFromElements() {
    let navLinkContainElements = document.querySelectorAll('.navLinkContain .p-none');
    let joinLogoMobile = document.getElementById('join_logo_mobile');

    joinLogoMobile.classList.remove('p-none');
    navLinkContainElements.forEach(element => {
        element.classList.remove('p-none');
        element.classList.remove('currentTemplate');
    });
}

/**
 * Hides the legal content section.
 */
function hideLegalContent() {
    let legalContent = document.getElementById('legal-content-section');
    legalContent.classList.add('d-none');
}

/**
 * Displays a popup for guest users to log in.
 */
function showGuestLoginPopup() {
    if (isGuestLoginPopupShown) return;
    isGuestLoginPopupShown = true;

    let popup = document.getElementById('guestLoginPopup');
    popup.classList.remove('fadeOutGuestLoginPopup');
    popup.style.display = 'block';

    setTimeout(() => {
        popup.classList.add('fadeOutGuestLoginPopup');
        setTimeout(() => {
            popup.style.display = 'none';
            isGuestLoginPopupShown = false;
        }, 2500);
    }, 2500);
}

/**
 * Escapes HTML special characters in a string.
 *
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHTML(str) {
    return str.replace(/[&<>"'\/\\)(]/g, function (match) {
        switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#039;';
            case '/': return '&#47;';
            case '\\': return '&#92;';
            case '(': return '&#40;';
            case ')': return '&#41;';
            default: return match;
        }
    });
}

/**
 * Checks and adjusts the UI based on the current orientation of the device.
 */
function checkOrientation() {
    let landscapeWarning = document.getElementById('landscape-warning');

    if ('ontouchstart' in window) {
        let portraitMediaQuery = window.matchMedia("(orientation: portrait)");

        if (!portraitMediaQuery.matches) {
            landscapeWarning.style.display = 'flex';
        } else {
            landscapeWarning.style.display = 'none';
        }
    }
}

/**
 * Loads user data from a storage source.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.log('users could not be loaded');
    }
}