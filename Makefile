ghost-themes: FORCE
	node find-ghost-themes.js
	for i in ./views/themes/*; do \
		cd $i; unzip $i/master.zip; cd -; done
	rm -rf ./views/themes/**/*/node_modules
	ln -s `pwd`/views/themes `pwd`/views/layouts/themes

FORCE:
