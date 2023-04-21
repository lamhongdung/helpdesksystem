export class Last7DaysReportResponse {

    constructor(

        // priority = id + name + resolveIn(hours)
        public dayMonth: string,

        // team = id + name + assignment method
        public numOfNewTickets: number,

        // number of tickets from fromDate to toDate of each [priorityid, teamid]
        public numOfSolvedTickets: number,

        // number of ontime tickets
        public numOfClosedTickets: number,

        // number of lated tickets
        public totalSpentHour: number



    ) {

    }

}
