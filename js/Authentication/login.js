let users = [];
let currentUser = [];
let isChecked = false;
let loginIsValid = false;
let hasBeenGreeted = false;

/**
 * Initializes login process by loading users, checking saved credentials, and setting up password input.
 */
async function initLogin() {
    await loadUsers();
    checkSavedLogin();
    checkPasswordInput();
    localStorage.removeItem('guestLog');
}

/**
 * Logs out the current user by clearing user and guest data from local storage and redirecting to the login page.
 */
function logOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('guestLog');
    window.location.href = './HTML/login.html';
}

/**
 * Attempts user login by retrieving login details, validating them, and managing session state.
 */
function login() {
    let name = document.getElementById('user-login').value;
    let userpassword = document.getElementById('password-input').value;
    let user = users.find(u => u.user == name || u.email == name);
    let password = users.find(u => u.password == userpassword);
    loginValidation(user, password);
    localStorage.removeItem('guestLog');
    localStorage.setItem('guestLog', 'false');
}

/**
 * Validates the login credentials and directs the flow based on their validity.
 *
 * @param {object} user - The user object from the users array.
 * @param {string} password - The password associated with the user account.
 */
function loginValidation(user, password) {
    if (user && password) {
        handleSuccessfulLogin(user);
    } else if (user && !password) {
        showPasswordError();
    } else {
        handleNoUserError();
    }
}

/**
 * Handles actions to be taken upon successful user login including setting current user and redirecting.
 *
 * @param {object} user - The successfully authenticated user object.
 */
function handleSuccessfulLogin(user) {
    localStorage.setItem('hasBeenGreeted', false);
    setCurrentUser(user);
    rememberMe();
    localStorage.setItem('isLoggedIn', 'true');
    redirectTo('./../../index.html');
}

/**
 * Manages actions and redirection if no user is found during login attempt.
 */
function handleNoUserError() {
    showNoUserError();
    setTimeout(() => redirectTo('../HTML/sign_up.html'), 3000);
}

/**
 * Redirects to a specified URL.
 *
 * @param {string} url - The URL to redirect to.
 */
function redirectTo(url) {
    window.location.href = url;
}

/**
 * Sets the current user information in local storage and updates the current user state.
 *
 * @param {object} user - The user object containing user details.
 */
function setCurrentUser(user) {
    let name = formatName(user.user);
    let initial = returnContactInitialLetter(name);
    let BgColor = user.BgColor;
    let email = user.email;
    currentUser.push({ name, email, initial, BgColor });
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

/**
 * Handles the guest login by setting session state and clearing current user data.
 *
 * @param {Event} e - The event object from the login action.
 */
function guestLogin(e) {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.removeItem('currentUser');
    localStorage.setItem('hasBeenGreeted', 'false');
    window.location.href = "../index.html";
    currentUser = [];
}

/**
 * Displays an error message if the password is incorrect.
 */
function showPasswordError() {
    let errorMsg = document.getElementById('input-error');
    !errorMsg.textContent ? errorMsg.innerHTML = "Wrong Password, please try again!" :
        errorMsg.textContent = '';
}

/**
 * Saves user login credentials in local storage if 'Remember Me' is checked.
 */
function rememberMe() {
    if (isChecked) {
        let username = document.getElementById('user-login').value;
        let password = document.getElementById('password-input').value;
        let user = { username, password };
        localStorage.setItem('userdata', JSON.stringify(user));
    }
}

/**
 * Checks for saved login credentials and sets them if found.
 */
function checkSavedLogin() {
    try {
        let user = getSavedUser();
        if (user) {
            setLoginFields(user);
            updateCheckboxStatus(true);
            isChecked = true;
        }
    } catch (e) {
        console.log(`there's currently no saved login information`);
        updateCheckboxStatus(false);
    }
}

/**
 * Retrieves saved user credentials from local storage.
 *
 * @returns {object|null} The saved user data or null if not found.
 */
function getSavedUser() {
    return JSON.parse(localStorage.getItem('userdata'));
}

/**
 * Sets the login fields with saved user credentials.
 *
 * @param {object} user - The user object with saved credentials.
 */
function setLoginFields(user) {
    document.getElementById('user-login').value = user['username'];
    document.getElementById('password-input').value = user['password'];
}

/**
 * Updates the status of the remember me checkbox.
 *
 * @param {boolean} isChecked - The current status of the checkbox.
 */
function updateCheckboxStatus(isChecked) {
    let checkButton = document.getElementById('check-button');
    let checkedButton = document.getElementById('checked-button');

    if (isChecked) {
        checkButton.classList.add('d-none');
        checkedButton.classList.remove('d-none');
    } else {
        checkButton.classList.remove('d-none');
        checkedButton.classList.add('d-none');
    }
}

/**
 * Displays an error message when no user is found during login.
 */
function showNoUserError() {
    document.getElementById('no-user-animation-div').classList.remove('d-none');
    document.getElementById('no-user-animation').classList.add('.add_login_signUp_animation');
}

/**
 * Toggles the 'Remember Me' button state and updates local storage accordingly.
 */
function toggleRememberMeButton() {
    isChecked = !isChecked;
    console.log(isChecked);
    document.getElementById('check-button').classList.toggle('d-none');
    document.getElementById('checked-button').classList.toggle('d-none');
    if (!isChecked) {
        localStorage.removeItem('userdata');
    }
}

/**
 * Formats a name to have each word start with an uppercase letter.
 *
 * @param {string} name - The name to be formatted.
 * @returns {string} The formatted name.
 */
function formatName(name) {
    return name.replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Checks if there is a password input and toggles visibility controls.
 */
function checkPasswordInput() {
    let passwordInput = document.getElementById('password-input');
    let visibilityToggle = document.getElementById('password-visibility-off');
    let clockImage = document.getElementById('password-lock');

    if (passwordInput && passwordInput.value) {
        visibilityToggle.classList.remove('d-none');
        clockImage.classList.add('d-none');
    }
}