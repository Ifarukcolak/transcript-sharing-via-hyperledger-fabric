import { Lectures } from 'src/app/models/lecturers.model';
export class Period {
    constructor( 
        public PeriodName?:string,
        public GPA?:number,     
        public Lectures?: Lectures[]
    ) { }
}
