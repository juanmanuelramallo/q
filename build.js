const { build } = require('esbuild')
const define = {}

const buildName = process.env.BUILD_NAME;
const baseApiUrl = process.env.BASE_API_URL;
if (buildName === undefined) {
  console.error('Please specify a BUILD_NAME');
  process.exit(1);
} else if (baseApiUrl === undefined) {
  console.error('Please specify a BASE_API_URL');
  process.exit(1);
} else {
  console.log(`Building for ${buildName} using ${baseApiUrl}`);
}

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

const options = {
  entryPoints: ['./src/app.js'],
  outfile: `./dist/${buildName}.js`,
  bundle: true,
  define,
}

build(options).catch(() => process.exit(1))
