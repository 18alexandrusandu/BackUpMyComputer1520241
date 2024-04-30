#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClient.h>
#include<SoftwareSerial.h>
#include<stdlib.h>
#include<string.h>
#include<ArduinoJson.h>
#include <regex.h>
#include <ESP8266HTTPClient.h>
const char* ssid = "Redmi 10 2022"; //Enter SSID
const char* password = "rvbn0378";
String   server_ip="192.168.91.75";
String   server_port="8080";
String  secure="";
String  altLink="http"+secure+"://"+server_ip+":"+server_port+"/sensors/send";
String  loginLink="http"+secure+"://"+server_ip+":"+server_port+"/users/loginDevice";
String   response;
int httpCode;
HTTPClient http;
WiFiClient wifiClient; 

char buff[3000]="";
SoftwareSerial mySerial(14,10);//ENABLES rx,tx ON D5 AND S3



class Message
{
public: 
long Id=0;
String unit="beats/s";
double value;
String type="heart";
String description="measures the heart function/electrocardiogram";
long senzorId=1;

};
class SensorResponse
{  public:
   long id;
   String type;
   String name;

};
class UserResponse
{
 public: 
String username;
String type;
SensorResponse sensors[18];
int size=0;
}userData;

class UserLogin
{
 public: 
   String username;
   String password;
   long finger_id;
  boolean methodFingerPrint=false;
}logindto;
char configData[2050];
DynamicJsonDocument configJson(2048);

void read_config()
{



//mySerial.println("start config#");
int now=millis();

mySerial.readBytesUntil('#',configData,1999);
Serial.println(configData);
deserializeJson( configJson,configData);
while(true);

}

void sendLogin()
{  
   Serial.println("Send login");

   DynamicJsonDocument loginDoc(2048);
  char result[2048];
   Serial.println("Send login2");
   loginDoc["username"]=logindto.username;
   loginDoc["password"]=logindto.password;
   loginDoc["finger_id"]=logindto.finger_id;
  if(logindto.username.equals("")|| logindto.password.equals(""))
  {
   loginDoc["username"]="Alexandru.Sandu";
   loginDoc["password"]="sparta1234";
  }
  if(logindto.finger_id<0)
  {
     loginDoc["methodFingerPrint"]=false;
  }else
  {
      loginDoc["methodFingerPrint"]=true;
  }
 
  serializeJson(loginDoc,result);
  Serial.print("serialized:");
  Serial.println(result);
  

  http.begin(wifiClient,loginLink);
  http.addHeader("Content-Type","application/json" );
 httpCode= http.POST(result);
  Serial.print("httpcode:");
  Serial.print(httpCode);
if(httpCode<300 && httpCode>100)
{
   http.getString();
  response = http.getString();
  Serial.println(response);
  loginDoc.clear();
  deserializeJson(loginDoc,response);
  Serial.println(String(loginDoc["name"]));
  Serial.println(String(loginDoc["type"]));
  Serial.println(String(loginDoc["sensors"]));

  JsonArray sensors= loginDoc["sensors"].as<JsonArray>();
  Serial.println(sensors.size());
  Serial.println(String(loginDoc["name"]));
  userData.type=String(loginDoc["type"]);

   int index=0;
   userData.size=0;
  for(JsonVariant s:sensors)
  {    
        userData.sensors[userData.size].id=(long)s["id"];


        userData.sensors[userData.size].type=(String)s["type"];
        userData.sensors[userData.size].type.toLowerCase();

        userData.sensors[userData.size].name=(String)s["name"];
        userData.size++;
        index=index+1;

  }
   if(userData.type.equals("ADMIN"))
{
  Serial.print("Este admin");
  digitalWrite(9, HIGH);
  delay(1000);
  
  read_config();



}else {
Serial.println("Nu este admin:"+userData.type);
}

}

  http.end();
 

}

void read_login()
{
char result[2048];
DynamicJsonDocument loginDoc(2048);

char messageR[3000]={0};
while(mySerial.available()<=0)
{
delay(3000);
mySerial.println("start login#");
Serial.println("wait for login information... inside\0\n");
}  
int length=mySerial.readBytesUntil('#', messageR,2999);

char* endString=strchr(messageR,'}');
  
if(endString){

  Serial.println("s-a gasit");
   endString[1]=0;
}
Serial.println(messageR);
deserializeJson(loginDoc,messageR);
Serial.println((String)loginDoc["username"]);
Serial.println((String)loginDoc["password"]);
logindto.password=(String)loginDoc["password"];
logindto.username=(String)loginDoc["username"];
logindto.finger_id=(long)loginDoc["finger_id"];
}








void setup() {
  pinMode(15,OUTPUT);
  digitalWrite(15,LOW);
  pinMode(9,OUTPUT);
  digitalWrite(9,LOW);
  pinMode(10,OUTPUT);
  digitalWrite(10,LOW);
  delay(1000); 
  mySerial.begin(9600);
  Serial.begin(9600);
  Serial.print("connecting\n");
  int tries=60;
  int currentTries=0;
  delay(100);
  digitalWrite(15,HIGH);
  read_login();
  digitalWrite(15,LOW);


//read_config();

 WiFi.begin(ssid,password);

//Serial.println(ssid);
//Serial.println(password);

 while (WiFi.status() != WL_CONNECTED) 
  {
     Serial.print("*");
     Serial.println("not connected,i will try again");
      currentTries+=1;
     if(currentTries>tries)
     {
      WiFi.begin(ssid,password); 
      Serial.println(" try re-connecting\n");
       currentTries=0;
     }
     delay(1000);
  }

  Serial.println("Connected to wi-fi");
  Serial.print(WiFi.localIP());
  sendLogin();

   
}

void loop() {
    
 //Serial.println("in loop");
 while(!mySerial.available());
   buff[0]=0;
   mySerial.readBytesUntil('\0',buff,(size_t)3000);
  
   if(strchr(buff,'#'))
   {

     strchr(buff,'#')[0]='\0';
   }

   mySerial.flush();
   int flag;
   Serial.println("RECEIVED:");
   Serial.println(buff);

   DynamicJsonDocument doc(2048);

  deserializeJson(doc,buff);
  String type=(String)doc["type"];
  String unit=(String)doc["unit"];
  float value=(float)doc["value"];
  Serial.println(value);
  Serial.println(type);
  Serial.println(unit);

  delay(2000);
  Serial.println(altLink);
  http.begin(wifiClient,altLink);
  doc.clear();
  doc["Id"]=0;
  doc["value"]=value;
  
  doc["unit"]=unit;
  doc["type"]=type;
for(int i=0;i<userData.size;i++)
{   Serial.print(type+" "+userData.sensors[i].type+" "+(String)userData.sensors[i].id);
    if(userData.sensors[i].type.indexOf(type)>0)
        doc["sensorId"]=userData.sensors[i].id;
}
  Serial.print("sensor has id:");
  Serial.println((long)doc["sensorId"]);
  doc["description"]="Measures the "+type+" from sensor with id:"+(String)doc["sensorId"];

  buff[0]=0;
  serializeJson(doc,buff);
  Serial.println(buff);
  http.addHeader("Content-Type","application/json" );

  Serial.println(" sending request");
  httpCode = http.POST(buff);
  Serial.print(httpCode);
  if (httpCode != 200){
     Serial.println("Couldn't send the request, got code: " + httpCode);
    } else {
      response = http.getString();
     Serial.println("Request was sent successfully");
    }
    http.end();
    delay(5000);
}
