#!/usr/bin/env bash

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
if [ -z "$DEPLOY_SEEDS" ] && [ -z "$DEPLOY_SEEDS_RELOAD" ]; then
  rsync -av dc-api.tar docker-compose.yml \
    "$DEPLOY_SERVER_DSN:$DEPLOY_SERVER_ROOT/" || _fail
else
  rsync -av dc-api.tar docker-compose.yml .docker.env .sequelizerc package.json seeders node_modules bin \
    "$DEPLOY_SERVER_DSN:$DEPLOY_SERVER_ROOT/" || _fail
fi

_info "Deploying image on remote server"
_CMD_ADD="echo 'Skip running database seeds...'"
if [ ! -z "$DEPLOY_SEEDS" ] || [ ! -z "$DEPLOY_SEEDS_RELOAD" ]; then
  _SEED_CMD_ADD="echo 'Skip droping old database seeds...'"

  if [ ! -z "$DEPLOY_SEEDS_RELOAD" ]; then
    _SEED_CMD_ADD="npm run db:seeds:down"
  fi

  _CMD_ADD="$(cat <<-EOF
echo "Waiting 5 seconds till services are up.."
sleep 5
mv .docker.env .env
. /root/.nvm/nvm.sh
$_SEED_CMD_ADD
npm run db:seeds:up
rm -rf .env .sequelizerc package.json seeders node_modules bin
EOF
)"
fi
_CMD="$(cat <<-EOF
cd '$DEPLOY_SERVER_ROOT'
docker load --input dc-api.tar
docker-compose up -d
$_CMD_ADD
rm -rf dc-api.tar docker-compose.yml
docker ps
EOF
)"
ssh "$DEPLOY_SERVER_DSN" "$_CMD" || _fail
