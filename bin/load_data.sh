#!/bin/bash

set -e

# データベース接続情報の設定
DATABASE_USER='postgres'
DATABASE_PASSWORD='root'
DATABASE_HOST='localhost'
DATABASE_PORT='5433'
DATABASE_NAME='school_db'

# psql接続コマンドの構築
PSQL_CONNECTION="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

# 確認関数の定義
confirm() {
    local prompt="${1}"
    local default="${2:-はい}"
    local response
    read -p "${prompt} (${default}): " response
    case "$response" in
        [Yyはい]* ) return 0;;  # 'yes'、'はい'、'Yes'、'はい' の場合は成功(0)を返す
        [Nnいいえ]* ) return 1;;  # 'no'、'いいえ'、'No'、'いいえ' の場合は失敗(1)を返す
        "" ) return 0;;  # 空の場合はデフォルト値で成功(0)を返す
        * ) echo "「はい」または「いいえ」を入力してください。"; confirm "${prompt}" "${default}";;
    esac
}

# コマンドライン引数の処理
if [ $# -ne 2 ]; then
    echo "使用法: $0 <sql_file> <yes/no>"
    exit 1
fi

sql_file="$1"
response="$2"

if [ ! -f "$sql_file" ]; then
    echo "エラー: ファイル '${sql_file}' が見つかりません。"
    exit 1
fi

# 確認メッセージの表示
confirm "データをデータベース '${DATABASE_NAME}' に投入しますか？" "${response}" || exit 0

# データベースが存在しない場合は作成
if ! psql "${PSQL_CONNECTION}" -lqt | cut -d \| -f 1 | grep -qw "${DATABASE_NAME}"; then
    psql "${PSQL_CONNECTION}" -c "CREATE DATABASE ${DATABASE_NAME};" || true
fi

# データをデータベースに投入する前に既存のデータを削除
if confirm "データベース '${DATABASE_NAME}' の既存データを削除しますか？" "${response}"; then
    # テーブル名 'alembic_version' 以外のテーブルのデータを削除
    psql "${PSQL_CONNECTION}" -c "DELETE FROM public.table_name WHERE table_schema = 'public' AND table_name NOT IN ('alembic_version');"
    echo "データベース '${DATABASE_NAME}' の既存データを削除しました。"
fi

# データをデータベースに投入
psql "${PSQL_CONNECTION}" -d "${DATABASE_NAME}" -f "${sql_file}"

echo "データの投入が完了しました！"
