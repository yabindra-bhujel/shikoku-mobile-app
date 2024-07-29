#!/bin/bash
set -e

# データベースの 設定
DATABASE_USER='postgres'
DATABASE_PASSWORD='root'
DATABASE_HOST='localhost'
DATABASE_PORT='5433'
DATABASE_NAME='school_db'

echo "Terminating connections to database $DATABASE_NAME..."

# データベースの接続中断
psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d postgres <<EOF
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '$DATABASE_NAME'
      AND pid <> pg_backend_pid();
EOF

echo "Recreating database $DATABASE_NAME..."

# データベースをDROP して 新しく作る
psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d postgres <<EOF
    -- Drop the existing database if it exists
    DROP DATABASE IF EXISTS $DATABASE_NAME;

    -- Create a new database
    CREATE DATABASE $DATABASE_NAME WITH OWNER $DATABASE_USER;
EOF

echo "Database $DATABASE_NAME has been recreated successfully!"
