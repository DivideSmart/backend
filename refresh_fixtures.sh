FIXTURES="dividesmart/fixtures.py"

echo "Deleting existing database."
rm dividesmart/db.sqlite3
echo "Generating new migrations."
python dividesmart/manage.py makemigrations
echo "Migrating database."
python dividesmart/manage.py migrate
echo "Adding fixtures data from $FIXTURES"
python ${FIXTURES}
