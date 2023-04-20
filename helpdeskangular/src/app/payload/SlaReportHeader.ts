export class SlaReportHeader {

    constructor(

        // total of tickets from fromDate to toDate of each teamid
        public numOfTickets: number,

        // total of ontime tickets for each teamid
        public numOfOntimeTickets: number,

        // total of lated tickets for each teamid
        public numOfLatedTickets: number,

        // sla percentage
        public slaPercent: string,



    ) {

    }

}
