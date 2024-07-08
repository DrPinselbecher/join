function returnContactPage() {
    content.innerHTML = '';
    content.innerHTML = /*html*/`
        <main id="contactContainContent" class="contacts_content">
            <section id="contact-list-section" class="contact_list_section">

                <div class="add_contact_btn_div">
                    <div onclick="openAddContact()" id="add-contact-button">
                        <span>Add new contact</span>
                        <img draggable="false" src="../images/person_add.svg" alt="">
                    </div>
                </div>
                <div id="contact-list" class="contacts_list_div"></div>
            </section>
            <section id="contactInformations" class="selected_contact_infos">
                <div class="contact_title_ctn">
                    <div class="contact_title">
                        <h1>Contacts</h1>
                        <img draggable="false" onclick="closeSelectedContactInformation()" src="../images/arrow-left-line.svg">
                    </div>
                    <div class="contacts_subtitle">
                        <div class="contacts_title_vector">
                            <img draggable="false" src="../images/Vector 5.svg" alt="">
                        </div>
                        <span>Better with a Team</span>
                    </div>
                </div>
                <div id="selected-contact-content" class="padding_left_62"></div>
            </section>

            <div class="mobile_add_contact_button_ctn">
                <div onclick="openAddContact()" id="mobile-add-contact-button" class="mobile_add_contact_button">
                    <img draggable="false" src="..//images/person_add.svg">
                </div>
            </div>
        </main>
    `;
}

function returnContactsOrganizer(i, organizerLetter) {
    return /*html*/`
    <div id="contact-organizer${i}">
        <div class="contact_organizer">
            <span>${organizerLetter}</span>
        </div>
        <hr class="divider">
    </div>
`;
}

function returnContacts(i, contactMatches) {
    return /*html*/`
        <div onclick="showContactInformation('${contactMatches['name']}', '${contactMatches['email']}', '${contactMatches['phone']}','${contactMatches['initial']}', '${contactMatches['BgColor']}')" id="${contactMatches['email']}" class="contact_div">
            <div id="${contactMatches['name']}-profil-picture" class="contact_circle" style="background-color:${contactMatches['BgColor']}">
            ${contactMatches['initial']}
            </div>
            <div class="flex_column gap_5 overflow_hidden">
                <span id="contact-name-${i}" class="contact_name">${contactMatches['name']}</span>
                <span id="contact-email-${i}" class="contact_email">${contactMatches['email']}</span>
            </div>
        </div>
    `;
}

function returnContactInformations(name, email, phone, initial, BgColor) {
    return /*html*/`
        <div class="align_item_center gap_54 gap_30">
            <div class="selected_contact_circle" style="background-color:${BgColor}">
            ${initial}
            </div>
            <div class="flex_column align_item_start gap_8">
                <div id="selected-contact-${name}" class="selected_contact_name">
                    ${name}
                </div>
                <div class="align_item_center gap_16">
                    <div onclick="openEditContact(event, '${name}', '${email}', '${phone}', '${initial}', '${BgColor}')" id="edit-selected-contact-${name}" class="edit_selected_contact align_item_center gap_8">
                        <img draggable="false" src="../images/edit.svg" alt="">
                        <span>Edit</span>
                    </div>
                    <div onclick="confirmTaskDeletionContacts('${email}','${name}')" id="delete-selected-contact-${name}" class="delete_selected_contact align_item_center gap_8">
                        <img draggable="false" src="../images/delete.svg" alt="">
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="contact_information_title">
            Contact Information
        </div>
        <div class="flex_column gap_15">
            <span class="font_weight_700">Email</span>
            <a draggable="false" href="mailto:${email}" id="selected-contact-${email}" class="selected_contact_email">${email}</a>
        </div>
        <div class="flex_column gap_15">
            <span class="font_weight_700">Phone</span>
            <a draggable="false" href="tel:${phone}" id="${name}-phone-number" class="selected_contact_phone">${phone}</a>
        </div>
        
        <div id="mobile-contact-editor" class="mobile_add_contact_button_ctn">
            <div onclick="openMobileEditMenu('${name}', '${email}', '${phone}', '${initial}', '${BgColor}')" id="mobile-contact-edit-menu" class="mobile_add_contact_button d-none">
                <img draggable="false" src="..//images/more_menu.svg">
            </div>
        </div>
        
        <div onclick="closeMobileEditMenu()" id="mobile-edit-contact-menu-ctn" class="mobile_edit_contact_ctn d-none"></div>
        
        <div id="contact-deletion-ctn" class="contact_deletion_ctn d-none">
            <div class="contact_deletion">
                <div>
                    <p>Are you sure you want to delete this Contact: </p>
                    <span>${name}?</span>
                </div>
                <div class="contact_deletion_btn_ctn gap_16">
                    <button onclick="confirmTaskDeletionContacts('${email}','${name}')" id="cancel-deletion"><img draggable="false" src="../images/close.svg" alt="">Cancel</button>
                    <button onclick="deleteContact('${email}')" id="confirm-deletion"><img draggable="false" src="../images/delete.svg" alt="">Delete</button>
                </div>
            </div>    
        </div>
    `;
}

