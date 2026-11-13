let items = [
  { desc: "Web design service", qty: 1, price: 100 },
  { desc: "Hosting (1 month)", qty: 1, price: 20 },
];
const symbols = { BDT: "৳", USD: "$", EUR: "€", GBP: "£", INR: "₹" };
const $ = id => document.getElementById(id);
const today = new Date().toISOString().slice(0,10);
$("invDate").value = today;
const due = new Date(); due.setDate(due.getDate()+14);
$("dueDate").value = due.toISOString().slice(0,10);

function money(n){ const c=$("currency").value; return (symbols[c]||"$")+Number(n||0).toFixed(2); }
function esc(s){ return String(s||"").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])); }

function drawItems(){
  $("items").innerHTML = items.map((it,i)=>`
    <div class="item-row">
      <label>Description<input value="${esc(it.desc)}" oninput="items[${i}].desc=this.value;render()"></label>
      <label>Qty<input type="number" min="0" step="1" value="${it.qty}" oninput="items[${i}].qty=+this.value||0;render()"></label>
      <label>Price<input type="number" min="0" step="0.01" value="${it.price}" oninput="items[${i}].price=+this.value||0;render()"></label>
      <label>Amount<input value="${money(it.qty*it.price)}" readonly></label>
      <button onclick="removeItem(${i})" title="Remove">✕</button>
    </div>`).join("");
}
function addItem(){ items.push({desc:"New item",qty:1,price:0}); drawItems(); render(); }
function removeItem(i){ items.splice(i,1); if(!items.length) items.push({desc:"",qty:1,price:0}); drawItems(); render(); }

function render(){
  drawItems();
  const sub = items.reduce((s,it)=>s+it.qty*it.price,0);
  const tax = sub * ((+$("taxRate").value||0)/100);
  const disc = sub * ((+$("discountRate").value||0)/100);
  const total = sub + tax - disc;
  $("preview").innerHTML = `
    <header>
      <div><h2>INVOICE</h2><div class="muted">${esc($("fromName").value)}<br>${esc($("fromAddress").value)}<br>${esc($("fromEmail").value)} • ${esc($("fromPhone").value)}</div></div>
      <div style="text-align:right"><strong>${esc($("invNo").value)}</strong><br><span class="muted">Date: ${esc($("invDate").value)}<br>Due: ${esc($("dueDate").value)}</span></div>
    </header>
    <p><strong>Bill To</strong><br>${esc($("toName").value)}<br><span class="muted">${esc($("toAddress").value)}<br>${esc($("toEmail").value)} ${esc($("toPhone").value)}</span></p>
    <table><tr><th>Description</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr>
    ${items.map(it=>`<tr><td>${esc(it.desc)}</td><td class="num">${it.qty}</td><td class="num">${money(it.price)}</td><td class="num">${money(it.qty*it.price)}</td></tr>`).join("")}
    </table>
    <div class="totals">
      <div><span>Subtotal</span><span>${money(sub)}</span></div>
      <div><span>Tax (${$("taxRate").value}%)</span><span>${money(tax)}</span></div>
      <div><span>Discount (${$("discountRate").value}%)</span><span>− ${money(disc)}</span></div>
      <div class="grand"><span>Total</span><span>${money(total)}</span></div>
    </div>
    <p><strong>Payment:</strong> ${esc($("payment").value)}</p>
    <p class="muted">${esc($("notes").value)}</p>`;
}
function downloadHTML(){
  const blob = new Blob([document.documentElement.outerHTML], {type:"text/html"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = ($("invNo").value||"invoice")+".html"; a.click();
}
function resetForm(){ location.reload(); }
render();
