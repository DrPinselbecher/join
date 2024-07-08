function generateBoardHTML() {
    content.innerHTML = '';
    content.innerHTML =/*html*/`
        <div class="titleContain">
            <h1>Board</h1>
            <div class="flex inputPlusBtn">
                <div class="boardInputBox">
                    <input id="find_task" onkeyup="searchTaskFromInput()" class="inputFindTask" type="text" placeholder="Find Task">
                    <img draggable="false" src="../images/search.svg">
                </div>
                <button onclick="addTaskFromBtn('to_do')" class="addTaskBtn"><span class="addBtnText">Add task</span><img draggable="false" src="../images/add.svg"></button>
            </div>
        </div>
        <div id="width_HTML"></div>
        <div id="loading_spinner" class="loadingSpinnerDiv d-none">
            <div>
                ${returnLoadingJoinSvg()}
            </div>
        </div>
    `;
}

function generateBoardWidthPlus1300HTML() {
    document.getElementById('width_HTML').innerHTML = /*html*/`
                    <div class="progressNamesContain">
                <p class="progressName">To do ${returnAddBtnSVG('to_do')}</p>
                <p class="progressName">In progress ${returnAddBtnSVG('in_progress')}</p>
                <p class="progressName">Await feedback ${returnAddBtnSVG('feedback')}</p>
                <p class="progressName">Done</p>
            </div>
            <div class="scrollbar">
                <div class="taskContain">
                    <div id="to_do" ondrop="dropTo('to_do')" ondragover="allowDrop(event); highlight('to_do', event)" ondragleave="removeHighlight('to_do')" class="taskLine"></div>
                    <div id="in_progress" ondrop="dropTo('in_progress')" ondragover="allowDrop(event); highlight('in_progress', event)" ondragleave="removeHighlight('in_progress')" class="taskLine"></div>
                    <div id="feedback" ondrop="dropTo('feedback')" ondragover="allowDrop(event); highlight('feedback', event)" ondragleave="removeHighlight('feedback')" class="taskLine"></div>
                    <div id="done" ondrop="dropTo('done')" ondragover="allowDrop(event); highlight('done', event)" ondragleave="removeHighlight('done')" class="taskLine"></div>
                </div>
            </div>
        </div>
    `;
}

function generateBoardWidthMinus1300HTML() {
    let isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent) && !/crios/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent);
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    let scrollbarClass = isSafari && isTouchDevice ? 'scrollbarForSafari' : 'scrollbar';

    document.getElementById('width_HTML').innerHTML = /*html*/`
        <div class="${scrollbarClass}">
            <div class="progressNamesContain">
                <div class="progressNameWithLine">
                    <p class="progressName">To do ${returnAddBtnSVG('to_do')}</p>
                    <div id="to_do" ondrop="dropTo('to_do')" ondragover="allowDrop(event); highlight('to_do', event)" ondragleave="removeHighlight('to_do')" class="taskLine scrollbarTaskLine"></div>
                <div class="progressNameWithLine">
                    <p class="progressName">In progress ${returnAddBtnSVG('in_progress')}</p>
                    <div id="in_progress" ondrop="dropTo('in_progress')" ondragover="allowDrop(event); highlight('in_progress', event)" ondragleave="removeHighlight('in_progress')" class="taskLine scrollbarTaskLine"></div>
                </div>
                <div class="progressNameWithLine">
                    <p class="progressName">Await feedback ${returnAddBtnSVG('feedback')}</p>
                    <div id="feedback" ondrop="dropTo('feedback')" ondragover="allowDrop(event); highlight('feedback', event)" ondragleave="removeHighlight('feedback')" class="taskLine scrollbarTaskLine"></div>
                <div class="progressNameWithLine">
                    <p class="progressName">Done</p>
                    <div id="done" ondrop="dropTo('done')" ondragover="allowDrop(event); highlight('done', event)" ondragleave="removeHighlight('done')" class="taskLine scrollbarTaskLine"></div>
                </div> 
            </div>
        </div>
    `;
}

