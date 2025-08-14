GitとAWS Amplifyを利用して静的ウェブサイトを公開・運用する方法

この手順は、ローカルのウェブサイトファイルをGitHubにアップロードし、AWS Amplifyと連携させて自動でデプロイするためのガイドです。

---
### ステップ1：Gitリポジトリの準備（GitHubを利用）
---

目的：ローカルのコードをGitHubにアップロードします。

1. GitHubで新しいリポジトリを作成します（例: `summer-vacation-site`）。

2. ローカルの `summer_vacation` フォルダで、以下のコマンドを実行します。

   ```bash
   # Gitリポジトリを初期化
   git init

   # すべてのファイルをステージング
   git add .

   # 最初のコミット
   git commit -m "最初のコミット"

   # GitHubリポジトリをリモートとして追加（<YOUR_USERNAME>と<YOUR_REPO_NAME>は自分のものに置き換える）
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git

   # mainブランチにプッシュ
   git push -u origin main
   ```

---
### ステップ2：AWS Amplifyでプロジェクトを作成
---

目的：AWS上で、GitHubリポジトリと連携するプロジェクトを作成します。

1. AWSコンソールにログインし、「AWS Amplify」サービスに移動します。

2. 「新しいアプリケーションをホストする」 -> 「Host web app」をクリックします。

3. Gitプロバイダーとして「GitHub」を選択し、画面の指示に従って認証します。

4. 公開したいリポジトリとブランチ（`main`）を選択し、「次へ」をクリックします。

---
### ステップ3：ビルド設定の確認とデプロイ
---

目的：ウェブサイトのファイルがどこにあるかをAmplifyに教え、デプロイを開始します。

1. ビルド設定画面で、Amplifyが提案する設定が表示されます。

2. `design` フォルダにサイトのファイルがあるため、設定ファイルを以下のように編集します。

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands: []
       build:
         commands: []
     artifacts:
       # 公開するファイル群は `design` フォルダの中にあることを指定
       baseDirectory: design
       files:
         - '**/*'
     cache:
       paths: []
   ```

3. 設定を確認し、「次へ」 -> 「保存してデプロイ」をクリックします。

---
### ステップ4：デプロイの確認とサイトへのアクセス
---

1. デプロイが自動で開始され、数分で完了します。

2. すべてのステップが緑色のチェックマークになったら成功です。

3. 画面に表示される `https://main.xxxxxxxx.amplifyapp.com` のようなURLが、あなたのウェブサイトのアドレスです。

---
### 今後の運用方法
---

ウェブサイトの更新は、ローカルでファイルを編集し、以下の3つのコマンドを実行するだけです。

```bash
git add .
git commit -m "更新内容のメモ"
git push
```

`git push` を実行すると、Amplifyが自動で変更を検知し、ウェブサイトを更新します。
