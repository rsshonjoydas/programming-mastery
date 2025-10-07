#!/bin/bash
# Usage: ./scripts/merge-to-main.sh frameworks/nestjs backend/frameworks/nestjs

BRANCH_NAME=$1
PREFIX=$2

if [ -z "$BRANCH_NAME" ] || [ -z "$PREFIX" ]; then
  echo "Usage: ./merge-to-main.sh [branch-name] [prefix-path]"
  echo "Example: ./merge-to-main.sh frameworks/nestjs backend/frameworks/nestjs"
  exit 1
fi

echo "🔄 Merging $BRANCH_NAME into main at $PREFIX"

git checkout main
git pull origin main

# Check if this is first merge
if [ -d "$PREFIX" ]; then
  echo "Directory exists, doing subtree pull..."
  git subtree pull --prefix=$PREFIX origin $BRANCH_NAME
else
  echo "First merge, doing subtree add..."
  git subtree add --prefix=$PREFIX origin $BRANCH_NAME
fi

git push origin main

echo "✅ Merge complete: $BRANCH_NAME → main ($PREFIX)"