function renderTaskHTMLDetails(task) {
    let assignedContainClass = task.contacts.length > 4 ? 'assignedContain overflow' : 'assignedContain';

    return /*html*/`
        <div id="backgroundFromTaskPopup" class="background fadeInBackground"></div>
        <div onclick="stop(event)" id ="taskDetails" class="taskDetails slideInFromRight">
            <div class="flex spaceBetween">
                ${checkTaskCategory(task.category, task.creator)}
            </div>
            <span id="taskTitleDetails" class="taskTitleDetails">${formatTaskText(task.title)}</span>
            <p id="taskDescriptionDetails" class="taskDescriptionDetails">${formatTaskText(task.description)}</p>
            <div class="titleTxtDetailsContain">
                <span class="titleDetails">Due date:</span>
                <span class="dateTxtDetails">${task.date.replace(/\./g, '<span style="color: gray; padding: 0 1px 0 1px;">/</span>')}</span>
            </div>
            <div class="titleTxtDetailsContain">
                <span class="titleDetails">Priority:</span>
                <span class="priorityTxtDetails">${checkPriority(task.priority)}</span>
            </div>
            <div class="titleAndAssignedContactsNumber">
                <span class="titleDetails">Assigned To:</span>
                <span id="numbersOfContacts" class="titleDetails">( ${task.contacts.length} )</span>
            </div>    
            <div id="profilBadgeDetails${task.id}" class="${assignedContainClass}">
                ${checkContactsInTask(task.contacts)}
            </div>
            <span class="titleDetails" style="margin-top: -10px">Subtasks</span>
            <div id="allSubtasksContainDetails${task.id}" class="allSubtasksContainDetails">
                ${checkSubtasksInTask(task.subtasks, task.id)}
            </div>
            <div class="editOptionsDetailsContain">
                <div onclick="confirmTaskDeletion(${task.id}, '${escapeHTML(task.title)}')" class="deleteDetailsContain">
                    <img draggable="false" src="../images/delete.svg"><span>Delete</span>
                </div>
                <div class="seperator"></div>
                <div onclick="renderEditTaskInBordSite(${task.id})" class="editDetailsContain">
                    <img draggable="false" src="../images/edit.svg"><span>Edit</span>
                </div>
            </div>
        </div>
    `;
}

function returnLoadingJoinSvg() {
    return /*html*/`
        <svg width="122" height="142" viewBox="0 0 102 122" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="102" height="122" fill="transparent"/>
            <defs>
                <mask id="fill-mask">
                    <rect x="0" y="122" width="102" height="122" fill="white">
                        <animate attributeName="y" values="122;0" dur="1s" repeatCount="indefinite" />
                    </rect>
                </mask>
            </defs>
                <g mask="url(#fill-mask)">
                <path d="M72.6549 0H50.4971V25.4923H72.6549V0Z" fill="#2A3647"/>
                <path d="M50.4971 46.2251H72.655V82.1779C72.7562 90.8292 70.2941 99.3153 65.5815 106.557C60.9284 113.594 51.9459 121.966 35.3275 121.966C17.2263 121.966 6.67577 113.406 0.98291 108.715L14.9594 91.4743C20.5159 96.0112 25.8679 99.7435 35.4128 99.7435C42.6396 99.7435 45.5202 96.7988 47.2076 94.2307C49.5015 90.6637 50.6881 86.4923 50.6165 82.2464L50.4971 46.2251Z" fill="#2A3647"/>
                <path d="M39.1967 30.1318H17.0388V52.3884H39.1967V30.1318Z" fill="#29ABE2"/>
                <path d="M84.2624 111.522C84.2624 116.265 81.8591 118.815 78.5013 118.815C75.1436 118.815 72.9448 115.785 72.9448 111.762C72.9448 107.739 75.2117 104.554 78.6888 104.554C82.1659 104.554 84.2624 107.687 84.2624 111.522ZM75.5185 111.711C75.5185 114.57 76.6605 116.675 78.6206 116.675C80.5808 116.675 81.6886 114.45 81.6886 111.539C81.6886 108.988 80.666 106.592 78.6206 106.592C76.5753 106.592 75.5185 108.903 75.5185 111.711Z" fill="#2A3647"/>
                <path d="M88.6597 104.76V118.593H86.2053V104.76H88.6597Z" fill="#2A3647"/>
                <path d="M91.3186 118.593V104.76H94.0457L96.9774 110.461C97.7321 111.952 98.4035 113.483 98.9886 115.049C98.8352 113.337 98.767 111.368 98.767 109.177V104.76H101.017V118.593H98.4773L95.5115 112.772C94.7264 111.243 94.0264 109.671 93.4151 108.064C93.4151 109.776 93.5344 111.711 93.5344 114.09V118.576L91.3186 118.593Z" fill="#2A3647"/>
            </g>
        </svg>
    `;
}

