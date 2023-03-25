export class TicketResponse {

    constructor(

        // ticket id
        public ticketid: number,
        // subject
        public subject: string,
        // creator name
        public creatorName: number,
        // creator phone number
        public creatorPhone: number,
        // assignee name
        public assigneeName: string,
        // create date time
        public createDatetime: Date,
        // ticket status name
        public ticketStatusName: string,
        // sla(service level agreement): ontime or late
        public sla: string,
        // creator email
        public creatorEmail: string,
        // team name
        public teamName: string,
        // category name
        public categoryName: string,
        // priority name
        public priorityName: number,

        // ticket content
        public content: string

    ) {

    }

}