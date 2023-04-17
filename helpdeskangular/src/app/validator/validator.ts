import { AbstractControl } from "@angular/forms";

//------------------------------
// Change password
//------------------------------

// validate whether "New password" is equal to "Comfirm new password" or not.
// - return NULL(have no error): if (newPassword === confirmNewPassword)
// - return 'misMatch'(has errors): if (newPassword !== confirmNewPassword)
export function passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {

    // get field "newPassword" of the form
    const newPassword = control.get("newPassword");

    // get field "confirmNewPassword" of the form
    const confirmNewPassword = control.get("confirmNewPassword");

    // if field "newPassword" or "confirmNewPassword" has not been modified yet
    if (newPassword.pristine || confirmNewPassword.pristine) {

        // return data is ok(has no error)
        return null;
    }

    return (newPassword && confirmNewPassword && newPassword.value === confirmNewPassword.value) ? null : { 'misMatch': true };
    // return null;
}

//------------------------------
// create ticket
//------------------------------

// validate whether attached ticket file is valid or not.
export function validTicketFile(control: AbstractControl): { [key: string]: boolean } | null {

    // get value of "hasAttachedFile"
    const hasAttachedFile = control.get("hasAttachedFile").value;

    // get value of "customFilename"
    const customFilename = control.get("customFilename").value;

    // if has no attached file
    if (!hasAttachedFile) {

        // return data is ok(has no error)
        return null;
    }

    // in case there is attached file
    return (customFilename !== '') ? null : { 'validTicketFile': true };

}

//------------------------------
// add comment
//------------------------------

// validate whether attached comment file is valid or not.
export function validCommentFile(control: AbstractControl): { [key: string]: boolean } | null {

    // get value of "hasAttachedCommentFile"
    const hasAttachedCommentFile = control.get("hasAttachedCommentFile").value;

    // get value of "commentCustomFilename"
    const commentCustomFilename = control.get("commentCustomFilename").value;

    // if has no attached file
    if (!hasAttachedCommentFile) {

        // return data is ok(has no error)
        return null;
    }

    // in case there is attached file
    return (commentCustomFilename !== '') ? null : { 'validCommentFile': true };

}
