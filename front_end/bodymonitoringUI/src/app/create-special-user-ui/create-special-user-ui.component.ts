import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: 'app-create-special-user-ui',
  templateUrl: './create-special-user-ui.component.html',
  styleUrls: ['./create-special-user-ui.component.css']
})
export class CreateSpecialUserUIComponent implements OnInit {
  baseHttp=""
  signInurl="users/createAdmin"
  signInurl2="users/createAssistant"
  signInurl3="users/signIn"

  constructor(private httpc:HttpClient, private rclm:RuntimeConfigLoaderService) { }

  ngOnInit(): void {
    this.baseHttp=this.rclm.getConfig()["local_server_ip_port"];
  }

  signIn(user:any)
  {
    var userValue =user.value;
    console.log(userValue);
     
var data={"Id":0,"name":userValue["name"],
"username":userValue["username"],
"phone":userValue["phone"],
"dateOfBirth":userValue["DoB"],
"address":userValue["address"],
"email":userValue["email"],
"password": userValue["password"],
"RoleType":userValue["type_user"]

}
  if(userValue["type_user"]=="ADMIN")
this.httpc.post(this.baseHttp+this.signInurl,data).subscribe()
  else
  if(userValue["type_user"]=="ASSISTANT")
this.httpc.post(this.baseHttp+this.signInurl2,data).subscribe()
   else
this.httpc.post(this.baseHttp+this.signInurl3,data).subscribe()
  } 

}
