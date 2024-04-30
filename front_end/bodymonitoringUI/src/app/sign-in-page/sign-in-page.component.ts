import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css']
})
export class SignInPageComponent implements OnInit {
  baseHttp="http://192.168.100.24:8080/";

   sigInurl="users/signIn";
   httpc:HttpClient;

  constructor(http: HttpClient,private rclm:RuntimeConfigLoaderService) { this.httpc=http}

  ngOnInit(): void {
    this.baseHttp=this.rclm.getConfig()["local_server_ip_port"]
  }
failed=false
success=false
signIn(user: any )
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
" RoleType":"PATIENT"

}

this.httpc.post(this.baseHttp+this.sigInurl,data).subscribe(resp=>this.success=true,err=>this.failed=true)


}



}