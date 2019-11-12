dev:
	npm run dev
	
run:
	npm run build
	cp favicon.ico dist
	tar -zcf dist.tar.gz dist

clean:
	rm -rf dist
	rm -rf dist.tar.gz