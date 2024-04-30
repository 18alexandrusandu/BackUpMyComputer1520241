import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
 isLogedIn=false;
 isAdmin=false;
 isPatient=false;
 isAssistant=false;
 id=0;
  constructor() { }
  logout()
{
  sessionStorage.clear();
  console.log("logout");
  this.isLogedIn=false;
  this.isAdmin=false;
  this.isAssistant=false;
  this.isPatient=false;
 
}

  ngOnInit(): void {
    if(sessionStorage.length==0)
    this.isLogedIn=false;
    else
    {   

      if(sessionStorage.getItem("id")!=null)
         this.id=Number(sessionStorage.getItem("id"));

      if(sessionStorage.getItem("type")!=null)
      {
        if(sessionStorage.getItem("type")=="ADMIN")
           this.isAdmin=true;
        if(sessionStorage.getItem("type")=="ASSISTANT")
           this.isAssistant=true;
        if(sessionStorage.getItem("type")=="PATIENT")
           this.isPatient=true;
      }
    
    this.isLogedIn=true;
    }




  }

}
