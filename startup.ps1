Set-ExecutionPolicy Bypass -Scope Process

$certConfigFiles = @("generate.ps1", "localhost.cnf", "CA.cnf")
$certFiles = Get-ChildItem -Path "$PSScriptRoot\certificates-gen" -File

foreach ($file in $certFiles) {
    if ($certConfigFiles -notcontains $file.Name) {
        Remove-Item -Path $file.FullName -Force
    }
}
Set-Location $PSScriptRoot\certificates-gen
Invoke-Expression -Command '.\generate.ps1'
Set-Location $PSScriptRoot

Copy-Item .\certificates-gen\localhost_key.pem -Destination .\rfidreader.client\certificates -Force
Copy-Item .\certificates-gen\localhost_cert.pem -Destination .\rfidreader.client\certificates -Force

Copy-Item .\certificates-gen\localhost_key.pem -Destination .\rfidreader.server\src\main\resources -Force
Copy-Item .\certificates-gen\localhost_cert.pem -Destination .\rfidreader.server\src\main\resources -Force

Set-Location $PSScriptRoot\rfidreader.server
Start-Process -FilePath mvn -ArgumentList "spring-boot:run"
$clientBlock = ({
    Set-Location "replace"
    Invoke-Expression -Command 'npm install'
    Invoke-Expression -Command 'npm run build; npm run preview'
} | Out-String) -replace "replace", "$PSScriptRoot\rfidreader.client"

Start-Process powershell.exe -ArgumentList "-Command &{$clientBlock}"
Set-Location $PSScriptRoot
