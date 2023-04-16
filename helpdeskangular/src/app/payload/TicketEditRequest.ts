export class TicketEditRequest {

    constructor(

        // ticket id
        public ticketid: number,

        // priority id
        public priorityid: number,

        // category id
        public categoryid: number,

        // assignee id
        public assigneeid: number,

        // ticket status id
        public ticketStatusid: number,

        // to be updated by user id(new 'last update user')
        public toBeUpdatedByUserid: number

    ) {

    }

}