function returnTaskCategorySmallHTML(category, formattedCategory) {
    return /*html*/`<h2 class="taskCategorySmall ${category}">${formattedCategory}</h2>`;
}

function returnTaskCategoryBigHTML(category, formattedCategory, creator) {
    return /*html*/`
        <div class="creatorDiv">
            <h2 class="taskCategoryBig ${category}">${formattedCategory}</h2>
            ${checkWidthForCreatorDiv(creator)}
        </div>
        <img draggable="false" class="closeWindowImage" src="../images/close.svg" onclick="closeTask()"></img>
    `;
}

function checkWidthForCreatorDiv(creator) {
    if (window.innerWidth >= 1000) {
        return /*html*/`<abbr class="curserWait" title="Creator: ${creator}">${returnCreatorSVG()}</abbr>`;
    } else {
        return /*html*/`<div id="creator_svg" class="creatorTooltip" onclick="openCreatorInformation('${creator}')">${returnCreatorSVG()}</div>`;
    }
}

function returnTaskPrioritySmallHTML(priority) {
    if (priority === 'Low') {
        return returnLowPrioritySVG();
    } else if (priority === 'Medium') {
        return returnMediumPrioritySVG();
    } else if (priority === 'Urgent') {
        return returnUrgetPrioritySVG();
    }
}

function returnTaskPriorityBigHTML(priority) {
    return /*html*/`<span>${priority}</span> <img draggable="false" src="../images/${priority}.svg">`
}

function returnAddBtnSVG(status) {
    return /*html*/`
        <svg onclick="addTaskFromBtn('${status}')" class="svgHover" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6665 8.5V16.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
            <path d="M16.6665 12.5754L8.6665 12.5754" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
            <rect x="1.6665" y="1.5" width="22" height="22" rx="7" stroke="#2A3647" stroke-width="2"/>
        </svg>
    `;
}

function renderTaskHTML(task) {
    return /*html*/`
        <div>
            ${checkTaskCategory(task.category)}
        </div>
        <article>
            <span class="taskTitle">${formatTaskText(task.title)}</span>
            <p class="taskDescription">${formatTaskText(task.description)}</p>
        </article>
            ${checkSubtasksInTask(task.subtasks, task.id)}
        </div>
        <div class="profilePropertyContain">
            <div id="profile${task.id}" class="profileBadgeContain">
                ${checkContactsInTask(task.contacts)}
            </div>
            <div id="task_priority_contain">
                ${checkPriority(task.priority)}
            </div>
        </div>
    `;
}

function returnConfirmationPopupHTML(id, msg) {
    return /*html*/`
        <div class="confirmationContent">
            <p class="deleteTitleMessage">${msg}</p>
        <div class="confirmationPopupBtnContain">
            <button onclick="deleteTask(${id})" style="color:rgba(255,0,0,90%);">Delete</button>
            <button onclick="closeConfirmationPopup()">Cancel</button>
        </div>
        </div>
    `;
}

function returnConfirmationMessageHTML(taskTitle) {
    return /*html*/`
        Are you sure you want to delete the task titled <br><b>"${taskTitle}"</b> ?
    `;
}

function returnEmptyDivInTaskLine() {
    return /*html*/`
        <div class="emptyTaskLine"><span>No tasks to do</span></div>
    `;
}

