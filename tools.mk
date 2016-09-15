.SUFFIXES:
.SECONDEXPANSION:

SHELL := $(shell which bash)

noecho := @

# PATH := $(shell pwd)/node_modules/.bin:$(PATH)

#regular Unix/bash tools
dir_mode := 700
file_mode := 400
noop := @true
install := install
install_dir := $(install) -m $(dir_mode) -d
install_file := $(install) -p -m $(file_mode) -T
#install_files takes one directory and multiple sources
install_files := $(install) -p -m $(file_mode) -t
rm := rm -f
echo := echo
touch:= touch

%/.keep_directory:
	$(noecho)$(install_dir) $(dir $@)
	$(noecho)$(touch) $@

.PRECIOUS: %/.keep_directory
