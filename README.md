# Overview
This repo aims to automate and standardize as much of the process of getting graphics from Adobe Illustrator onto a CUE page as possible.

## One-Time Setup Steps

### 1. Install `gsutils`
If not already installed locally, you'll need to install [gsutils](https://cloud.google.com/storage/docs/gsutil_install) and get permissions to the `mc-high-impact` folder.

### 2. Clone repo and install dependencies
```
git clone git@github.com:mcclatchy/svelte-adobe-illustrator.git
npm install
```

### 3. Add ai2svelte script to Adobe Illustrator
The `ai2svelte.js` script needs to be added to the appropriate local folder of Adobe Illustrator scripts. The process is the same as installing `ai2html`. I added a copy of the `ai2svelte.js` file in this repository (forked and adapted from NYT's [ai2html](https://github.com/newsdev/ai2html) and Reuter's [ai2svelte](https://github.com/reuters-graphics/ai2svelte).

Below is a command you can use on a Mac to copy the file into the right directory - due to permissions of the Adobe Illustrator file, you may need to use `sudo`. Your local filepath to the Adobe Illustrator folder may be different than this one, and you can also manually drag and drop the file in Finder if you prefer.
```
sudo cp src/lib/ai2svelte.js /Applications/Adobe\ Illustrator\ 2022/Presets.localized/en_US/Scripts/
```

### 4. Open `src/ai2svelte-input/ai2html-config.json` file in Adobe Illustrator
You need to ensure Adobe Illustrator has permissions to access the `ai2html-config.json` file (named with "html" because it's forked from `ai2html` - we could change this name if we really want). This file has some settings which we can use to override the settings in `ai2svelte.js` without changing the source code.

In Adobe Illustrator, click File -> Open then in the modal, set the Enable dropdown to **All Documents** and navigate to the `svelte-adobe-illustrator/src/ai2svelte-input/ai2html-config.json` file and open it up. Now running `ai2svelte` in Adobe Illustrator will be abel to read this file.


## Typical Workflow Steps

![resources](https://docs.google.com/drawings/d/e/2PACX-1vRnTuSQXyPXwoLWMCSmItLFnjmK9ReiCKA0lYXrDSMt8NgBM4OqYfuelZPU8pkTle3JibHJV5AEplQt/pub?w=1509&h=1344)


### 1. Create your Adobe Illustrator `.ai` file in `src/ai2html-input` folder
You can open up Adobe Illustrator and create a new file, and save it into the `src/ai2svelte-input` folder within your local copy of `svelte-adobe-illustrator`. To keep this repo light, the `.gitignore` is set to ignore `.ai` files so they don't bog down the commmit history.

If you want to test a quick set up, download the `.ai` files in this [Google folder](https://drive.google.com/drive/u/0/folders/1oCWsZ3kJ_VvmzruAA_5milcDgAFG6Aqv), and place them directly into the local `src/ai2html-input` folder.

#### File naming convention
What you name the `.ai` file will form the basis for the name of the Google bucket storage folder name and the filename URLs in your CUE embed. I'm proposing we use `kebab-case` and keep the names descriptive, but short. The examples in the Google folder are 
```
poultry-three-counties
poultry-statewide
tweet-timeline
```

#### Artboards
For now, we only support one artboard per graphic format. A mobile version uses 1 artboard. A desktop version uses 1 separate artboard. But a mobile version cannot yet be split into, say, 4 artboards as this won't work with the `ai2svelte` expectations.

### 2. In Adobe Illustrator, run `ai2svelte`
When your graphic is ready for testing, click on File -> Scripts -> ai2svelte and you should get a popup after the script runs successfully (or if it errors out). This script will output files like this:
```
File Type   Local Output Folder
.svelte     svelte-adobe-illustrator/src/ai2svelte-output
.png        svelte-adobe-illustrator/src/ai2svelte-output/imgs
```

The `.gitignore` will similarly automatically exclude these image files and Svelte files.

### 3.  Update `graphicConfig.json`
In the root of the repo, there will be a `graphicsConfig.json` file. It should look something like this:
```
{
    "graphics": [
        {
            "graphic_filename": "poultry-three-counties",
            "graphic_title": "Big poultry growth spurts",
            "graphic_description": "Three counties with significant growth in the number of poultry raised include Robeson, Anson and Duplin.",
            "graphic_notes": "Source: N.C. Department of Agriculture and Consumer Services",
            "google_bucket_year": "2023",
            "google_bucket_folder": "ai2svelte-examples"
        },
        {
            "graphic_filename": "poultry-statewide",
            "graphic_title": "North Carolina’s poultry crop: more than 1 billion birds",
            "graphic_description": "Statewide, chicken and turkey production has grown 66% since 1991. It jumped more than 17% since 2016.",
            "graphic_notes": "Source: N.C. Department of Agriculture and Consumer Services",
            "google_bucket_year": "2023",
            "google_bucket_folder": "ai2svelte-examples"
        },
        {
            "graphic_filename": "tweet-timeline",
            "google_bucket_year": "2023",
            "google_bucket_folder": "ai2svelte-examples",
            "embed_infographic_class": "full-bleed"
        }
    ]
}
```

#### Required fields
```
graphic_filename          Needs to match the name of the .ai file
google_bucket_year        In the Google bucket we store projects by year (e.g. mc-high-impact/2023)
google_bucker_folder      The subfolder of the project within the year (e.g. mc-high-impact/2023/ai2svelte-examples)
```

#### Optional fields
```
graphic_title             Title of the graphic (goes above graphic by default)
graphic_description       More detailed description of the graphic (goes above graphic, below title by default)
graphic_notes             Notes/source/byline of the graphic (goes below graphic by default
embed_infographic_class   Class name to add to the div that CUE wraps embeds in (e.g. full-bleed, wide)
```


### 4.  Run `generateGraphics.js` script

#### Generating a local preview
From the command line at the root of the `svelte-adobe-illustrator` repo, locally run the following for a preview of your graphics. Running this command will output files to the `svelte-adobe-illustrator/src/google-bucket-output` folder (also excluded from the repo by `.gitignore`). But it will not deploy these changes to the Google bucket.

```
node src/js/generateGraphics
npm run dev
```

In order to view the changes locally, your preview page should be located at 
```
http://localhost:3000/
```

#### Deploying to Google Bucket
Once you're happy with preview, run the same command using the deploy flag (`-d`) which will send the files in your local `google-bucket-output` folder into the Google bucket in the cloud. That Google bucket folder, in turn, auto-pushes changes to files every 15 minutes to the McClatchy servers using `rsync`.

```
node src/js/generateGraphics -d
```

### 5.  Create CUE embeds
The deploy-to-google-bucket script also prints HTML code for the CUE embed as part of its console output. That output should look something like the following:

```html
<script type="module" crossorigin src="/static/hi/2023/ai2svelte-examples/poultry-three-counties/embed.js"></script>
<link rel="stylesheet" href="/static/hi/2023/ai2svelte-examples/poultry-three-counties/embed.css">
<div id="embedRoot-0" class="embedRoot"></div>
```

Copy/paste this HTML output and create/publish a new embed in CUE (see [CUE embed creation walkthrough](https://docs.google.com/document/d/1zuSFDU8qTZeoF5HJfz__FBExMccBe_0Oi3Q6bm0L23g/edit)). As long as the Adobe Illustrator file name does not change, this CUE embed is a one-time setup. When added to a story and previewed or published, it will pull the latest version of the graphics files found in the McClatchy servers.



