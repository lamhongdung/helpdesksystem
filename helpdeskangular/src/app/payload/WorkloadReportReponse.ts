export class WorkloadReportResponse {

    constructor(

        // team = id + name + assignment method
        public team: string,

        // supporter id + fullname
        public supporter: string,

        // supporter status
        public supporterStatus: string,

        // number of tickets from fromDate to toDate of each [teamid, supporterid]
        public numOfTickets: number

    ) {

    }

}
