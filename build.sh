#!/bin/bash

cat speedread.js >/tmp/speedread.js
echo "speedRead();" >>/tmp/speedread.js
java -jar compiler.jar --compilation_level=ADVANCED_OPTIMIZATIONS --formatting=SINGLE_QUOTES --js=/tmp/speedread.js | sed s/%/%25/ >/tmp/speedread2.js
cat index_header.html /tmp/speedread2.js index_footer.html >index.html