function returnLowPrioritySVG() {
    return /*html*/`
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
            <g clip-path="url(#clip0_75609_16171)">
                <path d="M8.99998 7.24524C8.80055 7.24557 8.60628 7.18367 8.44574 7.06863L0.877242 1.63467C0.778768 1.56391 0.695595 1.47498 0.632471 1.37296C0.569347 1.27094 0.527508 1.15784 0.509344 1.0401C0.472658 0.802317 0.53463 0.560105 0.681625 0.366747C0.828621 0.17339 1.0486 0.0447247 1.29317 0.00905743C1.53773 -0.0266099 1.78686 0.0336422 1.98574 0.176559L8.99998 5.2075L16.0142 0.17656C16.1127 0.105795 16.2245 0.0545799 16.3434 0.02584C16.4622 -0.00289994 16.5857 -0.00860237 16.7068 0.00905829C16.8279 0.0267189 16.9442 0.0673968 17.0492 0.128769C17.1541 0.190142 17.2456 0.271007 17.3183 0.366748C17.3911 0.462489 17.4438 0.571231 17.4734 0.686765C17.5029 0.802299 17.5088 0.922362 17.4906 1.0401C17.4725 1.15784 17.4306 1.27094 17.3675 1.37296C17.3044 1.47498 17.2212 1.56391 17.1227 1.63467L9.55423 7.06863C9.39369 7.18367 9.19941 7.24557 8.99998 7.24524Z" fill="#7AE229"/>
                <path d="M8.99998 12.0001C8.80055 12.0005 8.60628 11.9386 8.44574 11.8235L0.877242 6.38955C0.678366 6.24664 0.546029 6.03276 0.509344 5.79498C0.472658 5.5572 0.53463 5.31499 0.681625 5.12163C0.828621 4.92827 1.0486 4.79961 1.29317 4.76394C1.53773 4.72827 1.78686 4.78853 1.98574 4.93144L8.99998 9.96239L16.0142 4.93144C16.2131 4.78853 16.4622 4.72827 16.7068 4.76394C16.9514 4.79961 17.1713 4.92827 17.3183 5.12163C17.4653 5.31499 17.5273 5.5572 17.4906 5.79498C17.4539 6.03276 17.3216 6.24664 17.1227 6.38956L9.55423 11.8235C9.39369 11.9386 9.19941 12.0005 8.99998 12.0001Z" fill="#7AE229"/>
            </g>
            <defs>
                <clipPath id="clip0_75609_16171">
                    <rect width="17" height="12" fill="white" transform="translate(0.5)"/>
                </clipPath>
            </defs>
        </svg>
    `;
}

function returnMediumPrioritySVG() {
    return /*html*/`
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="8" viewBox="0 0 18 8" fill="none">
            <g clip-path="url(#clip0_75609_16183)">
                <path d="M16.5685 7.16658L1.43151 7.16658C1.18446 7.16658 0.947523 7.06773 0.772832 6.89177C0.598141 6.71581 0.5 6.47716 0.5 6.22831C0.5 5.97947 0.598141 5.74081 0.772832 5.56485C0.947523 5.38889 1.18446 5.29004 1.43151 5.29004L16.5685 5.29004C16.8155 5.29004 17.0525 5.38889 17.2272 5.56485C17.4019 5.74081 17.5 5.97947 17.5 6.22831C17.5 6.47716 17.4019 6.71581 17.2272 6.89177C17.0525 7.06773 16.8155 7.16658 16.5685 7.16658Z" fill="#FFA800"/>
                <path d="M16.5685 2.7098L1.43151 2.7098C1.18446 2.7098 0.947523 2.61094 0.772832 2.43498C0.598141 2.25902 0.5 2.02037 0.5 1.77152C0.5 1.52268 0.598141 1.28403 0.772832 1.10807C0.947523 0.932105 1.18446 0.833252 1.43151 0.833252L16.5685 0.833252C16.8155 0.833252 17.0525 0.932105 17.2272 1.10807C17.4019 1.28403 17.5 1.52268 17.5 1.77152C17.5 2.02037 17.4019 2.25902 17.2272 2.43498C17.0525 2.61094 16.8155 2.7098 16.5685 2.7098Z" fill="#FFA800"/>
            </g>
            <defs>
                <clipPath id="clip0_75609_16183">
                    <rect width="17" height="6.33333" fill="white" transform="translate(0.5 0.833252)"/>
                </clipPath>
            </defs>
        </svg>
    `;
}

