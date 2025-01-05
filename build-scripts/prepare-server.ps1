Set-ExecutionPolicy Bypass -Scope Process
class ConfigData {
    [ValidateNotNullOrEmpty()][string]$JavaHome
    [ValidateNotNullOrEmpty()][string]$MavenPath
}
$config = [ConfigData](Get-Content $PSScriptRoot\configuration.json | Out-String | ConvertFrom-Json)

[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $config.JavaHome, [System.EnvironmentVariableTarget]::Process)
$mvn = (Join-Path ($config.MavenPath) -ChildPath .\mvn.cmd)

Set-Location (Join-Path $PSScriptRoot -ChildPath ..\rfidreader.server)
Invoke-Command -ScriptBlock { & $mvn clean package }

Set-Location $PSScriptRoot\..\
Copy-Item .\rfidreader.server\target\rfidreader-backend.jar .\rfidreader.desktop\resources\ -Force
Copy-Item .\build-scripts\application.properties .\rfidreader.desktop\resources\ -Force

Set-Location $PSScriptRoot
