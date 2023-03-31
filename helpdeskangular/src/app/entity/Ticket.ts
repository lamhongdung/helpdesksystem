export class Ticket {

    constructor(

        // ticket id
        public ticketid: number,
        // subject
        public subject: string,
        // category id
        public categoryid: number,
        // creator id
        public creatorid: number,
        // team id
        public teamid: number,
        // priority id
        public priorityid: number,
        // assignee id
        public assigneeid: number,
        // ticket status id
        public ticketStatusid: number,
        // content
        public content: string,

        // file URL
        public fileUrl: string,
        
        // date creates ticket
        public createDatetime: Date,
        // last datetime ticket is updated
        public lastUpdateDatetime: Date,

    ) {

    }

}