function returnUrgetPrioritySVG() {
    return /*html*/`
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
            <g clip-path="url(#clip0_75609_16177)">
                <path d="M9.00002 4.75476C9.19945 4.75443 9.39372 4.81633 9.55427 4.93137L17.1228 10.3653C17.2212 10.4361 17.3044 10.525 17.3675 10.627C17.4307 10.7291 17.4725 10.8422 17.4907 10.9599C17.5273 11.1977 17.4654 11.4399 17.3184 11.6333C17.1714 11.8266 16.9514 11.9553 16.7068 11.9909C16.4623 12.0266 16.2131 11.9664 16.0143 11.8234L9.00002 6.7925L1.98577 11.8234C1.8873 11.8942 1.77545 11.9454 1.65662 11.9742C1.53779 12.0029 1.4143 12.0086 1.2932 11.9909C1.1721 11.9733 1.05577 11.9326 0.950844 11.8712C0.845915 11.8099 0.754446 11.729 0.681662 11.6333C0.608878 11.5375 0.556201 11.4288 0.52664 11.3132C0.49708 11.1977 0.491215 11.0776 0.509379 10.9599C0.527545 10.8422 0.569382 10.7291 0.632508 10.627C0.695632 10.525 0.778805 10.4361 0.87728 10.3653L8.44577 4.93137C8.60631 4.81633 8.80059 4.75443 9.00002 4.75476Z" fill="#FF3D00"/>
                <path d="M9.00002 -0.000121266C9.19945 -0.000455511 9.39372 0.0614475 9.55427 0.176482L17.1228 5.61045C17.3216 5.75336 17.454 5.96724 17.4907 6.20502C17.5273 6.4428 17.4654 6.68501 17.3184 6.87837C17.1714 7.07173 16.9514 7.20039 16.7068 7.23606C16.4623 7.27173 16.2131 7.21147 16.0143 7.06856L9.00002 2.03761L1.98577 7.06856C1.78689 7.21147 1.53777 7.27173 1.2932 7.23606C1.04863 7.20039 0.828657 7.07173 0.681662 6.87837C0.534667 6.68501 0.472695 6.4428 0.509379 6.20502C0.546065 5.96723 0.678402 5.75336 0.87728 5.61044L8.44577 0.176482C8.60631 0.0614474 8.80059 -0.000455546 9.00002 -0.000121266Z" fill="#FF3D00"/>
            </g>
            <defs>
                <clipPath id="clip0_75609_16177">
                    <rect width="17" height="12" fill="white" transform="translate(17.5 12) rotate(-180)"/>
                </clipPath>
            </defs>
        </svg>
    `;
}

