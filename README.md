# プロジェクト: LLM 開発 プロジェクト

このリポジトリは、四国大学メディア情報学科の開発プロジェクトです。

## プロジェクトディレクトリ構造

- **api**: APIモジュールに関する詳細。
- **bin**:  bash scprit など  便利な コマンド とかが入っています。
- **chatbot**: チャットボットモジュールに関する詳細。
- **client**: クライアント側アプリケーションに関する詳細。

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

#### update expo
npm install expo@~51.0.5

#### update 
npm install expo-font@~12.0.5

### expo-router
npm install expo-router@~3.5.12

#### 
npm install react-native-reanimated@~3.10.1

### 
sudo npm install -g expo-cli

### react navigation
npm install @react-navigation/native-stack





