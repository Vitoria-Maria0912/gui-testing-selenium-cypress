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

use-cypress:
	yarn install
	yarn cypress

test-cypress-all:
	yarn cypress:test-suite

test-cypress-options:
	yarn cypress:test-file cypress/e2e/options.cy.js

test-selenium-all:
	yarn selenium:test-suite

test-selenium-options:
	yarn selenium:test-file selenium/e2e/options.js

