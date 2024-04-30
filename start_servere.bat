
@echo on
echo hello

cd "back_end" 
start call cmd /c call "recompile_run_backend.bat"

cd "../front_end/front_end_bat"
start call cmd /c call "COMPOSED_Modificat.bat"
