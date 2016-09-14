ghost-themes: FORCE
	node find-ghost-themes.js
	cp -r ./views/themes/ ./views/layouts/themes

FORCE:
