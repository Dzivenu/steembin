ghost-themes: FORCE
	node find-ghost-themes.js
	for i in ./views/themes/*; do \
		cd $i; ls; unzip ./master.zip; rm ./master.zip; rm -rf ./*/node_modules; cd -; done
	rm -rf ./views/themes/**/*/node_modules
	ln -s `pwd`/views/themes `pwd`/views/layouts/themes

FORCE:
