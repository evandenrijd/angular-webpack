.PHONY: all clean-dist copy-files
include tools.mk

all: clean-dist copy-files
	npm run dev

dist: clean-dist copy-files
	npm run prod

copy-files: ./public/dist/.keep_directory
	- cp -R ./src/public/* ./public/dist/

clean-dist:
	rm -fR ./public/dist
