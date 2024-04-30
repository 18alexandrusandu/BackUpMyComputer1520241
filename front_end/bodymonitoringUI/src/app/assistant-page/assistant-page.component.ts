import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { WebsocketComponent } from '../websocket/websocket.component';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-assistant-page',
  templateUrl: './assistant-page.component.html',
  styleUrls: ['./assistant-page.component.css']
})

export class  AssistantPageComponent implements OnInit {
  iconsState:any[]=[]
  baseHttp="";

  
  getUserDataUrl="users/user/";
  getPatientsUrl="users/allPatients";
  getUnAPatientsUrl="users/unassignedUsers";              
  getAPatientsUrl="users/assignedPatients/";   
  creaateAsignment="users/assign/";   
  updateAssignmentUrl="users/update/assignment"
  deleteAssignmentUrl="users/delete/assignment/"



  id=0;


  constructor(private http: HttpClient,private route: ActivatedRoute,private websocket:WebsocketComponent,
    private rclm:RuntimeConfigLoaderService) {

   this.dtTriggers[1]=new Subject<any>();
   this.dtTriggers[2]=new Subject<any>();
   this.dtTriggers[3]=new Subject<any>();
   this.dtTriggers[4]=new Subject<any>();
     }


  dtOptions:DataTables.Settings={};
  allPatients:any[]=[]
  assignedPatients:any[]=[{
    "id":"","name":"","username":"","phone":"","email":"","dateOfBirth":"","assignment":{"priority":""},"status":""}


  ]
  unassignedPatients:any[]=[
    {
      "id":"","name":"","username":"","phone":"","email":"","dateOfBirth":"","status":""
    }

  ]

  dtTriggers:Subject<any>[]=[]
  notifications:any[]=[]



  changeTimeDifference()
  {
  for(var notif of this.notifications)
  {
    var now=new Date();
    var notifTime=new Date(notif["timestamp"])
    var diff =  now.getTime()-notifTime.getTime();
  
    var hh = Math.floor(diff / 1000 / 60 / 60);
    diff -= hh * 1000 * 60 * 60;
  var mm = Math.floor(diff / 1000 / 60);
  diff -= mm * 1000 * 60;
  var ss = Math.floor(diff/ 1000);
  diff -= ss * 1000;
  if(hh>0)
    notif["timeDifference"]=String(hh)+" h "
   else
   if(mm>0)
    notif["timeDifference"]=String(mm)+" min "
     else
     notif["timeDifference"]=String(ss)+" sec"
  
  }
  
  this.notifications.sort((a,b)=>
  {
  if(new Date(a["timestamp"])<new Date(b["timestamp"]))
    return 1;
    return -1;
  
  }
  
  )
  
  
  
  
  }
  deleteNotificationUrl="notifications/delete/"
  getNotificationsUrl="notifications/user/"




getNotifications(notifs:any|undefined)
{
  setInterval(()=>this.changeTimeDifference(),1000)
          this.http.get<any>(this.baseHttp+this. getNotificationsUrl+this.id).subscribe(data=>
            {
        
                  console.log(data);
              this.notifications=data
            
        
        
            },err=>console.log(err)
          )

}








  deleteNotification(index:any)
  {
   var notifId=this.notifications[index]["id"]
   this.http.get(this.baseHttp+this.deleteNotificationUrl+notifId).subscribe(data=> window.location.reload());
   
   
  } 
  deleteAllNotifications(index:any)
{
  console.log("delete all")
 if(index<this.notifications.length-1)
{
  var notifId=this.notifications[index]["id"]
  this.http.get(this.baseHttp+this.deleteNotificationUrl+notifId).subscribe(data=>
    this.deleteAllNotifications(index+1));
}
else
if(index==(this.notifications.length-1))
{
  var notifId=this.notifications[index]["id"]
  this.http.get(this.baseHttp+this.deleteNotificationUrl+notifId).subscribe(data=>
    window.location.reload());
}

}

  
  assign(patiemtId:any)
  {
    this.http.get(this.baseHttp+this.creaateAsignment+patiemtId+"/"+this.id).subscribe
    (data=>
      {

        window.location.reload();

      });
    
  }

updateAssignment(assignment:any)
{

  this.http.post(this.baseHttp+this.updateAssignmentUrl,assignment).subscribe(data2=>
    {
      console.log(data2);
      window.location.reload();
    
    }
    );
}




 upgrade(patientId:any)
 {
  let val=Number(this.assignedPatients[patientId]["assignment"]["priority"]);
  if(val>0)
     val-=1;
     this.assignedPatients[patientId]["assignment"]["priority"]=val;
     this.updateAssignment( this.assignedPatients[patientId]["assignment"])
    



     this.assignedPatients= this.assignedPatients.sort((a,b)=> 
                 {if(a["assignment"]<b["assignment"])
                      return 1;
                      return -1;
                
                })



 }
 downgrade(patientId:any)
 {
 
   let val=Number(this.assignedPatients[patientId]["assignment"]["priority"]);
   val+=1;
   this.assignedPatients[patientId]["assignment"]["priority"]=val;
   this.updateAssignment( this.assignedPatients[patientId]["assignment"])
   this.assignedPatients= this.assignedPatients.sort((a,b)=> 
                 {if(a["assignment"]>b["assignment"])
                      return 1;
                      return -1;
                
                })

 }



