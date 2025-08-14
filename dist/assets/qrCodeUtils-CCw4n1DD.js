const i=a=>{try{return JSON.stringify({type:"piggy_bank",...a,timestamp:new Date().toISOString()})}catch(t){return console.error("QR kod oluşturma hatası:",t),`QB${Date.now().toString().slice(-6)}QR`}},s=a=>{try{const t=JSON.parse(a);return t.type==="piggy_bank"?{isValid:!0,bankNumber:t.bankNumber,bankId:t.bankId,timestamp:t.timestamp}:{isValid:!1}}catch{return{isValid:!1}}},o=a=>{const t=new Date().getFullYear();let r=1;const n=a.map(e=>e.bankNumber);for(;;){const e=`KB-${t}-${r.toString().padStart(3,"0")}`;if(!n.includes(e))return e;r++}},d=(a,t)=>`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kumbara QR Kod - ${t}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
        }
        .qr-container {
          border: 2px solid #000;
          padding: 20px;
          margin: 20px auto;
          width: 300px;
        }
        .qr-code {
          margin: 10px 0;
        }
        .bank-number {
          font-size: 18px;
          font-weight: bold;
          margin: 10px 0;
        }
        .instructions {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="qr-container">
        <h2>Kumbara QR Kod</h2>
        <div class="bank-number">${t}</div>
        <div class="qr-code">
          <img src="${a}" alt="QR Kod" />
        </div>
        <div class="instructions">
          Bu QR kodu tarayarak kumbara bilgilerine ulaşabilirsiniz.
        </div>
      </div>
    </body>
    </html>
  `;export{d as a,o as b,i as g,s as p};
