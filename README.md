# Run the project
docker compose up --build

# This will generate a file like: ./src/db/migrations/20231231000000-add-users-table.cjs
npm run migrations create "add table"

# Run migrations up
docker-compose exec api npm run migrations up
