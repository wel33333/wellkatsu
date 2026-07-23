// ===== 設定 =====
let settings = JSON.parse(localStorage.getItem("settings")) || {
    couponRate: 20,
    couponMax: 1000,
    paypayLimit: 66.5
};

let productDB = JSON.parse(localStorage.getItem("productDB")) || {};
// ウエル活マスター Ver3.0

let items = JSON.parse(localStorage.getItem("items")) || [];

function saveItems() {

    localStorage.setItem("items", JSON.stringify(items));

    localStorage.setItem("productDB", JSON.stringify(productDB));

}

function addItem() {

    const name = prompt("商品名を入力してください");
    if (!name) return;

    const price = Number(prompt("価格を入力してください"));
    if (price <= 0) return;

    const qty = Number(prompt("数量", "1")) || 1;

    items.push({
        name: name,
        price: price,
        qty: qty
    });

    saveItems();
    render();

}


function removeItem(index) {

    if (!confirm("削除しますか？")) return;

    items.splice(index, 1);

    saveItems();

    render();

}

function plus(index) {

    items[index].qty++;

    saveItems();

    render();

}

function minus(index) {

    if (items[index].qty > 1) {

        items[index].qty--;

    } else {

        removeItem(index);
        return;

    }

    saveItems();

    render();

}

function render() {

    const list = document.getElementById("itemList");

    let total = 0;

    if (items.length === 0) {

        list.innerHTML = "商品はありません";

    } else {

        list.innerHTML = "";

        items.forEach((item, index) => {

            total += item.price * item.qty;

            list.innerHTML += `
            <div class="item">
                <h3>${item.name}</h3>

<small>${item.barcode}</small>
                <p>

${item.price.toLocaleString()}円 × ${item.qty}

<br>

${item.recipe ? "🎁レシチャレ" : ""}

${item.paypay ? " 💳PayPay" : ""}

</p>

                <button onclick="minus(${index})">－</button>
                <button onclick="plus(${index})">＋</button>
                <button onclick="removeItem(${index})">🗑 削除</button>
<br><br>

<label>レシチャレ還元</label>

<input
type="number"
value="${item.cashback}"
onchange="updateCashback(${index}, this.value)"
style="width:90px;"> pt
                
            </div>
            `;

        });

    }

    document.getElementById("totalPrice").textContent =
        total.toLocaleString() + "円";

    const next = Math.ceil((total + 1) / 10000) * 10000;

    document.getElementById("nextTarget").textContent =
        "あと" + (next - total).toLocaleString() +
        "円で" + next.toLocaleString() + "円！";

    const const couponRate =
    Number(document.getElementById("couponRate").value) || 20;

const couponMax =
    Number(document.getElementById("couponMax").value) || 1000;

const paypayLimit =
    Number(document.getElementById("paypayLimit").value) || 66.5;

const maxPayPay =
    Math.floor(couponMax / (couponRate / 100));

const recommendedPayPay =
    Math.min(
        Math.round(total * paypayLimit / 100),
        maxPayPay
    );

const paypay = recommendedPayPay;

    document.getElementById("paypay").textContent =
        paypay.toLocaleString() + "円";

    const waon =
    Math.ceil((total - recommendedPayPay) / 1.5);

    document.getElementById("waon").textContent =
        waon.toLocaleString() + "pt";

    document.getElementById("reward").textContent = "0pt";
let cashbackTotal = 0;

items.forEach(item=>{

    if(item.recipe){

        cashbackTotal += item.cashback * item.qty;

    }

});

document.getElementById("cashbackTotal").textContent =
    cashbackTotal.toLocaleString() + "pt";
}

document.getElementById("addButton").addEventListener("click", addItem);

render();
let scanner;

document.getElementById("checkoutTotal").textContent =
    total.toLocaleString() + "円";

document.getElementById("checkoutPayPay").textContent =
    paypay.toLocaleString() + "円";

document.getElementById("checkoutWaon").textContent =
    waon.toLocaleString() + "pt";

const reward = Math.min(
    Math.floor(paypay * 0.20),
    1000
);

document.getElementById("checkoutReward").textContent =
    reward.toLocaleString() + "pt";

document.getElementById("checkoutNext").textContent =
    (next - total).toLocaleString() + "円";

function startScanner(){

    document.getElementById("barcodeResult").textContent="カメラ起動中...";

    scanner=new Html5Qrcode("reader");

    scanner.start(

        { facingMode:"environment" },

        {

            fps:10,

            qrbox:250

        },

        function(decodedText){

            document.getElementById("barcodeResult").textContent=decodedText;

            scanner.stop();

            addBarcode(decodedText);

        },

        function(){}

    );function addBarcode(code){

   if(productDB[code]){

    const index = items.findIndex(item => item.barcode === code);

    if(index >= 0){

        items[index].qty++;

    }else{

        const p = productDB[code];

        items.push({

            name:p.name,

            barcode:code,

            price:p.price,

            qty:1,

            recipe:p.recipe,

            paypay:p.paypay

        });

    }

    saveItems();

    render();

    return;

}


    }

    const name = prompt("商品名");

    if(!name) return;

    const price = Number(prompt("価格"));

    if(price<=0) return;

    const recipe = confirm("レシチャレ対象？");

    const paypay = confirm("PayPay対象？");

    productDB[code]={

        name,

        price,

        recipe,

        paypay

    };

    items.push({

            name:p.name,

            barcode:code,

            price:p.price,

            qty:1,

            recipe:p.recipe,

            paypay:p.paypay

        });

    saveItems();
function saveSettings() {

    settings.couponRate =
        Number(document.getElementById("couponRate").value);

    settings.couponMax =
        Number(document.getElementById("couponMax").value);

    settings.paypayLimit =
        Number(document.getElementById("paypayLimit").value);

    localStorage.setItem(
        "settings",
        JSON.stringify(settings)
    );

    render();

}
    render();

}


}
    
    

}
document.getElementById("couponRate").value =
    settings.couponRate;

document.getElementById("couponMax").value =
    settings.couponMax;

document.getElementById("paypayLimit").value =
    settings.paypayLimit;

document.getElementById("couponRate")
    .addEventListener("change", saveSettings);

document.getElementById("couponMax")
    .addEventListener("change", saveSettings);

document.getElementById("paypayLimit")
    .addEventListener("change", saveSettings);

document
.getElementById("couponPreset")
.addEventListener("change", function(){

    switch(this.value){

        case "20-1000":

            settings.couponRate = 20;
            settings.couponMax = 1000;
            break;

        case "10-500":

            settings.couponRate = 10;
            settings.couponMax = 500;
            break;

        case "5-300":

            settings.couponRate = 5;
            settings.couponMax = 300;
            break;

        default:

            return;

    }

    document.getElementById("couponRate").value=settings.couponRate;
    document.getElementById("couponMax").value=settings.couponMax;

    saveSettings();

});

function updateCashback(index, value){

    items[index].cashback = Number(value) || 0;

    saveItems();

    render();

}
