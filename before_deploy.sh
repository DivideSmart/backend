# remove the obsolte bundle (both development version and production version)
rm -r ./dividesmart/bundled_static/dev/*
rm -r ./dividesmart/bundled_static/prod/*

# generate new production-version bundle
webpack --config webpack.config.js --mode production
