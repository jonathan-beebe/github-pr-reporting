#!/bin/bash
docker build . -t app
printf -v args '%q ' "$@"
docker run -it app yarn start $args