function returnAddTaskPopupHTML() {
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    let onmousedownAttribute = isTouchDevice ? "" : ' onmousedown="preventPlaceholderSelection(event)"';

    return /*html*/`
        <div id="backgroundFromTaskPopup" class="background fadeInBackground"></div>
        <div id="popup-addTask" onclick="stop(event)" class="popup-addtask-container slideInFromRight">
            <div class="task-headline">
                <h1 class="task-name">Add Task</h1>
                <img draggable="false" onclick="closePopupAddTask()" class="closeWindowImage" src="../images/Property 1=close.svg" alt="">
            </div>
            <form onsubmit="setNewTaskFromPopupInBoard(); return false" class="task-input-container">
                <div class="mobile-scroll">
                    <div class="task-input">
                        <div class="left-field">
                            <div class="titel-field">
                                <h4>Title<span class="letter-color">*</span></h4>
                                <input autocomplete="off" id="titel-input" required type="text" name="myInput"
                                    placeholder="Enter a title">
                                <div class="error_warning">
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
                                    <div class="contact-box">
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
                                    <input id="calender-input" required class="calender_input" type="date"
                                        placeholder="dd/mm/yyyy" min="${getTodaysDateForCalender()}" onkeydown="return false;" ${onmousedownAttribute}>
                                    <div class="error_warning">
                                        <span id="calender-warning-text">This field is required</span>
                                    </div>
                                </div>
                            </div>
                            <div class="prio-container box1">
                                <h4>Prio</h4>
                                <div class="button-selection">
                                    <div class="prio-button" id="buttonUrgent" onclick="changeButtonStyles('Urgent')">Urgent
                                        <img draggable="false" class="prio-image" id="iconUrgent" src="../images/capa 2.svg" alt="">
                                    </div>
                                    <div class="prio-button selected" id="buttonMedium" onclick="changeButtonStyles('Medium')">Medium
                                        <img draggable="false" class="prio-image selected_icon" id="iconMedium" src="../images/prio media.svg" alt="">
                                    </div>
                                    <div class="prio-button" id="buttonLow" onclick="changeButtonStyles('Low')">Low <img draggable="false" class="prio-image" id="iconLow" src="../images/prio baja.svg" alt=""></div>
                                </div>
                            </div>
                            <div class="category-fields">
                                <h4>Category<span class="letter-color">*</span></h4>
                                <div id="categoryBox" onclick="toggleDropdown()" class="category-box">
                                    <div class="custom-list">
                                        <div>
                                            <input required autocomplete="off" class="span-category" id="selectedCategory" type="text"
                                                name="myInput" placeholder="Select task category">
                                        </div>
                                        <div class="category-icon-field">
                                            <img draggable="false" class="drop-option" id="selectIcon" src="../images/arrow_drop_downaa.svg"
                                                alt="Arrow">
                                        </div>
                                    </div>
                                </div>
                                <div id="dropdownOptionsPopup" class="dropdown-options"></div>
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
                                        <img draggable="false" id="closeImag" onclick="toggleSubtaskImages()" class="subtask-button-close"
                                            src="../images/Property 1=close.svg" alt="">
                                        <img draggable="false" id="checkImage" class="subtask-button-check" src="../images/Property 1=check.svg"
                                            alt="" onclick="addSubtask()">
                                    </div>
                                </div>
                                <div class="subtask-content-popup" id="subtaskContent"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="task-below-popup">
                    <div>
                        <div class="requered-field-popup">
                            <span class="letter-color">*</span>
                            This field is required
                        </div>
                    </div>
                    <div class="clear-create-button-popup">
                        <button onclick="renderAddTaskPopUp()" type="reset" class="clear-button-popup">Clear<img draggable="false" src="../images/close.svg"></button>
                        <button class="create-button">Create Task <img draggable="false" class="clear-create-img" src="../images/check.svg" alt=""></button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

function returnCreatorSVG() {
    return /*html*/`
        <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 6.5c-.414 0-.75.336-.75.75v5.5c0 .414.336.75.75.75s.75-.336.75-.75v-5.5c0-.414-.336-.75-.75-.75zm-.002-3c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z" fill="#A8A8A8" fill-rule="nonzero"/>
        </svg>
    `;
}

function returnEditTaskHTML(task) {
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    let onmousedownAttribute = isTouchDevice ? "" : ' onmousedown="preventPlaceholderSelection(event)"';
    let formattedDate = task.date.split(".").reverse().join("-");

    return /*html*/`
                    <div style="width:100%; display:flex; justify-content: flex-end;"><img draggable="false" class="closeWindowImage" src="../images/close.svg" onclick="closeTask()"></img></div>
        <form class="edit-task-container">
            <div style="width:100%">
                <div class="edit-task-input">
                    <div class="edit-task-left-field">
                            <div class="titel-field">
                                <h4>Title<span class="letter-color">*</span></h4>
                                <input value= "${task.title}" autocomplete="off" id="titel-inputEdit" required type="text" name="myInput" placeholder="Enter a title" oninput="ifEmptySetRequiredBorder()">
                                <div  class="error_warning">
                                    <span id="title-warning-text">This field is required</span>
                                </div>
                            </div>    
                        <div class="description-field">
                            <h4>Description</h4>
                            <div class="textarea-container">
                                <div class="textarea-field">
                                    <textarea id="read-descriptionEdit" class="textarea attrebute" type="text" name="myTextarea"
                                        placeholder="Enter a Description" spellcheck required>${task.description}</textarea>
                                </div>
                                <div>
                                    <img draggable="false" class="description-icon" src="../images/Recurso 1 1.svg" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="contacts-field box2">
                            <h4>Assigned to</h4>
                            <div id="assignInputContainEdit" class="custom-dropdown">
                                <input onkeyup="searchContactToAssignEdit()" id="assignTo-inputEdit" autocomplete="off" class="assign-input" type="search" placeholder="Select contacts to assign" oninput="this.value = this.value.replace(/[^a-zA-Z\u00C0-\u00FF ]/g, '');">
                                <div id="assignBtnEdit" class="assign-button" onclick="toggleContactsEdit()">
                                    <img draggable="false" onclick="rotateIconEdit()" src="../images/arrow_drop_downaa.svg" alt="Arrow Icon" id="arrowIconEdit">
                                </div>
                            </div>
                            <div class="contact-container d-none" id="contactContainerEdit">
                                <div id="contactBoxEdit" class="contact-box">
                                    <div id="assigned-to-contact-listEdit"></div>
                                </div>
                            </div>
                            <div id="selected-contact-ctnEdit" class="selected_contact_ctn d-none"></div>
                        </div>
                    </div>
                    <div class="edit-task-right-field">
                        <div>
                            <div class="date-field">
                                <h4>Due Date<span class="letter-color">*</span></h4>
                                <input value="${formattedDate}" id="calender-inputEdit" required class="calender_input" type="date" min="${getTodaysDateForCalender()}" ${onmousedownAttribute}>
                                <div class="error_warning">
                                    <span id="calender-warning-text">This field is required</span>
                                </div>
                            </div>
                        </div>
                        <div class="prio-container box1">
                            <h4>Prio</h4>
                            <div class="button-selection">
                                <div class="prio-button" id="buttonUrgentEdit" onclick="changeButtonStylesEdit('Urgent')">Urgent
                                    <img draggable="false" class="prio-image" id="iconUrgentEdit" src="../images/capa 2.svg" alt=""></div>
                                <div class="prio-button" id="buttonMediumEdit" onclick="changeButtonStylesEdit('Medium')">Medium
                                    <img draggable="false" class="prio-image" id="iconMediumEdit" src="../images/prio media.svg" alt=""></div>
                                <div class="prio-button" id="buttonLowEdit" onclick="changeButtonStylesEdit('Low')">Low <img draggable="false"
                                    class="prio-image" id="iconLowEdit" src="../images/prio baja.svg" alt=""></div>
                            </div>
                        </div>
                        <div class="subtask-container">
                            <h4>Subtasks</h4>
                            <div class="subtask-field">
                                <div class="subtask-input-container">
                                    <input oninput="showSubtaskImagesByInputEdit()" id="subtaskInputEdit" class="subtask-input" type="text" name="myInput" placeholder="Add new subtask" autocomplete="off" onkeypress="if(event.keyCode === 13) { addSubtaskInEditTask(); event.preventDefault(); }">
                                </div>
                                <div class="subtask-image-field-first" id="imageContainerEdit">
                                    <img draggable="false" src="../images/Property 1=add.svg" alt="" onclick="toggleSubtaskImagesEdit()">
                                </div>
                                <div class="subtask-image-field-second d-none" id="newImagesEdit">
                                    <img draggable="false" id="closeImag" onclick="toggleSubtaskImagesEdit()" class="subtask-button-close" src="../images/Property 1=close.svg" alt="">
                                    <img draggable="false" id="checkImage" class="subtask-button-check" src="../images/Property 1=check.svg" alt="" onclick="addSubtaskInEditTask()">
                                </div>
                            </div>
                            <div class="subtask-content" id="subtaskContentEdit"></div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="flex_end">
            <button onclick="reviseEditTask(${task.id})" class="create-button">Ok<img draggable="false" class="clear-create-img" src="../images/check.svg" alt=""></button>   
        </div>
    `;
}

function returnSubtaskForEditOption(subtaskDescription, i) {
    return /*html*/`
        <div class="task-list" id="taskListEdit${i}">
            <div class="liest-field">
                <div class="tasks-content">
                    <p class="finished-content" id="finishedContent${i}">${subtaskDescription}</p>
                </div>
                <div class="edit-delete-container">
                    <div class="edit-box">
                        <img onclick="toggleSubtaskEdit(${i})" class="edit-image" id="editImage${i}" src="../images/Property 1=edit.svg" alt="">
                    </div>
                    <div class="delete-box">
                        <img onclick="deleteButtonInEditTask(${i})" class="delete-image" id="deleteImage${i}" src="../images/Property 1=delete.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="edit-list d-none" id="editTaskListEdit${i}">
            <div class="liest-field">
                <div class="tasks-content">
                    <input id="editInputEdit${i}" class="subtask-input" value="${subtaskDescription}" type="text">
                </div>
                <div class="delete-check-container">
                    <div class="delete-box">
                        <img onclick="deleteButtonInEditTask(${i})" class="delete-image" src="../images/Property 1=delete.svg" alt="">
                    </div>
                    <div class="edit-box">
                        <img onclick="checkEditedTaskListEdit(${i}, '${subtaskDescription}')" id="checkImage${i}" class="subtask-button-check" src="../images/Property 1=check.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function returnAssignedToContactListEdit(index, contact) {
    let displayName = contact.name;
    if (currentUser && contact.email === currentUser[0].email) {
        displayName += "&nbsp;&nbsp;( You )";
    }

    return /*html*/`
        <div id="contact-${contact.email}" onclick="assignToEdit(${index}, '${displayName}', '${contact.email}', '${contact.phone}', '${contact.initial}', '${contact.BgColor}')" class="contacts-followfield">
            <div class="contacts-name">
                <div style="background-color:${contact.BgColor}" class="contact_circle">${contact.initial}</div>
                <span class="contact-name">${displayName}</span>
            </div>
            <div>
                <div class="check-button">
                    <img id="check-contact${index}-image" src="../images/Rectangle 5.svg" alt="">
                    <img id="checked-contact${index}-image" class="d-none" src="../images/check-white.svg" alt="">
                </div>
            </div>
        </div>
    `;
}


