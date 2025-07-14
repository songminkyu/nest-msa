#!/bin/bash
set -euo pipefail
. "$(dirname "$0")/common.cfg"

docker_compose --profile apps down
docker_compose --profile apps up -d --build

docker wait apps-setup
docker rm apps-setup
