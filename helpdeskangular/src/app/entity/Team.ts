import { Supporter } from "./Supporter";

export class Team {

    constructor(

        public id: number,
        public name: string,
        public assignmentMethod: string,

        // active supporters
        public supporters: Supporter[] = [],

        public status: string) {

    }

}