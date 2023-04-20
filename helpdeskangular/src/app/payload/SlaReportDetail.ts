export class SlaReportDetail {

    constructor(

        // priority = id + name + resolveIn(hours)
        public priority: string,

        // team = id + name + assignment method
        public team: string,

        // number of tickets from fromDate to toDate of each [priorityid, teamid]
        public numOfTickets: number,

        // number of ontime tickets
        public numOfOntimeTickets: number,

        // number of lated tickets
        public numOfLatedTickets: number,

        // sla percentage
        public slaPercent: string,



    ) {

    }

}
