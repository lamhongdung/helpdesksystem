export class EditTicketResponse {

    constructor(

        // ticket id
        public ticketid: number,
        // creator id + full name
        public creator: string,
        // creator phone number
        public creatorPhone: string,
        // creator email
        public creatorEmail: string,
        // subject
        public subject: string,
        // ticket content
        public content: string,

        // team id + team name
        public team: string,
        // create date time
        public createDatetime: Date,
        // last update date time
        public lastUpdateDatetime: Date,
        // last update by user id + full name
        public lastUpdateByUser: string,
        // spent hours + sla(service level agreement)
        public spentHour: string,
        // category id
        public categoryid: number,
        // priority id
        public priorityid: number,
        // assignee id
        public assigneeid: number,
        // ticket status id
        public ticketStatusid: number,
        // customFilename
        public customFilename: string,
        // originalFilename
        public originalFilename: string,
        // currentDatetime
        public currentDatetime: Date,

    ) {

    }

}