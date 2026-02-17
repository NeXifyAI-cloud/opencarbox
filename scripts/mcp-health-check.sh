#!/bin/bash

# MCP Server Health Check Script
# Tägliche Überprüfung aller MCP Server Verbindungen

set -e

echo "=== MCP SERVER HEALTH CHECK ==="
echo "Timestamp: $(date)"
echo ""

# Function to check HTTP-based MCP server
check_http_server() {
    local name=$1
    local url=$2
    local auth_header=$3
    
    echo "Checking $name..."
    
    if [ -z "$auth_header" ]; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" -m 10)
    else
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -H "$auth_header" "$url" -m 10)
    fi
    
    if [ "$status_code" = "405" ] || [ "$status_code" = "200" ]; then
        echo "  ✅ $name: HTTP $status_code (Server reachable)"
        return 0
    elif [ "$status_code" = "000" ]; then
        echo "  ❌ $name: Connection failed (timeout or unreachable)"
        return 1
    else
        echo "  ⚠️  $name: HTTP $status_code (unexpected)"
        return 2
    fi
}

# Function to check command-based MCP server
check_command_server() {
    local name=$1
    local command=$2
    
    echo "Checking $name..."
    
    if command -v $command > /dev/null 2>&1; then
        echo "  ✅ $name: Command available"
        return 0
    else
        echo "  ❌ $name: Command not found"
        return 1
    fi
}

# Load environment variables
if [ -f ".env" ]; then
    source .env
elif [ -f "env.example" ]; then
    source env.example
fi

# Check HTTP-based servers
echo "--- HTTP-based Servers ---"

# Supabase
check_http_server "Supabase" \
    "https://mcp.supabase.com/mcp?project_ref=cwebcfgdraghzeqgfsty&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching%2Cstorage" \
    "Authorization: Bearer $SUPABASE_ACCESS_TOKEN"

# GitHub
check_http_server "GitHub" \
    "https://api.githubcopilot.com/mcp/" \
    "Authorization: Bearer $CLASSIC_TOKEN_GITHUB"

# Vercel
check_http_server "Vercel" \
    "https://mcp.vercel.com" \
    "Authorization: Bearer $VERCEL_TOKEN"

echo ""
echo "--- Command-based Servers ---"

# Mem0
check_command_server "Mem0" "uvx"

# PostgreSQL
check_command_server "PostgreSQL MCP" "npx"

# Git
check_command_server "Git MCP" "npx"

# Filesystem
check_command_server "Filesystem MCP" "npx"

# GitLab
check_command_server "GitLab MCP" "npx"

echo ""
echo "--- Token Validity Check ---"

# Check if tokens are set
tokens_missing=0

if [ -z "$MEM0_API_KEY" ]; then
    echo "❌ MEM0_API_KEY not set"
    tokens_missing=$((tokens_missing + 1))
else
    echo "✅ MEM0_API_KEY: Set"
fi

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN not set"
    tokens_missing=$((tokens_missing + 1))
else
    echo "✅ SUPABASE_ACCESS_TOKEN: Set"
fi

if [ -z "$CLASSIC_TOKEN_GITHUB" ]; then
    echo "❌ CLASSIC_TOKEN_GITHUB not set"
    tokens_missing=$((tokens_missing + 1))
else
    echo "✅ CLASSIC_TOKEN_GITHUB: Set"
fi

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN not set"
    tokens_missing=$((tokens_missing + 1))
else
    echo "✅ VERCEL_TOKEN: Set"
fi

if [ -z "$GITLAB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "❌ GITLAB_PERSONAL_ACCESS_TOKEN not set"
    tokens_missing=$((tokens_missing + 1))
else
    echo "✅ GITLAB_PERSONAL_ACCESS_TOKEN: Set"
fi

echo ""
echo "=== SUMMARY ==="
echo "Total servers checked: 8"
echo "Tokens missing: $tokens_missing"
echo "Health check completed at: $(date)"

if [ $tokens_missing -gt 0 ]; then
    echo "⚠️  WARNING: Some tokens are missing. Check your .env file."
    exit 1
else
    echo "✅ All MCP servers are properly configured."
    exit 0
fi