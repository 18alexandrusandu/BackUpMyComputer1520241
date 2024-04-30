call stop_nginx.bat
call compose_ip_and_json.bat
call copy_source_dest.bat
call build_front_end.bat
cd "../front_end_bat"
call copy_source_dest.bat
call start_nginx.bat