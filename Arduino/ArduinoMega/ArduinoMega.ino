/*
    LCD_I2C - Arduino library to control a 16x2 LCD via an I2C adapter based on PCF8574

    Copyright(C) 2020 Blackhack <davidaristi.0504@gmail.com>

    This program is free software : you can redistribute it and /or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.If not, see < https://www.gnu.org/licenses/>.
*/
#include<SoftwareSerial.h>
#include <Adafruit_Fingerprint.h>
#include<DHT.h>
#include "Keypad.h"
#include <LCD_I2C.h>
#include<SoftWire.h>
#include<Wire.h>
#define Lom 10  
#define Lop 11
#define pinAdmin 5

void(*resetFunc)(void)=0;
SoftwareSerial mySerial(12,13);
SoftwareSerial mySerial2(22, 24); // RX,TX 
char ssid[50],pass[200],server_ip[50];
LCD_I2C lcd(0x27, 16, 2);
DHT dht2(A2,DHT11);  


int capsOn=0;
int mode=0;
int nr_chars=0;
int total_chars=0;
int enter=0;


const byte ROWS = 4; // rows
const byte COLS = 4; // columns
 // Default address of most PCF8574 modules, change according
char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'.','0',' ','D'}
};


byte rowPins[ROWS] = {52,50,48,46}; //connect to the row pinouts of the keypad
byte colPins[COLS] = {44,42,40,38}; //connect to the column pinouts of the keypad
Keypad customKeypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS);
char kept_prompt[50]="";
void cleanLine(int line)
{
lcd.setCursor(0,line);
lcd.print("                ");
lcd.setCursor(0,line);

}
int beat_old=0;
float BPM = 0;
int beatIndex=0;
float beats[500] = {0};
float threshold = 620;  //Threshold at which BPM calculation occurs
boolean belowThreshold = true;


int logedIn=0;

String prompt;




byte heart[8] = {
	0b00000,
	0b01010,
	0b11111,
	0b11111,
	0b01110,
	0b00100,
	0b00000,
	0b00000
};

class User
{
  
   public: 
String username;
String password;
int finger_id=-1;
String type;
};
User newUser=User();

char buff[3001];
char internalbuffer[80]={0};
int  read_keyboard(char* prompt=NULL,int password=0){
 //Serial.println("keyboard");
 if(prompt!=NULL)
 if(strcmp(prompt,kept_prompt)!=0)
 {
  cleanLine(0);
  lcd.print(prompt);
  strcpy(kept_prompt,prompt);
 }
 int returnvalue=0;
 char keypad_char_input= customKeypad.getKey();
  
  if(keypad_char_input)
     {
         Serial.print(keypad_char_input);   
        returnvalue=1;
     if(keypad_char_input=='A')
      {
        enter=1;
        Serial.println("Entered");
        internalbuffer[total_chars+1]=0;
        total_chars=0;
        nr_chars=0;

      }else
    if(keypad_char_input=='D' )
    {
 
       internalbuffer[total_chars-1]=' ';
       total_chars--;  
       nr_chars--;

       //other scope
       lcd.setCursor(0, 1);
          if(nr_chars>16)
           {
                if(password)
               { for(int i=0;i<strlen(internalbuffer+nr_chars-16);i++)
                 lcd.print("*");
               }
               else
               {
                lcd.print( internalbuffer+nr_chars-16 );
               }
         
           }
              else
           {
                if(password)
               { for(int i=0;i<strlen(internalbuffer);i++)
                  lcd.print("*");
               }else
               { 
                 lcd.print( internalbuffer );   
               }
           }
    }
     else
       if(keypad_char_input=='B')
         {
          capsOn=!capsOn;
         }
         else 
          if(keypad_char_input=='C')
         {
          mode=(mode+1)%4;
         }else {
               
              total_chars++;
              nr_chars++;
          if(mode>0 && keypad_char_input!='.' && keypad_char_input!=' ')
          {
             if(keypad_char_input=='0')
             {
               switch (mode) {
                 case 1: 
                  keypad_char_input='_';
                  break;
                  case 2:
                  keypad_char_input='@';
                  break;
                  case 3:
                  keypad_char_input='*';
                  break;
                  default:
                   keypad_char_input=keypad_char_input; 
                   break;
                  }
              }
                  else
               if(capsOn)
             {
             
               keypad_char_input+=-'1'+'A'+(mode-1)*9;
             }else {
               keypad_char_input+= -'1'+'a'+(mode-1)*9;
             }
             
         }
          internalbuffer[total_chars-1] = keypad_char_input;

        
          cleanLine(1);

              if(nr_chars>16)
           {
                if(password)
               { for(int i=0;i<strlen(internalbuffer+nr_chars-16);i++)
                 lcd.print("*");
               }
               else
               {
                lcd.print( internalbuffer+nr_chars-16 );
               }
         
           }
              else
           {
                if(password)
               { for(int i=0;i<strlen(internalbuffer);i++)
                 lcd.print("*");
               }
              lcd.print( internalbuffer );

           }
        
          Serial.print(keypad_char_input);
         }
  


    
   }
  return returnvalue;
}


