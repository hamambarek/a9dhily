#!/bin/bash

# A9dhily Development Workflow Script
# This script helps automate the development process with Git

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run security checks
run_security_checks() {
    print_status "Running security checks..."
    
    if command_exists npm; then
        npm run security:check
        print_success "Security checks completed"
    else
        print_error "npm not found. Please install Node.js and npm."
        exit 1
    fi
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if command_exists npm; then
        npm run test
        print_success "Tests completed"
    else
        print_error "npm not found. Please install Node.js and npm."
        exit 1
    fi
}

# Function to run linting
run_linting() {
    print_status "Running linting..."
    
    if command_exists npm; then
        npm run lint
        print_success "Linting completed"
    else
        print_error "npm not found. Please install Node.js and npm."
        exit 1
    fi
}

# Function to check Git status
check_git_status() {
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "You have uncommitted changes"
        git status --short
        return 1
    else
        print_success "Working directory is clean"
        return 0
    fi
}

# Function to create a feature branch
create_feature_branch() {
    local feature_name=$1
    
    if [ -z "$feature_name" ]; then
        print_error "Please provide a feature name"
        echo "Usage: $0 feature <feature-name>"
        exit 1
    fi
    
    # Convert feature name to branch name format
    local branch_name="feature/$(echo $feature_name | tr ' ' '-')"
    
    print_status "Creating feature branch: $branch_name"
    git checkout -b "$branch_name"
    print_success "Feature branch created: $branch_name"
}

# Function to commit changes
commit_changes() {
    local commit_message=$1
    
    if [ -z "$commit_message" ]; then
        print_error "Please provide a commit message"
        echo "Usage: $0 commit <commit-message>"
        exit 1
    fi
    
    print_status "Staging changes..."
    git add .
    
    print_status "Committing changes..."
    git commit -m "$commit_message"
    
    print_success "Changes committed successfully"
}

# Function to push changes
push_changes() {
    local branch_name=$(git branch --show-current)
    
    print_status "Pushing changes to remote..."
    git push origin "$branch_name"
    
    print_success "Changes pushed successfully to $branch_name"
}

# Function to complete a feature
complete_feature() {
    local branch_name=$(git branch --show-current)
    
    if [[ ! "$branch_name" =~ ^feature/ ]]; then
        print_error "You are not on a feature branch"
        exit 1
    fi
    
    print_status "Completing feature: $branch_name"
    
    # Switch to main branch
    git checkout main
    
    # Pull latest changes
    git pull origin main
    
    # Merge feature branch
    git merge "$branch_name"
    
    # Push to remote
    git push origin main
    
    # Delete feature branch
    git branch -d "$branch_name"
    
    print_success "Feature completed and merged to main"
}

# Function to show help
show_help() {
    echo "A9dhily Development Workflow Script"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  security              Run security checks"
    echo "  test                  Run tests"
    echo "  lint                  Run linting"
    echo "  status                Check Git status"
    echo "  feature <name>        Create a new feature branch"
    echo "  commit <message>      Commit changes with message"
    echo "  push                  Push changes to remote"
    echo "  complete              Complete current feature"
    echo "  workflow              Run full workflow (test, lint, commit, push)"
    echo "  help                  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 feature user-authentication"
    echo "  $0 commit 'Add user authentication feature'"
    echo "  $0 workflow"
}

# Main script logic
case "$1" in
    "security")
        run_security_checks
        ;;
    "test")
        run_tests
        ;;
    "lint")
        run_linting
        ;;
    "status")
        check_git_status
        ;;
    "feature")
        create_feature_branch "$2"
        ;;
    "commit")
        commit_changes "$2"
        ;;
    "push")
        push_changes
        ;;
    "complete")
        complete_feature
        ;;
    "workflow")
        print_status "Running full development workflow..."
        run_security_checks
        run_linting
        run_tests
        check_git_status
        print_success "Workflow completed successfully"
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
