export class TicketEditRequest {

    constructor(

        // ticket id
        public ticketid: number,

        // category id
        public categoryid: number,
        // priority id
        public priorityid: number,
        // assignee id
        public assigneeid: number,
        // ticket status id
        public ticketStatusid: number,
        // to be updated by user id
        public toBeUpdatedByUserid: number

    ) {

    }

}