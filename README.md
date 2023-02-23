# negative-news-filter
- インストール→[Firefox](https://addons.mozilla.org/firefox/addon/negative-news-filter/)
- ソースコードは[/firefox](/firefox)から。ルールファイルは[rules.json](/rules.json)
## 機能
- ニュースサイトでNGワードを含む記事リンクを非表示にします。
  - ツールバーの♥アイコンから設定画面を開き、改行でワードを区切って追加して下さい。
  - 正規表現が使えます。
- NGワードに関わらず、以下のような迷惑要素も一括非表示にできます。
  - サイドバー：ページ右側のサイドバー
  - ランキング：各種ランキング
  - 関連記事：**記事本文下**の関連記事・おすすめ記事
  - コメント：コメント欄（素人・専門家不問）・読者の反応（「いいね」など）
  - フッター：ページ下側のフッター
  - 有料記事：有料記事リンク。ただし、アイコンや値段表示を参照しているのでそれらがない記事には効果なし。
## 対応サイト
- [rules.json](/rules.json)で対応しているニュースサイトは以下の通りです。
  - 新聞：読売・日経・産経・朝日・毎日・東京・京都・北海道
  - テレビ：NHK・日テレ・FNN・テレ朝・TBS
  - ネットニュース（大手）：Yahoo!・ニコニコ・時事通信・J-CAST・エキサイト・ライブドア・goo
  - 海外メディア（日本語）：BBC・CNN
  - ビジネス誌：アゴラ・JBpress・現代ビジネス・東洋経済・ダイヤモンド・プレジデント・フォーブス・ウェッジ
- Pull requestsやIssuesからリクエストを送って下されば適宜ルールを追加します！
- もちろん、アドオン内でユーザがマイルールを追加することも可能です。
## ルール（[rules.json](/rules.json)およびマイルール）の書き方
- JSON形式で記述します。キーは"url", "article", "paid", "side", "ranking", "related", "comment", "footer", "remove", "//"です。
- "url"：URLです。正規表現・行頭マッチ（^）で書きます。"\\"は"\\\\"と書くことに注意して下さい。
  - 例："url":  "^https?://(www|news)\\\\.example\\\\.com/"
- "article": NGワードで非表示にする対象の記事リンク要素です。CSSセレクタで指定し、値は配列形式で複数の要素を書くことができます（以下同様）。開発者向けモードではここで指定された要素がピンクで表示されます。
- "paid"：有料記事を示す鍵アイコンや要素を指定します。"article"で指定されている要素の子孫ノードでないと効果が無いので注意です。
- "side", "ranking", "related", "comment", "footer"：それぞれサイドバー、ランキング、関連記事、コメント欄、フッターです。開発者向けではここで指定された要素が赤い外枠で表示されます。
- "remove"（非推奨）：本アドオンの動作に支障を来す要素を指定します。設定の如何を問わず強制削除するので、極力使わないで下さい（「注意点」も参照）。
- "//"：補足事項を書く欄です。"comment"キーはコメント欄要素の指定ですので注意して下さい。
## 注意点
- **広告やCookie通知等の一般的な迷惑要素には対応しません**。このような要素については[**uBlock Origin**](https://github.com/gorhill/uBlock)の方が高度なブロックが出来るからです。そもそも、このアドオンはuBlock Originの補完目的として作成しました（NGワードの設定はuBOではやりにくく、また上記のような迷惑要素に対応しているフィルタが無かったため）。このような経緯であるため、このアドオンの利用者には別途uBlock Origin（およびAdGuard Japanese, Annoyances, Social Media）を入れることを**強く推奨します**。
- このアドオンの動作に支障を来す要素を削除しています（rules.jsonのremoveキー）。例えば時事通信の記事ページをスクロールするとトップページに戻る機能などです。この機能はじきに削除する予定です。
