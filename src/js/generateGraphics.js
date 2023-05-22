const fs = require('fs')
const fse = require('fs-extra');
const { spawn } = require("child_process");
const cp = require('child_process')


// https://github.com/ralphtheninja/await-spawn
const asyncSpawn = (...args) => {
  const child = spawn(...args, { stdio: "inherit", shell: true })
  const stdout = child.stdout ? new BufferList() : ''
  const stderr = child.stderr ? new BufferList() : ''

  if (child.stdout) {
    child.stdout.on('data', data => {
      stdout.append(data)
    })
  }

  if (child.stderr) {
    child.stderr.on('data', data => {
      stderr.append(data)
    })
  }

  const promise = new Promise((resolve, reject) => {
    child.on('error', reject)

    child.on('close', code => {
      if (code === 0) {
        resolve(stdout)
      } else {
        const err = new Error(`child exited with code ${code}`)
        err.code = code
        err.stderr = stderr
        err.stdout = stdout
        reject(err)
      }
    })
  })

  promise.child = child

  return promise
}

// https://github.com/hanford/await-exec
function asyncExec(command, options = { log: false, cwd: process.cwd() }) {
  if (options.log) console.log(command)

  return new Promise((done, failed) => {
    cp.exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout
        err.stderr = stderr
        failed(err)
        return
      }

      done({ stdout, stderr })
    })
  })
}

const graphicsConfig = JSON.parse(fs.readFileSync("graphicsConfig.json"))['graphics']

const imports = []
const paths = []
const graphics = []
const mains = []
const partials = []

const args = process.argv;
const shouldDeployToGoogleBucket = args && args[2] === '-d'




