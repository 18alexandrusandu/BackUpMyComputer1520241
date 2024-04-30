import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketComponent } from '../websocket/websocket.component';
import { RuntimeConfigLoaderModule, RuntimeConfigLoaderService } from 'runtime-config-loader';
import { DataTableDirective } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { Observable, Subject } from 'rxjs';

 const component_layout= {
  selector: 'app-admin-site',
  templateUrl: './admin-site.component.html',
  styleUrls: ['./admin-site.component.css']}

@Component( {
  selector: 'app-admin-site',
  templateUrl: './admin-site.component.html',
  styleUrls: ['./admin-site.component.css']}    )
  export class AdminSiteComponent implements OnInit {
     
    constructor(private http:HttpClient,private route: ActivatedRoute,
      private rclm:RuntimeConfigLoaderService,private Pagination: NgxPaginationModule
      
      ) { 
        this.dtTriggers[0]=new Subject<any>();
        this.dtTriggers[1]=new Subject<any>();
        this.dtTriggers[2]=new Subject<any>();
        this.dtTriggers[3]=new Subject<any>();
        this.dtTriggers[4]=new Subject<any>();



      }
  
   // dtElement: DataTableDirective 
    iconsState:any[]=[];
    init1=false;
    init2=false;
    init3=false;
    init4=false;

    baseHttp="";
  
      dtOptions:DataTables.Settings={
      pagingType:"full_numbers",
      pageLength:3,
      processing:true,
      destroy:true}
      
  
    getUserDataUrl="users/user/";
    getAssistantsUrl="users/assistants";
    getSensorsUrl="sensors";              
    getUsersUrl="users";  
    getAssignments="users/assignments"
    updateSensorUrl="sensors/update"
    deleteSensorUrl="sensors/delete"
    deleteAssignmentUrl="users/delete/assignment"
    updateAssignmentUrl="users/update/assignment"
    deleteUserUrl="users/delete"
    updateUserUrl="users/update"
    getMeasurements="sensors/measurements"




    addSensors=false
    addMeasurement=false;
    addAsignment=false;
    updateSensorCond=false;
    updateAssignmentCond=false;
    updateUserCond=false;

    createSensorUrl="sensors/create";
    creaateAsignment="users/assign/";   
    id=0;
    users:any[]=[]
    assistants:any[]=[]
    assignments:any[]=[]
    sensors:any[]=[]
    measurements:any[]=[]
    dtTriggers:Subject<any>[]=[]
    dtTriggers1:Subject<any>=new Subject<any>()
  


    setupIcons()
    {
      let  icons=document.getElementsByTagName("i");
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
    this.http.get(this.baseHttp+this.getUserDataUrl+String(this.id)).subscribe(
      data=>
      {
        console.log(data);

        var object2=JSON.parse(JSON.stringify(data));
  
       var title_name=document.getElementById("admin_name")
       if( title_name)
       title_name.textContent=" "+object2["name"];
       console.log(object2);
    

      })
      this.http.get(this.baseHttp+this.getUserDataUrl+String(this.id)).subscribe(
        data=>
        {
          console.log(data);
  
          var object2=JSON.parse(JSON.stringify(data));
    
         var title_name=document.getElementById("admin_name")
         if( title_name)
         title_name.textContent=" "+object2["name"];
         console.log(object2);
      
  
        })
        this.http.get<any[]>(this.baseHttp+this.getUsersUrl).subscribe(
          data=>
          {  

            $("#tUsers").DataTable().destroy()
            console.log(data);
               this.users=[]
           for(let d of data)
      {

         this.users.push(d);

      }


      this.dtTriggers[1].next("2")
        
    
          })
          this.http.get<any[]>(this.baseHttp+this. getAssistantsUrl).subscribe(
            data=>
            {

              $("#tassist").DataTable().destroy()

              console.log(data);
              this.assistants=[]
             for(let d of data)
        {

           this.assistants.push(d);

        }
        this.dtTriggers[2].next("2")
          
            })
            this.http.get<any[]>(this.baseHttp+this. getAssignments).subscribe(
              data=>
              {

                $("#tasignments").DataTable().destroy()
            
                this.assignments=[]
                console.log(data);
        
               for(let d of data)
          {
  
             this.assignments.push(d);
  
          }
          this.dtTriggers[3].next("2")
            
              })
              this.http.get<any[]>(this.baseHttp+this.getSensorsUrl).subscribe(
                data=>
                {
                  
                  $("#tsensors").DataTable().destroy()

                  console.log(data);
               this.sensors=[]
                 for(let d of data)
            {
    
               this.sensors.push(d);
    
            }

             this.dtTriggers[0].next("2")
              
                })
                this.http.get<any[]>(this.baseHttp+this.getMeasurements).subscribe(
                  data=>
                  {

                    $("#tMeasurements").DataTable().destroy()
                 
                    

                    console.log(data);
                    this.measurements=[]
                   for(let d of data)
              {
      
                 this.measurements.push(d);
      
              }
            
            //  $("#tMeasurements").empty()
              this.dtTriggers[4].next("2")
              // this.dtTriggers1.next("2");
                
                  })


  }


  originalAlert:any
    
    ngOnInit(): void {
   
  
     this.originalAlert= window.alert
     // window.alert =message=>console.log(message)
      console.log(this.originalAlert)

      this.id=Number(this.route.snapshot.paramMap.get('id'));
      this.setupIcons();
   
   
       this.baseHttp=this.rclm.getConfig()["local_server_ip_port"];
    

   this.loadData();
   setInterval(this.loadData.bind(this),60000)
       
      
    this.dtTriggers[1]=new Subject<any>();




    }



    getNotifs(notifs:any|undefined)
    {

    }

    updateUser(_t25: number) {

      console.log("here");
       if(this.updateUserCond==false)
           {
            this.updateUserCond=true
           }else
           {


            this.users[_t25]["name"]=
          (document.getElementById("update_user_name"+_t25) as HTMLInputElement).value
           this.users[_t25]["username"]=
          (document.getElementById("update_user_username"+_t25) as HTMLInputElement).value

          this.users[_t25]["phone"]=
          (document.getElementById("update_user_phone"+_t25) as HTMLInputElement).value
           this.users[_t25]["role"]["type"]=
          (document.getElementById("update_user_role"+_t25) as HTMLInputElement).value


          this.users[_t25]["dateOfBirth"]=
          (document.getElementById("update_user_DoB"+_t25) as HTMLInputElement).value
           this.users[_t25]["status"]=
          (document.getElementById("update_user_status"+_t25) as HTMLInputElement).value

          this.users[_t25]["email"]=
          (document.getElementById("update_user_email"+_t25) as HTMLInputElement).value
           this.users[_t25]["address"]=
          (document.getElementById("update_user_address"+_t25) as HTMLInputElement).value


        console.log("user:",this.users[_t25]);
               
         this.http.post(this.baseHttp+this.updateUserUrl,this.users[_t25]).subscribe(data2=>
          {
            console.log(data2);
            console.log("url:",this.baseHttp+this.updateUserUrl);
            console.log("data:",this.users[_t25]);
            alert("wait for something");



            window.location.reload();
          }
          );


            this.updateUserCond=false;
           }



      }
      deleteUser(_t25: number) {

        console.log("here in delete");


        var id_user_to_delete=this.users[_t25]["id"]
        this.http.get<any[]>(this.baseHttp+this.deleteUserUrl+"/"+id_user_to_delete).subscribe(
          resp=>
          {
         console.log("deleted succesfully");
         window.location.reload();
          }

        )
       
     
      }




    startaddAssignment()
    {
      this.addAsignment=true;
     
    }

    createAssignment()
    {
      this.addAsignment=false;
    }



    updateAssignment(assignmentId:any)
    {
  if(this.updateAssignmentCond)
  {
           this.assignments[assignmentId]["asistantId"]=
           Number((document.getElementById("update_assignment_asistant_id"+assignmentId) as HTMLInputElement).value)
           this.assignments[assignmentId]["patientId"]=
           Number((document.getElementById("update_assignment_patient_id"+assignmentId) as HTMLInputElement).value)
         this.http.post(this.baseHttp+this.updateAssignmentUrl,this.assignments[assignmentId]).subscribe(data2=>
          {
            console.log(data2);
            window.location.reload();
          }
          );


    this.updateAssignmentCond=false;
  }else
     {
      this.updateAssignmentCond=true;
     }

    }


    deleteAssignment(assignmentId:any)
    {
      this.http.get(this.baseHttp+this.deleteAssignmentUrl+"/"+this.assignments[assignmentId]["id"]).subscribe(data=>
        
        { window.location.reload();
          
          console.log(data)
        }
          )
      
    }
    startaddSensor()
    {
      this.addSensors=true;
     
    }

    createSensor()
    {
      this.addSensors=false;



      var data={
         "lowLimit":Number((document.getElementById("sensor_lowLimit" ) as HTMLInputElement).value),
        "highLimit":Number((document.getElementById("sensor_highLimit" ) as HTMLInputElement).value),
         "userId":Number((document.getElementById("sensor_ownerId" ) as HTMLInputElement).value),
          "type":(document.getElementById("sensor_type") as HTMLInputElement).value,
          "name":(document.getElementById("sensor_name") as HTMLInputElement).value}

    this.http.post(this.baseHttp+this.createSensorUrl,data).subscribe(data2=>
      
      {
        console.log(data2);
        window.location.reload();
      }
      );


    }
    updateSensor(sensorId:any)
    {
      if(this.updateSensorCond==false)
      {
        this.updateSensorCond=true;

      }else
      {
        this.updateSensorCond=false;
          var data={
            "id":Number((document.getElementById("update_sensor_id"+sensorId) as HTMLInputElement).value),
           "lowLimit":Number((document.getElementById("update_sensor_low_limit"+sensorId)as HTMLInputElement) .value),
           "highLimit":Number((document.getElementById("update_sensor_high_limit"+sensorId) as HTMLInputElement).value),
           "userId":(document.getElementById("update_sensor_owner"+sensorId) as HTMLInputElement).value,
            "type":(document.getElementById("update_sensor_type"+sensorId) as HTMLInputElement).value,
            "name":(document.getElementById("update_sensor_name"+sensorId) as HTMLInputElement).value,
          }





        this.http.post(this.baseHttp+this.updateSensorUrl,data).subscribe(resp=>
          {

            window.location.reload();
          })
      }
    }


    deleteSensor(sensorId:any)
    {
      this.http.get(this.baseHttp+this.deleteSensorUrl+"/"+this.sensors[sensorId]["id"]).subscribe(data=>
        
        { window.location.reload();
          
          console.log(data)
        }
          )
              
    }
  
  
  }
  
