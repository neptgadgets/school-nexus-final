#!/bin/bash

# SchoolNexus Deployment Test Script
# This script tests the deployment setup and configuration

set -e

echo "🧪 Testing SchoolNexus Deployment Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "Testing $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to check file exists
check_file() {
    local file_path="$1"
    local description="$2"
    
    echo -n "Checking $description... "
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ MISSING${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to check directory exists
check_directory() {
    local dir_path="$1"
    local description="$2"
    
    echo -n "Checking $description... "
    
    if [ -d "$dir_path" ]; then
        echo -e "${GREEN}✅ EXISTS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ MISSING${NC}"
        ((TESTS_FAILED++))
    fi
}

echo "📁 Checking file structure..."

# Check essential files
check_file "package.json" "package.json"
check_file ".env.example" "environment template"
check_file "Dockerfile" "Docker configuration"
check_file "docker-compose.yml" "Docker Compose configuration"
check_file "ecosystem.config.js" "PM2 configuration"

# Check directories
check_directory "database" "database directory"
check_directory "database/migrations" "migrations directory"
check_directory "database/seeds" "seeds directory"
check_directory "scripts" "scripts directory"
check_directory "config" "config directory"

# Check migration files
check_file "database/migrations/001_initial_schema.sql" "database schema migration"
check_file "database/seeds/001_demo_data.sql" "demo data seeds"

# Check scripts
check_file "scripts/setup-dev.sh" "development setup script"
check_file "scripts/deploy-production.sh" "production deployment script"
check_file "scripts/backup-database.sh" "database backup script"

# Check configuration files
check_file "config/nginx.conf" "Nginx configuration"
check_file ".do/app.yaml" "DigitalOcean App Platform config"

# Check documentation
check_file "INSTALLATION_GUIDE.md" "installation guide"
check_file "DEPLOYMENT_README.md" "deployment README"
check_file "DEPLOYMENT_COMPLETE.md" "deployment summary"

echo ""
echo "🔧 Testing Node.js environment..."

# Check Node.js
run_test "Node.js installation" "command -v node"
run_test "npm installation" "command -v npm"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//')
    REQUIRED_VERSION="18.17.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        echo -e "Node.js version ($NODE_VERSION)... ${GREEN}✅ COMPATIBLE${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "Node.js version ($NODE_VERSION)... ${RED}❌ TOO OLD${NC}"
        ((TESTS_FAILED++))
    fi
fi

echo ""
echo "📦 Testing package.json scripts..."

# Check if package.json has required scripts
REQUIRED_SCRIPTS=("dev" "build" "start" "db:migrate" "db:seed" "deploy" "health")

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if grep -q "\"$script\":" package.json; then
        echo -e "Script '$script'... ${GREEN}✅ DEFINED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "Script '$script'... ${RED}❌ MISSING${NC}"
        ((TESTS_FAILED++))
    fi
done

echo ""
echo "🐳 Testing Docker configuration..."

# Test Docker files
run_test "Docker installation" "command -v docker"
run_test "Docker Compose installation" "command -v docker-compose"
run_test "Dockerfile syntax" "docker build --dry-run -f Dockerfile ."

echo ""
echo "🔍 Testing health check endpoint..."

# Check if health check file exists
check_file "src/app/api/health/route.ts" "health check API endpoint"

echo ""
echo "🔐 Testing environment configuration..."

# Check if .env.example has required variables
REQUIRED_ENV_VARS=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY" "NEXTAUTH_SECRET")

for var in "${REQUIRED_ENV_VARS[@]}"; do
    if grep -q "$var" .env.example; then
        echo -e "Environment variable '$var'... ${GREEN}✅ DEFINED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "Environment variable '$var'... ${RED}❌ MISSING${NC}"
        ((TESTS_FAILED++))
    fi
done

echo ""
echo "📊 Test Results Summary:"
echo "========================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}Your SchoolNexus deployment setup is ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.example to .env.local and configure your Supabase credentials"
    echo "2. Run 'npm run setup:dev' to set up development environment"
    echo "3. Run 'npm run db:migrate' to set up the database"
    echo "4. Run 'npm run dev' to start development server"
    echo ""
    echo "For production deployment, see DEPLOYMENT_README.md"
    exit 0
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "${YELLOW}Please fix the failing tests before deploying${NC}"
    echo ""
    echo "Common fixes:"
    echo "- Install missing dependencies: npm install"
    echo "- Update Node.js to version 18.17.0 or higher"
    echo "- Install Docker and Docker Compose"
    echo "- Check file permissions: chmod +x scripts/*.sh"
    exit 1
fi