function returnSubtasksDetailsHTML(subtaskId, subtask, taskId) {
    let imageHTML = subtask.subtaskStatus === 'finished' ? returnCheckedBoxHTML(subtaskId, taskId) : returnCheckBoxHTML(subtaskId, taskId);
    let subtaskClass = subtask.subtaskStatus === 'finished' ? 'lineThrough' : '';

    return /*html*/`
        <div onclick="selectSubtaskInDetails(${subtaskId},${taskId})" class="subtaskContainDetails ${subtaskClass}">
            ${imageHTML}
            <span id="subtask${subtaskId}${taskId}">${subtask.description}</span>
        </div>
    `;
}

function returnCheckedBoxHTML(subtaskId, taskId) {
    return /*html*/`<img id="checkedBox${subtaskId}${taskId}" src="../images/checked_button.svg">`;
}

function returnCheckBoxHTML(subtaskId, taskId) {
    return /*html*/`<img id="checkBox${subtaskId}${taskId}" src="../images/check_button.svg">`;
}

function returnNoSubtasksHTML(taskSizeStatus) {
    if (taskSizeStatus === 'small') {
        return '';
    } else if (taskSizeStatus === 'big') {
        return /*html*/`
            <div class="noSubtasksContain">
                <p>-</p><p>The task has no associated subtasks.</p><p>-</p>
            </div>`;
    }
    return '';
}

