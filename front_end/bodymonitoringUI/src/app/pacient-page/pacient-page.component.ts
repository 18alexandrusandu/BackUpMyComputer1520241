import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import {webSocket} from "rxjs/webSocket"
import { WebsocketComponent } from '../websocket/websocket.component';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';


@Component({
  selector: 'app-pacient-page',
  templateUrl: './pacient-page.component.html',
  styleUrls: ['./pacient-page.component.css']
})
export class PacientPageComponent implements OnInit {
  baseHttp="";

   getUserDataUrl="users/user/";
   updateUserUrl="users/update"
   deleteNoteUrl="users/note/delete/";
   deletePrescriptionUrl="users/prescription/delete/";
   deleteNotificationUrl="notifications/delete/"
   getNotificationsUrl="notifications/user/"
   getMeasurementsUrl="sensors/measurements/sensor/"
   getMeasurementsUrl2= "sensors/measurements/sensor/"

   dtTriggers:Subject<any>[]=[];


  constructor(private http: HttpClient,private route: ActivatedRoute,private websocket:WebsocketComponent,
    private rclm:RuntimeConfigLoaderService, private navigator:Router) { 
      this.dtTriggers[1]=new Subject<any>()
      this.dtTriggers[2]=new Subject<any>()
      this.dtTriggers[3]=new Subject<any>()

   

  }
  dtOptions:DataTables.Settings={
    pagingType:"full_numbers",
    pageLength:10,
    processing:true
  }
   id:any;
   isAssistant=false;
   dtTriggerSensors: Subject<any> = new Subject<any>();
   addSensors=false
   iconsState:any[]=[]
   userData:any
   tratamanete:any[]=[]
   assignment:any[]=[]
   notifications:any[]=[]
   notite:any[]=[]
   sensors:any[]=[]
   sensor_data:any;
   sensor_measurements:any[]=[]
   sensor_measurements_per_day:any[]=[]
   chosen_day:any;
   
   highcharts=Highcharts;
   chartOptions:Highcharts.Options={
    "title":{
          
      "text":"'Choose a sensor and a date to visualize data"

    },
    xAxis: {
      categories: ['']
  },
  yAxis:[ {
      title: {
          text: "Unit of measurement"
      }
  }],
    series:[
      {  data:[],
         name:"",
         type: 'spline',
       
      }],
    chart:{
        type:"spline",
    
       
    }

   
  }
  changeDataCond=false
  changeStatusCond=false
  useStatisticsCond=false;
  failed_update_empty_fields=false;
  failed_update_server_problem=false;




