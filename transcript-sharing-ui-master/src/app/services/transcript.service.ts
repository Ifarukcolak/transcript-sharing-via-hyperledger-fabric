import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Transcript } from '../models/transcript.model';


@Injectable()
export class TranscriptService implements OnInit {
    path = environment.path
    
    constructor(private http: HttpClient) {
    }

    ngOnInit() {

    }

        
    getTranscript(trascriptId: string, transcripts: Transcript[]): Transcript 
    {         
        return transcripts.find(i => i.IdentityNumber == trascriptId);
    }
    getTranscripts(){
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })    
      
       return this.http.get<Transcript[]>(this.path + this.getSchoolName, {headers:headers})
      
       }
       getHistory(identity_number:string){
        const params = new HttpParams()
        .set('identity_number', identity_number)
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type','application/json');
      
       return this.http.get<Transcript[]>(this.path + this.getSchoolName+'/one/history?'+ params.toString(), {headers:headers})
      
       }
    addTranscript(Transcript: Transcript): Observable<Transcript> {
        let headers = new HttpHeaders({
          'accept': 'application/json',
          'Content-Type':'application/json'
        })  
      return this.http.post<Transcript>(this.path + this.getSchoolName, Transcript,{headers:headers})
      }
      
      deleteTranscript(Transcript: Transcript,transcripts: Transcript[]) {
        let headers = new HttpHeaders({
          'accept': 'application/json',
          'Content-Type':'application/json'
        })  
        this.http.delete<Transcript>(this.path + this.getSchoolName + '/'+Transcript.IdentityNumber,{headers:headers}).subscribe(p =>{
           transcripts.splice(
              transcripts.findIndex(p => p.IdentityNumber == Transcript.IdentityNumber),
              1
            )
            console.log(p);
            
        } );
           
      
      } 
      saveTranscript(Transcript: Transcript,transcripts: Transcript[]) {
       let object= transcripts.find(data=>{data.IdentityNumber == Transcript.IdentityNumber })
        if (object == null || object== undefined) {
          this.addTranscript(Transcript)
            .subscribe(p =>{
              transcripts.push(p)
              console.log(p);
              
            },catchError=>{
              console.log(catchError);
              
            }
            );
         } else {
          this.addTranscript(Transcript).subscribe(p => {
            transcripts.splice(
              transcripts.findIndex(p => p.IdentityNumber == Transcript.IdentityNumber),
              1,
              Transcript
            )
            console.log(p);
          },catchError=>{
            console.log(catchError);
            
          });
         }
       }
       get getSchoolName():string{
        let my_object=localStorage.getItem('school')
        return my_object
      }
}