source env/bin/activate

pip install -r prod_requirements.txt

python dividesmart/manage.py makemigrations
python dividesmart/manage.py migrate

sudo env/bin/python dividesmart/manage.py collectstatic --noinput

# invalidate content in memcached
# python dividesmart/manage.py invalidate_cachalot -c default

# ask apache to reload Django, this command works because Django runs in daemon mode:
# https://stackoverflow.com/a/4206134/6159872
# https://code.google.com/archive/p/modwsgi/wikis/ReloadingSourceCode.wiki
touch dividesmart/dividesmart/wsgi.py