    setupIcons(initialState:any|undefined)
    {
      let  icons=document.getElementsByTagName("i");

      if(initialState!=undefined)
      this.iconsState=initialState
       else
       this.iconsState=[]

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

 showDataForSensor(index:number)
{
    console.log(this.sensors[index]);
    this.sensor_data=this.sensors[index];
   // this.getMeasurements();
     


}

goToChangePasword()
{

  console.log("in change passwords")
this.navigator.navigate(["changePassword/"+this.id]);

}


getMeasurementsForDateGiven()
{

  console.log("here")
   var dateInput=(document.getElementById("theDate") as HTMLInputElement).value;
      this.chosen_day=( new Date(dateInput)).toLocaleDateString()


   console.log("data:",dateInput,this.sensor_measurements)

   this.getMeasurementsForDate(dateInput)

}


display_chart()
{

   //this.select_measurements_by__provided_date(dateInput)
   this.sort_measurements_by_time()
   var labels_values=this.get_chart_time_labels_and_values()

   this.set_chart_data_and_render( labels_values)



  console.log( labels_values)
  

}





show_measurements_per_date()
{
  

  setInterval( this.getMeasurementsForDateGiven.bind(this),10000);



  this.getMeasurementsForDateGiven();

  this.display_chart();



}


average:number=0;
standard_deviation:number=0;
min:number=0;
max:number=0;

set_chart_data_and_render(data:any)
{

  if(data["values"].length>0)
{
  var copy=[...data["values"]]
  this.average =copy.reduce((a:number, b:number) => a + b)
  this.average= this.average/data["values"].length 
   this.standard_deviation=Math.sqrt(copy.map(x => Math.pow(x -this. average, 2)).reduce((a, b) => a + b) /copy.length )
 this. min=Math.min(...copy)
  this.max=Math.max(...copy)


 copy=[...data["values"]]


}

 var plotlines:any[]=
 [{
  color: 'red',
  width: 2,
  value: data["highlimit"],
  zIndex: 5,
  label:{ text:"higher Limit >="+data["highlimit"]

  }},{
color: 'blue',
width: 2,
value: data["lowlimit"],
zIndex: 5,
label:{ text:"lower Limit <=" +data["lowlimit"]

}}]

if(this.useStatisticsCond)
{
plotlines.push({
  color: 'black',
  width: 2,
  value: Number(Number(this.average).toPrecision(2)),
  zIndex: 5,
  label:{ text:"Average value/day "+Number(this.average).toFixed(2),
  align: 'right'}}
  )
   

  plotlines.push( {
    color: 'black',
    width: 2,
    value:Number(this.average-this.standard_deviation),
    zIndex: 5,
    label:{ text:"-1 standard deviation "+ Number(this.average-this.standard_deviation).toFixed(2),
    align: 'right',
   

    }
})

plotlines.push({
color: 'black',
width: 2,
value:Number(this.average+this.standard_deviation),
zIndex: 5,
label:{ text:"+1 standard deviation  "+ Number(this.average+this.standard_deviation).toFixed(2),
align: 'right',


}
})

}

   
  this.chartOptions={
    "title":{
          
      "text":data["title"],

    },
    xAxis: {
      categories: data["labels"],
      title:{
        text: "Hours"
       },
  },
  yAxis:[ {
      title: {
          text: data["yAxis"]
      },
      plotLines: plotlines
  }],

    series:[
      {  data:this.preprocesData(
         data["values"],Number(data["highlimit"]),Number(data["lowlimit"])),
         name:data["series"],
         type: 'spline',
         //color: '#00FF00',
         zoneAxis: 'y',
         zones: this.createZonesFromData(
          data["values"],Number(data["highlimit"]),Number(data["lowlimit"])

         )
       
      }],
    chart:{
        type:"spline",
    
       
    }



    }
}
useStatistics()
{
 if(this.useStatisticsCond==true)
 {
  this.useStatisticsCond=false;
  this.show_measurements_per_date()
 }
 
   else
   {
    this.useStatisticsCond=true;  
    this.show_measurements_per_date()
    this.show_measurements_per_date() 
   }
  

}


preprocesData(data:any,highlimit:any,lowlimit:any):any[]
{
  var newArray:any[]=[]
  console.log("lowLimnit",lowlimit);
  for(let d of data)
 {
     if(d>highlimit)
     {
      newArray.push({"y":d,"color":"red"})
     }else
     if(d<=lowlimit)
     {
      newArray.push({"y":d,"color":"blue"})
     }else
     {
      newArray.push({"y":d,"color":"green"})
     }



 }


 return  newArray;
}
createZonesFromData(data:any[],highlimit:any,lowlimit:any):any[]
{
  var zones=[]

  zones.push({"value":Number(lowlimit),"color":"blue"})
  zones.push({"value":Number(highlimit),"color":"green"})
  zones.push({"color":"red"})

return zones;
}



get_chart_time_labels_and_values():any
{
  var labels=[]
  var values=[]
  var day=""
  day=this.chosen_day
  for(let d of this.sensor_measurements_per_day)
  {
     var dateToParse=d["timestamp"];
     
     var DateForm=new Date(dateToParse)
     var label = DateForm.toLocaleTimeString();
  
    
     labels.push(label)
     values.push(Number(d["value"]))
   }

   var yAxis="unit of measurement"
   if( this.sensor_measurements_per_day &&  this.sensor_measurements_per_day.length>0)
   yAxis= this.sensor_measurements_per_day[0]["unit"]

     return {
      "labels":labels,
      "series":"Data for "+day,
      "title": "Data for "+this.sensor_data["name"],
      "values":values,
      "yAxis":yAxis,
      "lowlimit":this.sensor_data["lowLimit"],
      "highlimit":this.sensor_data["highLimit"]
     }


}

sort_measurements_by_time()
{
  this.sensor_measurements_per_day.sort((a,b)=>{
       var da=new Date(a["timestamp"])
       var db=new Date(b["timestamp"])

       if( da>db)
          return 1;

          return -1;

  })

}

select_measurements_by__provided_date(dateInput:any)
{
    var referenceDate=new Date(dateInput);
   console.log("reference", referenceDate)
   this.sensor_measurements_per_day=[];
   for(let d of this.sensor_measurements)
{
   var dateToBeCompared=d["timestamp"];
   console.log("dTc",dateToBeCompared);
   var DateForm=new Date(dateToBeCompared)
   if(DateForm.toDateString()==referenceDate.toDateString())
   {
     this.sensor_measurements_per_day.push(d);
   }

}

}

getMeasurements()
{
this.http.get<any[]>(this.baseHttp+this.getMeasurementsUrl+this.sensor_data["id"]).subscribe(
 data=>
 {
  console.log("measurements:",data);
  this.sensor_measurements=data;
 this. show_measurements_per_date();
 }



)

}
getMeasurementsForDate(date:any)
{
this.http.get<any[]>(this.baseHttp+this.getMeasurementsUrl2
   +this.sensor_data["id"]+"/date/"+date).subscribe(
 data=>
 {
  console.log("measurements:",data);
  this.sensor_measurements_per_day=data;
 this.display_chart();
 }



)

}


deleteNotification(index:any)
{
 var notifId=this.notifications[index]["id"]
 this.http.get(this.baseHttp+this.deleteNotificationUrl+notifId).subscribe(data=> window.location.reload()); 
} 

deleteAllNotifications(index:any)
{
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

addNote()
{
  this.navigator.navigate(["/createnote/"+this.id])
}

updateNote(index:any)
{
  console.log(this.notite[index]);
  var nId=this.notite[index]["Id"]
  this.navigator.navigate(["/updatenote/"+nId+"/"+this.id])

}
deleteNote(id:any)
{
  this.http.get(this.baseHttp+this.deleteNoteUrl+this.notite[id]["id"]).subscribe(data=> window.location.reload());
}

deleteAllNote()
{
  for(var i=0;i<this.notite.length-1;i++)
{
  this.http.get(this.baseHttp+this.deleteNoteUrl+this.notite[i]["Id"]).subscribe();
}

if(this.notite.length>0)
  this.http.get(this.baseHttp+this.deleteNoteUrl+this.notite[this.notite.length-1]["Id"]).subscribe(data=>
window.location.reload());
}

addPrescription()
{
  this.navigator.navigate(["/createprescription/"+this.id])
}

updatePrescription(index:any)
{ 
   var tratament=this.tratamanete[index]

  this.navigator.navigate(["/updateprescription/"+ tratament["id"]+"/"+this.id])


}
deletePrescription(index:any)
{
  this.http.get(this.baseHttp+this.deletePrescriptionUrl+this.tratamanete[index]["id"]).subscribe(data=> window.location.reload());
}

deletePrescriptions()
{

  for(var i=0;i<this.tratamanete.length-1;i++)
{
  this.http.get(this.baseHttp+this.deletePrescriptionUrl+this.tratamanete[i]["id"]).subscribe();
}

if(this.tratamanete.length>0)
  this.http.get(this.baseHttp+this.deleteNoteUrl+this.tratamanete[this.notite.length-1]["id"]).subscribe(data=>
window.location.reload());
}


addSensor(){
  this.addSensors=false;

}
start_addSensor()
{
  this.addSensors=true;

}
getNotifications(notifs:any | undefined)
{

  this.http.get<any>(this.baseHttp+this. getNotificationsUrl+this.id).subscribe(data=>
    {

          console.log(data);
      this.notifications=data
      


    },err=>console.log(err)
  )
}

loadData()
{
  this.http.get(this.baseHttp+this.getUserDataUrl+this.id).subscribe(
    data=>
    {
      console.log(data);

      var object2=JSON.parse(JSON.stringify(data));
     {
       var date=new Date(object2["dateOfBirth"])
       object2["dateOfBirth"]=date.toDateString();
    

     }
  

    

     $("#notes_table").DataTable().destroy()

     for(var note of object2["notes"])
     {

     note["date"]=new Date(note["date"]).toDateString();

     }


    this.notite=object2["notes"]
    this.dtTriggers[3].next("2")


    $("#treatments_Table").DataTable().destroy()
   for(var presciption of object2["prescriptions"])
     {
      presciption["startDate"]=new Date(presciption["startDate"]).toDateString();
      presciption["endDate"]=new Date(presciption["endDate"]).toDateString();
     }

    this.tratamanete=object2["prescriptions"]

   

    this.dtTriggers[2].next("2")

    this.userData=object2



    $("#sensors_table").DataTable().destroy()
   
    this.sensors=object2["sensors"] 
    this.dtTriggers[1].next("2")

    var assistents= document.getElementById("assistants")

    if( assistents)
    assistents.textContent=""
    for(let assignment of object2["asignments"])
    {

      this.http.get<any>(this.baseHttp+this.getUserDataUrl+assignment["asistantId"]).subscribe(data=>{
 
     console.log("assistent:"+data["name"])
   
       console.log( assignment)
      
     if( assistents)
     assistents.textContent+=" "+data["name"]+" tel.:"+data["phone"]+ "\r\n"+ " email:"+data["email"]

      })

    }

      console.log(object2);
    })
  
}

  ngOnInit(): void {



    this.dtOptions={
      pagingType:"full_numbers",
      pageLength:10,
      processing:true
    }

    this.baseHttp=this.rclm.getConfig()["local_server_ip_port"]
   //update icons
  
      this.setupIcons(undefined);

   
    //  setInterval(this.loadData.bind(this), 60000);
     // setInterval(this.getMeasurements.bind(this).bind(document), 5000);

  //fetch data
  this.id=this.route.snapshot.paramMap.get('id');
  this.loadData()
  setInterval(this.loadData.bind(this), 60000);
 
  console.log(this.baseHttp+this. getNotificationsUrl+this.id)
 
  

   
   
      setInterval(()=>this.changeTimeDifference(),1000)
     this.getNotifications(undefined)
    
    if(sessionStorage.getItem("type") && sessionStorage.getItem("type") =="ASSISTANT")
          this.isAssistant=true;
          this.websocket.connect(this.id,this.getNotifications.bind(this));
 
  }

  changeData(form:any)
  {


    var formdData=form.value;
    console.log("form:",form.value)
   if(this.changeDataCond==false)
   {
    this.changeDataCond=true;

   }
   else
  { this.failed_update_empty_fields=false;
        if(formdData["name"]=="" || 
        formdData["username"]=="" ||
        formdData["phone"]==""||
        formdData["DoB"]==""||
        formdData["email"]==""||
        formdData["address"]==""
        )
       {
        this.failed_update_empty_fields=true;
        return;

       }

    this.userData["name"]=formdData["name"]
    this.userData["username"]=formdData["username"]
    this.userData["phone"]=formdData["phone"]
    this.userData["dateOfBirth"]=formdData["DoB"]
    this.userData["email"]=formdData["email"]
    this.userData["address"]=formdData["address"]
    this.failed_update_server_problem=false;

    this.http.post(this.baseHttp+this.updateUserUrl, this.userData).subscribe(data2=>
      {
        console.log(data2);
        window.location.reload();
      },err=>  this.failed_update_server_problem=true
      );


    this.changeDataCond=false;

  }

  }


changeStatus(form:any)
{


  var formdData=form.value;
  console.log("form:",form.value)
 if(this.changeStatusCond==false)
 {
  this.changeStatusCond=true;

 }
 else
{



   console.log("here",this.userData)
 
  this.userData["dateOfBirth"]=new Date(this.userData["dateOfBirth"]);

  this.userData["status"]=formdData["status"]

  console.log("there",this.userData)

  this.http.post(this.baseHttp+this.updateUserUrl, this.userData).subscribe(data2=>
    {
      console.log(data2);
      window.location.reload();
    },err=>  {this.failed_update_server_problem=true;console.log(err);}
    );



    this.changeStatusCond=false;

}

}

}
