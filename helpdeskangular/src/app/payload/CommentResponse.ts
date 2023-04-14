// 
export class CommentResponse {

    constructor(

        public commentid: number,

        // description = id + name +...
        public commentDescription: string,
        public commenterid: number,
        public commenterName: string,
        public commenterPhone: string,
        public commenterEmail: string,
        public commenter: string,
        public commentDatetime: string,
        public customFilename: string,
        public originalFilename: string

    ) {

    }

}