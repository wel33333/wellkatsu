// ============================
// ウエル活マスター Ver4.0
// ============================

// 商品一覧
let items = JSON.parse(localStorage.getItem("items")) || [];

// 商品マスター
let productDB = JSON.parse(localStorage.getItem("productDB")) || {};

// 設定
let settings = JSON.parse(localStorage.getItem("settings")) || {
    couponRate: 20,
    couponMax: 1000,
    paypayLimit: 66.5
};

// 保存
function saveAll() {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("productDB", JSON.stringify(productDB));
    localStorage.setItem("settings", JSON.stringify(settings));
}

// 商品追加
function addItem() {

    const name = prompt("商品名");
    if (!name) return;

    const price = Number(prompt("価格"));
    if (price <= 0) return;

    const qty = Number(prompt("数量", "1")) || 1;

    items.push({
        name,
        barcode: "",
        price,
        qty,
        recipe: false,
        paypay: false,
        cashback: 0
    });

    saveAll();
    render();
}

// 削除
function removeItem(index){

    if(!confirm("削除しますか？")) return;

    items.splice(index,1);

    saveAll();

    render();

}

// 数量＋
function plus(index){

    items[index].qty++;

    saveAll();

    render();

}

// 数量－
function minus(index){

    if(items[index].qty>1){

        items[index].qty--;

    }else{

        removeItem(index);

    }

    saveAll();

    render();

}
// ============================
// 画面更新
// ============================

function render(){

    const list = document.getElementById("itemList");

    let total = 0;

    list.innerHTML = "";

    if(items.length===0){

        list.innerHTML = "商品はありません";

    }

    items.forEach((item,index)=>{

        total += item.price * item.qty;

        list.innerHTML += `
        <div class="item">

            <h3>${item.name}</h3>

            <small>${item.barcode || ""}</small>

            <p>${item.price.toLocaleString()}円 × ${item.qty}</p>

            <button onclick="minus(${index})">－</button>

            <button onclick="plus(${index})">＋</button>

            <button onclick="removeItem(${index})">🗑 削除</button>

        </div>
        `;

    });

    document.getElementById("totalPrice").textContent =
        total.toLocaleString() + "円";

    const next = Math.ceil((total + 1) / 10000) * 10000;

document.getElementById("nextTarget").textContent =
    "あと" +
    (next-total).toLocaleString() +
    "円で" +
    next.toLocaleString() +
    "円！";

calculatePayment(total);

}
        
// ============================
// PayPay・WAON計算
// ============================

function calculatePayment(total){

    settings.couponRate =
        Number(document.getElementById("couponRate")?.value) || settings.couponRate;

    settings.couponMax =
        Number(document.getElementById("couponMax")?.value) || settings.couponMax;

    settings.paypayLimit =
        Number(document.getElementById("paypayLimit")?.value) || settings.paypayLimit;

    saveAll();

    const maxPayPay =
        Math.floor(settings.couponMax / (settings.couponRate / 100));

    const paypay = Math.min(
        Math.round(total * settings.paypayLimit / 100),
        maxPayPay
    );

    const waon =
        Math.ceil((total - paypay) / 1.5);

    const reward =
        Math.min(
            Math.floor(paypay * settings.couponRate / 100),
            settings.couponMax
        );

    const paypayEl = document.getElementById("paypay");
    if(paypayEl) paypayEl.textContent = paypay.toLocaleString()+"円";

    const waonEl = document.getElementById("waon");
    if(waonEl) waonEl.textContent = waon.toLocaleString()+"pt";

    const rewardEl = document.getElementById("reward");
    if(rewardEl) rewardEl.textContent = reward.toLocaleString()+"pt";

}

// ============================
// バーコード商品追加
// ============================

function addBarcode(code){

    // 登録済み商品なら数量だけ増やす
    const index = items.findIndex(item => item.barcode === code);

    if(index >= 0){

        items[index].qty++;

        saveAll();

        render();

        return;
    }

    // 商品マスターに登録済みなら追加
    if(productDB[code]){

        const p = productDB[code];

        items.push({
            name: p.name,
            barcode: code,
            price: p.price,
            qty: 1,
            recipe: p.recipe,
            paypay: p.paypay,
            cashback: p.cashback || 0
        });

        saveAll();

        render();

        return;
    }

    // 初めての商品
    const name = prompt("商品名");
    if(!name) return;

    const price = Number(prompt("価格"));
    if(price <= 0) return;

    const recipe = confirm("レシチャレ対象ですか？");
    const paypay = confirm("PayPay対象ですか？");

    productDB[code] = {
        name,
        price,
        recipe,
        paypay,
        cashback: 0
    };

    items.push({
        name,
        barcode: code,
        price,
        qty: 1,
        recipe,
        paypay,
        cashback: 0
    });

    saveAll();

    render();

}