  setupIcons()
  {
    let  icons=document.getElementsByClassName("viz_icon")
  if(icons)
 for(var i=0;i< icons.length;i++)
 {
    this.iconsState.push(true);

    icons[i].addEventListener("click",(element)=>
                 {
                  var element2=  element.target as HTMLElement;
                 
                    
                   console.log(element.target);
                   if(this.iconsState[i]==true)
                   {
                    element2.classList.add("fa-chevron-up");
                    element2.classList.remove("fa-chevron-down");

                    if( element2.parentElement &&   element2.parentElement.nextElementSibling)
                   {
                   
                     var element3=element2.parentElement.nextElementSibling as HTMLElement
                     element3.style.display="none"
                    this.iconsState[i]=false;

                   }
                  }
                   else
                    {
                      element2.classList.remove("fa-chevron-up");
                      element2.classList.add("fa-chevron-down");
                   


                      if( element2.parentElement &&   element2.parentElement.nextElementSibling)
                     {
                     
                      var element3=element2.parentElement.nextElementSibling as HTMLElement
                        element3.style.display="block"
                  

                     }
                      
                      this.iconsState[i]=true;
                    }
                    }

                )
 }


  }

loadData()
{
  this.http.get<any[]>(this.baseHttp+this.getPatientsUrl).subscribe(data=>
    {


      $("#tall").DataTable().destroy()


      this.allPatients=[]

   console.log("all patients:",data)
      for(let d of data)
       {
         this.allPatients.push(d);
 
       }
 
    
       this.dtTriggers[1].next("2");
    }
      
  
 
 
     );
 
 
 
 
     this.http.get(this.baseHttp+this.getUserDataUrl+String(this.id)).subscribe(
       data=>
       {
         console.log(data);
 
         var object2=JSON.parse(JSON.stringify(data));
   
        var title_name=document.getElementById("assistant_name")
        if( title_name)
        title_name.textContent=" "+object2["name"];
        console.log(object2);
  
     
       })
 
       this.http.get<any[]>(this.baseHttp+this.getUnAPatientsUrl).subscribe(
         data=>
         {
          $("#tun").DataTable().destroy()
           console.log(data);
           var temp:any=[];
           
          
           for(let d of data)
           {
            d["dateOfBirth"]= new Date(d["dateOfBirth"]).toDateString()
             temp.push(d);
            
           }

          
      
           this.unassignedPatients=temp;

           this.dtTriggers[2].next("3");
       
   
         })
 
         this.http.get<any[]>(this.baseHttp+this.getAPatientsUrl+String(this.id)).subscribe(
           data=>
           {   
             var temp:any=[];
             $("#tass").DataTable().destroy()
             for(let d of data)
             {
 
               let intermediary=d;
               let intermediary2=intermediary["asignments"] as any[];
               let intermediary3=intermediary2.filter(ass=>ass["asistantId"]==this.id)
               console.log("filtered",intermediary3);
               let intermediary4=d;
 
               intermediary4["assignment"]=intermediary3[0];
               let date=new Date(intermediary4["dateOfBirth"])
               intermediary4["dateOfBirth"]= date.toDateString()
 
 
 
 
 
              temp.push(intermediary4);
             
 
 
       
             }
             this.assignedPatients=temp;

             this.assignedPatients.sort((a,b)=>Math.sign(a["assignment"]["priority"]-b["assignment"]["priority"]))
       
         
            this.dtTriggers[3].next("2");
     
           })
}






originalAlert:any
  ngOnInit(): void {
    this.dtOptions={
      pagingType:"full_numbers",
      pageLength:10,
      processing:true
    }

    
  

    this.baseHttp=this.rclm.getConfig()["local_server_ip_port"]
    this.setupIcons();
    this.id=Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
    setInterval(this.loadData.bind(this),60000);
  

          this.getNotifications(undefined);
          this.websocket.connect(this.id, this.getNotifications.bind(this));

  }
  ngOnDestroy(): void {
    
    this.dtTriggers[1].unsubscribe();
    this.dtTriggers[2].unsubscribe();
    this.dtTriggers[3].unsubscribe();

  }

  deleteAssignment(index:any)
  {

    var asignmentsPatient:any[]=this.assignedPatients[index]["asignments"]
    var myAsssignmentsToThisPatient=asignmentsPatient.filter(a=>a["asistantId"]==this.id)
        console.log(myAsssignmentsToThisPatient);

       for(var assignment of myAsssignmentsToThisPatient){
         console.log("Asignment", assignment);
         this.http.get<any[]>(this.baseHttp+this.deleteAssignmentUrl+String(assignment.id)).subscribe(a=>{
         alert("pacient deassigned succesfully");
         window.location.reload();

        }
          )
      }

  }

}
