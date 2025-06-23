const esbuild = require('esbuild');
const { ensureDir, copyFile } = require('fs-extra');

async function main() {
  await esbuild.build({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],  // <-- Exclude the vscode API
  });
  await ensureDir('dist/images');
  await copyFile('src/images/gopher.png', 'dist/images/gopher.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
