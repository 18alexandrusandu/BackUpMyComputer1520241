import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: 'app-change-password-component',
  templateUrl: './change-password-component.component.html',
  styleUrls: ['./change-password-component.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private http:HttpClient,  private rclm:RuntimeConfigLoaderService,private route:ActivatedRoute) { }
  baseHttp="";
  

  ngOnInit(): void {
    this.baseHttp=this.rclm.getConfig()["local_server_ip_port"];


  }

  sendEmailUrl="users/changePassword/"
  getUserUrl="users/changePassword/seconsStep/"
  updateUrl="users/changePassword/update"
  confirmation="users/changePassword/succesConfirmation/"

  user:any
  email:any
  password:any
  code:any
  sendEmailForCode()
  {
    console.log("will send email for code");
    var username=document.getElementById("username") as HTMLInputElement;
    var password=document.getElementById("password") as HTMLInputElement;
   this.email=username.value
   this.password=password.value
    this.http.get<any>(this.baseHttp+ this.sendEmailUrl+username.value).subscribe(resp=>
      {console.log("responsde:"+resp);
       this.code=String(resp);
    
       },err=>
       {
        var ErrorsP= document.getElementById("errors")
         if(ErrorsP)
         {
           ErrorsP.textContent=err.toString()

         }
        console.log(err)
        
        
       });





  }
 changePassword()
 {
  var ErrorsP= document.getElementById("errors")
  var SuccessP=document.getElementById("success")
  console.log("change password");
  var Requested:any=document.getElementById("code") as HTMLInputElement;
  Requested=Requested.value
  if( this.code!=null && this.code!='' && this.code==Requested)
  {
    console.log("codes match");
    if(ErrorsP)
    ErrorsP.textContent=""

    this.http.get<any>(this.baseHttp+this.getUserUrl+this.email+"/"
    +Requested+"/"+this.code
    
    ).subscribe(
       resp=>
       {
        this.user=resp;
        if(SuccessP)
        SuccessP.textContent="Received user data"
      
        this.user["password"]=this.password;

        this.http.post<any>(this.baseHttp+this.updateUrl,this.user
        
        ).subscribe(resp=>{

          if(SuccessP)
          SuccessP.textContent="Changed pasword for username:"+this.user["username"]
         +" successfully "
         this.http.get<any>(this.baseHttp+this.confirmation +this.user["email"]).subscribe();


        },
          err=>{
            if(ErrorsP)
            {
              ErrorsP.textContent="could not chnge user:" +this.user["username"]
              +" password"
   
            }
            if(SuccessP)
            SuccessP.textContent=""

          }


        )



       }

      ,err=>
      {
      console.log(err)
      if(ErrorsP)
      {
        ErrorsP.textContent="Could not receive user data for accounr pointed by email"

      }
      if(SuccessP)
      SuccessP.textContent=""

      })




  

  }else
    {
     
    if(ErrorsP)
         {
           ErrorsP.textContent="Code provided does not match the sended code"

         }
    }


 }




}
