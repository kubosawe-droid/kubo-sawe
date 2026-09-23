
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(req: Request){
  const { phone, amount, plan, network } = await req.json();
  const formattedPhone = phone.startsWith("0") ? "255"+phone.substring(1) : phone;

  const USER_REF = process.env.PALM_PESA_USER_REF;
  const SECRET = process.env.PALM_PESA_SECRET;

  if(!USER_REF || !SECRET){
    return NextResponse.json({ success: false, message: "PALM_PESA_USER_REF / SECRET bado hazijawekwa Vercel Settings -> Environment Variables" });
  }

  try {
    const resp = await fetch("https://api.palmpesa.co.tz/v1/checkout/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_ref: USER_REF,
        secret: SECRET,
        phone: formattedPhone,
        amount: Number(amount),
        reference: `KUBO-${Date.now()}`
      })
    });
    const data = await resp.json();
    console.log("PalmPesa response:", data);

    // Hifadhi kwenye KV database yako
    await kv.set(`payment:${formattedPhone}:${Date.now()}`, {
      phone: formattedPhone, originalPhone: phone, amount, plan, network, status: "pending", palm: data, time: new Date().toISOString()
    });

    if(data.success || data.status === "PENDING" || data.code === 200 || data.message?.includes("success")){
      return NextResponse.json({ success: true, message: "Ombi limetumwa! Angalia simu yako uingize PIN ya M-Pesa" });
    } else {
      return NextResponse.json({ success: false, message: `PalmPesa: ${JSON.stringify(data)}` });
    }
  } catch(e:any){
    return NextResponse.json({ success: false, message: e.message });
  }
}
