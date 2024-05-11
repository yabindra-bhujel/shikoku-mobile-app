#!/bin/bash

set -e

# データベース接続情報の設定
DATABASE_USER='postgres'
DATABASE_PASSWORD='root'
DATABASE_HOST='localhost'
DATABASE_PORT='5433'
DATABASE_NAME='school_db'

# Docker コンテナ名
DOCKER_CONTAINER='postgres_db'

# ダンプファイル名をユーザに指定させる
read -p "作成するダンプファイル名を入力してください: " DUMP_FILE

# pg_dump コマンドの構築 (オプションで --no-owner と --no-comments を追加)
PG_DUMP_COMMAND="docker exec ${DOCKER_CONTAINER} pg_dump -U ${DATABASE_USER} ${DATABASE_NAME} --exclude-table=alembic_version --no-owner --no-comments > ${DUMP_FILE}"

# コンテナ内で pg_dump を実行してデータベースダンプを作成
echo "データベース '${DATABASE_NAME}' のダンプを作成します..."
eval "${PG_DUMP_COMMAND}"

echo "データベース '${DATABASE_NAME}' のダンプを ${DUMP_FILE} に作成しました。"