function returnSmallSubtasksHTML(subtasks, taskId) {
    return /*html*/`
        <div id="subtask_contain${taskId}" class="subtaskContain">
            <div class="progressbarContainer">
                <div id="progressbar${taskId}"></div>
            </div>
            <span id="subtaskTxt${taskId}" class="subtaskTxt">${subtasksCompleted(subtasks, taskId)}/${subtasks.length}</span>
        </div>
    `;
}

function returnBigSubtasksHTML(subtasks, taskId) {
    return subtasks.map((subtask, i) => returnSubtasksDetailsHTML(i, subtask, taskId)).join('');
}

function returnSmallContactHTML(contact) {
    return /*html*/`
        <div class="profileBadge" style="background-color: ${contact.BgColor}">${contact.initial}</div>
    `;
}

function returnBigContactHTML(contact, index, totalContacts) {
    let isLast = index === totalContacts - 1;
    let isLastOdd = totalContacts % 2 !== 0;
    let assignedNameStyle = isLast && isLastOdd ? 'style="width: 100%;"' : '';

    return /*html*/`
        <div class="assignedProfil">
            <span class="assignedBadge" style="background-color: ${contact.BgColor}">${contact.initial}</span>
            <div class="assignedName" ${assignedNameStyle}>
                <span class="assignedNameText">${contact.name}</span>
            </div>
        </div>
    `;
}