. システム構成図
「助け手通知」の先が、より明確に**「家族のデバイス/ブラウザ」**となる。
    C -->|Database Operations| E(データベース: PostgreSQL on AWS RDS)
    C -->|Notification API (SNS/SES)| F(家族への通知: メール/SMS)
    C -->|API Call| G(OpenAI API for NLP/Matching - Optional)
    H[家族のデバイス/ブラウザ] -->|Web UI/通知確認| C
2. 各コンポーネントの役割
助け手デバイス/ブラウザ:

役割が「家族」に特化。家族が依頼内容を確認し、受諾・辞退・完了報告を行うためのWebインターフェース。

システムからの通知（メール/SMS）も受信。

マッチングアルゴリズム:

「最適な助け手を選定」から、**「登録されている家族全員への効率的な通知と、最初に受諾した家族の特定」**に重点が移る。

将来的な拡張として、家族ごとの対応実績や時間帯を考慮した優先順位付けを検討。

3. データベース設計（主要テーブルの検討）
Users テーブル:

user_type を Elderly (高齢者) / Family (家族) に限定。

家族ユーザーの場合、elderly_id (FK to Users.user_id) を追加し、どの高齢者の家族であるかを紐づける。

Helpers テーブル: 不要になるか、FamilyMembers テーブルとして再定義される。

FamilyMembers テーブル (新設):

family_member_id (PK, FK to Users.user_id)

elderly_id (FK to Users.user_id, この家族がサポートする高齢者)

relationship (高齢者との関係性: 'Son', 'Daughter', 'Grandson' など)

notification_preferences (通知方法、時間帯など)

Matches テーブル:

helper_id が family_member_id に置き換わる。

詳細設計の変更点
1. フロントエンド（高齢者向けUI）詳細
依頼内容確認画面: 依頼内容が家族に通知されることを高齢者が理解できるよう、「この内容で家族にお知らせしますか？」のような文言に変更する。

2. バックエンドAPI仕様（抜粋）
POST /api/helper/register -> POST /api/family/register: 登録対象が家族に変わる。

POST /api/helper/request/{request_id}/accept -> POST /api/family/request/{request_id}/accept: APIエンドポイント名も変更し、家族がリクエストを処理することを示す。

3. AI連携詳細
マッチングアルゴリズム:

アルゴリズム概要（簡素化）:

AIが解析した依頼内容を基に、その依頼に対応できる登録されているすべての家族を抽出（スキルマッチングは任意）。

抽出された家族全員に通知を送信。

最初に「受諾」した家族が担当者となる。他の家族には「〇〇さんが引き受けました」と通知することも検討。

Pythonでの実装: 助け手データベースの全件取得と、簡単なフィルタリング、通知処理が主となる。

4. データベーススキーマ詳細（Requestsテーブルの例）
assigned_helper_id が assigned_family_member_id に置き換わり、family_members テーブルを参照するように変更。