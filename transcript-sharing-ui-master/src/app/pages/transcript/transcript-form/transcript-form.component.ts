import { Lectures } from './../../../models/lecturers.model';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranscriptService } from 'src/app/services/transcript.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Transcript } from 'src/app/models/transcript.model';
import { Title } from "@angular/platform-browser";
import  *  as  data  from  'src/assets/transcript.json';
import  *  as  lecturData  from  'src/assets/lectur.json';

@Component({
  selector: 'app-transcript-form',
  templateUrl: './transcript-form.component.html',
  styleUrls: ['./transcript-form.component.css']
})
export class TranscriptFormComponent implements OnInit {
  TranscriptForm: FormGroup;
  Lectures: FormArray;
  editing:boolean
  checked=false
  public transcripts: Transcript[] = [];
  public lecturs: Lectures[] = [];

  public transcript :Transcript=new Transcript()

  success: boolean;
  lecturPeriod :String[] = ["2015-2016 Fall","2015-2016 Spring","2016-2017 Fall","2016-2017 Spring","2018-2019 Spring","2018-2019 Fall"]
  constructor(
    private router: Router,
    private transcriptService:TranscriptService,
    private activeRoute: ActivatedRoute,
    private fb :FormBuilder,
    private titleService: Title
    ) {this.titleService.setTitle("Add Transcript"); }
    get getControls() {
      return this.TranscriptForm.controls;
    }
  ngOnInit() {
    

    this.TranscriptForm = this.fb.group({
      IdentityNumber: new FormControl("", Validators.required),
      UniversityName: new FormControl("", Validators.required),
      UniversityId: new FormControl("", Validators.required),
      Department: new FormControl("", Validators.required),
      Name: new FormControl("", Validators.required),
      FatherName: new FormControl("", Validators.required),
      Surname: new FormControl("", Validators.required),
      Period: new FormControl("", Validators.required),
      BirthDate: new FormControl("", Validators.required),
      BirthPlace: new FormControl("", Validators.required),
      RegistryType: new FormControl("", Validators.required),
      RegistryDate: new FormControl("", Validators.required),
      Lectures: this.fb.array([ this.createItem() ])

   });
   this.editing = this.activeRoute.snapshot.params['mode'] == 'edit';  
   if(this.editing) {
    this.transcriptService.getTranscripts().subscribe(data =>{
      const array = JSON.stringify(data)
       

      let ctg = JSON.parse(JSON.parse(array))
      ctg.forEach(element => {
        this.transcripts.push(element.Record)
        
      });
      
      this.transcript = this.transcriptService.getTranscript(this.activeRoute.snapshot.params['id'],this.transcripts);
      
      this.getControls.IdentityNumber.setValue(this.transcript.IdentityNumber);    
      this.getControls.UniversityName.setValue(this.transcript.UniversityName);    
      this.getControls.UniversityId.setValue(this.transcript.UniversityId);    
      this.getControls.Department.setValue(this.transcript.Department);    
      this.getControls.Name.setValue(this.transcript.Name);    
      this.getControls.Surname.setValue(this.transcript.Surname);    
      this.getControls.Period.setValue(this.transcript.Period);    
      this.getControls.RegistryDate.setValue(this.transcript.RegistryDate);    
      this.getControls.RegistryType.setValue(this.transcript.RegistryType);    
      this.getControls.BirthDate.setValue(this.transcript.BirthDate);    
      this.getControls.BirthPlace.setValue(this.transcript.BirthPlace);    
      this.getControls.FatherName.setValue(this.transcript.FatherName);    




    })
   }
  }
  onClick(){
    let array= JSON.parse(JSON.stringify(data))
    this.transcripts=array.default    
    let number=Math.ceil( Math.random()*(this.transcripts.length));
    
    this.transcript= this.transcripts[number-1]
    this.getControls.IdentityNumber.setValue(this.transcript.IdentityNumber);    
      this.getControls.UniversityName.setValue(this.transcript.UniversityName);    
      this.getControls.UniversityId.setValue(this.transcript.UniversityId);    
      this.getControls.Department.setValue(this.transcript.Department);    
      this.getControls.Name.setValue(this.transcript.Name);    
      this.getControls.Surname.setValue(this.transcript.Surname);    
      this.getControls.Period.setValue(this.transcript.Period);    
      this.getControls.RegistryDate.setValue(this.transcript.RegistryDate);    
      this.getControls.RegistryType.setValue(this.transcript.RegistryType);    
      this.getControls.BirthDate.setValue(this.transcript.BirthDate);    
      this.getControls.BirthPlace.setValue(this.transcript.BirthPlace);    
      this.getControls.FatherName.setValue(this.transcript.FatherName);  
  }
  fileLectur(){
    if(this.lecturs.length>0){
      this.Lectures.clear()
      this.checked=true
      this.checked=false

    }
    
    let array= JSON.parse(JSON.stringify(lecturData))   
    let number=Math.ceil( Math.random()*(array.default.length));
    this.lecturs=[]
     for (let index = 0; index < number-1; index++) {
      let r = Math.ceil( Math.random()*(array.default.length-1));
      let t = array.default[r];
      if(this.lecturs.length>0){
        this.lecturs.forEach(data=>{
          if(data.Title!=t.Title){
            this.lecturs[index] = array.default[r];
          }
          else{
            let control=true
            while(control){
              r = Math.ceil( Math.random()*(array.default.length-1));
              let t = array.default[r];
              if(data.Title!=t.Title){
                this.lecturs[index] = array.default[r];
                control=false
              }
            }
          }
        })  
      }else{
        this.lecturs[index] = t;

      }
    
      }
      
    this.Lectures=this.TranscriptForm.get('Lectures') as FormArray
    for (let index = 0; index <  number-2; index++) {
      this.Lectures.push(this.createItem())
    }
    this.Lectures.patchValue(this.lecturs)

  }
  createItem(): FormGroup {
    
    return this.fb.group({
      LectureCode: '',
      Title: '',
      CRD: '',
      GRD: '',
      LecturePeriod: '',

    });
  }
  get addDynamicElement() {
    
    return this.TranscriptForm.get('Lectures') as FormArray
  }
  addItem(): void {
    
    this.Lectures=this.TranscriptForm.get('Lectures') as FormArray
    console.log(this.createItem());
          
    this.Lectures.push(this.createItem());
    console.log(this.Lectures);
    
    
  }
  onSubmit() {
      
      this.transcriptService.saveTranscript(this.TranscriptForm.value,this.transcripts,this.activeRoute.snapshot.params['id'])
      this.router.navigate(['/'+this.getSchoolName+'/transcipt']);

    
  }
  get getSchoolName():string{
    let my_object=localStorage.getItem('school')
    return my_object
  }
}
