import { Component, OnInit, ViewChild } from '@angular/core';
import { Transcript } from 'src/app/models/transcript.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TranscriptService } from 'src/app/services/transcript.service';
import { Lectures } from 'src/app/models/lecturers.model';
import { element } from 'protractor';
@Component({
  selector: 'app-transcript-list',
  templateUrl: './transcript-list.component.html',
  styleUrls: ['./transcript-list.component.css']
})
export class TranscriptListComponent implements OnInit {
  public transcripts: Transcript[] = [];
  public lecturers: Lectures[] = [];
 
  public loading = false
  displayedColumns: string[] = [
    "IdentityNumber",
    "UniversityName",
    "Department",
    "Name",
    "Surname",
    "action"
  ];
  displayedColumnsLecturer: string[] = [
    "LectureCode",
    "Title",
    "CRD",
    "GRD",
  ];
  dataSource = new MatTableDataSource<Transcript>()
  dataSourceLecturer = new MatTableDataSource<Lectures>()

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private transcriptService :TranscriptService) 
    {
      
     }
     deleteTrancript(transcript: Transcript) {
      this.transcriptService.deleteTranscript(transcript,this.transcripts);
      this.dataSource = new MatTableDataSource<Transcript>(this.transcripts);
      this.dataSource.paginator = this.paginator;
     }
  getSelected(id:string){
    console.log(id);
    
    this.lecturers=[]
  //   console.log(JSON.parse(JSON.stringify(this.transcripts.find(data =>{
  //   data.IdentityNumber==id
  // }).Lectures) ));
  this.transcripts.forEach(data=>{
    if(data.IdentityNumber==id){
      
      this.lecturers=data.Lectures
      const array = JSON.stringify( this.lecturers)
         
  
      let ctg = JSON.parse(JSON.parse(array))      
      console.log(ctg);
      
      this.lecturers=ctg
    }
  
    
  })
       
    this.dataSourceLecturer = new MatTableDataSource<Lectures>(this.lecturers);      
    this.dataSourceLecturer.paginator = this.paginator;

  }
 get getSchoolName():string{
    let my_object=localStorage.getItem('school')
    return my_object
  }
  ngOnInit() {
  
  
    this.transcriptService.getTranscripts().subscribe(
      response => {
        const array = JSON.stringify(response)
       

        let ctg = JSON.parse(JSON.parse(array))
        ctg.forEach(element => {
          this.transcripts.push(element.Record)
          
        });
          
          
         this.dataSource = new MatTableDataSource<Transcript>(this.transcripts);      
         this.dataSource.paginator = this.paginator;

      })
  }

}
