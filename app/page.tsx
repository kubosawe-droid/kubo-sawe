"use client";
import { useState } from "react";

const packages = [
  { id: 1, name: "Masaa 2", price: 500, time: "2 Hours" },
  { id: 2, name: "Siku 1", price: 1000, time: "24 Hours" },
  { id: 3, name: "Wiki 1", price: 5000, time: "7 Days" },
];

const networks = ["M-Pesa", "Tigo Pesa", "Airtel Money", "Halopesa"];

export default function Page(){
  const [phone, setPhone] = useState("");
  const [pkg, setPkg] = useState(packages[0]);
  const [network, setNetwork] = useState("M-Pesa");
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if(!phone || phone.length < 10){ alert("Weka namba sahihi 07xxxxxxxx"); return; }
    setLoading(true);
    try{
      const res = await fetch("/api/lipa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: pkg.price, plan: pkg.name, network })
      });
      const data = await res.json();
      if(data.success){
        alert("✅ " + data.message + "\nAngalia simu yako uingize PIN ya M-Pesa");
      } else {
        alert("❌ " + data.message);
      }
    }catch(e:any){
      alert("Imeshindwa: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:480, margin:"0 auto", padding:20, fontFamily:"sans-serif"}}>
      <h1 style={{textAlign:"center", color:"#0ea5e9"}}>KUBO SAWE WIFI</h1>
      <p style={{textAlign:"center"}}>Chagua kifurushi, weka namba, lipa kwa M-Pesa - PIN itakuja moja kwa moja</p>

      <h3>1. Chagua Kifurushi</h3>
      <div style={{display:"grid", gap:10}}>
        {packages.map(p=>(
          <div key={p.id} onClick={()=>setPkg(p)} style={{border: pkg.id===p.id?"2px solid #0ea5e9":"1px solid #ccc", padding:15, borderRadius:10, cursor:"pointer"}}>
            <b>{p.name}</b> - {p.time} <span style={{float:"right"}}>TZS {p.price}</span>
          </div>
        ))}
      </div>

      <h3>2. Mtandao</h3>
      <select value={network} onChange={e=>setNetwork(e.target.value)} style={{width:"100%", padding:12, borderRadius:8}}>
        {networks.map(n=><option key={n}>{n}</option>)}
      </select>

      <h3>3. Namba ya Simu</h3>
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07xxxxxxxx" style={{width:"100%", padding:12, borderRadius:8, border:"1px solid #ccc"}}/>

      <button onClick={handleBuy} disabled={loading} style={{width:"100%", marginTop:20, padding:14, background:"#0ea5e9", color:"white", border:"none", borderRadius:10, fontSize:16, fontWeight:"bold"}}>
        {loading ? "Inatuma ombi..." : `LIPA TZS ${pkg.price} - ${pkg.name}`}
      </button>

      <p style={{fontSize:12, color:"#666", textAlign:"center", marginTop:20}}>Malipo yote yanaenda kupitia Palm Pesa - Hakuna demo tena</p>
    </div>
  )
            }
