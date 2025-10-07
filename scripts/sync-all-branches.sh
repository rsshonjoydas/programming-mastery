#!/bin/bash
# Sync all framework branches to main
# Usage: ./scripts/sync-all-branches.sh

echo "🔄 Syncing all branches to main..."

git checkout main
git pull origin main

# List of branches and their paths
declare -A BRANCHES=(
  ["languages/javascript"]="languages/javascript"
)

for BRANCH in "${!BRANCHES[@]}"; do
  PREFIX="${BRANCHES[$BRANCH]}"
  echo "Syncing $BRANCH → $PREFIX"
  git subtree pull --prefix=$PREFIX origin $BRANCH
done

git push origin main

echo "✅ All branches synced to main"
