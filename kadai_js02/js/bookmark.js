// 保存ボタンのセレクタ
// var button = document.querySelector(".save_button");
let button= $(".save_button");


// 入力ボックスのセレクタ
// var siteName = document.querySelector("[name='site_name']");
let siteName = $("[name='site_name']")[0];
// var url = document.querySelector("[name='url']");
let url = $("[name='url']")[0];
// ブックマークエリアのセレクタ
// var bookmarksSection = document.querySelector(".bookmarks");
let bookmarksSection = $(".bookmarks");
//localStorage.clear();
// ローカルストレージフォルダを作成
if (typeof (localStorage.bookmark) == "undefined") {
    localStorage.bookmark = JSON.stringify(new Array());
}

// Saveボタンをクリックした時
// button.addEventListener("click", function (e) {
button.on('click',function(e){

    // 送信ボタンを押した時の通常のフォーム送信処理をキャンセルする。
    // 勝手に遷移したり、おかしな処理をしないようにする。
    e.preventDefault();

    // Urlのパターン
    let patterURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

    // 宣言
    let bookmark_json, oldbookmark, newItem, check = false, adr, itemAdr, newest_id;

    // Validation (フォームに入力された値に誤りがないか確認する。)

    if (siteName.value === "") { // タイトルが空白だったらエラー
        alert("サイト名を入力してください。");
    } else if (url.value === "") {　// URLが空白だったらエラー
        alert("URLを入力していください。");
    } else if (!patterURL.test(url.value)) { // URL形式でなかった場合、エラー
        alert("正確なURLを入力してください。");
    } else {　// 入力が正確だった時の処理

        // ローカルストレージからbookmark(json)を取得する。
        bookmark_json = localStorage.bookmark;
        oldbookmark = JSON.parse(bookmark_json);

        //入力 URL
        adr = url.value;
        adr = adr.replace(/http:\/\/|https:\/\//i, "");

        // item 形式は
        // {"id":0,
        //  "title":"aaaaa",
        //  "date":"2021/08/25 10:00:00",
        //  "url":"https://google.com"
        //  };
        for (item of oldbookmark){
            itemAdr = item.url.replace(/http:\/\/|https:\/\//i, "");
            if (itemAdr == adr) {
                check = true;
            }
        }
        // 重複している。時の処理
        if (check == true) {
            alert("このサイトURLは登録済みです。");
        }
        else {
            //重複してない時は登録
            // 保存されているデータがある時は、IDの最大値を取得する。
            if (oldbookmark.length > 0 )
                newest_id = oldbookmark.reduce((a,b)=>a.id>b.id?a:b)
            else // データがない時は１を指定
                newest_id = 1

            // 今日
            let now = new Date();
            let now_disp = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
            // 登録するデータを作成する。
            newItem = {
                    "id" : newest_id,
                    "title" : siteName.value,
                    "date" :now_disp,
                    "url" : url.value
            };
            //元の配列にデータを登録
            oldbookmark.push(newItem);
            // Jsonに変換
            let setjson = JSON.stringify(oldbookmark); 
            // ローカルストレージに登録
            localStorage.bookmark = setjson;
            // 登録したデータを表示する。
            addBookmark(newest_id, newItem.date, siteName.value, url.value);
            // 入力データを空白にする
            siteName.value = "";
            url.value = "";
        }
    }
});
    


// ブックマークをHTMLで表示する部分

function addBookmark(id, date, name, url) {
    let dataLink = url;
    let short_title = name.substr(0, 18);
    // urlにhttpsがない時は、//を手前につけてhttp,httpsどちらでもアクセスできるようにする。
    if (!url.includes("http")) {
        url = "//" + url;
    }
    // ブックマーククラス内に　日付、タイトル、URLを設定する。
    // 隠しパラーメータでデータ削除用のIDも表示する。
    // 削除ボタンクリック時に、関数（removeBookmark）を呼び出す。
    // thisは、要素を指定するために、クリックしたボタンの要素を選択できるようにしておく。
    let item = `<div class="bookmark">
                <span class="date">${date}</span>
                 <span class="title">${name}</span>
                 <a class="visit" href="${url}" target="_blank" 
                    data-link='${dataLink}'>記事を見る</a>
                 <a onclick="removeBookmark(this)" 
                    class="delete" href="#">記事を削除</a>
                    <input id="id" name="id" type="hidden" value="${id}">
                </div>`;
    // ブックマークセクションにitemのHTMLを　追記 する。 +=で追記
    bookmarksSection[0].innerHTML += item;
}

// 読み込み時に、ローカルストレージからデータを取得して、
// 保存されているデータを表示する。
// (function fetchBoookmark() {
//     // ローカルストレージにデータがあるか確認
//     
// })();
$(window).on('load', function() {
    if (typeof (localStorage.bookmark) != "undefined" && localStorage.bookmark !== "") {

        // ローカルストレージからデータとってくる。
        bookmark_json = localStorage.bookmark;
        // Jsonデータに変換。
        boomarklist = JSON.parse(bookmark_json);
        // 保存されている配列データ全てを
        for (item of boomarklist) {
            // html上に描画する。
            addBookmark(item.id, item.date, item.title, item.url);
        }
    }
});

// ブックマークの削除

function removeBookmark(thisItem) {
    let item = thisItem.parentNode, // ボタン要素の一つ上のdivを取得する。
        id = item.querySelector("input").value; // 隠し要素のidデータを取得する。

    // ローカルストレージからデータとってくる。
    bookmark_json = localStorage.bookmark;
    // Jsonデータに変換。
    boomarklist = JSON.parse(bookmark_json);

    // 配列データから、指定されたID要素を削除する。
    //https://qiita.com/_shimizu/items/b8eac14f399e20599818
    boomarklist.some(function(v, i){
        if (v.id==id) boomarklist.splice(i, 1); //idの要素を削除
    });

    // Jsonに変換
    let setjson = JSON.stringify(boomarklist);
    // ローカルストレージに登録
    localStorage.bookmark = setjson;

    // 削除されたURL情報をHTML上から削除する。
    bookmarksSection.removeChild(item);
}
