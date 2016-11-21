ghost-themes: FORCE
	which cat
	node find-ghost-themes.js
	for i in ./views/layouts/themes/*; do \
			if [ -d $$i ]; then \
				echo $$i; \
				cd $$i; \
				unzip ./master.zip > /dev/null 2>&1; \
				rm ./master.zip; \
				rm -rf ./*/node_modules; \
				cd -; \
			fi; \
		done
	rm -rf ./views/layouts/themes/**/*/node_modules
	rm -rf ./views/layouts/themes/**/*/bower_components
	cp -r ./views/layouts/themes ./views/themes

FORCE:
