import { Period } from './../../models/period.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Transcript } from 'src/app/models/transcript.model';
import { Lectures } from 'src/app/models/lecturers.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TranscriptService } from 'src/app/services/transcript.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { VirtualTimeScheduler } from 'rxjs';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  public transcripts: Transcript[] = [];
  public lecturers: Lectures[] = [];
  indentyNumber: string
  public loading = false
  public lecturPeriod: Period[] = []
  public index: number
  public lectur: Lectures[] = []; 
  public productsPerPage = 5;
  public selectedPage = 1;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSourceLecturer = new MatTableDataSource<Lectures>()

  constructor(private transcriptService: TranscriptService, private titleService: Title) {
    this.titleService.setTitle("Transcript History");
  }

  displayedColumnsLecturer: string[] = [
    "LectureCode",
    "Title",
    "CRD",
    "GRD",
  ];


  get getSchoolName(): string {
    let my_object = localStorage.getItem('school')
    return my_object
  }

  ngOnInit() {

  }
  getLectures(i: number) {
    this.lecturPeriod = []
    this.lecturers = []

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
  getSearch() {
    this.transcripts = []
    this.transcriptService.getHistory(this.indentyNumber).subscribe(
      response => {

        response.forEach(element => {
          this.transcripts.push(element)
        });

      })
  }
  get transcriptsPage():Transcript[]{
    let index = (this.selectedPage - 1) * this.productsPerPage;

    return this.transcripts.slice(index, index + this.productsPerPage)

  }
   pageNumbers(): number[] 
  {
      return Array(Math.ceil(this.transcripts.length / this.productsPerPage))
          .fill(0) // ilk basta dizinin index degeri 0 elemanina esitliyoruz
          .map((a, i) => i + 1); // sonrasinda tum elemanlari gezip onlari 1 artiriyoruz..
  }

  changePage(p: number) 
  {
      this.selectedPage = p;
  }

}
