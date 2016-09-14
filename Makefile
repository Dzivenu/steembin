ghost-themes: FORCE
	node find-ghost-themes.js
	for i in ./views/themes/*; do \
			if [ -d $$i ]; then \
				cd $$i; \
				unzip ./master.zip; \
				rm ./master.zip; \
				rm -rf ./*/node_modules; \
				cd -; \
				if ! [ -f $$i/post.hbs ]; then \
					rm -rf $$i
					rm -rf $$i.json
				fi; \
			fi; \
		done
	rm -rf ./views/themes/**/*/node_modules
	rm -rf ./views/themes/**/*/bower_components
	cp -r ./views/themes ./views/layouts/themes

FORCE:
