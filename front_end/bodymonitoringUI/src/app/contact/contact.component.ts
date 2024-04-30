import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: []
})
export class ContactComponent implements OnInit {

  constructor(private http:HttpClient,  private rclm:RuntimeConfigLoaderService) { }
  dtOptions:DataTables.Settings={};
  admins:any[]=[]

  dtTrriger= new Subject<any>()
  baseHttp="";

  getAdminContactDataUrl="users/admins";



  ngOnInit(): void {
    this.dtOptions={
      pagingType:"full_numbers",
      pageLength:10,
      processing:true
    }
    this.baseHttp=this.rclm.getConfig()["local_server_ip_port"];
    this.http.get<any[]>(this.baseHttp+this.getAdminContactDataUrl)
    .subscribe(data=>
      {
         for(let d of data)
           this.admins.push(d)

         this.dtTrriger.next("2")
      }
      
      
      
      )


}
}
