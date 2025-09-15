// This script deploys the contents of the dist folder to the gh-pages branch
const ghpages = require('gh-pages');

ghpages.publish('dist', function(err) {
  if (err) {
    console.error('Deploy failed:', err);
    process.exit(1);
  } else {
    console.log('Deployed to GitHub Pages!');
  }
});
