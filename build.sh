#!/bin/bash

JS_FILE=speedread.js
OUTPUT_HTML=index.html

# Requires closure-compiler (https://developers.google.com/closure/compiler/)
COMPILER_JAR=compiler.jar

# Add call to main function to js
cat $JS_FILE >/tmp/speedread.js
echo "speedRead();" >>/tmp/speedread.js

# Optimise and minify
java -jar $COMPILER_JAR --compilation_level=ADVANCED_OPTIMIZATIONS --formatting=SINGLE_QUOTES --js=/tmp/speedread.js | sed s/%/%25/ >/tmp/speedread2.js

# Build html file
cat index_header.html /tmp/speedread2.js index_footer.html >$OUTPUT_HTML

