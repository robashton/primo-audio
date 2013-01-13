all: concat
	 
concat:
	browserify demo/demo.js > demo/demo-built.js

watch:
	browserify demo/demo.js -o demo/demo-built.js --watch --debug
