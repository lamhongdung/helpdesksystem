export class TicketCreateRequest {

    constructor(

        // creator id
        public creatorid: number,
        // subject
        public subject: string,
        // ticket content
        public content: string,

        // team id
        public teamid: number,
        // category id
        public categoryid: number,
        // priority id
        public priorityid: number,

        // customFilename
        public customFilename: string,

    ) {

    }

}