int reconfigured=0;
void setup()
{   
    logedIn=0;
    reconfigured=0;
    pinMode(Lop,INPUT);//heart inpout
    pinMode(Lom ,INPUT);//heart input
    pinMode(Lom ,OUTPUT);
    dht2.begin();
    
    pinMode(7,INPUT);
    Serial.begin(9600);
    mySerial.begin(9600);

    lcd.begin();
    lcd.createChar(0, heart);
    lcd.backlight();
    lcd.clear();
    lcd.print("Login"); 

    app_login();
    int n=0;
  
    lcd.clear();
    lcd.println("Wait wi-fi:");
     int val= digitalRead(7);
       
    Serial.println("wi-fi is ready");
    mySerial.println(buff);
    
}




void configure()
{    reconfigured=1;
     enter=0;
     Serial.println("in config");
     lcd.clear();
     lcd.setCursor(0,0);
     lcd.print("config:");

    do{
     read_keyboard("WI-FI name:",50);
     }while(!enter);
     enter=0;
     strcpy(ssid,internalbuffer);

     do{
     read_keyboard("Ip of server:",50);
      }while(!enter);  
     strcpy(server_ip,internalbuffer);

      enter=0;
      do{
     read_keyboard("password",200);
        }while(!enter);
    strcpy(pass,internalbuffer);

    strcpy(buff,"{ssid:\"");
    strcat(buff,ssid);
    strcat(buff,"\",");
    strcat(buff,"password:\""); 
    strcat(buff,pass); 
    strcat(buff,"\",");
    strcat(buff,"server_ip:"); 
    strcat(buff,server_ip); 
    strcat(buff,"\"}#"); 
    mySerial.print(buff);

}


void cleanBuffer(int length,int val=0)
{
for(int i=0;i<length;i++)
{
   buff[i]=val;
}
}
void calculateBPM (int beat) 
{
  lcd.clear();
  cleanBuffer(16);
  Serial.println("heart"); 
  prompt="ECG:"+String(beat);
  prompt.toCharArray(buff,200);
  lcd.setCursor (0, 0); 
  lcd.write((byte)0);
  lcd.print(buff);

  buff[0]=0;

  prompt="{\"type\":\"ecg\",\"value\":"+String(beat)+",\"unit\":\"voltage\"}#";

  prompt.toCharArray(buff,1900);
  Serial.print("ecg:");
  Serial.println(buff);
  mySerial.write(buff);

  //Serial.println(keypad_char_input);
  if(beat> threshold && belowThreshold == true){

  int beat_new = millis();    // get the current millisecond
  float diff = beat_new - beat_old; 
  float currentBPM = 60000.0 / diff; 

  beats[beatIndex++] = currentBPM;
    // store to array to convert the average
  float total = 0.0;
  for (int i = 0; i < 500; i++){
    total += beats[i];
  }
   BPM = (float)(total / 500);
    // convert to beats per minute
   prompt="BPM:"+String(BPM);

  prompt.toCharArray(buff,50);
  cleanLine(1);
  lcd.print(buff);
  buff[0]=0;
  prompt="{\"type\":\"pulse\",\"value\":"+String(diff)+",\"unit\":\"beat/sec\"}#";
  prompt.toCharArray(buff,1000);
  mySerial.write(buff);


  beat_old = beat_new;
  beatIndex = (beatIndex + 1) % 500;  // cycle through the array instead of using FIFO queue
  belowThreshold = false;

  }else {
   belowThreshold=true;
  }
}

