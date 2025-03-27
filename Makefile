create-cont-docker:
	docker build --platform linux/amd64 -t sylius-showcase .
	docker run -v $(pwd)/media:/app/public/media -d --restart=always -p 8080:80 --name 'sylius' sylius-showcase
	docker exec -it sylius bin/console sylius:fixtures:load -n && sudo chown -R 33:33 media

create-cont-podman:
	podman build --platform linux/amd64 -t sylius-showcase .
	podman run -v $(pwd)/media:/app/public/media -d --restart=always -p 8080:80 --name 'sylius' sylius-showcase
	podman exec -it sylius bin/console sylius:fixtures:load -n && sudo chown -R 33:33 media

reset-database-docker:
	docker stop sylius
	docker rm sylius
	@$(MAKE) create-cont-docker

reset-database-podman:
	podman stop sylius
	podman rm sylius
	@$(MAKE) create-cont-podman

install-yarn:
	npm install -g yarn

use-cypress-yarn:
	yarn install
	yarn cypress

test-cypress-yarn-all:
	yarn cypress:test-suite

test-cypress-yarn-options:
	yarn cypress:test-file cypress/e2e/options.cy.js

test-selenium-yarn-all:
	yarn selenium:test-suite

test-selenium-yarn-options:
	yarn selenium:test-file selenium/e2e/options.js

use-cypress-npm:
	npm install
	npm run cypress

test-cypress-npm-all:
	npm run cypress:test-suite

test-cypress-npm-options:
	npm run cypress:test-file cypress/e2e/options.cy.js

test-selenium-npm-all:
	npm selenium:test-suite

test-selenium-npm-options:
	npm selenium:test-file selenium/e2e/options.js

