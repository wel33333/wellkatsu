let items = [];

function updateScreen() {
  let total = 0;

  items.forEach(item => {
    total += item.price * item.qty;
  });

  document.getElementById("totalPrice").textContent =
    total.toLocaleString() + "円";

  const next = Math.ceil(total / 10000) * 10000;

  document.getElementById("nextTarget").textContent =
    "あと" + (next - total).toLocaleString() +
    "円で" + next.toLocaleString() + "円！";

  document.getElementById("paypay").textContent =
    Math.round(total * 0.665).toLocaleString() + "円";

  document.getElementById("waon").textContent =
    Math.round((total - total * 0.665) / 1.5).toLocaleString() + "pt";

  document.getElementById("reward").textContent =
    "0pt";
}
