
/**
 * Loads tasks from storage and updates the highest task ID based on the loaded tasks.
 */
async function loadTasks() {
    try {
        let savedTasks = await getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            highestTaskId = tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0);
        } else {
            tasks = [];
        }
    } catch (error) {
        console.error("Fehler beim Laden der Tasks:", error);
    }
}

/**
 * Renders all tasks by loading them and assigning them to their respective statuses.
 */
async function renderAllTasks() {
    await loadTasks();
    await assignTaskElementsToStatus('to_do');
    await assignTaskElementsToStatus('in_progress');
    await assignTaskElementsToStatus('feedback');
    await assignTaskElementsToStatus('done');
    checkProfileBadgeCount();
    updateAllProgressBars();
    hideLoadingElementJoin();
}

/**
 * Checks and manages the count of profile badges in the task view.
 */
function checkProfileBadgeCount() {
    let profileBadgeContainers = document.querySelectorAll('.profileBadgeContain');

    profileBadgeContainers.forEach(container => {
        let profileBadges = container.getElementsByClassName('profileBadge');
        let numberOfBadges = profileBadges.length;

        if (numberOfBadges > 5) {
            removeExcessBadges(container);
            addAdditionalBadge(container, numberOfBadges);
        }
    });
}

/**
 * Adds an additional badge to indicate more than the displayed count of profile badges.
 *
 * @param {HTMLElement} container - The container element for the profile badges.
 * @param {number} numberOfBadges - The total number of badges.
 */
function addAdditionalBadge(container, numberOfBadges) {
    let additionalBadge = document.createElement('div');
    additionalBadge.className = 'profileBadgeToMuch';
    additionalBadge.textContent = `+${numberOfBadges - 4}`;
    container.appendChild(additionalBadge);
}

/**
 * Removes excess profile badges from the container to limit the number displayed.
 *
 * @param {HTMLElement} container - The container element for the profile badges.
 */
function removeExcessBadges(container) {
    while (container.children.length > 4) {
        container.removeChild(container.lastChild);
    }
}

/**
 * Updates progress bars for all tasks based on their completion status.
 */
function updateAllProgressBars() {
    tasks.forEach(task => {
        updateSubtasksCount(task.id);
    });
}

/**
 * Assigns task elements to their respective status sections on the board.
 *
 * @param {string} status - The status category to assign tasks to.
 */
async function assignTaskElementsToStatus(status) {
    let container = document.getElementById(status);
    let tasksByStatus = tasks.filter(task => task.status === status);
    container.innerHTML = '';
    tasksByStatus.forEach(task => {
        container.appendChild(renderTaskElement(task));
    });
    ifContainerEmpty(container);
}

/**
 * Checks if a container is empty and fills it with a placeholder if necessary.
 *
 * @param {HTMLElement} container - The container to check for content.
 */
function ifContainerEmpty(container) {
    if (container.innerHTML === '') {
        container.innerHTML = returnEmptyDivInTaskLine();
    }
}

/**
 * Renders an individual task element.
 *
 * @param {object} task - The task object to be rendered.
 * @returns {HTMLElement} The section element containing the task.
 */
function renderTaskElement(task) {
    let section = createSectionElement(task);
    addDragEvents(section, task.id);
    addClickEvents(section, task.id);
    addTouchEvents(section, task.id);

    section.innerHTML = renderTaskHTML(task);
    return section;
}

/**
 * Creates a new HTML section element for a task.
 *
 * @param {object} task - The task object.
 * @returns {HTMLElement} A section element for the task.
 */
function createSectionElement(task) {
    let section = document.createElement('section');
    section.className = 'section';
    section.id = `section${task.id}`;
    section.draggable = true;
    return section;
}

/**
 * Adds drag events to a task section element.
 *
 * @param {HTMLElement} section - The section element of the task.
 * @param {number} taskId - The ID of the task.
 */
function addDragEvents(section, taskId) {
    if (!('ontouchstart' in window)) {
        section.ondragstart = () => startDragging(taskId);
    }
    section.ondragend = endDragging;
}

/**
 * Adds click events to a task section element.
 *
 * @param {HTMLElement} section - The section element of the task.
 * @param {number} taskId - The ID of the task.
 */
function addClickEvents(section, taskId) {
    section.onclick = () => openTask(taskId);
}

/**
 * Adds touch events to a task section element.
 *
 * @param {HTMLElement} section - The section element of the task.
 * @param {number} taskId - The ID of the task.
 */
function addTouchEvents(section, taskId) {
    section.addEventListener('touchstart', () => handleTouchStart(taskId), { passive: false });
    section.addEventListener('touchend', (event) => handleTouchEnd(event, taskId), { passive: false });
}

/**
 * Formats task text based on the current task size status.
 *
 * @param {string} text - The text to be formatted.
 * @returns {string} Formatted text.
 */
function formatTaskText(text) {
    let trimmedText = text.trim();
    if (currentTaskSizeStatus === 'small' && trimmedText.length > 57) {
        return trimmText(trimmedText);
    } else {
        return showFullTextLength(trimmedText);
    }
}

/**
 * Trims text to a certain length with ellipsis for a brief display.
 *
 * @param {string} trimmedText - The text to be trimmed.
 * @returns {string} Trimmed text.
 */
function trimmText(trimmedText) {
    return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1, 57) + '...';
}

/**
 * Returns the full length of the text with the first letter capitalized.
 *
 * @param {string} trimmedText - The text to format.
 * @returns {string} Formatted text.
 */
function showFullTextLength(trimmedText) {
    return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
}

/**
 * Formats the task priority display based on the current task size status.
 *
 * @param {string} priority - The priority of the task.
 * @returns {string} HTML string for priority display.
 */
function checkPriority(priority) {
    if (currentTaskSizeStatus === 'small') {
        return returnTaskPrioritySmallHTML(priority);
    } else if (currentTaskSizeStatus === 'big') {
        return returnTaskPriorityBigHTML(priority);
    }
}

/**
 * Formats and displays the task category based on the current task size status.
 *
 * @param {string} category - The task category.
 * @param {string} creator - The creator of the task.
 * @returns {string} HTML string for category display.
 */
function checkTaskCategory(category, creator) {
    let formattedCategory = category.replace(/_/g, ' ');
    if (currentTaskSizeStatus === 'small') {
        return returnTaskCategorySmallHTML(category, formattedCategory);
    } else if (currentTaskSizeStatus === 'big') {
        return returnTaskCategoryBigHTML(category, formattedCategory, creator);
    }
}