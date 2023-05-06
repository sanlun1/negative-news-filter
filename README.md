# negative-news-filter
- インストール→[Firefox](https://addons.mozilla.org/firefox/addon/negative-news-filter/)
- ソースコードは[/firefox](/firefox)から。ルールファイルは[rules.json](/rules.json)
## 機能
- ニュースサイトでNGワードを含む記事リンクを非表示にします。
  - ツールバーの♥アイコンから設定画面を開き、改行でワードを区切って追加して下さい。
  - 正規表現が使えます。
  - 「**強引モード**」をオンにすることで、ルールの有無に関わらず全てのサイトでNGワードを含むaタグリンクを除去することができます。ただし、aタグに含まれない画像等の要素は除去できないのであくまでも簡易的なフィルタとしてお使い下さい。
- NGワードに関わらず、以下のような迷惑要素も一括非表示にできます。
  - サイドバー：ページ右側のサイドバー
  - ランキング：各種ランキング
  - 関連記事：**記事本文下**の関連記事・おすすめ記事
  - コメント：コメント欄（素人・専門家不問）・コメント数・読者の反応（「いいね」など）
  - フッター：ページ下側のフッター
  - 有料記事：有料記事リンク。ただし、アイコンや値段表示を参照しているのでそれらがない記事には効果なし。
## 対応サイト
- [rules.json](/rules.json)で対応しているニュースサイトは以下の通りです（*印はスマホ版ページも対応）。
  - 新聞：読売・日経・産経・朝日・毎日・北海道・河北・東京・下野・静岡・中日・京都・神戸・中国・高知・西日本（関連記事・ランキング未対応）
  - テレビ：NHK・日テレ・FNN・テレ朝・TBS・カンテレ・ytv・ABC・MBS
  - ネットニュース（総合）：Yahoo!・Google・ニコニコ・時事通信*・J-CAST・エキサイト・ライブドア・goo・BIGLOBE・47NEWS・iza・zakzak
  - 海外メディア（日本語）：BBC・CNN・REUTERS・AFPBB
  - ビジネス・言論：アゴラ・JBpress・現代ビジネス・東洋経済・ダイヤモンド・プレジデント・フォーブス・ウェッジ・SAKISIRU
  - スポーツ・芸能：報知・サンスポ・デイリー・東スポ・スポニチ・ゲンダイ・ABEMA
- Pull requestsやIssuesからリクエストを送って下されば適宜対応サイトを増やします！
  - GitHubを使いたくない人は[作者HP](https://www.eonet.ne.jp/~internet/nnf/)の[BBS](https://www.eonet.ne.jp/~internet/nnf/bbs/)からどうぞ。
- もちろん、アドオン内でユーザがマイルールを追加することも可能です。
## ルール（[rules.json](/rules.json)およびマイルール）の書き方
- JSON形式で記述します。キーは"url", "article", "paid", "side", "ranking", "related", "comment", "footer", "remove", "//"です。
- "url"：URLです。正規表現・行頭マッチ（^）で書きます。"\\"は"\\\\"と書くことに注意して下さい。
  - 例："url":  "^https?://(www|news)\\\\.example\\\\.com/"
- "article": NGワードで非表示にする対象の記事リンク要素です。CSSセレクタで指定し、値は配列形式で複数の要素を書くことができます（以下同様）。開発者向けモードではここで指定された要素がピンクで表示されます。
- "paid"：有料記事を示す鍵アイコンや要素を指定します。"article"で指定されている要素の子孫ノードでないと効果が無いので注意です。
- "side", "ranking", "related", "comment", "footer"：それぞれサイドバー、ランキング、関連記事、コメント欄、フッターです。開発者向けではここで指定された要素が赤い外枠で表示されます。
- "remove"：本アドオンの動作に支障を来す要素（主にShadow DOMの親ノード）を指定します。設定の如何を問わず強制削除するので、極力使わないで下さい。
- "//"：補足事項を書く欄です。"comment"キーはコメント欄要素ですので注意して下さい。
## 注意点
- **広告やCookie通知等の一般的な迷惑要素には対応しません**。このような要素については[**uBlock Origin**](https://github.com/gorhill/uBlock)の方が高度なブロックが出来るからです。そもそも、このアドオンはuBlock Originの補完目的として作成しました（NGワードの設定はuBOではやりにくく、また上記のような迷惑要素に対応しているフィルタが無かったため）。このような経緯であるため、本アドオンの利用者には別途uBlock Originをインストールした上で、AdGuard Japanese, AdGuard Annoyances, AdGuard Social Media, [AdGuard Japanese filter Plus](https://github.com/Yuki2718/adblock2)の計4種類のフィルタ（前3者はUBO標準組込、後1者はリンクから）を購読することを**強く推奨します**。
