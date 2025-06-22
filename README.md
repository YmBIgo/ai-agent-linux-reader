Search Page : https://storage.googleapis.com/linux-reader/index5.html  
VSCode : https://marketplace.visualstudio.com/items?itemName=coffeecupjapan.linux-reader

## Linux Reader とは？
Linux Reader とは、LLMと一緒にLinuxのコードを読むためのツールです。

[\[LinuxReaderデモ\](https://youtu.be/cuhBrpQenJs)](https://youtu.be/cuhBrpQenJs)

#### [できること]
- 人がコードを読まずともLLMが関数探索してくれる（VSCode）
- 前に進んだ関数経路に戻れる（VSCode）
- 調べている関数経路のバグをLLMが見つけてくれる（VSCode）
- 調べている関数をLLMが図にしてくれる（VSCode）
- 調べた関数経路をLLMがレポートにしてくれる（VSCode）
- 調べた関数経路をインポート・エクスポートできる（VSCode）
- 自分の調べた関数経路をアップロードでき、他人の調べた関数経路を検索できる（web）

#### [効果]
- Linuxコードをランダムウォークなしに読み進められる
- 土地勘がないと10分以上かかる数百行、数千行の関数のコードリーディングを、LLMが1分で終わらせてくれる
- Linuxコードのバグを見つけられる機能がある
- 頭にいれるだけで暗黙知になりがちな関数経路や関数の説明をLLMがしてくれる
- 関数経路のアップロード・検索機能（web）により、暗黙知の共有がされる

#### [できないこと/人の作業]
- エントリーポイントの把握
- LLMによる関数自動探索（人が判断した方が正確）
- コードベースを分割せず一括でLLMに調べさせること

## 利用方法
VSCode拡張としてはまだ公開していません。  
公開し次第、VSCode拡張でのインストール方法を書きます。

#### 用意するもの
clangd(14系以上), Linuxのコード, Linuxのcompile_commands.json, vscode(1.100.0以上)  
OpenAIかAnthropicかPLaMoかGeminiのAPIキー

1. Linuxコードベース、clangdの準備

```
git clone https://github.com/torvalds/linux
brew install clangd
```

2. compile_commands.json の用意

https://zenn.dev/tmsn/articles/6317bdf591bc97

なども参考にする

```
make defconfig
bear -- make LLVM=1 -j16
```

3. vscode のインストール

1.100.0 以上をインストールしてください

4. LinuxReader のインストール

```
git clone https://github.com/YmBIgo/LinuxReader
```

5. VSCode で LinuxReader をダウンロード

https://marketplace.visualstudio.com/items?itemName=coffeecupjapan.linux-reader&ssr=false#overview

#### 開く
ダウンロード完了したら、「Command + Shift + p」でコマンドパレットを開き、「Open Linux in New Tab」をクリック  
クリック後に、右側にタブウィンドウが出てくれば成功です

6. 設定の入力
clangdのパス、Linuxのパス、compile_commands.json のディレクトリのパス、LLM（OpenAI・Claude・Plamo・Gemini）を入力

7. チャット画面で探索を開始
最初に、「探索を開始するファイルパス」「探索を開始する関数」「探索の目的」を入力すれば、探索を開始できます。

8. 探索を制御
しばらくすると、LLMが関数の中から重要な関数を選ぶので、そこから内容を探索したい関数を選択します。  
すると、またLLMが関数の中から重要な関数を選ぶので、そこから再度探索したい関数を選択します。  
以上の流れを、自分がいいと思うまで続けます。

9. その他機能
その他にも、「過去の探索経路からの再探索機能」「探索経路のインポート・エクスポート機能」「バグ発見機能」「探索レポート機能」などがあります。  
また、https://storage.googleapis.com/linux-reader/index5.html から自分の探索した経路の登録や他人の探索した経路の検索ができます。

## Release Notes

#### 1.0.0

LinuxReaderの最初のリリース

#### 1.0.2

履歴保存・履歴から再検索の機能を追加

### 1.0.3

Gemini対応