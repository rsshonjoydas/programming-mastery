#!/bin/bash
# Usage: ./scripts/create-new-branch.sh my-branch-name

create_branch() {
  BRANCH_NAME=$1

  if [ -z "$BRANCH_NAME" ]; then
    echo "Usage: ./create-new-branch.sh [branch-name]"
    exit 1
  fi

  # Check if branch exists on remote
  if git ls-remote --heads origin $BRANCH_NAME | grep -q $BRANCH_NAME; then
    echo "⚠️  Branch '$BRANCH_NAME' already exists on remote!"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "❌ Overwrite cancelled"
      read -p "Enter a new branch name (or press Ctrl+C to exit): " NEW_BRANCH_NAME
      if [ -z "$NEW_BRANCH_NAME" ]; then
        echo "❌ No branch name provided"
        exit 1
      fi
      # Recursively call the function with new branch name
      create_branch "$NEW_BRANCH_NAME"
      return
    fi
    FORCE_FLAG="-f"
  else
    FORCE_FLAG=""
  fi

  echo "🌿 Creating new orphan branch: $BRANCH_NAME"
  git checkout --orphan $BRANCH_NAME

  echo "🗑️  Removing all files from staging and working directory..."
  git rm -rf .
  git clean -fdx

  # echo "📝 Creating initial commit..."
  # git commit --allow-empty -m "Initial commit: $BRANCH_NAME"

  # echo "🚀 Pushing to remote..."
  # git push $FORCE_FLAG -u origin $BRANCH_NAME

  # echo "✅ Empty branch created and pushed: $BRANCH_NAME"
}

# Start the process
create_branch "$1"
