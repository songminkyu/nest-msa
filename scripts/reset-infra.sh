#!/bin/bash
set -xeuo pipefail
. "$(dirname "$0")/common.cfg"
. $TEST_ENV_FILE

docker_compose --profile infra down --volumes --timeout 0

rm -rf $WORKSPACE_ROOT/_output
mkdir -p $WORKSPACE_ROOT/$LOG_DIRECTORY
mkdir -p $WORKSPACE_ROOT/$FILE_UPLOAD_DIRECTORY

docker_compose --profile infra up -d

SETUP_CONTAINERS="mongo-key-generator mongo-setup redis-setup nats-setup"

for CONTAINER in $SETUP_CONTAINERS; do
    CONTAINER_NAME="${PROJECT_NAME}-${CONTAINER}"

    if [ "$(docker wait "$CONTAINER_NAME")" -ne 0 ]; then
        echo "Error: Container '$CONTAINER_NAME' failed."
        exit 1
    else
        docker rm -v "$CONTAINER_NAME"
    fi
done

# The file is too large to save, so it will be created.
RES_PATH=$WORKSPACE_ROOT/src/apps/__tests__/helpers/res

dd if=/dev/zero bs=49999999 count=1 | tr '\0' 'a' > $RES_PATH/large.txt
dd if=/dev/zero bs=50000000 count=1 | tr '\0' 'a' > $RES_PATH/oversized.txt