function returnAddContactPopup() {
    return /*html*/`
        <div id="contact-popup" onclick="stop(event)" class="contact_popup">
            <section class="section_left">
                <div class="close_mobile_contact_popup_div">
                    <div id="close-contact-popup" onclick="closePopupContact()">
                        <img draggable="false" src="../images/close.svg">
                    </div>
                </div>
                <div class="call_to_action_ctn">
                    <img draggable="false" class="call_to_action_logo" src="../images/join_logo.svg">
                    <div class="call_to_action_text">
                        <h2>Add contact</h2>
                        <span>Tasks are better with a team!</span>
                    </div>
                    <div class="call_to_action_vector">
                        <img draggable="false" src="../images/vector.svg" alt="">
                    </div>
                </div>
            </section>

            <section class="section_right">
                <div class="contact_profil_ctn">
                    <div class="contact_profil">
                        <img draggable="false" src="../images/person_white.svg">
                    </div>
                </div>
                <div class="flex_column width_100">
                    <div class="close_desktop_contact_popup_div">
                        <div onclick="closeContactPopup()" id="close-contact-popup">
                            <img draggable="false" src="../images/close.svg">
                        </div>
                    </div>
                    <form onsubmit="addNewContact(); return false" class="contact_form">
                        <div class="contact_inputs_ctn">
                            <div class="contact_input">
                                <input onblur="checkExistingContact()" id="new-contact-name" required type="text" placeholder="Name" autocomplete="off" oninput="this.value = this.value.replace(/[^a-zA-Z\u00C0-\u00FF ]/g, '');">
                                <img draggable="false" src="../images/person.svg" alt="">
                            </div>
                            <div class="contact_input">
                                <input onblur="checkExistingContact()" id="new-contact-email" required type="Email" placeholder="Email" autocomplete="off">
                                <img draggable="false" src="../images/mail.svg" alt="">
                            </div>
                            <div class="contact_input">
                                <input onblur="checkExistingContact()" type="number" id="new-contact-phone" required type="number" placeholder="Phone" autocomplete="off">
                                <img draggable="false" src="../images/call.svg" alt="">
                            </div>
                        </div>
                        <div class="contact_buttons_ctn">
                            <button type="button" id="contact-popup-left-button" onclick="closeContactPopup() "class="contact_popup_left_button">Cancel<img draggable="false" src="../images/close.svg"></button>
                            <button class="contact_popup_right_button">Create contact <img draggable="false" src="../images/check.svg"></button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    `;
}

function returnEditContactPopup(name, email, phone, initial, BgColor) {
    return /*html*/`
        <div id="contact-popup" onclick="stop(event)" class="contact_popup">
            <section class="section_left">
                <div class="close_mobile_contact_popup_div">
                    <div onclick="closeMobileContactPopup()" id="close-contact-popup">
                        <img draggable="false" src="../images/close.svg">
                    </div>
                </div>
                <div class="call_to_action_ctn">
                    <img draggable="false" class="call_to_action_logo" src="../images/join_logo.svg">
                    <div class="call_to_action_text">
                        <h2>Edit contact</h2>
                    </div>
                    <div class="call_to_action_vector">
                        <img draggable="false" src="../images/vector.svg" alt="">
                    </div>
                </div>
            </section>

            <section class="section_right">
                <div class="contact_profil_ctn">
                    <div class="selected_contact_circle" style="background-color:${BgColor}">
                    ${initial}
                    </div>
                </div>
                <div class="flex_column width_100">
                    <div class="close_desktop_contact_popup_div">
                        <div onclick="closeContactPopup()" id="close-contact-popup">
                            <img draggable="false" src="../images/close.svg">
                        </div>
                    </div>
                    <form onsubmit="editContact('${name}','${email}','${phone}','${initial}','${BgColor}'); return false" class="contact_form">
                        <div class="contact_inputs_ctn">
                            <div class="contact_input">
                                <input id="edited-${name}" value="${name}" type="text" oninput="this.value = this.value.replace(/[^a-zA-Z\u00C0-\u00FF ]/g, '');">
                                <img draggable="false" src="../images/person.svg" alt="">
                            </div>
                            <div class="contact_input">
                                <input id="edited-${email}" value="${email}" type="Email">
                                <img draggable="false" src="../images/mail.svg" alt="">
                            </div>
                            <div class="contact_input">
                                <input id="edited-${phone}" value="${phone}" type="number"  autocomplete="off">
                                <img draggable="false" src="../images/call.svg" alt="">
                            </div>
                        </div>
                        <div class="contact_buttons_ctn">
                            <button type="button" onclick="confirmTaskDeletionContacts('${email}','${name}')" class="contact_popup_left_button">Delete<img draggable="false" src="../images/close.svg"></button>
                            <button onclick="closeMobileContactPopup()" class="contact_popup_right_button">Save<img draggable="false" src="../images/check.svg" alt=""></button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    `;
}

function returnMobileEditContactMenu(name, email, phone, initial, BgColor) {
    return /*html*/`
    <div id="mobile-edit-contact-menu" class="mobile_edit_contact_menu animate_edit_contact_menu">
        <div onclick="openEditContact(event, '${name}', '${email}', '${phone}', '${initial}', '${BgColor}')" id="edit-contact" class="mobile_edit_contact">
            <img draggable="false" src="..//images/edit.svg">
            <span>Edit</span>
        </div>
        <div onclick="confirmTaskDeletionContacts('${email}','${name}')" id="delete-contact" class="mobile_edit_contact">
            <img draggable="false" src="..//images/delete.svg">
            <span>Delete</span>
        </div>
    </div>
    `;
}

function returnConfirmationPopupContactsHTML(email, msg) {
    return /*html*/`
        <div class="confirmationContent">
            <p class="deleteTitleMessage">${msg}</p>
            <div class="confirmationPopupBtnContain">
                <button onclick="deleteContact('${email}')" style="color:rgba(255,0,0,90%);">Delete</button>
                <button onclick="closeConfirmationPopup()">Cancel</button>
            </div>
        </div>
    `;
}