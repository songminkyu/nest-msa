#!/bin/bash
set -euo pipefail
. "$(dirname "$0")/common.cfg"

docker_compose --profile apps --profile infra down --rmi all

rm -rf $WORKSPACE_ROOT/_output
rm -rf $WORKSPACE_ROOT/node_modules
