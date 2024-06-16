# プロジェクト: 大学の LLM 開発 プロジェクト

このリポジトリは、四国大学メディア情報学科の開発プロジェクトです。

## プロジェクトディレクトリ構造

- **bin**:  bash scprit など  便利な コマンド とかが入っています。
- **services** 
    - **chatbot**: チャットボットモジュールに関する詳細。
    - **client**: クライアント側アプリケーションに関する詳細。
    - **api**: APIモジュールに関する詳細。

## プロジェクトの立ち上げ方

### 前提条件

- [Dockerのインストール](https://www.docker.com/get-started/)
- Xcodeのインストール（iOSアプリを起動する場合）
- iOSシミュレータのインストール（iOSアプリを起動する場合）
- Expo Goアプリのインストール（Expoで開発されたアプリを起動する場合）
- Node.Js のインストール

### 立ち上げ手順

1. Dockerを起動します。

2. コマンドラインから以下のコマンドを実行します。

### api だけ 起動する場合
```bash
bin/start
```


#### iOSアプリを起動する場合（データベースを含む）

```bash
bin/start -i

```

#### Androidアプリを起動する場合（データベースを含む）
```bash
bin/start -a
```


# git / github 運用ルール

### ブランチ命名規則 (Branch naming conventions):
#### ブランチ名は 機能と わかるようにする

- 機能ブランチ (Feature branches):
    - 形式: f/branch-name 
    - 例: f/login-client

- 修正ブランチ (Bugfix branches):
    - 形式: b/branch-name
   - 例: bugfix/456-fix-api-response-error


# commit
 - できるだけ 詳細内容を書く commit メセッジは 長くしない
 - 作業が完了したら、変更をローカルに留め置かずにプッシュする（コードの喪失を防ぐため）。
 

 # pull request
 - プルリクエストを作成し、コードの変更を他のチームメンバーにレビューしてもらう
 -  プル リクエストを 作成時に内容をきちんと書く, 見てもらいたい内容、特にレビューをお願いしたい箇所, 今回保留した項目・次の課題 などとかわかりやすくかく 
 - もし  コードの内容が そのままで マージされない前提であればタイトルの 先頭に [wip]  

 # merge
 - pull request ぜずに merge しない
 - マジしたら ブランチも消す ロカルも リモートブランチも