const createGraphic = async (graphic, i) => {
    const graphicFilename = graphic?.graphic_filename
    const graphicTitle = graphic?.graphic_title
    const graphicDescription = graphic?.graphic_description
    const graphicNotes = graphic?.graphic_notes
    const googleBucketYear = graphic?.google_bucket_year
    const googleBucketFolder = graphic?.google_bucket_folder
    const googleBucketOutputPath = `${googleBucketYear}/${googleBucketFolder}/${graphicFilename}`
    const embedInfographicClass = graphic?.embed_infographic_class;

    console.log(`
#################################################################################

    ${graphicFilename}

#################################################################################
`
)

    const importTemplate = `
        import Graphic${i} from '../../ai2svelte-output/${graphicFilename}.svelte';
    `
    const pathTemplate = `
        const baseUrl${i} = \`https://www.\${domain}.com/static/hi/${googleBucketOutputPath}\`
        const imagePath${i} = import.meta.env.PROD ? \`\${baseUrl${i}}\` : '../../src/ai2svelte-output/imgs'
    `
    const titleTemplate = graphicTitle ? `<GraphicTitle text="${graphicTitle}"/>` : ""
    const descriptionTemplate = graphicDescription ? `<GraphicDescription text="${graphicDescription}"/>` : ""
    const notesTemplate = graphicNotes ? `<GraphicNotes text="${graphicNotes}"/>` : ""
    const graphicTemplate = `
        ${titleTemplate}
        ${descriptionTemplate}
        <Graphic${i} imagePath={imagePath${i}}/>
        ${notesTemplate}
    `
    const exportTemplate = `
        <script>
            import Fonts from './Fonts.svelte';

            import GraphicDescription from './GraphicDescription.svelte';
            import GraphicNotes from './GraphicNotes.svelte';
            import GraphicTitle from './GraphicTitle.svelte';
            ${importTemplate}

            const domain = window.pageInfo['marketInfo.domain'];
            ${pathTemplate}
        </script>

        <style type='text/css'>
            :global(.g-text) {
            width: min(var(--story-width), 100%);
            --hf: var(--serif);
            --ht: none;
            }
        </style>

        <Fonts/>
        ${graphicTemplate}
    `
    await fs.writeFileSync(`./src/js/components/AppGraphic${i}.svelte`, exportTemplate);


    // Write to main.js to plug into the npm run build workflow for the specific graphic
    const mainEmbedClass = embedInfographicClass ? `embed${i}.closest(".embed-infographic")?.classList.add("${embedInfographicClass}")` : ""
    const mainTemplate = `
        import App${i} from './components/AppGraphic${i}.svelte';

        window.$${i} = document.querySelector.bind(document);
        const embed${i} = $${i}('#embedRoot-${i}');
        ${mainEmbedClass}

        const app${i} = new App${i}({
            target: embed${i}
        })
    `
    await fs.writeFileSync("./src/js/main.js", mainTemplate);

    const partialsEmbedTemplate = `
      <div id="embedRoot-${i}" class="embedRoot"></div>
      <script type="module" src="{{resolve-from-root '/src/js/main.js'}}"></script>
    `
    await fs.writeFileSync("./partials/embed.html", partialsEmbedTemplate);

    console.log(`
---------------------------------------------------------------------------------
    Step 1: Compiling the files...
---------------------------------------------------------------------------------
`
)
    await asyncSpawn('npm run build', [])


    // Move the built dist/assets folder into the google-bucket-output folder
    const sourceEmbedDirectory = "./dist/assets/"
    const sourceImageDirectory = "./src/ai2svelte-output/imgs"
    const destinationDirectory = `./src/google-bucket-output/${googleBucketOutputPath}`

    // Move the embeds into the correct folder location
    try {
      await fse.copySync(sourceEmbedDirectory, destinationDirectory, { overwrite: true })
    } catch (err) {
      console.error(err)
    }

    await fs.readdirSync(sourceImageDirectory).forEach(image => {
        // Move the images into the correct folder location
        if (image.startsWith(graphicFilename)) {
            try {
              fse.copySync(`${sourceImageDirectory}/${image}`, `${destinationDirectory}/${image}`, { overwrite: true })
            } catch (err) {
              console.error(err)
            }
        }
    });
    
    // Add custom embed.html into assets folder
    const embedTemplate = 
`<script type="module" crossorigin src="/static/hi/${googleBucketOutputPath}/embed.js"></script>
<link rel="stylesheet" href="/static/hi/${googleBucketOutputPath}/embed.css">
<div id="embedRoot-${i}" class="embedRoot"></div>`

    await fs.writeFileSync(`${destinationDirectory}/embed.html`, embedTemplate);

  if (shouldDeployToGoogleBucket) {
    console.log(`
  }
---------------------------------------------------------------------------------
    Step 2:  Sending files to google bucket folder
    Folder:  ${googleBucketOutputPath}
---------------------------------------------------------------------------------

`
)
    await asyncSpawn(`gsutil -m rsync -r -x ".DS_Store|partials/" src/google-bucket-output/${googleBucketOutputPath}/ gs://mc-high-impact/${googleBucketOutputPath}`);
  

    console.log(`
  }
---------------------------------------------------------------------------------
    Step 3:  Copy/paste this HTML code into CUE

${embedTemplate}

---------------------------------------------------------------------------------

`
)

  }


  imports.push(importTemplate)
  paths.push(pathTemplate)
  graphics.push(graphicTemplate)

  const spacerTemplate = "<p>Integer eu tristique odio. Sed ac dui non quam aliquam pretium. Suspendisse potenti. Vivamus vehicula sapien ac dignissim sodales. Curabitur lobortis euismod maximus. Nunc condimentum consectetur tellus non consectetur. Cras suscipit metus eget mi convallis dignissim eu a sem. Mauris mi risus, porta at malesuada quis, viverra sit amet erat. Vestibulum vitae commodo libero. Nam volutpat vitae odio porta vehicula.</p>"
  const previewTemplate =  `
      <script>
          import Fonts from './Fonts.svelte';

          import GraphicDescription from './GraphicDescription.svelte';
          import GraphicNotes from './GraphicNotes.svelte';
          import GraphicTitle from './GraphicTitle.svelte';
          ${imports.join("\n")}

          const domain = window.pageInfo['marketInfo.domain'];
          ${paths.join("\n")}

      </script>

      <style type='text/css'>
          :global(.g-text) {
          width: min(var(--story-width), 100%);
          --hf: var(--serif);
          --ht: none;
          }
      </style>

      <Fonts/>
      ${graphics.join(spacerTemplate)}
  ` 
  await fs.writeFileSync('./src/js/components/App.svelte', previewTemplate);


  mains.push(mainTemplate)
  const previewMainTemplate = mains.join("\n")
  await fs.writeFileSync('./src/js/main.js', previewMainTemplate);

  partials.push(partialsEmbedTemplate)
  const embedInfographics = partials.map((p) => {
    return `
    <div class="embed-infographic">
      ${p}
    </div>
`
  });
  const previewPartialsTemplate = embedInfographics.join(spacerTemplate)
  await fs.writeFileSync(`./partials/embed.html`, previewPartialsTemplate);

}

const createGraphics = async (graphic, i) => {
  for (const [i, graphic] of graphicsConfig.entries()) {
    await createGraphic(graphic, i);
  }
}

createGraphics();