void app_login()
{
  char data1[100],data2[100];
  int enterUsername=0;
  int enterPassword=0;
  int val= digitalRead(7);
     while(!val)
     {
       Serial.println("wait for Wi-Fi to be ready for login");
       lcd.clear();
       lcd.setCursor(0, 0);
       lcd.print("wait ready");
       val= digitalRead(7);
     }
   delay(10000);
 while(!logedIn)
{ 
 if(logedIn==0 && enterUsername==0)
 {

 read_keyboard("Username");
 if(enter)
 {
  
   strcpy(data1,internalbuffer);
   newUser.username=String(data1);
   Serial.println("user:"+ newUser.username);
   strcpy(internalbuffer,"                      ");  
   strcpy(internalbuffer,"");  
   enter=0;
   enterUsername=1;
   total_chars=0;
   nr_chars=0;
   lcd.clear();
   delay(1000);
 }
 }
if(logedIn==0 && enterUsername==1 && enterPassword==0)
{
 read_keyboard("Password:");
 if(enter)
 {   
    strcpy(data2,internalbuffer);
    strcpy(internalbuffer,"                      ");  
    strcpy(internalbuffer,"");  
    Serial.print("password:");
    newUser.password=String(data2);
    Serial.println( newUser.password);

    enter=0;
    enterPassword=1;
    total_chars=0;
    nr_chars=0;
    lcd.clear();
    delay(1000);
 }
}
if(logedIn==0 && enterUsername==1 && enterPassword==1)
{
     lcd.print("SENDING DATA");
     Serial.println("username:"+newUser.username);
     Serial.println("password:"+newUser.password);
     Serial.println("fingerid:"+String(newUser.finger_id));
     String userData="{\"username\":\""+newUser.username+"\",\"password\":\""+newUser.password+"\",\"finger_id\":"+String(newUser.finger_id)+"}#";
     buff[0]=0;  
     userData.toCharArray(buff,2999);
    Serial.println(buff);
    mySerial.print(buff);
   delay(30000);
   lcd.clear();
   logedIn=1;
}
}
}

void readHeart()
{
Serial.println("heart");
if((digitalRead(Lop) == HIGH)||(digitalRead(Lom) == HIGH)){

}
else
{
// send the keypad_char_input of analog input 0:
int heartBeat=analogRead(A0);
calculateBPM(heartBeat);
}
//Wait for a bit to keep serial data from saturating
delay(500);
}

void readTemperatureAndHumidity(){ 
  Serial.println("temperature");
    float temp;
    float hum;
    temp = dht2.readTemperature();
    hum=  dht2.readHumidity();
  
   if(hum>=0)
{
       lcd.clear();   
	     Serial.println("humidity");
	     lcd.setCursor (0, 1); 
       String prompt="Hum:"+String(hum);
       prompt.toCharArray(buff,50);
       cleanLine(2);
       lcd.print(buff);
       prompt="{\"type\":\"humidity\",\"value\":"+String(hum)+",\"unit\":\"Procent\"}#";
       prompt.toCharArray(buff,1999);
       Serial.println(buff);
       mySerial.flush();
       mySerial.write(buff);
       Serial.println("done humidity");
}
     delay(2000);

   if(temp > 0.0)
   {   buff[0]=0;
	     lcd.clear();   
       mySerial.flush();
       // temp+=12;	   
	     lcd.setCursor (0, 0); 
       prompt="Temp:"+String(temp)+String((char)223)+" C";
       prompt.toCharArray(buff,999); 
       lcd.print(buff);
       prompt="{\"type\":\"temperature\",\"value\":"+String(temp)+",\"unit\":\"C\"}#";
       Serial.println(temp);
      prompt.toCharArray(buff,1999); 

       Serial.println(buff);

       mySerial.flush();
       mySerial.write(buff);
       Serial.println("done temperature");  
     }
   }
   
  
void loop()
{
 int admin=digitalRead(pinAdmin);
 Serial.print("Admin:");
 Serial.println(admin);
 if(mySerial.available())
 { cleanBuffer(1999);
   String insideBuffer=mySerial.readString();
   Serial.print("read:");
   Serial.println(insideBuffer);
  
  
 }





if(admin && reconfigured==0)
{
 Serial.println("is this");

configure();
while(true);
setup();
}else
{
 readHeart();
 delay(500);
 readTemperatureAndHumidity();
 delay(700);
}
}