export class TicketSearchResponse {

    constructor(

        // ticket id
        public ticketid: number,
        // subject
        public subject: string,
        // creator name
        public creatorName: string,
        // assignee name
        public assigneeName: string,
        // create date time
        public createDatetime: Date,
        // ticket status name
        public ticketStatusName: string,
        // sla(service level agreement): ontime or late
        public sla: string,
        // last update date time
        public lastUpdateDatetime: Date,
        // spent hours. ex: 1.5 hours
        public spentHour: number,
        // count spent 'days-hours-minutes'. ex: spentDayHhmm = '3 days 15 hours 22 minutes'
        public spentDayHhmm: string,
        // creator phone number
        public creatorPhone: string,
        // creator email
        public creatorEmail: string,
        // team name
        public teamName: string,
        // category name
        public categoryName: string,
        // priority name
        public priorityName: string,

        // ticket content
        public content: string,

        // resolveIn
        public resolveIn: string,
        // currentDatetime
        public currentDatetime: Date,
        // ticket status id
        public ticketStatusid: number

    ) {

    }

}