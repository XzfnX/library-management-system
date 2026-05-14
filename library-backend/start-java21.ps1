cd d:\lenovo\Documents\library-backend
$env:JAVA_HOME="d:\lenovo\Documents\jdk21-extracted\jdk-21.0.2"
$env:PATH="$($env:JAVA_HOME)\bin;$($env:PATH)"
java -version
Write-Host "`n正在启动后端服务..."
mvn clean compile exec:java