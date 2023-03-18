// this class contains data is received from server
export class TeamResponse {

    constructor(

        public id: number,
        public teamName: string,
        public assignmentMethod: string,

        public calendarid: number,
        public calendarName: string,

        public status: string
    ) {

    }

}