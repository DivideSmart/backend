# modify database scheme according to the change of models.py
python dividesmart/manage.py makemigrations

# apply above migrations
python dividesmart/manage.py migrate

# python dividesmart/manage.py showtasks

# remove the obsolete bundle
rm -r ./dividesmart/bundled_static/dev/*

webpack --config webpack.config.dev.js --mode development &  # run webpack watching mode in background

if [ $# -ge 1 ]; then
    .dividesmart/manage.py runserver 0.0.0.0:$1  # run Django development server on specify port
else
    ./dividesmart/manage.py runserver 0.0.0.0:8000  # run Django development server on default port 8080
fi

pkill -f webpack  # kill wepback watching mode after django dev server is terminated

rm -r ./dividesmart/bundled_static/dev/*
