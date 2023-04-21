export class Last7DaysReportResponse {

    constructor(

        // weekday + day + month. ex: Fri-21/4
        public dayMonth: string,

        // number of new tickets
        public numOfNewTickets: number,

        // number of solved tickets
        public numOfSolvedTickets: number,

        // number of closed tickets
        public numOfClosedTickets: number,

        // total spent hours for 'Resolved'/'Closed' tickets
        public totalSpentHour: number


    ) {

    }

}
