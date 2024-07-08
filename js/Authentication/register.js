
/**
 * Loads user data from local storage asynchronously.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.log('users could not be loaded');
    }
}

/**
 * Toggles password visibility icons based on the input value in the password field.
 */
function togglePasswordImg() {
    let passwordInput = document.getElementById('password-input');
    if (!passwordInput.value == '') {
        togglePasswordIconsBasedOnInputType(passwordInput);
    } else {
        resetPasswordIcons();
        passwordInput.type = 'password';
    }
}

/**
 * Switches password visibility icons depending on whether the password is hidden or shown.
 *
 * @param {HTMLInputElement} passwordInput - The password input field element.
 */
function togglePasswordIconsBasedOnInputType(passwordInput) {
    let passwordVisibilityOff = document.getElementById('password-visibility-off');
    let passwordLock = document.getElementById('password-lock');

    if (passwordInput.type === 'password') {
        passwordLock.classList.add('d-none');
        passwordVisibilityOff.classList.remove('d-none');
    } else if (passwordInput.type === 'text') {
        passwordVisibilityOff.classList.add('d-none');
    }
}

/**
 * Resets the password visibility icons to their default state.
 */
function resetPasswordIcons() {
    let passwordVisibility = document.getElementById('password-visibility-on');
    let passwordVisibilityOff = document.getElementById('password-visibility-off');
    let passwordLock = document.getElementById('password-lock');

    passwordLock.classList.remove('d-none');
    passwordVisibilityOff.classList.add('d-none');
    passwordVisibility.classList.add('d-none');
}

/**
 * Toggles the visibility of the password in the password input field.
 */
function toggleShowPassword() {
    let passwordInput = document.getElementById('password-input');
    let passwordVisibilityOff = document.getElementById('password-visibility-off');
    let passwordVisibility = document.getElementById('password-visibility-on');
    passwordVisibilityOff.classList.toggle('d-none');
    passwordVisibility.classList.toggle('d-none');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}
