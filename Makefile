embed:
	cat dist/partials/embed.html | pbcopy

deploy:
	rsync -rvzL -i --update --exclude={'*.mp4', '*.mp3', '*.jpg', 'assets/*.json'} -e ssh dist/ mcc.mi:2022/${PROJ_NAME}

## Must set up gcloud cli to use these commands
bucket:
	gsutil -m rsync -r -x ".DS_Store|partials/" dist/ gs://mc-high-impact/$(shell date +'%Y')/$(notdir $(CURDIR))

test:
	gsutil -m rsync -n -r -x ".DS_Store|partials/" dist/ gs://mc-high-impact/$(shell date +'%Y')/$(notdir $(CURDIR))

.PHONY: bucket \
		test   \
		embed  \
		deploy \