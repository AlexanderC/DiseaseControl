#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$0")
PROJECT_ROOT="$SCRIPT_DIR/.."

function _info() {
  echo ""
  echo " ===> $1"
  echo ""
}

function _fail() {
  if [ ! -z "$1" ]; then
    echo "$1"
  fi
  exit 1
}

_info "Accessing working directory"
cd "$PROJECT_ROOT" || _fail

_info "Loading .env configuration"
source .env || _fail

_info "Creating database config to .db.json"
_CMD="$(cat <<-EOF
{
  "development":  {
    "url": "$DB_DSN",
    "dialect": "mysql"
  }
}
EOF
)"
touch .db.json || _fail
echo "$_CMD" > .db.json || _fail
