const { build } = require('esbuild')
const define = {}

for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k])
}

const options = {
  entryPoints: ['./src/app.js'],
  outfile: './dist/app.js',
  bundle: true,
  define,
}

build(options).catch(() => process.exit(1))
