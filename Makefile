RM=rm -f
MKDIR=mkdir -p

PERL=perl
COFFEE=coffee
# Requires closure-compiler (https://developers.google.com/closure/compiler/)
COMPILER_JAR=compiler.jar
MINIFY=java -jar $(COMPILER_JAR) --compilation_level=ADVANCED_OPTIMIZATIONS --formatting=SINGLE_QUOTES --output_wrapper "(function(){%output%}).call(this);"

BUILD=build
TEST=test
SPEC=spec
LOADER=speedread-loader
SPEEDREAD=speedread
UNITTESTS=unittests

.PHONY: all builddir specs test clean

all: builddir $(BUILD)/$(LOADER)-mini.js $(BUILD)/$(SPEEDREAD)-mini.js $(TEST)/$(SPEEDREAD).js $(TEST)/$(UNITTESTS).js specs index.html

builddir:
	$(MKDIR) $(BUILD)

$(BUILD)/$(LOADER).js: $(LOADER).coffee
	$(COFFEE) -o $(BUILD) -c $<

$(BUILD)/$(LOADER)-mini.js: $(BUILD)/$(LOADER).js
	$(MINIFY) --js=$< > $@

$(BUILD)/$(SPEEDREAD).js: $(SPEEDREAD).coffee
	$(COFFEE) -o $(BUILD) -c $<

$(BUILD)/$(SPEEDREAD)-mini.js: $(BUILD)/$(SPEEDREAD).js
	$(MINIFY) --js=$< > $@

index.html: index_template.html $(BUILD)/$(SPEEDREAD)-mini.js $(BUILD)/$(LOADER).js index_generator.pl
	$(PERL) index_generator.pl > $@

$(TEST)/$(SPEEDREAD).js: $(SPEEDREAD).coffee
	$(COFFEE) -o $(TEST) -b -c $<

$(TEST)/$(UNITTESTS).js: $(UNITTESTS).coffee
	$(COFFEE) -o $(TEST) -b -c $<

specs:
	$(COFFEE) -c $(SPEC) 

test:
	jasmine-node --coffee --verbose spec/

clean:
	$(RM) $(BUILD)/*.js $(TEST)/*.js $(SPEC)/*.spec.js index.html

