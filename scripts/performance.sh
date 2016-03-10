#!/bin/bash

JAVA_OPTS="-Dtargeturl=$(docker-machine ip default)"

printf "This docker-machine ip address %s\n" "$(docker-machine ip default)"
printf  "Trying to call the gatling gun\n\n"

. $GATLING_HOME/bin/gatling.sh -nr -m -sf $TODOBACK_HOME/perf/
