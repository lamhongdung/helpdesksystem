export class ChangePassword {

    constructor(
        public email: string,
        public oldPassword: string,
        public newPassword: string,
        public confirmNewPassword: string

    ) {

    }

}
