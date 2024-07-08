
/**
 * Initializes the sign-up process by loading existing users.
 */
async function initSignUp() {
    await loadUsers();
}

/**
 * Handles the sign-up process, creating a new user with entered details and redirecting after successful registration.
 */
async function signUp() {
    let user = document.getElementById('user-input').value;
    let email = document.getElementById('email-input').value;
    let password = document.getElementById('password-input').value;
    let BgColor = setRandomColor();
    if (loginIsValid && isChecked) {
        users.push({ user, email, BgColor, password });
        await setItem('users', JSON.stringify(users));
        resetForm();
        showSignUpConfirmation();
        setTimeout(() => window.location.href = "../HTML/login.html", 2000);
    }
}

/**
 * Checks if the entered username or email already exists among registered users.
 */
function checkExistingUser() {
    resetSignUpCustomValidity();
    let userError = document.getElementById('user-input');
    let emailError = document.getElementById('email-input');
    let username = document.getElementById('user-input').value;
    let userEmail = document.getElementById('email-input').value;
    let user = users.find(u => u.user == username);
    let email = users.find(u => u.email == userEmail);
    returnLoginCustomValidityMessage(user, email, userError, emailError);
}

/**
 * Resets the sign-up form fields to their default empty state.
 */
function resetForm() {
    let signUpButton = document.getElementById('signUpButton');
    let user = document.getElementById('user-input');
    let email = document.getElementById('email-input');
    let password = document.getElementById('password-input');
    let confirmedPassword = document.getElementById('password-confirmation');
    user.value = "";
    email.value = "";
    password.value = "";
    confirmedPassword.value = "";
    signUpButton.disabled = true;
}

/**
 * Displays a confirmation animation after a successful sign-up.
 */
function showSignUpConfirmation() {
    document.getElementById('sign-up-animation-div').classList.remove('d-none');
    document.getElementById('sign-up-animation').classList.add('add_sign_Up_animation');
}

/**
 * Extracts the initial letter from a contact's name.
 *
 * @param {string} name - The contact's name.
 * @returns {string} The initial letter of the name.
 */
function returnContactInitialLetter(name) {
    return name.replace(/[^A-Z]+/g, '');
}

/**
 * Generates a random hexadecimal color.
 *
 * @returns {string} The generated hexadecimal color.
 */
function setRandomColor() {
    let letters = '0123456789ABCDEF';
    let BgColor = '#';
    for (let i = 0; i < 6; i++) {
        BgColor += letters[Math.floor(Math.random() * 16)];
    }
    return BgColor;
}

/**
 * Sets custom validity messages for the user and email fields based on their availability.
 *
 * @param {object|null} user - The found user object or null.
 * @param {object|null} email - The found email object or null.
 * @param {HTMLElement} userError - The user input element for displaying errors.
 * @param {HTMLElement} emailError - The email input element for displaying errors.
 */
function returnLoginCustomValidityMessage(user, email, userError, emailError) {
    if (user) {
        !loginIsValid
        userError.setCustomValidity('This User Already exist');
    } else if (email) {
        !loginIsValid
        emailError.setCustomValidity('This email adress has already been registered');
    } else {
        loginIsValid;
    }
}

/**
 * Resets custom validity messages for the sign-up form fields.
 */
function resetSignUpCustomValidity() {
    document.getElementById('user-input').setCustomValidity('');
    document.getElementById('email-input').setCustomValidity('');
}

/**
 * Activates or deactivates the sign-up button based on the privacy policy agreement.
 */
function activateButton() {
    let signUpButton = document.getElementById('signUpButton');
    isChecked ? signUpButton.disabled = false : signUpButton.disabled = true && signUpValidation();
}

/**
 * Validates the password and confirmation password against specified criteria.
 */
function passwordValidation() {
    let password = document.getElementById('password-input');
    let confirmedPassword = document.getElementById('password-confirmation');
    let passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    passwordValidation.test(password.value) ? loginIsValid = true : loginIsValid = false;
    !loginIsValid ? password.setCustomValidity('The Password must be at least 8 characters with at least one lowercase, one uppercase and one digit. ') :
        password.setCustomValidity('');
    password.value === confirmedPassword.value ? loginIsValid = true : loginIsValid = false;
    !loginIsValid ? confirmedPassword.setCustomValidity('The Confirm Password confirmation does not match') :
        confirmedPassword.setCustomValidity('');
}

/**
 * Validates the sign-up form and displays an error message if the privacy policy is not accepted.
 */
function signUpValidation() {
    let errorMsg = document.getElementById('input-error');
    !isChecked && !errorMsg.textContent ? errorMsg.innerHTML = returnPrivacyPoliceErrorMsg() :
        errorMsg.innerHTML = '';
}

/**
 * Toggles the privacy policy agreement checkbox state.
 */
function checkPrivatePolicyButton() {
    isChecked = !isChecked;
    document.getElementById('check-button').classList.toggle('d-none');
    document.getElementById('checked-button').classList.toggle('d-none');
}

/**
 * Returns the error message for privacy policy agreement.
 *
 * @returns {string} The privacy policy error message.
 */
function returnPrivacyPoliceErrorMsg() {
    return /*html*/`
        <span>"Please read and accept our Privacy Policy to continue using our services."</span>
    `;
}