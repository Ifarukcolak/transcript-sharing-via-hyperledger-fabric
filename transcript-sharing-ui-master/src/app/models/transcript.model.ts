import { Lectures } from './lecturers.model';

export class Transcript {
    constructor(
        public IdentityNumber?: string,
        public UniversityName?: string,
        public UniversityId?: number,
        public Department?:string,
        public Name?:string,
        public Surname?:string,
        public Period?:string,
        public BirthDate?:Date,
        public BirthPlace?:string,
        public FatherName?:string,
        public GPA?:number,
        public RegistryDate?:string,
        public RegistryType?:Date,
        public Lectures?:Array<Lectures>,

        
    ) { }
}
