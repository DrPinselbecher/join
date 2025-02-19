function returnHelpHTML() {
    content.innerHTML = '';
    content.innerHTML = /*html*/`
        <main class="legal_content_ctn" style="padding-top: 10px">
            <div class="legal_content_title">
                <h1>Help</h1>
                <a draggable="false" onclick="renderSummary()"><img draggable="false" src="../images/arrow-left-line.svg" alt=""></a>
            </div>
            <p style="margin-top:-20px">Welcome to the help page for <span style="color: #29ABE2;">Join</span>, your
                guide to using our kanban project
                management tool. Here, we'll
                provide an overview of what <span style="color: #29ABE2;">Join</span> is, how it can benefit you, and
                how to use it.</p>
            <div>
                <h2>What is Join?</h2>
                <p><span style="color: #29ABE2;">Join</span> is a kanban-based project management tool designed and
                    built by a group of dedicated students as
                    part of their web development bootcamp at the Developer Akademie.<br><br>

                    Kanban, a Japanese term meaning "billboard", is a highly effective method to visualize work, limit
                    work-in-progress, and maximize efficiency (or flow). <span style="color: #29ABE2;">Join</span>
                    leverages the principles of kanban to help
                    users manage their tasks and projects in an intuitive, visual interface.<br><br>

                    It is important to note that <span style="color: #29ABE2;">Join</span> is designed as an educational
                    exercise and is not intended for
                    extensive business usage. While we strive to ensure the best possible user experience, we cannot
                    guarantee consistent availability, reliability, accuracy, or other aspects of quality regarding
                    <span style="color: #29ABE2;">Join</span>.<br>
                </p>
            </div>
            <section>
                <h2>How to use it</h2>
                <p style="margin-top: -5px;">Here is a step-by-step guide on how to use <span
                        style="color: #29ABE2;">Join</span>:</p>
                <div>
                    <div style="display: flex; gap: 15px;">
                        <h2>1.</h2>
                        <div>
                            <h2>Relevant Legal Bases</h2>
                            <p style="margin: 0;">When you log in to <span style="color: #29ABE2;">Join</span>, you'll
                                find a default board. This board
                                represents your project
                                and contains four default lists: "To Do", "In Progress", “Await feedback” and "Done".
                            </p><br>
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <h2>2.</h2>
                        <div>
                            <h2>Creating Contacts</h2>
                            <p style="margin: 0;"><span style="color: #29ABE2;">Join</span>, you can add contacts to
                                collaborate on your projects. Go to
                                the "Contacts" section, click on "New contact", and fill in the required information.
                                Once added, these contacts can be assigned tasks and they can interact with the tasks on
                                the board.</p><br>
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <h2>3.</h2>
                        <div>
                            <h2>Adding Cards</h2>
                            <p style="margin: 0;">Now that you've added your contacts, you can start adding cards. Cards
                                represent individual tasks. Click the "+" button under the appropriate list to create a
                                new card. Fill in the task details in the card, like task name, description, due date,
                                assignees, etc.</p><br>
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <h2>4.</h2>
                        <div>
                            <h2>Moving Cards</h2>
                            <p style="margin: 0;">
                                As the task moves from one stage to another, you can reflect that on the board by
                                dragging and dropping the card from one list to another.</p><br>
                        </div>
                    </div>
                    <div style="display: flex; gap: 15px;">
                        <h2>4.</h2>
                        <div>
                            <h2>Deleting Cards</h2>
                            <p style="margin: 0;">
                                Once a task is completed, you can either move it to the "Done" list or delete it.
                                Deleting a card will permanently remove it from the board. Please exercise caution when
                                deleting cards, as this action is irreversible.<br><br>
                                Remember that using <span style="color: #29ABE2;">Join</span> effectively requires
                                consistent updates from you and your team
                                to ensure the board reflects the current state of your project.<br><br>
                                Have more questions about <span style="color: #29ABE2;">Join</span>? Feel free to
                                contact us at [Your Contact Email]. We're
                                here to help you!<br><br>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <h2 style="margin-bottom: 40px;">Enjoy using Join!</h2>
        </main>
    `;
    let legalContent = document.getElementById('legal-content-section');
    legalContent.classList.add('d-none');
}