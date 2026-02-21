@echo off
REM MCP Server Health Check Script for Windows
REM Tägliche Überprüfung aller MCP Server Verbindungen

echo === MCP SERVER HEALTH CHECK ===
echo Timestamp: %date% %time%
echo.

REM Load environment variables from .env file if it exists (only lines with =)
if exist .env (
    for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
        if not "%%a"=="" if not "%%b"=="" (
            set "%%a=%%b"
        )
    )
) else if exist env.example (
    for /f "usebackq tokens=1,2 delims==" %%a in ("env.example") do (
        if not "%%a"=="" if not "%%b"=="" (
            set "%%a=%%b"
        )
    )
)

echo --- HTTP-based Servers ---

REM Function to check HTTP server
:check_http
setlocal
set server_name=%~1
set url=%~2
set auth_header=%~3

echo Checking %server_name%...

if "%auth_header%"=="" (
    for /f "tokens=*" %%a in ('curl -s -o nul -w "%%{http_code}" "%url%" --max-time 10 2^>nul') do set status_code=%%a
) else (
    for /f "tokens=*" %%a in ('curl -s -o nul -w "%%{http_code}" -H "%auth_header%" "%url%" --max-time 10 2^>nul') do set status_code=%%a
)

if "%status_code%"=="405" (
    echo   [OK] %server_name%: HTTP 405 (Server reachable)
    endlocal & exit /b 0
) else if "%status_code%"=="200" (
    echo   [OK] %server_name%: HTTP 200 (Server reachable)
    endlocal & exit /b 0
) else if "%status_code%"=="000" (
    echo   [ERROR] %server_name%: Connection failed (timeout or unreachable)
    endlocal & exit /b 1
) else (
    echo   [WARNING] %server_name%: HTTP %status_code% (unexpected)
    endlocal & exit /b 2
)
goto :eof

REM Check Supabase
call :check_http "Supabase" "https://mcp.supabase.com/mcp?project_ref=cwebcfgdraghzeqgfsty&features=docs%%2Caccount%%2Cdatabase%%2Cdebugging%%2Cdevelopment%%2Cfunctions%%2Cbranching%%2Cstorage" "Authorization: Bearer %SUPABASE_ACCESS_TOKEN%"

REM Check GitHub
call :check_http "GitHub" "https://api.githubcopilot.com/mcp/" "Authorization: Bearer %CLASSIC_TOKEN_GITHUB_NEU%"

REM Check Vercel
call :check_http "Vercel" "https://mcp.vercel.com" "Authorization: Bearer %VERCEL_TOKEN%"

echo.
echo --- Command-based Servers ---

REM Function to check if command exists
:check_command
setlocal
set server_name=%~1
set command=%~2

echo Checking %server_name%...

where %command% >nul 2>&1
if %errorlevel% equ 0 (
    echo   [OK] %server_name%: Command available
    endlocal & exit /b 0
) else (
    echo   [ERROR] %server_name%: Command not found
    endlocal & exit /b 1
)
goto :eof

REM Check Mem0
call :check_command "Mem0" "uvx"

REM Check PostgreSQL MCP
call :check_command "PostgreSQL MCP" "npx"

REM Check Git MCP
call :check_command "Git MCP" "npx"

REM Check Filesystem MCP
call :check_command "Filesystem MCP" "npx"

REM Check GitLab MCP
call :check_command "GitLab MCP" "npx"

echo.
echo --- Token Validity Check ---

set tokens_missing=0

if "%MEM0_API_KEY%"=="" (
    echo [ERROR] MEM0_API_KEY not set
    set /a tokens_missing+=1
) else (
    echo [OK] MEM0_API_KEY: Set
)

if "%SUPABASE_ACCESS_TOKEN%"=="" (
    echo [ERROR] SUPABASE_ACCESS_TOKEN not set
    set /a tokens_missing+=1
) else (
    echo [OK] SUPABASE_ACCESS_TOKEN: Set
)

if "%CLASSIC_TOKEN_GITHUB_NEU%"=="" (
    echo [ERROR] CLASSIC_TOKEN_GITHUB_NEU not set
    set /a tokens_missing+=1
) else (
    echo [OK] CLASSIC_TOKEN_GITHUB_NEU: Set
)

if "%VERCEL_TOKEN%"=="" (
    echo [ERROR] VERCEL_TOKEN not set
    set /a tokens_missing+=1
) else (
    echo [OK] VERCEL_TOKEN: Set
)

if "%GITLAB_PERSONAL_ACCESS_TOKEN%"=="" (
    echo [ERROR] GITLAB_PERSONAL_ACCESS_TOKEN not set
    set /a tokens_missing+=1
) else (
    echo [OK] GITLAB_PERSONAL_ACCESS_TOKEN: Set
)

echo.
echo === SUMMARY ===
echo Total servers checked: 8
echo Tokens missing: %tokens_missing%
echo Health check completed at: %date% %time%

if %tokens_missing% gtr 0 (
    echo [WARNING] Some tokens are missing. Check your .env file.
    exit /b 1
) else (
    echo [OK] All MCP servers are properly configured.
    exit /b 0
)