export class CommentRequest {

    constructor(

        // ticket id
        public ticketid: number,

        // comment description
        public commentDescription: string,

        // commenter id
        public commenterid: number,

        // commentCustomFilename
        public commentCustomFilename: string

    ) {

    }

}