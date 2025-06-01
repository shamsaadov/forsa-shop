#!/bin/bash

echo "Waiting for MySQL to be ready..."
echo "DB Host: ${DB_HOST}"
echo "DB Port: ${DB_PORT}"
echo "DB User: ${DB_USER}"
echo "DB Name: ${DB_NAME}"

# Функция проверки подключения к MySQL
wait_for_mysql() {
    local host="$1"
    local port="$2"
    local user="$3"
    local password="$4"
    local root_password="${MYSQL_ROOT_PASSWORD:-secret}"
    local max_attempts=60
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt/$max_attempts: Checking MySQL connection..."
        
        # Сначала проверим сетевое подключение
        if nc -z "$host" "$port" 2>/dev/null; then
            echo "Network connection to $host:$port is OK"
            
            # Проверяем подключение как root (чтобы убедиться что MySQL готов)
            if mysql -h"$host" -P"$port" -uroot -p"$root_password" -e "SELECT 1" >/dev/null 2>&1; then
                echo "MySQL root connection is OK"
                
                # Теперь пробуем подключиться как обычный пользователь
                if mysql -h"$host" -P"$port" -u"$user" -p"$password" -e "SELECT 1" >/dev/null 2>&1; then
                    echo "MySQL user connection is OK!"
                    return 0
                else
                    echo "MySQL user '$user' connection failed - checking if user exists..."
                    # Проверим существует ли пользователь
                    user_exists=$(mysql -h"$host" -P"$port" -uroot -p"$root_password" -se "SELECT COUNT(*) FROM mysql.user WHERE User='$user';" 2>/dev/null)
                    if [ "$user_exists" = "1" ]; then
                        echo "User '$user' exists, but password might be wrong"
                    else
                        echo "User '$user' does not exist - MySQL still initializing"
                    fi
                fi
            else
                echo "MySQL root connection failed - MySQL still starting"
            fi
        else
            echo "Cannot connect to $host:$port (network issue)"
        fi
        
        echo "MySQL is not ready yet. Waiting 3 seconds..."
        sleep 3
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