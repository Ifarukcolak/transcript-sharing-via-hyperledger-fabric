import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranscriptService } from 'src/app/services/transcript.service';
import { Transcript } from 'src/app/models/transcript.model';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Lectures } from 'src/app/models/lecturers.model';
import { Period } from 'src/app/models/period.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-examine',
  templateUrl: './examine.component.html',
  styleUrls: ['./examine.component.css']
})
export class ExamineComponent implements OnInit {
  public transcripts :Transcript[]=[]
  TranscriptForm: FormGroup;
  public transcript :Transcript=new Transcript()
  public lectur: Lectures[] = []; 
  public lecturPeriod: Period[] = []
  displayedColumnsLecturer: string[] = [
    "LectureCode",
    "Title",
    "CRD",
    "GRD",
  ];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSourceLecturer = new MatTableDataSource<Lectures>()

  constructor(  private router: Router,
    private transcriptService:TranscriptService,
    private activeRoute: ActivatedRoute,
    private fb :FormBuilder,
    ) { }

  ngOnInit() {
    this.transcriptService.getOne(this.activeRoute.snapshot.params['id']).subscribe(response => {
      
     
      response.forEach(element => {
        this.transcripts.push(element)
        this.transcript=element 
      });
  
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
      this.getLectures(0)
    })
    this.TranscriptForm = this.fb.group({
      IdentityNumber: new FormControl("", ),
      UniversityName: new FormControl("", ),
      UniversityId: new FormControl("",),
      Department: new FormControl("", ),
      Name: new FormControl("", ),
      FatherName: new FormControl("",),
      Surname: new FormControl("",),
      Period: new FormControl("", ),
      BirthDate: new FormControl("", ),
      BirthPlace: new FormControl("", ),
      RegistryType: new FormControl("",),
      RegistryDate: new FormControl("",),

   });
       
     

  }
  getLectures(i: number) {
    this.lecturPeriod = []
    this.lectur = []

    this.transcripts[i].Lectures.forEach(data => {
      let isUsed = false

      //control the lecturePeroid List
      this.lecturPeriod.forEach(lectPeriod => {
        if (data.LecturePeriod == lectPeriod.PeriodName)
          isUsed = true
      })

      if (!isUsed) {
        let period = new Period()
        period.PeriodName = data.LecturePeriod
        period.GPA = data.GPA
        period.Lectures = []
        this.lecturPeriod.push(period)
      }



    })

    

    this.lecturPeriod.forEach(genericPeriod => {
      this.transcripts[i].Lectures.forEach(data => {

        if (genericPeriod.PeriodName == data.LecturePeriod) {
          genericPeriod.Lectures.push(data)
        }
      })

    })

  }
  getlectur(lectur: Lectures[]) {
    this.lectur = lectur
    this.dataSourceLecturer = new MatTableDataSource<Lectures>(this.lectur);
    this.dataSourceLecturer.paginator = this.paginator;
  }
  get getControls() {
    return this.TranscriptForm.controls;
  }
}
