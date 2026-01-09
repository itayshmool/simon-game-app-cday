#!/bin/bash
# =============================================================================
# Simon Game - Publish to Your GitHub
# =============================================================================
# This script creates your own GitHub repository and pushes the code.
# Run with: npm run publish
# =============================================================================

set -e

echo ""
echo "🚀 ═══════════════════════════════════════════════"
echo "   PUBLISH TO YOUR GITHUB"
echo "═══════════════════════════════════════════════════"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "   Please install it first:"
    echo "   • Mac:     brew install gh"
    echo "   • Windows: winget install GitHub.cli"
    echo ""
    echo "   Then run: gh auth login"
    echo ""
    exit 1
fi

# Check if logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ You're not logged in to GitHub."
    echo ""
    echo "   Please run: gh auth login"
    echo ""
    exit 1
fi

# Get GitHub username
GITHUB_USER=$(gh api user -q .login)
echo "✅ Logged in as: $GITHUB_USER"
echo ""

# Repository name
REPO_NAME="simon-game-app"

# Check if repo already exists
if gh repo view "$GITHUB_USER/$REPO_NAME" &> /dev/null; then
    echo "⚠️  Repository $GITHUB_USER/$REPO_NAME already exists!"
    echo ""
    read -p "   Do you want to push to the existing repo? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   Cancelled."
        exit 1
    fi
else
    # Create the repository
    echo "📦 Creating repository: $GITHUB_USER/$REPO_NAME"
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
    echo ""
    echo "✅ Repository created!"
fi

# Update remote and push
echo "📤 Pushing code to GitHub..."

# Remove old remotes if they exist
git remote remove origin 2>/dev/null || true
git remote remove cday 2>/dev/null || true

# Add new remote
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Push
git push -u origin main --force

echo ""
echo "═══════════════════════════════════════════════════"
echo "   ✅ SUCCESS!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "   Your repository: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "   Next step: Deploy on Render"
echo "   1. Go to: https://dashboard.render.com"
echo "   2. Click: New → Blueprint"
echo "   3. Select your repository"
echo ""
echo "═══════════════════════════════════════════════════"
echo ""
