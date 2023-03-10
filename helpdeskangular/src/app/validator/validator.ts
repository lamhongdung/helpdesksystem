import { AbstractControl } from "@angular/forms";

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
