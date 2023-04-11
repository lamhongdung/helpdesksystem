export class TicketEditRequest {

    constructor(

        // ticket id
        public ticketid: number,
        // last update by user id + full name
        public lastUpdateByUser: string,
        // category id
        public categoryid: number,
        // priority id
        public priorityid: number,
        // assignee id
        public assigneeid: number,
        // ticket status id
        public ticketStatusid: number,

    ) {

    }

}