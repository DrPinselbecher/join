function generateSummaryHTML() {
    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    let margin = isSafari && isTouchDevice ? 'style="margin-top: -40px"' : '';

    let content = document.getElementById("content");
    content.innerHTML = "";
    content.innerHTML = /*html*/`
    <main ${margin}>
        <div class="summary_title_ctn">
            <div class="summary_title">
                <h1>Join 360</h1>
                <div class="summary_subtitle_ctn">
                    <div class="vector_ctn">
                        <img draggable="false" src="../images/Vector 5.svg" alt="">
                    </div>
                    <span>Key Metrics at a Glance</span>
                </div>
            </div>
        </div>

        <div class="summary_content_ctn">
            <section class="summary_section_left">
                <div class="summary_start_row">
                    <div onclick="renderBoard()" id="to-do-thumbnail" class="summary_start_row_thumbnails">
                        <img draggable="false" src="../images/to_do_thumbnail.svg" alt="">
                        <div class="flex_colum_align_center">
                            <span id="to-do-task-number" class="summary_digits">${filterAndReturnToDoTasks()}</span>
                            <span class="font_20px">To-Do</span>
                        </div>
                    </div>
                    <div onclick="renderBoard()" id="done-thumbnail" class="summary_start_row_thumbnails">
                        <img draggable="false" src="../images/done_thumbnail.svg" alt="">
                        <div class="flex_colum_align_center">
                            <span id="done-tasks-number" class="summary_digits">${filterAndReturnDoneTasks()}</span>
                            <span class="font_20px">Done</span>
                        </div>
                    </div>
                </div>
                <div onclick="renderBoard()" class="summary_second_row">
                    <div class="second_row_left_section">
                        <div class="prio_circle">
                            <img draggable="false" src="../images/summary_prio_alta.svg" alt="">
                        </div>
                        <div class="flex_colum_align_center">
                            <span class="summary_digits">${filterAndReturnUrgentTasks()}</span>
                            <span class="font_20px">Urgent</span>
                        </div>
                    </div>
                    <div class="summary_second_row_separator_ctn">
                        <img draggable="false" src="../images/summary_second_row_vector.svg" alt="">
                    </div>
                    <div class="second_row_right_section">
                        <span id="current-date-summary">${renderNextDeadlineDate()}</span>
                        <span id="deadline-text">Upcoming Deadline</span>
                    </div>
                </div>
                <div class="summary_ending_row">
                    <div onclick="renderBoard()" class="summary_ending_row_thumbnails">
                        <span class="summary_digits">${tasks.length}</span>
                        <span class="nowrap_justify_center font_20px">Tasks in Board</span>
                    </div>
                    <div onclick="renderBoard()" class="summary_ending_row_thumbnails">
                        <span class="summary_digits">${filterAndReturnInProgressTasks()}</span>
                        <span class="nowrap_justify_center font_20px">Tasks in Progress</span>
                    </div>
                    <div onclick="renderBoard()" class="summary_ending_row_thumbnails">
                        <span class="summary_digits">${filterAndReturnAwaitFeedbackTasks()}</span>
                        <span class="nowrap_justify_center font_20px">Awaiting feedback</span>
                    </div>
                </div>
            </section>
            <section class="summary_section_right">
                    <span id="greeting">${renderGreetingMessage()}</span>
                    <span id="greeted-name">${renderGreetsUserName()}</span>
            </section>
        </div>
    </main>
    `;
}

function returnMobileGreeting() {
    return `
        <span id="mobile-greeting">${renderGreetingMessage()}</span>
        <span id="mobile-greeted-name">${renderGreetsUserName()}</span>
    `;
}
