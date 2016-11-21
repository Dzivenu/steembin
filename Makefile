ghost-themes: FORCE
	node find-ghost-themes.js
	for i in ./views/layouts/themes/*; do \
			if [ -d $$i ]; then \
				cd $$i; \
				unzip ./master.zip > /dev/null 2>&1; \
				rm ./master.zip; \
				rm -rf ./*/node_modules; \
				cd -; \
				if [ -f $$i/*/post.hbs ]; then echo "Skip"; \
				else \
					rm -rf $$i; \
					rm -rf $$i.json; \
				fi; \
				if [ \`$$i.json | grep github\` ]; then echo "Skip"; \
				else \
					rm -rf $$i; \
					rm -rf $$i.json; \
				fi; \
			fi; \
		done
	rm -rf ./views/layouts/themes/**/*/node_modules
	rm -rf ./views/layouts/themes/**/*/bower_components
	# cp -r ./views/layouts/themes ./views/themes

FORCE:
