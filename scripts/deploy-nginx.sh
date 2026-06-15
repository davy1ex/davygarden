#!/usr/bin/env bash
# Coolify static deploy: build Quartz into public/ for Nginx.
# Coolify settings:
#   Build Pack: Nixpacks
#   Is static site: true
#   Install Command: (leave empty — Nixpacks runs npm ci automatically)
#   Build Command: bash scripts/deploy-nginx.sh
#   Publish Directory: public
#   Custom Nginx: paste contents of nginx.conf from repo root

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

log() {
  printf '[deploy-nginx] %s\n' "$*"
}

require_node() {
  if ! command -v node >/dev/null 2>&1; then
    echo "node is required (>= 22)" >&2
    exit 1
  fi

  local major
  major="$(node -p "process.versions.node.split('.')[0]")"
  if (( major < 22 )); then
    echo "node >= 22 is required, got $(node -v)" >&2
    exit 1
  fi
}

fetch_git_history() {
  if ! command -v git >/dev/null 2>&1 || ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    log "skip git fetch (not a git repo)"
    return 0
  fi

  log "fetching full git history for created-modified-date plugin"
  git fetch --unshallow 2>/dev/null || git fetch --depth=0 origin 2>/dev/null || true
}

install_dependencies() {
  # Nixpacks already runs `npm ci` before the build command. Re-running it
  # fails with EBUSY on the mounted node_modules/.cache directory.
  if [[ -d node_modules ]]; then
    log "dependencies already installed by Nixpacks, skipping npm ci"
    return 0
  fi

  log "installing npm dependencies"
  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi
}

install_plugins() {
  log "installing quartz plugins from lockfile"
  npx quartz plugin install

  log "installing any plugins declared in quartz.config.yaml"
  npx quartz plugin install --from-config
}

build_site() {
  log "building quartz site"
  npx quartz build
}

verify_output() {
  if [[ ! -f public/index.html ]]; then
    echo "build failed: public/index.html not found" >&2
    exit 1
  fi

  log "build ok: $(find public -type f | wc -l | tr -d ' ') files in public/"
}

main() {
  require_node
  fetch_git_history
  install_dependencies
  install_plugins
  build_site
  verify_output
}

main "$@"
