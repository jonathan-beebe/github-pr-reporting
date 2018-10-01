#!/bin/bash
docker build . -t app
docker run -it app yarn test