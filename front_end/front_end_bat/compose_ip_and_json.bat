@echo off 
set /P var= < "ipServer.txt"
set /P var2= < "ipPort.txt"
set /P var3= < "ipProtocol.txt"
echo %var%
echo %var2%
set var4=%var3%://%var%:%var2%/
echo %var4%
set var5="local_server_ip_port"
set var6={%var5%:"%var4%","freeParameter":"0"}
echo %var6%
echo %var6%>"app-config.json"