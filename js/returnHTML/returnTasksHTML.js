function generateAddTaskHTML() {
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    let onmousedownAttribute = isTouchDevice ? "" : ' onmousedown="preventPlaceholderSelection(event)"';

    content.innerHTML = '';
    content.innerHTML = /*html*/`
        <div id="taskContainerContent" class="task-container">
                <div class="task-headline">
                    <h1 class="task-name">Add Task</h1>
                </div>
            <form onsubmit="createTask(); return false" class="task_input_ctn">
                <div class="mobile-scroll">
                    <div class="task-input">
                        <div class="left-field">
                                <div class="titel-field">
                                    <h4>Title<span class="letter-color">*</span></h4>
                                    <input autocomplete="off" id="titel-input" required type="text" name="myInput" placeholder="Enter a title">
                                    <div  class="error_warning">
                                        <span id="title-warning-text">This field is required</span>
                                    </div>
                                </div>    
                            <div class="description-field">
                                <h4>Description</h4>
                                <div class="textarea-container">
                                    <div class="textarea-field">
                                        <textarea id="read-description" class="textarea attrebute" type="text" name="myTextarea"
                                            placeholder="Enter a Description" spellcheck></textarea>
                                    </div>
                                    <div>
                                        <img draggable="false" class="description-icon" src="../images/Recurso 1 1.svg" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="contacts-field box2">
                                <h4>Assigned to</h4>
                                <div id="assignInputContain" class="custom-dropdown">
                                    <input onkeyup="searchContactToAssign()" id="assignTo-input" class="assign-input" autocomplete="off" type="search" placeholder="Select contacts to assign" oninput="this.value = this.value.replace(/[^a-zA-Z\u00C0-\u00FF ]/g, '');">
                                    <div id="assignBtn" class="assign-button" onclick="toggleContacts()">
                                        <img draggable="false" onclick="rotateIcon()" src="../images/arrow_drop_downaa.svg" alt="Arrow Icon" id="arrowIcon">
                                    </div>
                                </div>
                                <div class="contact-container d-none" id="contactContainer">
                                    <div id="contactBox" class="contact-box">
                                        <div id="assigned-to-contact-list"></div>
                                    </div>
                                </div>
                            </div>
                            <div id="selected-contact-ctn" class="selected_contact_ctn d-none"></div>
                        </div>
                        <div class="right-field">
                            <div>
                                <div class="date-field">
                                    <h4>Due Date<span class="letter-color">*</span></h4>
                                    <input id="calender-input" required class="calender_input" type="date" placeholder="dd/mm/yyyy" min="${getTodaysDateForCalender()}" onkeydown="return false;" ${onmousedownAttribute}>
                                    <div class="error_warning">
                                        <span id="calender-warning-text">This field is required</span>
                                    </div>
                                </div>
                            </div>
                            <div class="prio-container box1">
                                <h4>Prio</h4>
                                <div class="button-selection">
                                    <div class="prio-button" id="buttonUrgent" onclick="changeButtonStyles('Urgent')">Urgent
                                        <img draggable="false" class="prio-image" id="iconUrgent" src="../images/capa 2.svg" alt=""></div>
                                    <div class="prio-button selected" id="buttonMedium" onclick="changeButtonStyles('Medium')">Medium
                                        <img draggable="false" class="prio-image selected_icon" id="iconMedium" src="../images/prio media.svg" alt=""></div>
                                    <div class="prio-button" id="buttonLow" onclick="changeButtonStyles('Low')">Low <img draggable="false"
                                        class="prio-image" id="iconLow" src="../images/prio baja.svg" alt=""></div>
                                </div>
                            </div>
                            <div class="category-fields">
                                <h4>Category<span class="letter-color">*</span></h4>
                                <div id="categoryBox" onclick="toggleDropdown()" class="category-box">
                                    <div class="custom-list">
                                        <div>
                                            <input class="span-category" id="selectedCategory" type="text" name="myInput" required autocomplete="off" placeholder="Select task category">
                                        </div>
                                        <div class="category-icon-field">
                                            <img draggable="false" class="drop-option" id="selectIcon" src="../images/arrow_drop_downaa.svg"
                                                alt="Arrow">
                                        </div>
                                    </div>
                                </div>
                                <div id="dropdownOptions" class="dropdown-options">
                                    
                                </div>
                            </div>
                            <div class="subtask-container">
                                <h4>Subtasks</h4>
                                <div class="subtask-field">
                                    <div class="subtask-input-container">
                                    <input autocomplete="off" oninput="showSubtaskImagesByInput()" id="subtaskInput" class="subtask-input" type="text" name="myInput" placeholder="Add new subtask" onkeypress="if(event.keyCode === 13) { addSubtask(); event.preventDefault(); }">
                                    </div>
                                    <div class="subtask-image-field-first" id="imageContainer">
                                        <img draggable="false" src="../images/Property 1=add.svg" alt="" onclick="toggleSubtaskImages()">
                                    </div>
                                    <div class="subtask-image-field-second d-none" id="newImages">
                                        <img draggable="false" id="closeImag" onclick="toggleSubtaskImages()" class="subtask-button-close" src="../images/Property 1=close.svg" alt="">
                                        <img draggable="false" id="checkImage" class="subtask-button-check" src="../images/Property 1=check.svg" alt="" onclick="addSubtask()">
                                    </div>
                                </div>
                                <div class="subtask-content" id="subtaskContent"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="task-below">
                    <div>
                        <div class="requered-field">
                            <span class="letter-color">*</span>
                            This field is required
                        </div>
                    </div>
                    <div class="clear-create-button">
                        <button onclick="clearBegonnenNewTask()" type="reset" class="clear-button">Clear<img draggable="false" src="../images/close.svg"></button>
                        <button class="create-button">Create Task <img draggable="false" class="clear-create-img" src="../images/check.svg" alt=""></button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

function returnSubtask(subtaskDescription, i) {
    return /*html*/`
        <div class="task-list" id="taskList${i}">
            <div class="liest-field">
                <div class="tasks-content">
                    <p class="finished-content" id="finishedContent${i}">${subtaskDescription}</p>
                </div>
                <div class="edit-delete-container">
                    <div class="edit-box">
                        <img draggable="false" onclick="toggleSubtask(${i})" class="edit-image" id="editImage${i}" src="../images/Property 1=edit.svg" alt="">
                    </div>
                    <div class="delete-box">
                        <img draggable="false" onclick="deleteButton(${i})" class="delete-image" id="deleteImage${i}" src="../images/Property 1=delete.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="edit-list d-none" id="editTaskList${i}">
            <div class="liest-field">
                <div class="tasks-content">
                    <input id="editInput${i}" class="subtask-input" value="${subtaskDescription}" type="text">
                </div>
                <div class="delete-check-container">
                    <div class="delete-box">
                        <img draggable="false" onclick="deleteButton(${i})" class="delete-image" src="../images/Property 1=delete.svg" alt="">
                    </div>
                    <div class="edit-box">
                        <img draggable="false" onclick="checkEditedTaskList(${i}, '${subtaskDescription}')" id="checkImage${i}" class="subtask-button-check" src="../images/Property 1=check.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function returnAssignedToContactList(index, contact) {
    let displayName = contact.name;
    if (currentUser && contact.email === currentUser[0].email) {
        displayName += "&nbsp;&nbsp;( You )";
    }

    return /*html*/`
        <div id="contact-${index}" onclick="assignTo(${index}, '${contact.name}', '${contact.email}', '${contact.phone}', '${contact.initial}', '${contact.BgColor}')" class="contacts-followfield">
            <div class="contacts-name">
                <div style="background-color:${contact.BgColor}" class="contact_circle">${contact.initial}</div>
                <span class="contact-name">${displayName}</span>
            </div>
            <div>
                <div class="check-button">
                    <img draggable="false" id="check-contact${index}-img" src="../images/Rectangle 5.svg" alt="">
                    <img draggable="false" id="checked-contact${index}-img" class="d-none" src="../images/check-white.svg" alt="">
                </div>
            </div>
        </div>
    `;
}

function returnSelectedContactBadges(selectedContact) {
    return `
        <div class="contact_circle" style="background-color:${selectedContact['BgColor']}">${selectedContact['initial']}</div>
    `
}


function renderCategory(category, c) {
    return `
    <div class="category-list" id="category${c}" onclick="acceptCategory('${category}')">
        <span >${category}</span>
    </div>
    `;
}