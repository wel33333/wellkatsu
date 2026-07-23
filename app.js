// ==========================
// ウエル活マスター Ver2.0
// ==========================

let items = JSON.parse(localStorage.getItem("items")) || [];

function save() {
    localStorage.setItem("items", JSON.stringify(items));
}

function addItem() {

    const name = prompt("商品名");
    if (!name) return;

    const price = Number(prompt("価格"));
    if (!price) return;

    const qty = Number(prompt("数量", "1")) || 1;

    items.push({
        name,
        price,
        qty
    });

    save();
    render();
}

function removeItem(index) {

    if (confirm("削除しますか？")) {

        items.splice(index,1);

        save();

        render();

    }

}

function plus(index){

    items[index].qty++;

    save();

    render();

}

function minus(index){

    if(items[index].qty>1){

        items[index].qty--;

    }else{

        removeItem(index);

        return;

    }

    save();

    render();

}

function render(){

    let total=0;

    const list=document.getElementById("itemList");

    if(items.length===0){

        list.innerHTML="商品はありません";

    }else{

        list.innerHTML="";

        items.forEach((item,index)=>{

            total+=item.price*item.qty;

            list.innerHTML+=`
            <div style="
            border:1px solid #ddd;
            border-radius:10px;
            padding:10px;
            margin-bottom:10px;">

            <b>${item.name}</b><br>

            ${item.price.toLocaleString()}円 × ${item.qty}

            <br><br>

            <button onclick="minus(${index})">－</button>

            <button onclick="plus(${index})">＋</button>

            <button onclick="removeItem(${index})">
            🗑削除
            </button>

            </div>
            `;

        });

    }

    document.getElementById("totalPrice").textContent=
    total.toLocaleString()+"円";

    const target=Math.ceil((total+1)/10000)*10000;

    document.getElementById("nextTarget").textContent=
    "あと"+(target-total).toLocaleString()+"円で"+
    target.toLocaleString()+"円！";

    //----------------------
    // PayPayおすすめ
    //----------------------

    const paypay=Math.round(total*0.665);

    document.getElementById("paypay").textContent=
    paypay.toLocaleString()+"円";

    const waon=Math.ceil((total-paypay)/1.5);

    document.getElementById("waon").textContent=
    waon.toLocaleString()+"pt";

    document.getElementById("reward").textContent=
    "0pt";

}

document
.getElementById("addButton")
.onclick=addItem;

render();
