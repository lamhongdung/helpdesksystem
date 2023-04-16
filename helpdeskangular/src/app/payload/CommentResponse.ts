// 
export class CommentResponse {

    constructor(

        public commentid: number,

        // comment content
        public commentDescription: string,

        public commenterid: number,

        public commenterName: string,

        public commenterPhone: string,

        public commenterEmail: string,

        // commenter = commenterid + commenterName + commenterPhone + commenterEmail
        public commenter: string,

        public commentDatetime: string,
        public customFilename: string,
        public originalFilename: string

    ) {

    }

}