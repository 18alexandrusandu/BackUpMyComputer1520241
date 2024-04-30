

copy "app-config.json"  "..\\bodymonitoringUI\\dist\\bodymonitoring-ui\\assets"
copy "app-config.json"  "..\\bodymonitoringUI\\src\\assets"

cd "..\\bodymonitoringUI"

xcopy /E /H /C /I /Y  "dist" "..\\nginx\\nginx-1.25.1\\html\dist"

cd "..\\front_end_bat"