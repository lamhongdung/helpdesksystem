export class WorkloadReportResponse {

    constructor(

        // team = id + name + assignment method
        public team: string,

        // id + fullname + status
        public supporter: string,

        // number of tickets per supporter and team
        public numOfTickets: number

    ) {

    }

}
