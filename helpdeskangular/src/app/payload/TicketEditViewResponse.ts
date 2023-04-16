export class TicketEditViewResponse {

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

        // team id + team name + assignment method
        public team: string,
        // create date time
        public createDatetime: Date,
        // last update date time
        public lastUpdateDatetime: Date,
        // last update by user id + full name
        public lastUpdateByUser: string,

        // spentDayHhmm + sla(service level agreement)
        // ex: spentHour = "5 hours 41 minutes  --> Ontime"
        public spentHour: string,
        // priority id
        public priorityid: number,
        // category id
        public categoryid: number,
        // assignee id
        public assigneeid: number,
        // ticket status id
        public ticketStatusid: number,

        // - customFilename = "": if user did not attach file or
        //                          attached file size exceeds max allowed file size(>10MB)
        // - customFilename = timestamp + UUID + extension(ex: .jpg): if user has attached file
        // ex: customFilename = "20230405143231_3ed7c8ea-114e-4c1f-a3d3-8e5a439e9aff.jpg".
        public customFilename: string,

        // originalFilename.
        // ex: originalFilename = 'abc.png'
        public originalFilename: string,

        //
        // the following fields are for tooltips
        //

        // currentDatetime
        public currentDatetime: Date,
        // resolveIn
        public resolveIn: number,
        // sla(service level agreement)
        public sla: string,

        // ex: spentDayHhmm = "3 days 5 hours 41 minutes"
        public spentDayHhmm: string


    ) {

    }

}