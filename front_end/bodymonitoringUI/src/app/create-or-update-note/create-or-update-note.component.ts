import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: 'app-create-or-update-note',
  templateUrl: './create-or-update-note.component.html',
  styleUrls: ['./create-or-update-note.component.css']
})
export class CreateOrUpdateNoteComponent implements OnInit {

  constructor(private http: HttpClient,private route: ActivatedRoute,
    private rclm:RuntimeConfigLoaderService) { }
    createOrUpdateCond=false;
    createUrl="users/note/create"
    updateUrl="users/note/update"
    getUrl="users/note"
    baseUrl=""
    userId:any
    noteId:any
    note:any;
        createOrUpdate()
    {
    





    if(this.createOrUpdateCond==true)
   {

    var data={
     "Id":0,
     "userId":this.userId,
     "date": new Date(),
    "description":(document.getElementById("description") as HTMLTextAreaElement).value,
     "text":(document.getElementById("text") as HTMLTextAreaElement).value

    }
    this.http.post( this.baseUrl+this.createUrl,data).subscribe(resp=>window.location.reload())
 


   }else
   {

    var data2={
      "Id":this.note["Id"],
      "userId": this.userId,
      "date": (document.getElementById("date") as HTMLTextAreaElement).value,
     "description":(document.getElementById("description") as HTMLTextAreaElement).value,
      "text":(document.getElementById("text") as HTMLTextAreaElement).value
 
     }
     this.http.post( this.baseUrl+this.updateUrl,data2).subscribe(resp=>window.location.reload())
  
 


   }



    }


  ngOnInit(): void {




    this.baseUrl=this.rclm.getConfig()["local_server_ip_port"]
    console.log(this.route.snapshot.url[0].path)
const re1 = /create./;
const re2= /update./;
this.createOrUpdateCond= re1.test(this.route.snapshot.url[0].path)

    console.log(this.createOrUpdateCond)

    console.log(this.route.snapshot.paramMap.get('id'))
    if(this.createOrUpdateCond)
    {
      this.userId=this.route.snapshot.paramMap.get('id')
      
    }else
    {
      this.noteId=this.userId=this.route.snapshot.paramMap.get('id')
      this.userId=this.route.snapshot.paramMap.get('userId')
      this.http.get<any>( this.baseUrl+this.getUrl+"/"+ this.noteId).subscribe(resp=>{
        this.note=resp;
         
        var dateInput=(new Date(this.note["date"])).toISOString()
        dateInput=dateInput.substring(0,dateInput.length-1)
        console.log(this.note);

        (document.getElementById("date") as HTMLInputElement).value= dateInput

        
        
      })



    }

  }

}
