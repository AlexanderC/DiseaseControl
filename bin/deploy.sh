#!/bin/sh

function _info() {
  echo ""
  echo " ===> $1"
  echo ""
}

function _fail() {
  if [ !-z "$1" ]; then
    echo "$1"
  fi
  exit 1
}

_info "Validating environment"
if [ -z "$DEPLOY_SERVER_DSN" ] || [ -z "$DEPLOY_SERVER_ROOT" ]; then
  _fail "Missing deploy server configuration"
elif [ -z "$(which rsync)" ]; then
  _fail "Missing rsync utility"
fi

_info "Building dc-api image"
docker build -t dc-api . || _fail

_info "Exporting image into dc-api.tar archive"
docker save dc-api > dc-api.tar || _fail

_info "Sending image and configuration to $DEPLOY_SERVER_DSN"
rsync -av dc-api.tar docker-compose.yml "$DEPLOY_SERVER_DSN:$DEPLOY_SERVER_ROOT/" || _fail

_info "Deploying image on remote server"
_CMD="$(cat <<-EOF
cd '$DEPLOY_SERVER_ROOT'
docker load --input dc-api.tar
docker-compose up -d
rm dc-api.tar docker-compose.yml
EOF
)"
ssh "$DEPLOY_SERVER_DSN" "$_CMD" || _fail
