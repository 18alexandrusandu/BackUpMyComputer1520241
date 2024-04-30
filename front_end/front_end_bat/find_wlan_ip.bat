
@echo off 
ipconfig /all >temp.txt

Find /V /N "" ^ < "temp.txt" >"temp5.txt"

findstr /N /R  /C:" *Wireless *LAN *adapter *Wi-Fi"   "temp5.txt" > temp.txt
findstr /N /R  /C:" *IPv4 *Address"  "temp5.txt" > "temp2.txt"
::^Wireless *LAN *adapter *Wi-Fi

@echo on
for  /f "delims=:."  %%f  in (temp.txt) do (

echo %%f 
set /A number=%%f
)

echo %number%NUMBER

set /a result=0
set /A found=0
echo beforeFor

setlocal enableextensions enabledelayedexpansion
for /f "delims=:." %%g  in (temp2.txt) do (ECHO Num%%g
set /A number2=%%g
if !number2! gtr %number% (echo merge asta 
 if !number2! gtr %result% (echo merge si asta 
     if %found% equ 0 (set /a found=1
        echo !number2!
        set /a result=!number2!))))
		
endlocal  &  set result=%result%
  
echo NUMBER"result" %result%



 set finalline="nothing"

::extract line with the found index
setlocal enableextensions enabledelayedexpansion
set /a count = 0
for /f "tokens=* delims="  %%i in (temp5.txt) do (
   set /a count += 1
   echo !count! %result%
  if !count! equ %result% (echo !count! %%i     
  set finalline=%%i ))
endlocal  &  set finalline=%finalline%


echo %finalline% > "temp4.txt"


::@echo on

for /f "tokens=2* delims=:(" %%i in (temp4.txt) do (echo "something"
echo %%i   
set finalline=%%i )

echo %finalline% > "temp4.txt"


for /f "tokens=2 delims= " %%i in (temp4.txt) do (echo "something"
echo %%i   
set finalline=%%i )

set finalline=%finalline: =%
echo %finalline%
echo %finalline%> "ipServer.txt"

del "temp.txt" "temp2.txt" "temp4.txt" "temp5.txt"
::findstr /r /c:"^.[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+.$"  temp4.txt > resultedIp.txt   
                    
@echo off

