#!/bin/bash

echo "Waiting for MySQL to be ready..."

# Функция проверки подключения к MySQL
wait_for_mysql() {
    local host="$1"
    local port="$2"
    local user="$3"
    local password="$4"
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt/$max_attempts: Checking MySQL connection..."
        
        if mysql -h"$host" -P"$port" -u"$user" -p"$password" -e "SELECT 1" >/dev/null 2>&1; then
            echo "MySQL is ready!"
            return 0
        fi
        
        echo "MySQL is not ready yet. Waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "ERROR: MySQL is not ready after $max_attempts attempts"
    return 1
}

# Ожидаем готовности MySQL
wait_for_mysql "${DB_HOST}" "${DB_PORT}" "${DB_USER}" "${DB_PASSWORD}"

if [ $? -eq 0 ]; then
    echo "MySQL is ready. Running database initialization..."
    npm run init-db
    
    echo "Starting the application..."
    node dist/index.js
else
    echo "Failed to connect to MySQL. Exiting..."
    exit 1
fi 