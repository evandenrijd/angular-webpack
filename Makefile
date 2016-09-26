.PHONY: all clean-dist copy-files
include tools.mk

SOURCES = server.js \
	./src/common/meta_data_ctor.js \
	./src/common/users_data_service_ctor.js \
	./src/common/settings_ctor.js \
	./src/common/settings_data_service_ctor.js \
	./src/common/file_ctor.js
TARGETS=$(patsubst %.js,%.plain.js,$(SOURCES))

all: clean-dist copy-files $(TARGETS)
	npm run dev

dist: clean-dist copy-files
	npm run prod

copy-files: ./public/dist/.keep_directory
	- cp -R ./src/public/* ./public/dist/

clean:
	rm -fR $(TARGETS)

clean-dist:
	rm -fR ./public/dist
