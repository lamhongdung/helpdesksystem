import { DropdownResponse } from "./DropdownResponse";
// import { Supporter } from "./Supporter";

// this class contains data is submited from client
export class Team {

    constructor(

        public id: number,
        public name: string,
        public assignmentMethod: string,

        // active supporters
        // public supporters: Supporter[] = [],
        public supporters: DropdownResponse[] = [],

        public status: string
    ) {

    }

}