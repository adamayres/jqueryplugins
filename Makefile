build: rsmin acr acrmin acrzip

INTRO_FILE = template/intro
COMMA = ,
COPY_YEAR = $(shell date "+%Y")
DATE = $(shell date)

ACR = ajax-cache-response
ACR_SRC_FILE = ${ACR}/src/jquery.${ACR}-1.1.js
ACR_ZIP_FILE = ${ACR}/jquery.${ACR}.zip
ACR_BUILD_FILE = ${ACR}/jquery.${ACR}.js
ACR_BUILD_MIN_FILE = ${ACR}/jquery.${ACR}.min.js

RS = request-storage
RS_FILE = ${RS}/${RS}.js
RS_MIN_FILE = ${RS}/${RS}.min.js

SF = stack-fiddle
SF_FILE = ${SF}/${SF}.js
SF_MIN_FILE = ${SF}/${SF}.min.js

define build_intro

sed -e 's/@DATE/${DATE}/' \
		-e 's/@COPY_YEAR/${COPY_YEAR}/' \
		-e 's/@LIB/${1}/' \
		-e 's/@DEP/${2}/' \
		-e 's/@PATH/${3}/' \
	${INTRO_FILE} > ${INTRO_FILE}.tmp
	
uglifyjs -nc ${4} > ${5}
cat ${INTRO_FILE}.tmp ${5} > ${5}.tmp
mv ${5}.tmp ${5}
rm -rf ${INTRO_FILE}.tmp

endef

acr: ${RS_FILE} ${ACR_SRC_FILE} 
	cat $^ > ${ACR_BUILD_FILE}

acrmin:
	$(call build_intro,Ajax Cache Response,${COMMA} Request Storage,${ACR},${ACR_BUILD_FILE},${ACR_BUILD_MIN_FILE})
	
acrlint:
	jslint ${ACR_SRC_FILE}
	
acrzip:
	zip -r ${ACR_ZIP_FILE} ${ACR}
	
rsmin:
	$(call build_intro,Request Storage,,${RS},${RS_FILE},${RS_MIN_FILE})
	
rslint:
	jslint ${RS_FILE}
	
sfmin:
	$(call build_intro,Stack Fiddle,,${SF},${SF_FILE},${SF_MIN_FILE})
	
sflint:
	jslint ${SF_FILE}
	
	