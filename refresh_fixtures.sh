rm dividesmart/db.sqlite3
python dividesmart/manage.py makemigrations
python dividesmart/manage.py migrate
python dividesmart/fixtures.py
