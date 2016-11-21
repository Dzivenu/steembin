ghost-themes: FORCE
	which cat
	node find-ghost-themes.js
	for i in ./views/layouts/themes/*; do \
			if [ -d $$i ]; then \
				echo $$i; \
				cd $$i; \
				unzip ./master.zip; \
				rm ./master.zip; \
				rm -rf ./*/node_modules; \
				cd -; \
			fi; \
		done
	rm -rf ./views/layouts/themes/**/node_modules
	rm -rf ./views/layouts/themes/**/bower_components
	ln ./views/layouts/themes ./views/themes

FORCE:
