#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
. $WORKSPACE_ROOT/.env.test

HOST="http://${SERVICE_GATEWAY_HOST}:${SERVICE_GATEWAY_HTTP_PORT}"

ERROR_LOG=""
. ./auth.test
. ./customers.test

if [[ -z "$ERROR_LOG" ]]; then
    echo "Test Successful"
else
    echo "List of Failed Tests:"
    echo -e "$ERROR_LOG"
    exit 1
fi
