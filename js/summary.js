
/**
 * Renders the summary page with necessary UI adjustments and task data.
 */
async function renderSummary() {
    summaryBgrColor();
    removeBgrColorWithoutSummary();
    removeJoinLogoClickable();
    await loadTasks();
    addContentCSS();
    renderGreetsUserName();
    let hasBeenGreeted = localStorage.getItem('hasBeenGreeted');
    showMobileGreeting(hasBeenGreeted);
    hideLegalContent();
    generateSummaryHTML();
}

/**
 * Renders the date of the next urgent task deadline.
 *
 * @returns {string} Formatted date of the next deadline or a message if no urgent deadlines are found.
 */
function renderNextDeadlineDate() {
    let futureDates = getFutureUrgentTaskDeadlines();
    return futureDates.length > 0 ? formatDeadlinedate(futureDates[0]) : 'No Urgent Deadlines';
}

/**
 * Retrieves future deadlines for urgent tasks.
 *
 * @returns {Array} Array of future dates for urgent tasks.
 */
function getFutureUrgentTaskDeadlines() {
    let urgentTasks = tasks.filter(task => task.priority === "Urgent");
    let allDeadlines = urgentTasks.map(task => convertDateFormat(task.date));
    let today = getStartOfToday();
    let futureDates = allDeadlines.filter(date => date >= today);
    futureDates.sort((a, b) => a - b);
    return futureDates;
}

/**
 * Gets the start of the current day with time set to midnight.
 *
 * @returns {Date} Today's date with time set to 00:00:00.
 */
function getStartOfToday() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

/**
 * Converts a date string in DD.MM.YYYY format to a Date object.
 *
 * @param {string} dateStr - The date string to convert.
 * @returns {Date} The converted Date object.
 */
function convertDateFormat(dateStr) {
    let parts = dateStr.split(".");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

/**
 * Formats a date into a more readable string format.
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted date string.
 */
function formatDeadlinedate(date) {
    let monthOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let day = date.getDate();
    let month = monthOfYear[date.getMonth()];
    let year = date.getFullYear();
    let formattedDate = `${month} ${day}, ${year}`;
    return formattedDate;
}

/**
 * Renders an appropriate greeting message based on the current time of day.
 *
 * @returns {string} Greeting message suitable for the time of day.
 */
function renderGreetingMessage() {
    let x = new Date();
    let hour = x.getHours();
    if (hour < 12) {
        return 'Good morning,'
    } else if (hour >= 12 && hour < 14) {
        return 'Good day,'
    } else if (hour >= 14 && hour < 19) {
        return 'Good afternoon,'
    } else {
        return 'Good evening,'
    }
}

/**
 * Renders the name of the current user or a generic greeting if no user is logged in.
 *
 * @returns {string} The name of the current user or 'Dear Guest'.
 */
function renderGreetsUserName() {
    if (currentUser) {
        return currentUser[0]['name'];
    } else {
        return 'Dear Guest';
    }
}

/**
 * Shows a mobile greeting message if the user hasn't been greeted yet.
 *
 * @param {string} hasBeenGreeted - String indicating if the user has been greeted.
 */
function showMobileGreeting(hasBeenGreeted) {
    let mobileGreeting = document.getElementById('mobile-greeting-ctn');
    if (window.matchMedia('max-width: 1000px') && hasBeenGreeted && hasBeenGreeted === 'false') {
        mobileGreeting.innerHTML = returnMobileGreeting();
        mobileGreeting.classList.remove('d-none');
        mobileGreeting.classList.add('mobile_greeting_animation');
        setTimeout(() => {
            mobileGreeting.classList.add('d-none');
            localStorage.removeItem('hasBeenGreeted');
            hasBeenGreeted = true;
        }, 1600)
    }
}

/**
 * Sets background color styling for the summary section.
 */
function summaryBgrColor() {
    document.getElementById('summary').classList.add('currentTemplate', 'p-none');
    document.getElementById('summary_mobile').classList.add('currentTemplate', 'p-none');
}

/**
 * Removes background color styling from non-summary sections.
 */
function removeBgrColorWithoutSummary() {
    document.getElementById('add_task').classList.remove('currentTemplate', 'p-none');
    document.getElementById('board').classList.remove('currentTemplate', 'p-none');
    document.getElementById('contacts').classList.remove('currentTemplate', 'p-none');
    document.getElementById('add_task_mobile').classList.remove('currentTemplate', 'p-none');
    document.getElementById('board_mobile').classList.remove('currentTemplate', 'p-none');
    document.getElementById('contacts_mobile').classList.remove('currentTemplate', 'p-none');
}

/**
 * Removes the clickable behavior from the Join logo.
 */
function removeJoinLogoClickable() {
    document.getElementById('join_logo').classList.add('p-none');
    document.getElementById('join_logo_mobile').classList.add('p-none');
}

/**
 * Filters and returns the count of tasks in 'to_do' status.
 *
 * @returns {number} The count of 'to_do' tasks.
 */
function filterAndReturnToDoTasks() {
    let task = tasks.filter(task => task.status === "to_do").length;
    return task;
}

/**
 * Filters and returns the count of tasks in 'in_progress' status.
 *
 * @returns {number} The count of 'in_progress' tasks.
 */
function filterAndReturnInProgressTasks() {
    let task = tasks.filter(task => task.status === "in_progress").length;
    return task;
}

/**
 * Filters and returns the count of tasks in 'feedback' status.
 *
 * @returns {number} The count of 'feedback' tasks.
 */
function filterAndReturnAwaitFeedbackTasks() {
    let task = tasks.filter(task => task.status === "feedback").length;
    return task;
}

/**
 * Filters and returns the count of tasks in 'done' status.
 *
 * @returns {number} The count of 'done' tasks.
 */
function filterAndReturnDoneTasks() {
    let task = tasks.filter(task => task.status === "done").length;
    return task;
}

/**
 * Filters and returns the count of urgent tasks.
 *
 * @returns {number} The count of 'Urgent' priority tasks.
 */
function filterAndReturnUrgentTasks() {
    let task = tasks.filter(task => task.priority === "Urgent").length;
    return task;
}