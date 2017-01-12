@rem check if running elevated
@whoami /groups | find "S-1-16-12288" && goto :isadministrator

@echo Run as administrator
@pause
@goto :eof

:isadministrator

set basepath=%~dp0

%appcmd% delete site /site.name:"api.local"  > nul 2> nul
%appcmd% delete apppool /apppool.name:"api.local"  > nul 2> nul

netsh http delete urlacl url=http://api.local:80/  

set appcmd="C:\Windows\System32\inetsrv\appcmd.exe"

echo on

netsh http add urlacl url=http://api.local:80/ user=everyone


rem add app pools
%appcmd% add apppool /apppool.name:"api.local" /managedRuntimeVersion:"v4.0" /managedPipelineMode:"Integrated"
%appcmd% set config /section:applicationPools /[name='api.local'].processModel.pingingEnabled:false

rem add sites/apps
%appcmd% add site /site.name:"api.local" /bindings:http://api.local:80 /physicalPath:"%basepath%Web"
%appcmd% set app /app.name:"api.local/" /applicationPool:"api.local"
%appcmd% set site /site.name:"api.local" /serverAutoStart:true

set folder=%~dp0

IF %folder:~-1%==\ SET folder=%folder:~0,-1%
ICACLS "%folder%" /Grant IIS_IUSRS:R

iisreset

@pause