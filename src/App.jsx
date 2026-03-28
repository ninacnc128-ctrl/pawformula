import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ── SUPABASE CONFIG ───────────────────────────────────────────────
// Replace these two values with your own from Supabase → Settings → API
const SUPABASE_URL = "https://kitaribnmqztxbogszga.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_NnN7NxcOFtEXBdwslFZMjA_4COsQQNw";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── DESIGN TOKENS ─────────────────────────────────────────────────
const C = {
  sage:"#7A9E7E", sageL:"#EBF2EC", sageD:"#4A7150",
  earth:"#C4956A", earthL:"#F5EDE3",
  cream:"#FAF7F2", white:"#FFFDF9",
  border:"#E8E2D9", mid:"#6B6B6B", light:"#B0ADA8", dark:"#2C2C2C",
  ink:"#1A1A2E", slate:"#4A4E69", stone:"#F0EDE8", gold:"#C9A84C",
};

// ── DATA ─────────────────────────────────────────────────────────
const FLAVORS = [
  { id:"chicken", emoji:"🍗", name:"雞肉鮮蔬", en:"Chicken & Vegetables", tag:"最受歡迎", accent:"#C4956A", bg:"#FBF6EE",
    ingredients:["雞胸肉","雞腿肉","地瓜","花椰菜","胡蘿蔔","南瓜","雞蛋"],
    seasonal:"搭配當季蔬果：春季豌豆 · 夏季南瓜 · 秋季地瓜 · 冬季白花椰",
    suitable:["初次嘗試鮮食","腸胃敏感","各年齡層均適合"], notFor:["雞肉過敏"],
    desc:"清淡易消化，是毛孩最熟悉的家常味道。雞胸肉配上地瓜、花椰菜與胡蘿蔔，溫和不刺激。" },
  { id:"beef", emoji:"🥩", name:"牛肉滋補", en:"Beef & Root Vegetables", tag:"高蛋白首選", accent:"#B87060", bg:"#FBF0EE",
    ingredients:["台灣溫體牛肉","牛心","紅蘿蔔","馬鈴薯","菠菜","藍莓"],
    seasonal:"搭配當季蔬果：春季菠菜 · 夏季藍莓 · 秋季南瓜 · 冬季根莖類",
    suitable:["活動量大","需要增肌","成年期最佳"], notFor:["牛肉過敏"],
    desc:"台灣溫體牛肉，鐵質與鋅含量豐富。搭配根莖類蔬菜，補充體力與肌肉量。" },
  { id:"lamb", emoji:"🐑", name:"羊肉低敏", en:"New Zealand Lamb", tag:"過敏首選", accent:"#7080A8", bg:"#EEF0F8",
    ingredients:["紐西蘭草飼羊肉","羊肝","甜豌豆","蘋果","南瓜","亞麻籽油"],
    seasonal:"搭配當季蔬果：春季豌豆 · 夏季蘋果 · 秋季南瓜 · 冬季地瓜",
    suitable:["食物過敏","皮膚問題","換糧調整期"], notFor:[],
    desc:"紐西蘭草飼羊肉，新型蛋白質，對常見過敏原不耐受的毛孩最理想。" },
  { id:"fish", emoji:"🐟", name:"鮮魚護心", en:"Tilapia & Salmon", tag:"熟齡推薦", accent:"#5080A0", bg:"#EEF4FB",
    ingredients:["台南吳郭魚","鮭魚","蝦仁","昆布","菠菜","地瓜"],
    seasonal:"搭配當季蔬果：春季菠菜 · 夏季小黃瓜 · 秋季芋頭 · 冬季白蘿蔔",
    suitable:["熟齡毛孩","心臟保健","腎臟支持"], notFor:["魚類過敏"],
    desc:"台南吳郭魚搭配鮭魚，Omega-3 DHA/EPA 含量高，對心臟和關節都有幫助。" },
  { id:"duck", emoji:"🦆", name:"鴨肉關節", en:"Cherry Duck & Joint Care", tag:"關節專屬", accent:"#5A8A60", bg:"#EDF5EC",
    ingredients:["宜蘭櫻桃鴨","鴨肝","蘋果","花椰菜","薑黃","葡萄糖胺"],
    seasonal:"搭配當季蔬果：春季花椰菜 · 夏季蘋果 · 秋季薑黃 · 冬季芹菜",
    suitable:["關節炎","老年毛孩","術後恢復"], notFor:[],
    desc:"宜蘭櫻桃鴨，加入葡萄糖胺與軟骨素，專為有關節問題的毛孩設計。" },
  { id:"pork", emoji:"🐷", name:"豬肉能量", en:"Black Pork & Sweet Potato", tag:"幼年最佳", accent:"#B07080", bg:"#F8EEF2",
    ingredients:["屏東黑豬里肌","豬肝","地瓜","菠菜","雞蛋","藍莓"],
    seasonal:"搭配當季蔬果：春季菠菜 · 夏季藍莓 · 秋季地瓜 · 冬季紅蘿蔔",
    suitable:["幼年毛孩","活潑好動","體重偏輕"], notFor:["豬肉過敏"],
    desc:"屏東黑豬里肌，維生素 B1 豐富，支持神經系統發育與能量代謝。" },
];

const STAGES = [
  { id:"puppy", label:"幼年期", en:"Puppy", age:"0–12 個月", emoji:"🌱",
    highlight:"高蛋白 · 高脂肪 · 鈣磷平衡",
    desc:"成長期需要大量能量，支持骨骼、肌肉與神經系統快速發育。",
    protein:30, fat:20, veg:30, sup:20,
    priceUnit:220, priceSub:1800,
    challenges:["骨骼發育不足","體重過輕","腸胃適應新食物","免疫力建立"],
    bestFor:["所有幼犬幼貓","剛離乳毛孩","體重偏輕的小毛孩"],
    notIdealFor:["7歲以上熟齡","有腎臟問題"],
    accentColor:"#4A7150", borderColor:"#7A9E7E", cardBg:"#EDF5EC" },
  { id:"adult", label:"成年期", en:"Adult", age:"1–7 歲", emoji:"💪",
    highlight:"均衡比例 · 維持體重 · 活力充沛",
    desc:"主要目標是維持理想體重與身體功能，提供均衡的巨量營養素。",
    protein:25, fat:15, veg:40, sup:20,
    priceUnit:200, priceSub:1500,
    challenges:["體重管理","預防肥胖","維持肌肉量","口腔健康"],
    bestFor:["健康成年犬貓","活潑好動毛孩","維持理想體重"],
    notIdealFor:["12個月以下","7歲以上熟齡"],
    accentColor:C.dark, borderColor:C.border, cardBg:C.white, badge:"最多人選擇" },
  { id:"senior", label:"熟齡期", en:"Senior", age:"7 歲以上", emoji:"🌿",
    highlight:"低熱量 · 高含水 · 關節保健",
    desc:"新陳代謝變慢，需降低熱量密度、提高水分含量，並特別補充關節保健。",
    protein:28, fat:12, veg:40, sup:20,
    priceUnit:220, priceSub:1800,
    challenges:["關節退化","腎臟功能下降","肌肉流失","認知退化"],
    bestFor:["7歲以上犬貓","關節不適","食慾變差的老犬貓"],
    notIdealFor:["1歲以下幼年","高活動量運動型"],
    accentColor:"#8B5E3C", borderColor:C.earth, cardBg:C.earthL },
];

// ── SHARED COMPONENTS ────────────────────────────────────────────
const Chip = ({ label, selected, onClick }) => (
  <div onClick={onClick} style={{ padding:"9px 16px", border:`1.5px solid ${selected?C.sage:C.border}`, borderRadius:50, fontSize:13, fontWeight:500, color:selected?C.sageD:C.mid, background:selected?C.sageL:C.cream, cursor:"pointer", userSelect:"none", transition:"all .18s" }}>
    {label}
  </div>
);
const IconCard = ({ icon, label, sublabel, selected, onClick }) => (
  <div onClick={onClick} style={{ padding:"18px 12px", border:`2px solid ${selected?C.sage:C.border}`, borderRadius:14, background:selected?C.sageL:C.cream, cursor:"pointer", textAlign:"center", transition:"all .2s" }}>
    <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
    <div style={{ fontSize:13, fontWeight:500, color:C.dark }}>{label}</div>
    {sublabel && <div style={{ fontSize:11, color:C.mid, marginTop:2 }}>{sublabel}</div>}
  </div>
);
const BCSCard = ({ num, tag, desc, tagColor, bg, border, selected, onClick }) => (
  <div onClick={onClick} style={{ border:`2px solid ${selected?border:C.border}`, borderRadius:14, background:selected?bg:C.cream, cursor:"pointer", textAlign:"center", overflow:"hidden", transition:"all .2s" }}>
    <div style={{ padding:"12px 10px 6px", display:"flex", justifyContent:"center", alignItems:"center", minHeight:80, background:"#F5F5F0" }}>
      <div style={{ fontSize:11, color:C.light, textAlign:"center", lineHeight:1.4 }}>圖片<br/>待上傳</div>
    </div>
    <div style={{ padding:"6px 8px 12px" }}>
      <div style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:600, color:C.dark }}>{num}</div>
      <div style={{ fontSize:10, fontWeight:600, color:tagColor, marginTop:2 }}>{tag}</div>
      <div style={{ fontSize:10, color:C.mid, marginTop:3, lineHeight:1.4, fontWeight:300 }}>{desc}</div>
    </div>
  </div>
);

const SharedNav = ({ page, setPage }) => {
  const [aboutOpen, setAboutOpen] = useState(false);
  return (
    <nav style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:200 }}>
      <div onClick={()=>setPage("home")} style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:600, color:C.dark, cursor:"pointer" }}>
        Paw<span style={{ color:C.sage }}>Formula</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:28 }}>

        {/* About dropdown */}
        <div style={{ position:"relative" }}
          onMouseEnter={()=>setAboutOpen(true)}
          onMouseLeave={()=>setAboutOpen(false)}>
          <div style={{ fontSize:13, fontWeight:["story_team","philosophy","faq"].includes(page)?700:500, color:["story_team","philosophy","faq"].includes(page)?C.sageD:C.mid, borderBottom:["story_team","philosophy","faq"].includes(page)?`2px solid ${C.sage}`:"none", paddingBottom:2, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
            關於 PawFormula
            <span style={{ fontSize:10, color:C.light }}>▾</span>
          </div>
          {/* Bridge div fills the gap so mouse doesn't leave */}
          {aboutOpen && <div style={{ position:"absolute", top:"100%", left:0, width:"100%", height:16, background:"transparent" }} />}
          {aboutOpen && (
            <div style={{ position:"absolute", top:"calc(100% + 10px)", left:0, background:C.white, border:`1px solid ${C.border}`, borderRadius:14, boxShadow:"0 8px 32px rgba(0,0,0,.12)", minWidth:220, overflow:"hidden", zIndex:300 }}>
              {[
                { id:"story_team",  icon:"📖", label:"品牌故事 ＆ 研發團隊", sub:"我們是誰，從哪裡來" },
                { id:"philosophy",  icon:"🌿", label:"配方理念 ＆ 認證",     sub:"原形食物與製程標準" },
                { id:"faq",         icon:"💬", label:"常見問題 FAQ",          sub:"您最想知道的事" },
              ].map((item, i) => (
                <div key={item.id} onClick={()=>{ setPage(item.id); setAboutOpen(false); }}
                  style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 18px", cursor:"pointer", borderTop: i>0?`1px solid ${C.border}`:"none", background:page===item.id?C.sageL:"white", transition:"background .15s" }}>
                  <span style={{ fontSize:20, marginTop:1 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:page===item.id?600:500, color:page===item.id?C.sageD:C.dark }}>{item.label}</div>
                    <div style={{ fontSize:11, color:C.light, marginTop:2 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div onClick={()=>setPage("recipes")} style={{ fontSize:13, fontWeight:page==="recipes"?700:500, color:page==="recipes"?C.sageD:C.mid, borderBottom:page==="recipes"?`2px solid ${C.sage}`:"none", paddingBottom:2, cursor:"pointer" }}>
          食譜系列
        </div>
        <div onClick={()=>{ setPage("intake"); window.scrollTo({top:0}); }} style={{ padding:"9px 20px", background:C.sage, color:"white", borderRadius:50, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>
          開始客製 →
        </div>
      </div>
    </nav>
  );
};

// ── HOME PAGE ────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", color:C.dark, background:C.cream }}>

      {/* HERO */}
      <div style={{ background:C.white, padding:"72px 48px 64px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center", maxWidth:1100, margin:"0 auto" }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2.5px", textTransform:"uppercase", color:C.sage, marginBottom:16 }}>台灣第一個個人化冷凍寵物鮮食</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:48, fontWeight:500, lineHeight:1.2, marginBottom:20, color:C.dark }}>
            牠不只是寵物，<br/><em style={{ color:C.sage, fontStyle:"italic" }}>牠是您的家人。</em>
          </h1>
          <p style={{ fontSize:16, color:C.mid, lineHeight:1.8, fontWeight:300, marginBottom:32, maxWidth:460 }}>
            每一份 PawFormula 鮮食，都是依據您的毛孩的品種、年齡、體重、活動量和健康狀況量身計算——由獸醫營養師認證，台灣在地食材製作，急速冷凍保鮮直送到府。
          </p>
          <div style={{ display:"flex", gap:12 }}>
            <div onClick={()=>setPage("intake")} style={{ padding:"14px 28px", background:C.sage, color:"white", borderRadius:50, fontSize:15, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>
              為牠量身訂製 →
            </div>
            <div onClick={()=>setPage("recipes")} style={{ padding:"14px 24px", border:`1.5px solid ${C.border}`, color:C.mid, borderRadius:50, fontSize:14, fontWeight:500, cursor:"pointer" }}>
              查看食譜系列
            </div>
          </div>
        </div>
        {/* Image placeholder */}
        <div style={{ background:"linear-gradient(135deg, #EBF2EC, #F5EDE3)", borderRadius:24, height:400, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, border:`1px dashed ${C.border}` }}>
          <div style={{ fontSize:48 }}>📸</div>
          <div style={{ fontSize:14, color:C.light, fontWeight:300 }}>品牌主視覺圖片</div>
          <div style={{ fontSize:12, color:C.light }}>建議尺寸：600 × 400px</div>
        </div>
      </div>

      {/* WHAT WE DO */}
      <div style={{ padding:"72px 48px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.earth, marginBottom:12 }}>我們在做什麼</div>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:36, fontWeight:500, color:C.dark, marginBottom:14 }}>科學計算，從第一口開始。</h2>
          <p style={{ fontSize:15, color:C.mid, maxWidth:560, margin:"0 auto", lineHeight:1.8, fontWeight:300 }}>PawFormula 提供兩種系列，無論您的毛孩有多特別的需求，都能找到最適合的方案。</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:52 }}>
          {/* Card 1: Custom */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"36px 32px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:120, height:120, background:`radial-gradient(circle, ${C.sageL} 0%, transparent 70%)`, pointerEvents:"none" }} />
            <div style={{ fontSize:36, marginBottom:16 }}>✨</div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", color:C.sage, marginBottom:8 }}>客製化系列</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:500, marginBottom:12 }}>為牠，專屬計算</div>
            <div style={{ fontSize:14, color:C.mid, lineHeight:1.8, fontWeight:300, marginBottom:24 }}>
              填寫問卷後，我們的系統會依據您的毛孩的每日靜息能量需求（RER）× 多重乘數計算出精確的熱量目標，再由獸醫營養師選配最適合的食譜與補充劑。
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
              {["依體重、年齡、活動量個人化計算","獸醫認證療癒配方（CKD、心臟病、胰臟炎等）","季度重新評估，配方隨成長調整","NT$4,500–7,000 / 月"].map(t=>(
                <div key={t} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:C.mid }}>
                  <span style={{ color:C.sage, fontWeight:700, marginTop:1 }}>✓</span>{t}
                </div>
              ))}
            </div>
            <div onClick={()=>setPage("intake")} style={{ display:"inline-block", padding:"12px 24px", background:C.sage, color:"white", borderRadius:50, fontSize:14, fontWeight:600, cursor:"pointer" }}>
              開始填寫問卷 →
            </div>
          </div>

          {/* Card 2: Classic */}
          <div style={{ background:C.ink, border:`1px solid ${C.ink}`, borderRadius:20, padding:"36px 32px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:140, height:140, background:`radial-gradient(circle, rgba(201,168,76,.15) 0%, transparent 70%)`, pointerEvents:"none" }} />
            <div style={{ fontSize:36, marginBottom:16 }}>🥩</div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", color:C.gold, marginBottom:8 }}>經典系列</div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:500, marginBottom:12, color:"white" }}>簡單選擇，品質一致</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,.65)", lineHeight:1.8, fontWeight:300, marginBottom:24 }}>
              六種口味 × 三個生命階段，已為每個階段調配好最適合的黃金比例。不需要填問卷，直接選擇口味和階段即可訂購。
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
              {["台灣在地食材，每批次可溯源","每份配方含 3 種以上當季蔬果","獸醫營養師認證配方","NT$1,500–2,500 / 月"].map(t=>(
                <div key={t} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:"rgba(255,255,255,.7)" }}>
                  <span style={{ color:C.gold, fontWeight:700, marginTop:1 }}>✓</span>{t}
                </div>
              ))}
            </div>
            <div onClick={()=>setPage("recipes")} style={{ display:"inline-block", padding:"12px 24px", background:C.gold, color:C.ink, borderRadius:50, fontSize:14, fontWeight:700, cursor:"pointer" }}>
              查看食譜系列 →
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background:C.white, padding:"72px 48px", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.earth, marginBottom:12 }}>如何運作</div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:36, fontWeight:500, color:C.dark }}>從問卷到餐桌，四個步驟。</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {[
              { n:"01", emoji:"📋", title:"填寫問卷", desc:"告訴我們牠的品種、年齡、體重、活動量和健康狀況。只需 5 分鐘。" },
              { n:"02", emoji:"🔬", title:"科學計算", desc:"系統自動計算每日 MER，獸醫營養師選配最適合的食譜與補充劑。" },
              { n:"03", emoji:"👨‍🍳", title:"現做冷凍", desc:"台灣在地食材，新鮮備料後急速冷凍，每份精確分裝並貼上個人化標籤。" },
              { n:"04", emoji:"🚚", title:"冷鏈宅配", desc:"保溫箱加乾冰，直送到府。每季重新評估，配方隨牠的成長持續調整。" },
            ].map(s=>(
              <div key={s.n} style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.sage, letterSpacing:"1px", marginBottom:12 }}>{s.n}</div>
                <div style={{ fontSize:40, marginBottom:14 }}>{s.emoji}</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:500, marginBottom:10 }}>{s.title}</div>
                <div style={{ fontSize:13, color:C.mid, lineHeight:1.7, fontWeight:300 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM */}
      <div style={{ padding:"72px 48px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.earth, marginBottom:12 }}>研發團隊</div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:36, fontWeight:500, color:C.dark, marginBottom:20, lineHeight:1.3 }}>由獸醫師與<br/>營養科學家共同開發</h2>
            <p style={{ fontSize:15, color:C.mid, lineHeight:1.8, fontWeight:300, marginBottom:28 }}>
              PawFormula 的每一份配方，都由合作獸醫營養師依據最新 AAFCO 及 FEDIAF 國際標準審核，並定期依據最新臨床研究更新配方。我們的目標只有一個：讓每隻毛孩都能吃到真正適合牠的食物。
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { title:"獸醫營養師認證", desc:"所有配方均由認證獸醫營養師審核" },
                { title:"台灣在地食材", desc:"與台灣在地農場直接合作，食材可溯源" },
                { title:"HACCP 認證生產", desc:"符合台灣農業部食品安全標準" },
              ].map(t=>(
                <div key={t.title} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:C.sageL, display:"flex", alignItems:"center", justifyContent:"center", color:C.sageD, fontSize:16, flexShrink:0 }}>✓</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500, color:C.dark, marginBottom:3 }}>{t.title}</div>
                    <div style={{ fontSize:13, color:C.mid, fontWeight:300 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Team image placeholder */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background:"linear-gradient(135deg, #EBF2EC, #E8F4E8)", borderRadius:20, height:260, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10, border:`1px dashed ${C.border}` }}>
              <div style={{ fontSize:40 }}>👩‍⚕️</div>
              <div style={{ fontSize:13, color:C.light }}>團隊照片</div>
              <div style={{ fontSize:11, color:C.light }}>建議尺寸：520 × 260px</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[{n:"100+",d:"服務毛孩"},{n:"6",d:"食譜口味"},{n:"3",d:"生命階段"},{n:"99%",d:"飼主滿意度"}].map(s=>(
                <div key={s.n} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 14px", textAlign:"center" }}>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:600, color:C.sage }}>{s.n}</div>
                  <div style={{ fontSize:12, color:C.mid, marginTop:4 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA BANNER */}
      <div style={{ background:C.ink, padding:"56px 48px", textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:32, fontWeight:500, color:"white", marginBottom:14, lineHeight:1.3 }}>準備好為<em style={{ color:C.gold, fontStyle:"italic" }}>牠</em>開始了嗎？</div>
          <p style={{ fontSize:15, color:"rgba(255,255,255,.65)", fontWeight:300, lineHeight:1.8, marginBottom:32 }}>填寫問卷只需要 5 分鐘，我們的系統會立即計算出牠的每日營養需求，並為您推薦最適合的食譜方案。</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <div onClick={()=>setPage("intake")} style={{ padding:"14px 32px", background:C.gold, color:C.ink, borderRadius:50, fontSize:15, fontWeight:700, cursor:"pointer" }}>
              立即為牠量身訂製 →
            </div>
            <div onClick={()=>setPage("recipes")} style={{ padding:"14px 24px", border:"1.5px solid rgba(255,255,255,.3)", color:"rgba(255,255,255,.8)", borderRadius:50, fontSize:14, fontWeight:500, cursor:"pointer" }}>
              先看看食譜系列
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background:C.white, borderTop:`1px solid ${C.border}`, padding:"32px 48px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:600, color:C.dark }}>
          Paw<span style={{ color:C.sage }}>Formula</span>
        </div>
        <div style={{ fontSize:12, color:C.light }}>© 2026 PawFormula 台灣 ∙ 獸醫營養師認證 ∙ 台北冷鏈宅配</div>
      </div>
    </div>
  );
}

// ── INTAKE FORM PAGE ─────────────────────────────────────────────

// ── INTAKE PAGE ──────────────────────────────────────────────────
// Root-level stable field components to prevent cursor-loss on re-render
const TF = ({ label, hint, req, value, onChange, placeholder, type="text" }) => (
  <div style={{ marginBottom:20 }}>
    <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:7 }}>
      {label}{req&&<span style={{ color:"#C4956A" }}>*</span>}
      {hint&&<span style={{ fontWeight:300, color:"#6B6B6B", fontSize:12, marginLeft:6 }}>{hint}</span>}
    </label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width:"100%", padding:"12px 16px", border:"1.5px solid #E8E2D9", borderRadius:10,
        fontFamily:"'Noto Sans TC',sans-serif", fontSize:14, color:"#2C2C2C",
        background:"#FAF7F2", outline:"none", boxSizing:"border-box" }}
      onFocus={e=>{ e.target.style.borderColor="#7A9E7E"; e.target.style.background="white"; }}
      onBlur={e=>{ e.target.style.borderColor="#E8E2D9"; e.target.style.background="#FAF7F2"; }}
    />
  </div>
);
const TA = ({ label, hint, value, onChange, placeholder }) => (
  <div style={{ marginTop:10 }}>
    <label style={{ display:"block", fontSize:12, fontWeight:400, color:"#6B6B6B", marginBottom:6 }}>{label}{hint&&<span style={{ fontWeight:300, fontSize:11, marginLeft:4 }}>{hint}</span>}</label>
    <textarea
      value={value} onChange={onChange} placeholder={placeholder}
      style={{ width:"100%", padding:"12px 16px", border:"1.5px solid #E8E2D9", borderRadius:10,
        fontFamily:"'Noto Sans TC',sans-serif", fontSize:14, color:"#2C2C2C",
        background:"#FAF7F2", outline:"none", resize:"vertical", minHeight:80,
        lineHeight:1.6, boxSizing:"border-box" }}
      onFocus={e=>{ e.target.style.borderColor="#7A9E7E"; e.target.style.background="white"; }}
      onBlur={e=>{ e.target.style.borderColor="#E8E2D9"; e.target.style.background="#FAF7F2"; }}
    />
  </div>
);

const HEALTH_LABELS = { none:"✅ 健康良好", ckd:"腎臟病 CKD", cardiac:"心臟病", pancreatitis:"胰臟炎", diabetes:"糖尿病", obesity:"肥胖", arthritis:"關節炎", liver:"肝臟疾病", ibd:"腸胃問題 IBD", skin:"皮膚過敏", cancer:"腫瘤（緩解期）" };
const ALLERGY_LABELS = { none:"無已知過敏", chicken:"雞肉", beef:"牛肉", pork:"豬肉", fish:"魚類", egg:"蛋類", dairy:"乳製品", wheat:"小麥", corn:"玉米", soy:"大豆" };
const PLAN_LIST = [
  { id:"chicken", emoji:"🍗", name:"雞肉鮮蔬配方", protein:"雞胸肉 + 雞腿肉", desc:"清淡易消化，適合大多數毛孩。", price:4800, allergens:["chicken"], badge:"最受歡迎" },
  { id:"beef",    emoji:"🥩", name:"牛肉滋補配方", protein:"台灣溫體牛肉",   desc:"高蛋白、鐵質豐富，活動量大的毛孩最佳。", price:5500, allergens:["beef"] },
  { id:"lamb",    emoji:"🐑", name:"羊肉低敏配方", protein:"紐西蘭草飼羊肉", desc:"新型蛋白質，過敏毛孩最理想。", price:5800, allergens:[] },
  { id:"fish",    emoji:"🐟", name:"鮮魚護心配方", protein:"台南吳郭魚 + 鮭魚", desc:"富含 Omega-3，熟齡或心臟問題毛孩推薦。", price:5500, allergens:["fish"] },
  { id:"duck",    emoji:"🦆", name:"鴨肉關節配方", protein:"宜蘭櫻桃鴨",     desc:"添加葡萄糖胺，關節炎毛孩專屬。", price:5800, allergens:[] },
  { id:"pork",    emoji:"🐷", name:"豬肉能量配方", protein:"屏東黑豬里肌",   desc:"維生素 B1 豐富，幼年毛孩成長好幫手。", price:4800, allergens:["pork"] },
];
const HEALTH_NOTES = {
  ckd:"腎臟病（CKD）：優先選擇鮮魚護心配方（低磷、高含水量）或雞肉鮮蔬配方。",
  cardiac:"心臟病：鮮魚護心配方最適合，嚴格控制鈉含量。",
  pancreatitis:"胰臟炎：雞肉鮮蔬低脂配方為首選，每日分 4–6 小份。",
  diabetes:"糖尿病：每日固定時間餵食，搭配胰島素注射時程。",
  obesity:"肥胖：搭配我們的減重模式，以理想體重計算熱量。",
  arthritis:"關節炎：鴨肉關節配方已添加葡萄糖胺與軟骨素。",
  liver:"肝臟疾病：嚴格控制銅含量，補充鋅，請提供最新肝功能報告。",
  ibd:"腸胃問題：羊肉或鴨肉配方（新型蛋白質），少量多餐。",
  skin:"皮膚過敏：羊肉低敏或鴨肉配方。",
  cancer:"腫瘤緩解期：高蛋白配方，補充 Omega-3 抗炎。",
};

function IntakePage({ setPage, cart, setCart }) {
  const [step, setStep] = useState(1);

  // All form state at top level — never recreated on render
  const [petName,    setPetName]    = useState("");
  const [species,    setSpecies]    = useState("");
  const [breed,      setBreed]      = useState("");
  const [sex,        setSex]        = useState("");
  const [weight,     setWeight]     = useState("");
  const [idealWeight,setIdealWeight]= useState("");
  const [age,        setAge]        = useState(3);
  const [size,       setSize]       = useState("");
  const [sizeMult,   setSizeMult]   = useState(1.0);
  const [bcs,        setBcs]        = useState("");
  const [activity,   setActivity]   = useState("");
  const [actMult,    setActMult]    = useState(1.6);
  const [env,        setEnv]        = useState("");
  const [diet,       setDiet]       = useState("");
  const [dietNote,   setDietNote]   = useState("");
  const [treatFreq,  setTreatFreq]  = useState("");
  const [health,     setHealth]     = useState([]);
  const [healthNote, setHealthNote] = useState("");
  const [allergies,  setAllergies]  = useState([]);
  const [allergyNote,setAllergyNote]= useState("");
  const [goals,      setGoals]      = useState([]);
  const [reportFile, setReportFile] = useState(null);
  const [plan,       setPlan]       = useState("");
  const [delivery,   setDelivery]   = useState("biweekly");
  const [addons,     setAddons]     = useState([]);

  const allergiesActive = allergies.filter(a=>a!=="none");
  const selectedPlan = PLAN_LIST.find(p=>p.id===plan);

  // Health multi-select: if "none" selected, clear others; if disease selected, remove "none"
  const toggleHealth = (v) => {
    if (v === "none") { setHealth(["none"]); return; }
    setHealth(prev => {
      const without = prev.filter(x => x !== "none");
      return without.includes(v) ? without.filter(x=>x!==v) : [...without, v];
    });
  };
  // Allergy multi-select: same logic
  const toggleAllergy = (v) => {
    if (v === "none") { setAllergies(["none"]); return; }
    setAllergies(prev => {
      const without = prev.filter(x => x !== "none");
      return without.includes(v) ? without.filter(x=>x!==v) : [...without, v];
    });
  };
  const toggleGoal = (v) => setGoals(p => p.includes(v) ? p.filter(x=>x!==v) : [...p,v]);
  const toggleAddon = (v) => setAddons(p => p.includes(v) ? p.filter(x=>x!==v) : [...p,v]);

  const bcsMsg = {
    "2":{ t:"BCS 1–2：體重偏低，我們會確保熱量充足，幫助達到理想體重。", bg:"#FFF8F0", c:"#C4906A" },
    "3":{ t:"BCS 3：稍微偏瘦，我們會適當提高熱量密度。", bg:"#FFF8F0", c:"#C4906A" },
    "5":{ t:"BCS 4–5：體重非常理想！我們會幫他維持這個最佳狀態。", bg:"#EBF2EC", c:"#4A7150" },
    "6":{ t:"BCS 6：略微超重，我們會適當調低熱量。", bg:"#F5EDE3", c:"#8B5E3C" },
    "7":{ t:"BCS 7–8：需要積極體重管理，我們會安排專屬減重計畫。", bg:"#F5EDE3", c:"#8B5E3C" },
    "9":{ t:"BCS 9：建議同時諮詢獸醫，我們提供嚴格的體重管理配方。", bg:"#FFF0EE", c:"#A05040" },
  };
  const bcsData = [
    { val:"2", num:"1–2", tag:"過瘦",    desc:"脊椎突出，肋骨清晰可見",   tagColor:"#C4906A", bg:"#FFF8F0", border:"#E8A055" },
    { val:"3", num:"3",   tag:"偏瘦",    desc:"腰線過明顯，肋骨輕觸即感", tagColor:"#C4906A", bg:"#FFF8F0", border:"#E8A055" },
    { val:"5", num:"4–5", tag:"✓ 理想", desc:"腰線優美，肋骨可觸不外露", tagColor:"#4A7150", bg:"#EBF2EC", border:"#7A9E7E" },
    { val:"6", num:"6",   tag:"略微超重",desc:"腰線不明顯，身形較圓潤",   tagColor:"#C4705A", bg:"#F5EDE3", border:"#C4956A" },
    { val:"7", num:"7–8", tag:"超重",    desc:"沒有腰線，腹部兩側外擴",   tagColor:"#C4705A", bg:"#F5EDE3", border:"#C4956A" },
    { val:"9", num:"9",   tag:"肥胖",    desc:"全身渾圓，尾根被脂肪覆蓋", tagColor:"#C4705A", bg:"#FFF0EE", border:"#E09080" },
  ];

  const activityOpts = [
    { v:"sedentary",  m:1.2, l:"🛋️ 宅家型",  eg:"平常懶懶的，一天活動不超過 10 分鐘，最愛趴在沙發上睡覺" },
    { v:"low",        m:1.4, l:"🚶 悠閒型",  eg:"每天散步一次約 15–30 分鐘，節奏慢，不太喜歡跑跳" },
    { v:"moderate",   m:1.6, l:"🎾 活潑型",  eg:"每天散步加玩耍合計 30–60 分鐘，偶爾追球或追貓棒" },
    { v:"active",     m:2.0, l:"🏃 運動型",  eg:"每天外出活動超過 1 小時，活力充沛，很愛跑跳玩耍" },
    { v:"very_active",m:3.5, l:"🏆 競技型",  eg:"工作犬、獵犬、競技犬，每日高強度訓練超過 2 小時" },
  ];

  const Chip = ({ label, selected, onClick }) => (
    <div onClick={onClick} style={{
      padding:"9px 16px", border:`1.5px solid ${selected?"#7A9E7E":"#E8E2D9"}`,
      borderRadius:50, fontSize:13, fontWeight:500,
      color:selected?"#4A7150":"#6B6B6B",
      background:selected?"#EBF2EC":"#FAF7F2",
      cursor:"pointer", userSelect:"none", transition:"all .18s",
    }}>{label}</div>
  );
  const ICard = ({ icon, label, sublabel, selected, onClick }) => (
    <div onClick={onClick} style={{
      padding:"16px 10px", border:`2px solid ${selected?"#7A9E7E":"#E8E2D9"}`,
      borderRadius:14, background:selected?"#EBF2EC":"#FAF7F2",
      cursor:"pointer", textAlign:"center", transition:"all .2s",
    }}>
      <div style={{ fontSize:26, marginBottom:5 }}>{icon}</div>
      <div style={{ fontSize:13, fontWeight:500, color:"#2C2C2C" }}>{label}</div>
      {sublabel&&<div style={{ fontSize:11, color:"#6B6B6B", marginTop:2 }}>{sublabel}</div>}
    </div>
  );

  const btnNext = { padding:"12px 32px", background:"#7A9E7E", color:"white", border:"none", borderRadius:50, fontFamily:"'Noto Sans TC',sans-serif", fontSize:14, fontWeight:500, cursor:"pointer" };
  const btnBack = { padding:"12px 22px", background:"transparent", color:"#6B6B6B", border:"1.5px solid #E8E2D9", borderRadius:50, fontFamily:"'Noto Sans TC',sans-serif", fontSize:13, cursor:"pointer" };

  const StepBar = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", maxWidth:580, margin:"0 auto" }}>
      {[1,2,3,4,5].map((n,i)=>(
        <div key={n} style={{ display:"flex", alignItems:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", border:`2px solid ${n<=step?"#7A9E7E":"#E8E2D9"}`, background:n===step?"#7A9E7E":n<step?"#EBF2EC":"#FFFDF9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:500, color:n===step?"white":n<step?"#4A7150":"#B0ADA8" }}>
              {n<step?"✓":n}
            </div>
            <div style={{ fontSize:10, fontWeight:500, color:n===step?"#4A7150":n<step?"#7A9E7E":"#B0ADA8", letterSpacing:".5px", textTransform:"uppercase", whiteSpace:"nowrap" }}>
              {["基本資料","體型年齡","生活習慣","健康狀況","選擇計畫"][i]}
            </div>
          </div>
          {i<4&&<div style={{ width:48, height:2, background:n<step?"#7A9E7E":"#E8E2D9", margin:"0 4px 20px", flexShrink:0 }}/>}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", background:"#FAF7F2", color:"#2C2C2C" }}>
      <div style={{ background:"#FFFDF9", padding:"52px 40px 40px", textAlign:"center", borderBottom:"1px solid #E8E2D9" }}>
        <div style={{ fontSize:11, fontWeight:500, letterSpacing:"2.5px", textTransform:"uppercase", color:"#7A9E7E", marginBottom:14 }}>PawFormula 客製化系列</div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:34, fontWeight:500, color:"#2C2C2C", lineHeight:1.3, marginBottom:12 }}>牠不只是寵物，<em style={{ color:"#7A9E7E", fontStyle:"italic" }}>牠是您的家人。</em></h1>
        <p style={{ fontSize:15, color:"#6B6B6B", maxWidth:500, margin:"0 auto 28px", lineHeight:1.8, fontWeight:300 }}>我們想多認識一下您的毛孩。只需要幾分鐘，告訴我們關於他的一些細節。</p>
        <StepBar />
      </div>

      <div style={{ maxWidth:660, margin:"0 auto", padding:"36px 20px 80px" }}>
        <div style={{ background:"#FFFDF9", borderRadius:20, border:"1px solid #E8E2D9", padding:"40px 44px", boxShadow:"0 4px 32px rgba(0,0,0,.04)" }}>

          {/* ── STEP 1 ── */}
          {step===1&&(
            <div>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:"2px", textTransform:"uppercase", color:"#C4956A", marginBottom:8 }}>步驟 1 / 5</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:500, marginBottom:8 }}>我們想更了解您的毛孩 🐾</div>
              <div style={{ fontSize:14, color:"#6B6B6B", marginBottom:28, lineHeight:1.8, fontWeight:300 }}>請告訴我們關於他的一些細節——每一份計畫都是從認識他開始的。</div>

              <TF label="他叫什麼名字？" req value={petName} onChange={e=>setPetName(e.target.value)} placeholder="例如：小橘、奶油、Mochi…" />

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>他是哪種動物？<span style={{ color:"#C4956A" }}>*</span></label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[{v:"dog",i:"🐶",l:"狗狗"},{v:"cat",i:"🐱",l:"貓咪"}].map(s=>(
                    <ICard key={s.v} icon={s.i} label={s.l} selected={species===s.v} onClick={()=>setSpecies(s.v)} />
                  ))}
                </div>
              </div>

              <TF label="他的品種是？" hint="（不確定的話，填「米克斯」就好）" value={breed} onChange={e=>setBreed(e.target.value)} placeholder="例如：柴犬、布偶貓、米克斯…" />

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>他的性別<span style={{ color:"#C4956A" }}>*</span></label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                  {[{v:"male_intact",l:"公（未結紮）"},{v:"male_neutered",l:"公（已結紮）"},{v:"female_intact",l:"母（未絕育）"},{v:"female_spayed",l:"母（已絕育）"}].map(s=>(
                    <Chip key={s.v} label={s.l} selected={sex===s.v} onClick={()=>setSex(s.v)} />
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:28 }}><button style={btnNext} onClick={()=>setStep(2)}>繼續 →</button></div>
              <div style={{ display:"flex", gap:20, justifyContent:"center", marginTop:24, paddingTop:20, borderTop:"1px solid #E8E2D9", flexWrap:"wrap" }}>
                {["獸醫營養師認證配方","台灣在地食材","急速冷凍保鮮"].map(t=>(
                  <div key={t} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:"#6B6B6B" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#7A9E7E" }}/>{t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step===2&&(
            <div>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:"2px", textTransform:"uppercase", color:"#C4956A", marginBottom:8 }}>步驟 2 / 5</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:500, marginBottom:8 }}>關於他的身體，多說一點 💚</div>
              <div style={{ fontSize:14, color:"#6B6B6B", marginBottom:24, lineHeight:1.8, fontWeight:300 }}>體重和體型是為他計算每日熱量需求最重要的資訊。</div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:0 }}>
                <TF label="目前體重" hint="（公斤）" req type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="例如：4.5" />
                <TF label="理想體重" hint="（公斤）" type="number" value={idealWeight} onChange={e=>setIdealWeight(e.target.value)} placeholder="目標體重" />
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>他現在幾歲？<span style={{ color:"#C4956A" }}>*</span></label>
                <div style={{ padding:"6px 0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                    <input
                      type="range" min="0" max="20" step="0.5" value={age}
                      onChange={e=>setAge(parseFloat(e.target.value))}
                      style={{ flex:1, accentColor:"#7A9E7E", cursor:"pointer" }}
                    />
                    <div style={{ minWidth:60, textAlign:"right", fontSize:17, fontWeight:500, color:"#4A7150", fontFamily:"Georgia,serif", flexShrink:0 }}>
                      {age<1?`${Math.round(age*12)} 個月`:`${age} 歲`}
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#B0ADA8", marginTop:6 }}>
                    <span>幼年</span><span>成年（5）</span><span>熟齡（10）</span><span>長者（20）</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>體型大小<span style={{ color:"#C4956A" }}>*</span></label>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                  {[{v:"toy",m:1.1,i:"🐾",l:"小型",s:"<10 公斤"},{v:"medium",m:1.0,i:"🐾",l:"中型",s:"10–25 公斤"},{v:"large",m:0.9,i:"🐾",l:"大型",s:"25–45 公斤"},{v:"giant",m:0.8,i:"🐾",l:"超大型",s:">45 公斤"}].map(s=>(
                    <ICard key={s.v} icon={s.i} label={s.l} sublabel={s.s} selected={size===s.v} onClick={()=>{ setSize(s.v); setSizeMult(s.m); }} />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:6 }}>從上方看，他的體型最像哪一個？<span style={{ color:"#C4956A" }}>*</span></label>
                <div style={{ fontSize:12, color:"#6B6B6B", marginBottom:10, fontWeight:300 }}>想像你從正上方俯視他——腰部是否有明顯的收腰弧線？</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                  {bcsData.map(b=>(
                    <div key={b.val} onClick={()=>setBcs(b.val)} style={{ border:`2px solid ${bcs===b.val?b.border:"#E8E2D9"}`, borderRadius:14, background:bcs===b.val?b.bg:"#FAF7F2", cursor:"pointer", textAlign:"center", overflow:"hidden", transition:"all .2s" }}>
                      <div style={{ padding:"10px 8px 5px", minHeight:70, display:"flex", alignItems:"center", justifyContent:"center", background:"#F5F5F0", fontSize:11, color:"#B0ADA8", lineHeight:1.4 }}>圖片<br/>待上傳</div>
                      <div style={{ padding:"6px 6px 10px" }}>
                        <div style={{ fontFamily:"Georgia,serif", fontSize:13, fontWeight:600, color:"#2C2C2C" }}>{b.num}</div>
                        <div style={{ fontSize:10, fontWeight:600, color:b.tagColor, marginTop:2 }}>{b.tag}</div>
                        <div style={{ fontSize:10, color:"#6B6B6B", marginTop:3, lineHeight:1.4, fontWeight:300 }}>{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {bcs&&bcsMsg[bcs]&&(
                  <div style={{ marginTop:10, padding:"10px 14px", borderRadius:8, fontSize:13, lineHeight:1.6, background:bcsMsg[bcs].bg, color:bcsMsg[bcs].c }}>{bcsMsg[bcs].t}</div>
                )}
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginTop:28 }}>
                <button style={btnBack} onClick={()=>setStep(1)}>← 返回</button>
                <button style={btnNext} onClick={()=>setStep(3)}>繼續 →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step===3&&(
            <div>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:"2px", textTransform:"uppercase", color:"#C4956A", marginBottom:8 }}>步驟 3 / 5</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:500, marginBottom:8 }}>他平時的生活是什麼樣的？🏃</div>
              <div style={{ fontSize:14, color:"#6B6B6B", marginBottom:24, lineHeight:1.8, fontWeight:300 }}>活動量直接影響他每天需要的熱量。</div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:10 }}>活動量等級<span style={{ color:"#C4956A" }}>*</span></label>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {activityOpts.map(s=>(
                    <div key={s.v} onClick={()=>{ setActivity(s.v); setActMult(s.m); }} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px", border:`1.5px solid ${activity===s.v?"#7A9E7E":"#E8E2D9"}`, borderRadius:12, background:activity===s.v?"#EBF2EC":"#FAF7F2", cursor:"pointer", transition:"all .2s" }}>
                      <div style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{s.l.split(" ")[0]}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:activity===s.v?"#4A7150":"#2C2C2C" }}>{s.l.split(" ").slice(1).join(" ")}</div>
                        <div style={{ fontSize:12, color:"#6B6B6B", marginTop:3, fontWeight:300, lineHeight:1.5 }}>{s.eg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>居住環境</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                  {[{v:"indoor",l:"🏠 完全室內"},{v:"indoor_outdoor",l:"🌿 室內為主，偶爾外出"},{v:"outdoor",l:"🌳 室外為主"}].map(s=>(
                    <Chip key={s.v} label={s.l} selected={env===s.v} onClick={()=>setEnv(s.v)} />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>目前飲食類型</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:9, marginBottom:0 }}>
                  {[{v:"dry",l:"乾糧"},{v:"wet",l:"濕食／罐頭"},{v:"raw",l:"生鮮 BARF"},{v:"homemade",l:"自製鮮食"},{v:"mixed",l:"混合式"}].map(s=>(
                    <Chip key={s.v} label={s.l} selected={diet===s.v} onClick={()=>setDiet(s.v)} />
                  ))}
                </div>
                <TA label="目前使用的品牌或其他補充說明" value={dietNote} onChange={e=>setDietNote(e.target.value)} placeholder="例如：目前餵皇家老犬糧，偶爾加罐頭…" />
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>平常給零食的習慣？</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                  {[{v:"none",l:"不給零食"},{v:"occasional",l:"偶爾給"},{v:"daily_small",l:"每天少量"},{v:"daily_moderate",l:"每天適量"},{v:"daily_lots",l:"每天很多"}].map(s=>(
                    <Chip key={s.v} label={s.l} selected={treatFreq===s.v} onClick={()=>setTreatFreq(s.v)} />
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginTop:28 }}>
                <button style={btnBack} onClick={()=>setStep(2)}>← 返回</button>
                <button style={btnNext} onClick={()=>setStep(4)}>繼續 →</button>
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step===4&&(
            <div>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:"2px", textTransform:"uppercase", color:"#C4956A", marginBottom:8 }}>步驟 4 / 5</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:500, marginBottom:8 }}>他的健康，我們最在乎 ❤️</div>
              <div style={{ fontSize:14, color:"#6B6B6B", marginBottom:24, lineHeight:1.8, fontWeight:300 }}>如果他有任何健康狀況，我們的獸醫營養師將依據最新臨床指引調整配方。</div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>請填寫毛孩目前的健康狀況<span style={{ fontSize:12, fontWeight:300, color:"#6B6B6B", marginLeft:6 }}>（可複選）</span></label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:9, marginBottom:0 }}>
                  {Object.entries(HEALTH_LABELS).map(([v,l])=>(
                    <Chip key={v} label={l} selected={health.includes(v)} onClick={()=>toggleHealth(v)} />
                  ))}
                </div>
                <TA label="如有其他狀況或補充說明，請在這裡告訴我們" value={healthNote} onChange={e=>setHealthNote(e.target.value)} placeholder="例如：上個月剛確診腎臟病第二期，目前在服用降磷藥物…" />
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>食物過敏<span style={{ fontSize:12, fontWeight:300, color:"#6B6B6B", marginLeft:6 }}>（可複選）</span></label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:9, marginBottom:0 }}>
                  {Object.entries(ALLERGY_LABELS).map(([v,l])=>(
                    <Chip key={v} label={l} selected={allergies.includes(v)} onClick={()=>toggleAllergy(v)} />
                  ))}
                </div>
                <TA label="其他過敏原或觀察到的過敏症狀" value={allergyNote} onChange={e=>setAllergyNote(e.target.value)} placeholder="例如：吃了雞肉之後皮膚會發癢…" />
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>您希望達成什麼健康目標？<span style={{ fontSize:12, fontWeight:300, color:"#6B6B6B", marginLeft:6 }}>（可複選）</span></label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                  {[{v:"maintain",l:"維持理想體重"},{v:"lose",l:"健康減重"},{v:"gain",l:"增重補充體力"},{v:"joint",l:"關節保健"},{v:"skin",l:"皮膚毛髮光澤"},{v:"gut",l:"腸胃健康"},{v:"senior",l:"熟齡整體保養"},{v:"immunity",l:"免疫力提升"}].map(s=>(
                    <Chip key={s.v} label={s.l} selected={goals.includes(s.v)} onClick={()=>toggleGoal(s.v)} />
                  ))}
                </div>
              </div>

              {/* Health report upload */}
              <div style={{ background:"#F0F7F0", border:"1.5px solid #7A9E7E", borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#2C2C2C", marginBottom:6 }}>📋 上傳健檢報告（選填）</div>
                <div style={{ fontSize:12, color:"#6B6B6B", marginBottom:14, lineHeight:1.6, fontWeight:300 }}>
                  如果您有近期的血液檢查、尿液或影像報告，上傳後我們的獸醫營養師可以更精準地為他調整配方。支援 PDF、JPG、PNG（最大 10MB）。
                </div>
                <label style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 20px", background:"white", border:"1.5px solid #7A9E7E", borderRadius:50, cursor:"pointer", fontSize:13, fontWeight:500, color:"#4A7150" }}>
                  📎 選擇檔案上傳
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={e=>setReportFile(e.target.files)} style={{ display:"none" }} />
                </label>
                {reportFile&&reportFile.length>0&&(
                  <div style={{ marginTop:12 }}>
                    {Array.from(reportFile).map((f,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#4A7150", marginTop:6 }}>
                        <span>✓</span><span>{f.name}</span><span style={{ color:"#B0ADA8" }}>({(f.size/1024).toFixed(0)} KB)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginTop:28 }}>
                <button style={btnBack} onClick={()=>setStep(3)}>← 返回</button>
                <button style={btnNext} onClick={()=>setStep(5)}>查看專屬計畫 ✨</button>
              </div>
            </div>
          )}

          {/* ── STEP 5 ── */}
          {step===5&&(
            <div>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:"2px", textTransform:"uppercase", color:"#C4956A", marginBottom:8 }}>步驟 5 / 5</div>
              <div style={{ textAlign:"center", marginBottom:24 }}>
                <h2 style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:500, color:"#2C2C2C", marginBottom:8 }}>
                  為 <span style={{ color:"#7A9E7E" }}>{petName||"您的毛孩"}</span> 選擇食譜
                </h2>
                <p style={{ fontSize:14, color:"#6B6B6B", fontWeight:300, lineHeight:1.7 }}>根據{petName||"他"}的狀況，以下食譜都非常適合他。</p>
              </div>

              {health.filter(h=>h!=="none").length>0&&(
                <div style={{ padding:"14px 16px", background:"#F5EDE3", borderRadius:12, fontSize:13, color:"#8B5E3C", marginBottom:18, lineHeight:1.7, border:"1px solid #E8C4A0" }}>
                  <strong>🩺 依據他的健康狀況，我們的建議：</strong><br/><br/>
                  {health.filter(h=>h!=="none").map(h=>(<span key={h} style={{ display:"inline-block", padding:"4px 12px", borderRadius:50, fontSize:12, fontWeight:500, background:"#F5EDE3", color:"#8B5E3C", border:"1px solid #E8C4A0", margin:3 }}>{HEALTH_LABELS[h]}</span>))}
                  <br/><br/>
                  {health.filter(h=>h!=="none").map(h=>HEALTH_NOTES[h]).filter(Boolean).join(" ")}
                </div>
              )}
              {allergiesActive.length>0&&(
                <div style={{ padding:"10px 14px", background:"#EBF2EC", borderRadius:10, fontSize:12, color:"#4A7150", marginBottom:16 }}>
                  🚫 <strong>過敏提醒：</strong>含有過敏原的食譜已標示為不可選。
                </div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                {PLAN_LIST.map(p=>{
                  const dimmed = p.allergens.some(a=>allergiesActive.includes(a));
                  return (
                    <div key={p.id} onClick={dimmed?undefined:()=>setPlan(p.id)} style={{ border:`2px solid ${plan===p.id?"#7A9E7E":"#E8E2D9"}`, borderRadius:14, background:plan===p.id?"#EBF2EC":"#FAF7F2", cursor:dimmed?"not-allowed":"pointer", opacity:dimmed?.4:1, position:"relative", transition:"all .2s" }}>
                      {plan===p.id&&<div style={{ position:"absolute", top:10, left:10, width:20, height:20, borderRadius:"50%", background:"#7A9E7E", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:11 }}>✓</div>}
                      {p.badge&&<div style={{ position:"absolute", top:10, right:10, background:"#7A9E7E", color:"white", fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:50 }}>{p.badge}</div>}
                      <div style={{ fontSize:32, padding:"18px 16px 8px", textAlign:"center" }}>{p.emoji}</div>
                      <div style={{ padding:"0 14px 16px" }}>
                        <div style={{ fontFamily:"Georgia,serif", fontSize:15, fontWeight:500, color:"#2C2C2C", marginBottom:3 }}>{p.name}</div>
                        <div style={{ fontSize:11, fontWeight:600, color:"#4A7150", letterSpacing:".4px", textTransform:"uppercase", marginBottom:6 }}>{p.protein}</div>
                        <div style={{ fontSize:12, color:"#6B6B6B", lineHeight:1.5, fontWeight:300 }}>{p.desc}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#4A7150", marginTop:8, fontFamily:"Georgia,serif" }}>NT${p.price.toLocaleString()} <span style={{ fontSize:11, fontWeight:400, color:"#6B6B6B" }}>/ 月</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:10 }}>🌿 加購補充品（選填）</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {["關節保健包 +NT$300","益生菌腸胃包 +NT$250","Omega-3 魚油膠囊 +NT$280","毛髮光澤維生素 E +NT$200"].map(a=>(
                    <div key={a} onClick={()=>toggleAddon(a)} style={{ padding:"8px 14px", border:`1.5px solid ${addons.includes(a)?"#C4956A":"#E8E2D9"}`, borderRadius:50, fontSize:12, fontWeight:500, color:addons.includes(a)?"#8B5E3C":"#6B6B6B", background:addons.includes(a)?"#F5EDE3":"#FAF7F2", cursor:"pointer" }}>{a}</div>
                  ))}
                </div>
              </div>

              <div style={{ background:"#FAF7F2", border:"1px solid #E8E2D9", borderRadius:14, padding:16, marginBottom:20 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"#2C2C2C", marginBottom:10 }}>🚚 配送頻率</div>
                <div style={{ display:"flex", gap:10 }}>
                  {[{v:"weekly",f:"每週配送",d:"最新鮮，免運費"},{v:"biweekly",f:"每兩週配送",d:"最多人選擇"},{v:"monthly",f:"每月配送",d:"一次備足"}].map(d=>(
                    <div key={d.v} onClick={()=>setDelivery(d.v)} style={{ flex:1, padding:"11px 8px", border:`1.5px solid ${delivery===d.v?"#7A9E7E":"#E8E2D9"}`, borderRadius:10, textAlign:"center", cursor:"pointer", background:delivery===d.v?"#EBF2EC":"white" }}>
                      <div style={{ fontSize:13, fontWeight:500, color:"#2C2C2C" }}>{d.f}</div>
                      <div style={{ fontSize:11, color:"#6B6B6B", marginTop:2 }}>{d.d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:"linear-gradient(135deg,#EBF2EC,#EFF7EF)", borderRadius:16, padding:24, textAlign:"center", border:"1.5px solid #7A9E7E" }}>
                <div style={{ fontFamily:"Georgia,serif", fontSize:20, color:"#2C2C2C", marginBottom:6 }}>
                  為 <strong style={{ color:"#7A9E7E" }}>{petName||"您的毛孩"}</strong> 訂製第一份鮮食
                </div>
                <div style={{ fontSize:13, color:"#6B6B6B", marginBottom:8, fontWeight:300, lineHeight:1.7 }}>獸醫營養師認證 ∙ 急速冷凍保鮮 ∙ 台北冷鏈宅配<br/>前兩週可免費調整配方，滿意再繼續</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:34, fontWeight:600, color:"#4A7150", marginBottom:4 }}>
                  {selectedPlan?`NT$${selectedPlan.price.toLocaleString()}`:"—"}
                </div>
                <div style={{ fontSize:12, color:"#6B6B6B", marginBottom:18 }}>/ 月 ∙ 隨時可暫停或取消</div>
                <button onClick={()=>{
                  if(!plan){ alert(`請先為${petName||"您的毛孩"}選擇食譜 🐾`); return; }
                  setCart(c=>[...c,{
                    emoji: selectedPlan.emoji, name: selectedPlan.name,
                    stage: "", petName, type:`客製化訂閱 ${delivery==="weekly"?"每週":delivery==="biweekly"?"每兩週":"每月"}`,
                    price: selectedPlan.price, qty:1
                  }]);
                  addons.forEach(a=>{
                    const price = parseInt(a.match(/\d+/)?.[0]||0);
                    setCart(c=>[...c,{ emoji:"🌿", name:a.replace(/ \+.*$/,""), stage:"", petName, type:"補充品", price, qty:1 }]);
                  });
                  setPage("checkout");
                }} style={{ padding:"14px 44px", background:"#C4956A", color:"white", border:"none", borderRadius:50, fontFamily:"'Noto Sans TC',sans-serif", fontSize:15, fontWeight:500, cursor:"pointer" }}>
                  立即開始訂閱 🐾
                </button>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
                <button style={btnBack} onClick={()=>setStep(4)}>← 修改資料</button>
                <button style={btnBack} onClick={()=>{
                  setStep(1); setPetName(""); setSpecies(""); setBreed(""); setSex("");
                  setWeight(""); setIdealWeight(""); setAge(3); setSize(""); setSizeMult(1.0);
                  setBcs(""); setActivity(""); setActMult(1.6); setEnv(""); setDiet("");
                  setDietNote(""); setTreatFreq(""); setHealth([]); setHealthNote("");
                  setAllergies([]); setAllergyNote(""); setGoals([]); setReportFile(null);
                  setPlan(""); setDelivery("biweekly"); setAddons([]);
                }}>重新填寫</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


// ── RECIPES CATALOGUE PAGE ────────────────────────────────────────
// ── RECIPES CATALOGUE PAGE (subscription only) ────────────────────
function RecipesPage({ setPage, cart, setCart }) {
  const [selFlavors, setSelFlavors] = useState([]);
  const [selStage, setSelStage]     = useState(null);
  const [expanded, setExpanded]     = useState(null);
  const [delivery, setDelivery]     = useState("biweekly");
  const [cartDone, setCartDone]     = useState(false);

  const toggleFlavor = id => setSelFlavors(p => p.includes(id)?p.filter(f=>f!==id):[...p,id]);
  const stage    = STAGES.find(s=>s.id===selStage);
  const subTotal = stage && selFlavors.length>0 ? stage.priceSub * selFlavors.length : 0;

  const Bar=({label,pct,color})=>(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.slate,marginBottom:4}}>
        <span>{label}</span><span style={{fontWeight:600,color:C.ink}}>{pct}%</span>
      </div>
      <div style={{height:5,background:"rgba(0,0,0,.08)",borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:3,transition:"width .5s"}}/>
      </div>
    </div>
  );

  return (
    <div style={{background:"#F0EDE8",minHeight:"100vh",fontFamily:"'Noto Sans TC',sans-serif",color:C.ink}}>

      {/* HERO */}
      <div style={{background:C.ink,color:"white",padding:"64px 48px 56px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:400,height:"100%",background:"linear-gradient(135deg,transparent 40%,rgba(201,168,76,.12))",pointerEvents:"none"}}/>
        <div style={{maxWidth:700}}>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"3px",textTransform:"uppercase",color:C.gold,marginBottom:16}}>PawFormula 經典系列 · Classic Line</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:46,fontWeight:500,lineHeight:1.2,marginBottom:20,color:"white"}}>好食材，好比例，<br/><em style={{color:C.gold,fontStyle:"italic"}}>每天都剛剛好。</em></h1>
          <p style={{fontSize:16,lineHeight:1.8,fontWeight:300,color:"rgba(255,255,255,.7)",maxWidth:520,marginBottom:28}}>
            不需要填問卷。六種口味 × 三個生命階段，每份配方含 <strong style={{color:C.gold}}>3 種以上台灣當季蔬果</strong>，獸醫營養師認證，台灣在地食材製作。
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <div style={{padding:"8px 20px",background:C.gold,color:C.ink,borderRadius:50,fontSize:12,fontWeight:700}}>NT$1,500–2,500 / 月</div>
            <div style={{padding:"8px 20px",border:"1px solid rgba(255,255,255,.3)",color:"rgba(255,255,255,.8)",borderRadius:50,fontSize:12}}>3+ 種當季蔬果</div>
            <div style={{padding:"8px 20px",border:"1px solid rgba(255,255,255,.3)",color:"rgba(255,255,255,.8)",borderRadius:50,fontSize:12}}>獸醫營養師認證</div>
            <div onClick={()=>setPage("single")} style={{padding:"8px 20px",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.5)",color:"white",borderRadius:50,fontSize:12,fontWeight:600,cursor:"pointer"}}>🛍️ 先買單包試試 →</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:920,margin:"0 auto",padding:"48px 24px 80px"}}>

        {/* STEP 1 – STAGE */}
        <div style={{marginBottom:52}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:C.ink,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>1</div>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:500}}>選擇生命階段</div>
              <div style={{fontSize:13,color:C.slate,marginTop:2,fontWeight:300}}>每個階段的配方比例不同，選對了才能補對營養。</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {STAGES.map(s=>{
              const sel=selStage===s.id;
              return(
                <div key={s.id} onClick={()=>setSelStage(s.id)} style={{border:`2px solid ${sel?s.borderColor:"rgba(0,0,0,.1)"}`,borderRadius:20,background:sel?s.cardBg:"white",cursor:"pointer",padding:"24px 22px",transition:"all .25s",position:"relative",transform:sel?"translateY(-4px)":"none",boxShadow:sel?"0 12px 32px rgba(0,0,0,.1)":"0 2px 8px rgba(0,0,0,.04)"}}>
                  {s.badge&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:C.sage,color:"white",fontSize:10,fontWeight:700,padding:"4px 14px",borderRadius:50,whiteSpace:"nowrap"}}>{s.badge}</div>}
                  {sel&&<div style={{position:"absolute",top:14,right:14,width:22,height:22,borderRadius:"50%",background:s.borderColor,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12}}>✓</div>}
                  <div style={{textAlign:"center",marginBottom:18}}>
                    <div style={{fontSize:40,marginBottom:8}}>{s.emoji}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:500}}>{s.label}</div>
                    <div style={{fontSize:12,color:C.slate,marginTop:2}}>{s.age}</div>
                    <div style={{fontSize:11,fontWeight:700,color:s.accentColor,marginTop:10,letterSpacing:".5px",textTransform:"uppercase"}}>{s.highlight}</div>
                  </div>
                  <div style={{fontSize:13,color:C.slate,lineHeight:1.7,fontWeight:300,marginBottom:18}}>{s.desc}</div>
                  <div style={{background:"rgba(0,0,0,.04)",borderRadius:10,padding:"14px",marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.ink,marginBottom:10,letterSpacing:".3px",textTransform:"uppercase"}}>配方比例</div>
                    <Bar label="蛋白質" pct={s.protein} color={sel?s.borderColor:"#B0ADA8"}/>
                    <Bar label="優質脂肪" pct={s.fat} color={sel?C.earth:"#C8C0B0"}/>
                    <Bar label="蔬菜纖維" pct={s.veg} color={sel?"#7AB87E":"#B8C8B8"}/>
                    <Bar label="補充劑" pct={s.sup} color={sel?"#90B8D8":"#C0CCD8"}/>
                  </div>
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.ink,marginBottom:8,letterSpacing:".3px",textTransform:"uppercase"}}>適合族群</div>
                    {s.bestFor.map(t=>(<div key={t} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:12,color:C.slate,marginBottom:5}}><span style={{color:s.accentColor,fontWeight:700,flexShrink:0}}>✓</span>{t}</div>))}
                    <div style={{fontSize:11,fontWeight:600,color:C.ink,marginBottom:8,marginTop:12,letterSpacing:".3px",textTransform:"uppercase"}}>常見健康挑戰</div>
                    {s.challenges.map(t=>(<div key={t} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:12,color:C.slate,marginBottom:5}}><span style={{color:C.earth,fontWeight:700,flexShrink:0}}>→</span>{t}</div>))}
                  </div>
                  <div style={{borderTop:"1px solid rgba(0,0,0,.08)",paddingTop:14,display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                    <div><div style={{fontSize:11,color:C.slate}}>訂閱月費</div><div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:s.accentColor}}>NT${s.priceSub.toLocaleString()}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.slate}}>單包售價</div><div style={{fontSize:15,fontWeight:600,color:C.ink}}>NT${s.priceUnit}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2 – FLAVOR */}
        <div style={{marginBottom:48,opacity:selStage?1:.5,pointerEvents:selStage?"auto":"none",transition:"opacity .3s"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:selStage?C.ink:C.light,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0,transition:"background .3s"}}>2</div>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:500,color:selStage?C.ink:C.light,transition:"color .3s"}}>選擇口味 <span style={{fontSize:14,fontWeight:300,color:C.slate,fontFamily:"inherit"}}>（可多選，輪替更健康）</span></div>
              <div style={{fontSize:13,color:C.slate,marginTop:2,fontWeight:300}}>每種口味使用不同主蛋白質，每份均含 3 種以上台灣當季蔬果。</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {FLAVORS.map(f=>{
              const sel=selFlavors.includes(f.id);
              const isExp=expanded===f.id;
              return(
                <div key={f.id}>
                  <div onClick={()=>toggleFlavor(f.id)} style={{border:`2px solid ${sel?"#1A1A2E":f.accent+"40"}`,borderRadius:16,background:sel?"#1A1A2E":f.bg,cursor:"pointer",transition:"all .2s",position:"relative",overflow:"hidden",transform:sel?"translateY(-2px)":"none",boxShadow:sel?"0 8px 24px rgba(0,0,0,.15)":"0 2px 6px rgba(0,0,0,.04)"}}>
                    {sel&&<div style={{position:"absolute",top:10,left:10,width:22,height:22,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:C.ink}}>✓</div>}
                    <div style={{position:"absolute",top:10,right:10,background:sel?"rgba(255,255,255,.2)":f.accent,color:"white",fontSize:9,fontWeight:700,padding:"3px 10px",borderRadius:50}}>{f.tag}</div>
                    <div style={{fontSize:38,padding:"22px 20px 10px",textAlign:"center"}}>{f.emoji}</div>
                    <div style={{padding:"0 18px 18px"}}>
                      <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:500,color:sel?"white":C.ink,marginBottom:3}}>{f.name}</div>
                      <div style={{fontSize:10,fontWeight:600,color:sel?"rgba(255,255,255,.6)":f.accent,letterSpacing:".8px",textTransform:"uppercase",marginBottom:8}}>{f.en}</div>
                      <div style={{fontSize:12,color:sel?"rgba(255,255,255,.7)":C.slate,lineHeight:1.6,fontWeight:300,marginBottom:8}}>{f.desc}</div>
                      <div style={{fontSize:11,color:sel?"rgba(255,255,255,.5)":C.light,fontStyle:"italic",lineHeight:1.5}}>{f.seasonal}</div>
                    </div>
                  </div>
                  <div onClick={()=>setExpanded(isExp?null:f.id)} style={{textAlign:"center",fontSize:12,color:C.sageD,cursor:"pointer",margin:"8px 0",fontWeight:500}}>
                    {isExp?"收起 ↑":"查看成分 ↓"}
                  </div>
                  {isExp&&(
                    <div style={{background:"white",border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px"}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.ink,marginBottom:10}}>主要食材</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                        {f.ingredients.map(i=>(<span key={i} style={{padding:"4px 10px",background:"#F5F5F0",border:"1px solid rgba(0,0,0,.08)",borderRadius:50,fontSize:11,color:C.ink}}>{i}</span>))}
                      </div>
                      <div style={{fontSize:12,fontWeight:600,color:C.sageD,marginBottom:6}}>✅ 適合</div>
                      {f.suitable.map(s=>(<div key={s} style={{fontSize:11,color:C.slate,marginBottom:3}}>• {s}</div>))}
                      {f.notFor.length>0&&<><div style={{fontSize:12,fontWeight:600,color:"#C4705A",marginTop:10,marginBottom:6}}>⚠️ 不適合</div>{f.notFor.map(s=>(<div key={s} style={{fontSize:11,color:C.slate,marginBottom:3}}>• {s}</div>))}</>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 3 – ORDER */}
        <div style={{background:"white",borderRadius:24,padding:"32px 36px",boxShadow:"0 4px 24px rgba(0,0,0,.06)",opacity:(selStage&&selFlavors.length>0)?1:.5,transition:"opacity .3s"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:(selStage&&selFlavors.length>0)?C.ink:C.light,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0,transition:"background .3s"}}>3</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:500}}>確認訂單</div>
          </div>
          {/* Summary */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
            <div style={{background:"#F0EDE8",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:C.slate,letterSpacing:".8px",textTransform:"uppercase",marginBottom:6}}>生命階段</div>
              {stage?<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{stage.emoji}</span><div><div style={{fontSize:15,fontWeight:500,color:C.ink}}>{stage.label}</div><div style={{fontSize:11,color:C.slate}}>{stage.age}</div></div></div>:<div style={{fontSize:13,color:C.light}}>尚未選擇</div>}
            </div>
            <div style={{background:"#F0EDE8",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:C.slate,letterSpacing:".8px",textTransform:"uppercase",marginBottom:6}}>已選口味</div>
              {selFlavors.length>0?<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{selFlavors.map(id=>{const f=FLAVORS.find(fl=>fl.id===id);return(<span key={id} style={{fontSize:13}}>{f.emoji} {f.name}</span>);})}</div>:<div style={{fontSize:13,color:C.light}}>尚未選擇</div>}
            </div>
          </div>
          {/* Delivery */}
          <div style={{marginBottom:24}}>
            <div style={{display:"flex",gap:0,borderRadius:14,overflow:"hidden",border:`1.5px solid ${C.ink}`,width:"fit-content",marginBottom:16}}>
              <div onClick={()=>{}} style={{padding:"11px 28px",background:C.ink,color:"white",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
                📦 訂閱制 <span style={{background:C.sage,color:"white",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:50}}>省 15%</span>
              </div>
              <div onClick={()=>setPage("single")} style={{padding:"11px 28px",background:"white",color:C.ink,fontSize:14,fontWeight:500,cursor:"pointer"}}>
                🛍️ 改為單包購買
              </div>
            </div>
            <div style={{background:"#F8F5F0",borderRadius:14,padding:"20px 20px"}}>
              <div style={{fontSize:13,color:C.slate,lineHeight:1.6,marginBottom:16}}>自動續訂 ∙ 隨時可暫停或取消 ∙ 免運費 ∙ 前兩週可免費調整配方</div>
              <div style={{fontSize:12,fontWeight:600,color:C.ink,marginBottom:10}}>配送頻率</div>
              <div style={{display:"flex",gap:10}}>
                {[{v:"weekly",f:"每週配送",d:"最新鮮"},{v:"biweekly",f:"每兩週配送",d:"最多人選擇"},{v:"monthly",f:"每月配送",d:"一次備足"}].map(d=>(
                  <div key={d.v} onClick={()=>setDelivery(d.v)} style={{flex:1,padding:"11px",border:`1.5px solid ${delivery===d.v?C.ink:C.border}`,borderRadius:10,textAlign:"center",cursor:"pointer",background:delivery===d.v?C.ink:"white",transition:"all .2s"}}>
                    <div style={{fontSize:13,fontWeight:500,color:delivery===d.v?"white":C.ink}}>{d.f}</div>
                    <div style={{fontSize:11,color:delivery===d.v?"rgba(255,255,255,.6)":C.mid,marginTop:2}}>{d.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Price */}
          <div style={{background:`linear-gradient(135deg,${C.ink},#2A2A4A)`,borderRadius:16,padding:"22px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:4}}>{selFlavors.length>0&&stage?`${stage.label} × ${selFlavors.length} 種口味`:"請選擇後查看價格"}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:700,color:C.gold}}>{subTotal>0?`NT$${subTotal.toLocaleString()}`:"—"}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>/ 月 ∙ 隨時可暫停或取消</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:4}}>單種口味</div>
              <div style={{fontSize:20,fontWeight:600,color:"white",fontFamily:"Georgia,serif"}}>{stage?`NT$${stage.priceSub.toLocaleString()}`:"—"}</div>
              <div style={{fontSize:10,color:C.gold,marginTop:3}}>比單買省 15%</div>
            </div>
          </div>
          <button onClick={()=>{
            if(!selFlavors.length||!selStage){alert("請先選擇生命階段和口味！");return;}
            selFlavors.forEach(fid=>{
              const f=FLAVORS.find(fl=>fl.id===fid);
              setCart(c=>[...c,{ emoji:f.emoji, name:f.name, stage:stage.label, type:`訂閱 ${delivery==="weekly"?"每週":delivery==="biweekly"?"每兩週":"每月"}`, price:stage.priceSub, qty:1 }]);
            });
            setCartDone(true); setTimeout(()=>setCartDone(false),3000);
          }} style={{width:"100%",padding:15,background:cartDone?C.sageD:(!selFlavors.length||!selStage)?C.light:C.gold,color:cartDone||(!selFlavors.length||!selStage)?"white":C.ink,border:"none",borderRadius:50,fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:(!selFlavors.length||!selStage)?"not-allowed":"pointer",transition:"all .2s"}}>
            {cartDone?"✓ 已加入購物車！":"訂閱並加入購物車 🐾"}
          </button>
          <div style={{textAlign:"center",marginTop:16,fontSize:13,color:C.slate}}>
            有特殊健康需求？<span onClick={()=>setPage("intake")} style={{color:C.sageD,fontWeight:600,cursor:"pointer",marginLeft:4}}>前往填寫客製化問卷 →</span>
          </div>
        </div>

        {/* CROSSSELL */}
        <div style={{marginTop:40,background:`linear-gradient(135deg,${C.sageL},#E8F4E8)`,border:`1px solid ${C.sage}`,borderRadius:20,padding:"28px 32px",display:"flex",gap:24,alignItems:"center"}}>
          <div style={{fontSize:48,flexShrink:0}}>✨</div>
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:500,marginBottom:6}}>想要更精準的個人化配方？</div>
            <div style={{fontSize:13,color:C.mid,lineHeight:1.7,fontWeight:300,marginBottom:14}}>如果您的毛孩有特殊健康狀況、食物過敏，或想依據體重、活動量和 BCS 評分獲得完全個人化配方——<strong style={{color:C.sageD}}>客製化系列</strong>會是更適合的選擇。</div>
            <div onClick={()=>setPage("intake")} style={{display:"inline-block",padding:"10px 22px",background:C.sage,color:"white",borderRadius:50,fontSize:13,fontWeight:600,cursor:"pointer"}}>前往填寫客製化問卷 →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ───────────────────────────────────────────────────
function StoryTeamPage({ setPage }) {
  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", color:C.dark, background:C.cream }}>
      <div style={{ background:C.ink, padding:"72px 48px 64px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:400, height:"100%", background:"linear-gradient(135deg, transparent 50%, rgba(122,158,126,.1))", pointerEvents:"none" }} />
        <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"3px", textTransform:"uppercase", color:C.sage, marginBottom:16 }}>關於 PawFormula</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:44, fontWeight:500, color:"white", lineHeight:1.25, marginBottom:16 }}>
            我們相信，<em style={{ color:C.gold, fontStyle:"italic" }}>每隻毛孩</em><br/>都值得被好好對待。
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.65)", lineHeight:1.8, fontWeight:300, maxWidth:540, margin:"0 auto" }}>PawFormula 誕生於一個很簡單的信念：寵物的食物應該像對待家人一樣用心。</p>
        </div>
      </div>
      <div style={{ maxWidth:1040, margin:"0 auto", padding:"72px 48px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"flex-start", marginBottom:72 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.earth, marginBottom:12 }}>品牌故事</div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:32, fontWeight:500, color:C.dark, marginBottom:24, lineHeight:1.35 }}>從一隻生病的老狗，開始的這件事。</h2>
            {[
              { title:"故事的起點", content:"PawFormula 的創辦人在陪伴愛犬走過慢性腎臟病（CKD）的過程中，發現市面上幾乎找不到一款食品是真正依據牠的腎功能分期、體重和活動量計算出來的。大部分所謂的「腎臟處方食品」，不是太貴就是口感不佳，而且都是一刀切的通用配方。" },
              { title:"兩年的研究", content:"於是，我們花了兩年時間，與獸醫營養師合作，建立了一套以 RER × MER 為核心的個人化計算系統。我們研究了超過 200 篇獸醫營養學文獻，拜訪了台灣各地的在地農場，並與 HACCP 認證的食品安全專家共同設計了整個生產流程。" },
              { title:"第一批訂閱戶", content:"2025 年，我們以 30 位創始訂閱者開始了軟性上市。三個月後，超過 85% 的飼主回報毛孩的健康指標有顯著改善，其中 CKD 患犬的血磷值平均下降了 23%。" },
              { title:"我們的承諾", content:"PawFormula 不是一個寵物食品公司，而是一個相信「每隻毛孩都值得被個別對待」的團隊。我們的承諾很簡單：只要您願意花幾分鐘告訴我們關於牠的一切，我們就會用最嚴謹的科學和最新鮮的食材，回應您對牠的愛。" },
            ].map((s,i)=>(
              <div key={s.title} style={{ marginBottom:24, paddingBottom:24, borderBottom: i<3?`1px solid ${C.border}`:"none" }}>
                <div style={{ fontSize:15, fontWeight:600, color:C.dark, marginBottom:8 }}>{s.title}</div>
                <p style={{ fontSize:14, color:C.mid, lineHeight:1.9, fontWeight:300 }}>{s.content}</p>
              </div>
            ))}
          </div>
          <div>
            <div style={{ background:"linear-gradient(135deg, #EBF2EC, #F5EDE3)", borderRadius:20, height:300, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10, border:`1px dashed ${C.border}`, marginBottom:20 }}>
              <div style={{ fontSize:48 }}>🐕</div>
              <div style={{ fontSize:13, color:C.light }}>品牌故事圖片（480 × 300px）</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[{n:"100+",d:"服務毛孩"},{n:"6",d:"食譜口味"},{n:"3",d:"生命階段"},{n:"99%",d:"飼主滿意度"}].map(s=>(
                <div key={s.n} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 14px", textAlign:"center" }}>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:600, color:C.sage }}>{s.n}</div>
                  <div style={{ fontSize:12, color:C.mid, marginTop:4 }}>{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop:`1px solid ${C.border}`, maxWidth:1040, margin:"0 auto" }} />
      <div style={{ maxWidth:1040, margin:"0 auto", padding:"72px 48px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.earth, marginBottom:12 }}>研發團隊</div>
          <h2 style={{ fontFamily:"Georgia,serif", fontSize:34, fontWeight:500, color:C.dark, marginBottom:14 }}>站在牠身後的人。</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginBottom:36 }}>
          {[
            { emoji:"👩‍⚕️", role:"獸醫營養師", title:"配方開發與認證", desc:"所有食譜由認證獸醫營養師審核，依 AAFCO 及 FEDIAF 標準調整。每季更新配方，每位客製化客戶出貨前均經二次審查。" },
            { emoji:"🧪", role:"食品安全專家", title:"生產與品質控管", desc:"生產廚房通過 HACCP 認證，每批次食材均經微生物檢測與重金屬篩檢。批次號碼與食材產地全程可溯源。" },
            { emoji:"📊", role:"營養計算系統", title:"個人化演算引擎", desc:"自主開發的 MER 計算引擎整合超過 12 項個人化參數，包括 BCS 評分、絕育狀態、健康診斷和活動量。" },
          ].map(t=>(
            <div key={t.role} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"28px 24px", textAlign:"center" }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg, #EBF2EC, #F5EDE3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 16px", border:`1px dashed ${C.border}` }}>{t.emoji}</div>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", color:C.sage, marginBottom:6 }}>{t.role}</div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:500, color:C.dark, marginBottom:12 }}>{t.title}</div>
              <div style={{ fontSize:13, color:C.mid, lineHeight:1.8, fontWeight:300 }}>{t.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background:C.sageL, border:`1px solid ${C.sage}`, borderRadius:20, padding:"28px 36px", textAlign:"center", marginBottom:48 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:500, color:C.dark, marginBottom:8 }}>想加入我們？</div>
          <p style={{ fontSize:14, color:C.mid, lineHeight:1.7, fontWeight:300, marginBottom:14 }}>我們正在尋找熱愛動物、相信科學的獸醫師、食品科學家和工程師。</p>
          <div style={{ fontSize:14, color:C.sageD, fontWeight:600 }}>📧 careers@pawformula.com.tw</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div onClick={()=>setPage("intake")} style={{ display:"inline-block", padding:"14px 32px", background:C.sage, color:"white", borderRadius:50, fontSize:15, fontWeight:600, cursor:"pointer" }}>為牠量身訂製 →</div>
        </div>
      </div>
    </div>
  );
}

// ── PHILOSOPHY + CERTS PAGE (merged) ────────────────────────────────
function PhilosophyCertsPage({ setPage }) {
  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", color:C.dark, background:C.cream }}>
      <div style={{ background:C.ink, padding:"72px 48px 64px", textAlign:"center" }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"3px", textTransform:"uppercase", color:C.sage, marginBottom:14 }}>配方理念 ＆ 認證</div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:44, fontWeight:500, color:"white", lineHeight:1.25, marginBottom:16 }}>從原形食物中，<br/><em style={{ color:C.gold, fontStyle:"italic" }}>獲取真正所需的營養。</em></h1>
        <p style={{ fontSize:16, color:"rgba(255,255,255,.65)", lineHeight:1.8, fontWeight:300, maxWidth:560, margin:"0 auto" }}>最好的寵物食品不需要一張長長的添加劑清單——只需要正確的食材、正確的比例，以及不讓營養流失的製程。</p>
      </div>
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"72px 48px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center", marginBottom:72 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.earth, marginBottom:12 }}>原形食物原則</div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:30, fontWeight:500, marginBottom:18, lineHeight:1.35 }}>看得見的食材，才是真正的食物。</h2>
            <p style={{ fontSize:14, color:C.mid, lineHeight:1.9, fontWeight:300, marginBottom:14 }}>PawFormula 的每一份配方，食材都以原形呈現——整塊雞胸肉、新鮮地瓜、完整的蔬菜。我們不使用肉骨粉、副產品或「動物蛋白」這種模糊的成分描述。</p>
            <p style={{ fontSize:14, color:C.mid, lineHeight:1.9, fontWeight:300 }}>原形食物中的蛋白質、脂肪、維生素和礦物質存在於完整的食物基質中，吸收率和生物利用率遠高於人工萃取後再添加回去的合成營養素。</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              { icon:"✅", title:"我們使用", bg:C.sageL, border:C.sage, color:C.sageD, items:["整塊雞胸肉、雞腿肉","台灣溫體牛肉","新鮮根莖蔬菜","當季水果","天然補充劑（葡萄糖胺、亞麻籽油）"] },
              { icon:"❌", title:"我們不使用", bg:C.earthL, border:C.earth, color:"#8B5E3C", items:["肉骨粉或副產品","人工色素、香料","防腐劑","模糊的「動物蛋白」","填充性穀物（玉米澱粉等）"] },
            ].map(g=>(
              <div key={g.title} style={{ background:g.bg, border:`1.5px solid ${g.border}`, borderRadius:14, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:600, color:g.color, marginBottom:10 }}>{g.icon} {g.title}</div>
                {g.items.map(i=>(<div key={i} style={{ fontSize:13, color:C.mid, marginBottom:5, paddingLeft:8 }}>• {i}</div>))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:C.ink, borderRadius:24, padding:"48px 44px", marginBottom:72, color:"white" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.gold, marginBottom:12 }}>特殊製程</div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:30, fontWeight:500, color:"white", marginBottom:12 }}>急速冷凍，<em style={{ color:C.gold, fontStyle:"italic" }}>鎖住每一分營養。</em></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[
              { icon:"🌡️", title:"低溫輕煮", desc:"低溫烹調確保病原體滅活，同時最大程度保留胺基酸結構完整性。" },
              { icon:"❄️", title:"-40°C 急速冷凍", desc:"備料後 2 小時內急速冷凍，細胞結構不被冰晶破壞，營養素保留率 ≥ 95%。" },
              { icon:"🔒", title:"真空密封保鮮", desc:"食品級真空袋密封，防止氧化與冷凍燒傷，保存期限達 6 個月。" },
              { icon:"🚚", title:"全程冷鏈配送", desc:"保溫箱加乾冰，全程維持 -15°C 以下，食品安全無縫接軌。" },
            ].map(s=>(
              <div key={s.title} style={{ background:"rgba(255,255,255,.07)", borderRadius:14, padding:"20px 16px", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>{s.icon}</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:500, color:"white", marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.55)", lineHeight:1.7, fontWeight:300 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:48 }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.earth, marginBottom:12 }}>認證與標準</div>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:30, fontWeight:500, color:C.dark }}>每一個數字，都有來源。</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:20 }}>
            {[
              { icon:"🏅", label:"HACCP 認證", sub:"危害分析重要管制點", color:C.sageL, border:C.sage, desc:"從食材驗收、備料、烹調、冷凍到包裝，每個關鍵管制點均有監控記錄，確保每批次食品安全。" },
              { icon:"📋", label:"AAFCO 標準", sub:"美國飼料管理協會", color:C.earthL, border:C.earth, desc:"所有配方均符合 AAFCO 犬貓完整均衡飲食標準，是目前全球寵物食品業最廣泛採用的營養充足性基準。" },
              { icon:"🌍", label:"FEDIAF 標準", sub:"歐洲寵物食品工業聯合會", color:"#EEF4FB", border:"#5080A0", desc:"療癒型配方額外對照 FEDIAF 歐洲標準，取其中較嚴格的規範執行，確保特殊需求毛孩符合最高國際水準。" },
              { icon:"🇹🇼", label:"台灣農業部合規", sub:"寵物食品相關法規", color:"#F5F0F5", border:"#A080A0", desc:"所有產品標示均符合台灣農業部規定，成分表、保證分析值、餵食指南及製造商資訊全部以正體中文標示。" },
            ].map(c=>(
              <div key={c.label} style={{ background:c.color, border:`1.5px solid ${c.border}`, borderRadius:16, padding:"22px 24px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ fontSize:30 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:500, color:C.dark }}>{c.label}</div>
                    <div style={{ fontSize:11, color:C.mid }}>{c.sub}</div>
                  </div>
                </div>
                <div style={{ fontSize:13, color:C.mid, lineHeight:1.8, fontWeight:300 }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px 32px", textAlign:"center" }}>
            <div style={{ fontSize:13, color:C.mid, lineHeight:1.8, fontWeight:300 }}>如需查看 HACCP 認證文件、實驗室報告或批次可溯源紀錄：<strong style={{ color:C.sageD }}>quality@pawformula.com.tw</strong></div>
          </div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div onClick={()=>setPage("intake")} style={{ display:"inline-block", padding:"14px 32px", background:C.sage, color:"white", borderRadius:50, fontSize:15, fontWeight:600, cursor:"pointer" }}>為牠量身訂製 →</div>
        </div>
      </div>
    </div>
  );
}

// ── FAQ PAGE ──────────────────────────────────────────────────────
function FAQPage() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"冷凍鮮食要怎麼保存和解凍？", a:"收到後請立即放入冷凍庫，最長可保存 6 個月。餵食前一天移至冷藏室自然解凍（4–8°C），或以密封袋浸泡冷水快速解凍約 30–60 分鐘。請勿微波解凍，高溫會破壞食物的營養結構。" },
    { q:"從乾糧換成鮮食，需要注意什麼？", a:"建議採 7–10 天漸進式轉換：前三天以 25% 鮮食 + 75% 原食物開始，每兩天提高 25%。部分毛孩在轉換期會有短暫軟便或排便頻率改變，屬正常現象，通常 3–5 天後恢復。若症狀持續超過一週，建議諮詢獸醫。" },
    { q:"我的毛孩有 CKD，可以吃嗎？", a:"可以，而且鮮食對 CKD 毛孩特別有幫助——高含水量（≥70%）有助於腎臟灌流。我們的客製化系列會依據 IRIS 分期嚴格控制磷含量，並提供上傳血液報告的介面，讓獸醫營養師直接依數值調整配方。" },
    { q:"訂閱後可以更換口味或暫停嗎？", a:"可以。每個月均可在後台更換口味、調整份量或暫停訂閱，無需任何費用或違約金。如果毛孩的體重或健康狀況有變化，隨時更新問卷，我們會在下一批次出貨前調整配方。" },
    { q:"PawFormula 跟市面上其他鮮食品牌有什麼不同？", a:"最大的差異是「個人化計算」。市面上大多數鮮食品牌是按體重分級，而 PawFormula 的客製化系列會依據 RER × MER、BCS 評分、健康診斷和活動量計算出專屬的每日熱量目標，再由獸醫營養師選配食譜。" },
    { q:"配送範圍和時間？", a:"目前服務範圍為台北市全區，每週二、五進行冷鏈配送。下單後 72 小時內出貨，以 LINE 訊息提前通知到貨時窗。預計 2026 年下半年擴展至台中與高雄。" },
    { q:"可以同時訂不同口味嗎？", a:"可以。訂閱制可以選擇多種口味同時訂購，我們建議輪替不同口味，有助於增加飲食多樣性，也能降低單一蛋白質過敏的風險。" },
    { q:"有試吃方案嗎？", a:"有。在食譜系列頁面可以點選「先買單包試試」，無需訂閱，按需購買即可。確認適口性後再考慮訂閱享受 85 折優惠。" },
  ];
  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", color:C.dark, background:C.cream }}>
      <div style={{ background:C.white, padding:"72px 48px 56px", textAlign:"center", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.earth, marginBottom:14 }}>常見問題</div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:44, fontWeight:500, color:C.dark, lineHeight:1.25 }}>您可能想知道的。</h1>
      </div>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"56px 48px 80px" }}>
        {faqs.map((f,i) => (
          <div key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
            <div onClick={()=>setOpen(open===i?null:i)} style={{ padding:"20px 0", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
              <div style={{ fontSize:15, fontWeight:500, color:C.dark, lineHeight:1.5, paddingRight:20 }}>Q：{f.q}</div>
              <div style={{ fontSize:20, color:C.sage, flexShrink:0, transition:"transform .2s", transform:open===i?"rotate(45deg)":"none" }}>+</div>
            </div>
            {open===i&&<div style={{ paddingBottom:20, fontSize:14, color:C.mid, lineHeight:1.8, fontWeight:300 }}>{f.a}</div>}
          </div>
        ))}
        <div style={{ textAlign:"center", marginTop:48 }}>
          <p style={{ fontSize:14, color:C.mid, marginBottom:12 }}>還有其他問題嗎？</p>
          <div style={{ fontSize:14, color:C.sageD, fontWeight:600 }}>📧 hello@pawformula.com.tw</div>
        </div>
      </div>
    </div>
  );
}

// ── SINGLE PURCHASE PAGE ──────────────────────────────────────────
function SinglePurchasePage({ setPage, cart, setCart }) {
  const [selStage, setSelStage] = useState(null);
  const [selFlavor, setSelFlavor] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const stage = STAGES.find(s=>s.id===selStage);
  const flavor = FLAVORS.find(f=>f.id===selFlavor);
  const total = stage && flavor ? stage.priceUnit * qty : 0;
  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", background:"#F0EDE8", minHeight:"100vh", color:C.ink }}>
      <div style={{ background:C.ink, padding:"48px 48px 40px" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div onClick={()=>setPage("recipes")} style={{ fontSize:13, color:"rgba(255,255,255,.5)", cursor:"pointer", marginBottom:16 }}>← 食譜系列</div>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:"3px", textTransform:"uppercase", color:C.gold, marginBottom:12 }}>單包購買</div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:36, fontWeight:500, color:"white", lineHeight:1.25, marginBottom:12 }}>試吃一包，<em style={{ color:C.gold, fontStyle:"italic" }}>先認識再訂閱。</em></h1>
          <p style={{ fontSize:15, color:"rgba(255,255,255,.65)", fontWeight:300, lineHeight:1.7 }}>無需訂閱，按需購買。選一個生命階段和口味，就這麼簡單。</p>
        </div>
      </div>
      <div style={{ maxWidth:760, margin:"0 auto", padding:"36px 24px 80px" }}>
        <div style={{ background:"white", borderRadius:20, padding:"28px", marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.ink, letterSpacing:".5px", textTransform:"uppercase", marginBottom:16 }}>① 選擇生命階段</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {STAGES.map(s=>(
              <div key={s.id} onClick={()=>setSelStage(s.id)} style={{ border:`2px solid ${selStage===s.id?s.borderColor:"rgba(0,0,0,.1)"}`, borderRadius:14, padding:"16px 14px", cursor:"pointer", textAlign:"center", background:selStage===s.id?s.cardBg:"white", transition:"all .2s" }}>
                <div style={{ fontSize:28, marginBottom:6 }}>{s.emoji}</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:500 }}>{s.label}</div>
                <div style={{ fontSize:11, color:C.slate, marginTop:2 }}>{s.age}</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:s.accentColor, marginTop:8 }}>NT${s.priceUnit}</div>
                <div style={{ fontSize:10, color:C.slate }}>/ 包</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:"white", borderRadius:20, padding:"28px", marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,.05)", opacity:selStage?1:.5, pointerEvents:selStage?"auto":"none", transition:"opacity .3s" }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.ink, letterSpacing:".5px", textTransform:"uppercase", marginBottom:16 }}>② 選擇口味</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {FLAVORS.map(f=>{
              const sel=selFlavor===f.id; const isExp=expanded===f.id;
              return (
                <div key={f.id}>
                  <div onClick={()=>setSelFlavor(f.id)} style={{ border:`2px solid ${sel?"#1A1A2E":f.accent+"50"}`, borderRadius:14, background:sel?"#1A1A2E":f.bg, cursor:"pointer", transition:"all .2s", textAlign:"center", padding:"14px 12px" }}>
                    <div style={{ fontSize:32, marginBottom:6 }}>{f.emoji}</div>
                    <div style={{ fontFamily:"Georgia,serif", fontSize:14, fontWeight:500, color:sel?"white":C.ink }}>{f.name}</div>
                    <div style={{ fontSize:10, fontWeight:600, color:sel?"rgba(255,255,255,.6)":f.accent, marginTop:3, letterSpacing:".5px", textTransform:"uppercase" }}>{f.tag}</div>
                  </div>
                  <div onClick={()=>setExpanded(isExp?null:f.id)} style={{ textAlign:"center", fontSize:11, color:C.sageD, cursor:"pointer", marginTop:5, fontWeight:500 }}>{isExp?"收起 ↑":"成分 ↓"}</div>
                  {isExp&&<div style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px", marginTop:4 }}><div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>{f.ingredients.map(i=>(<span key={i} style={{ padding:"3px 8px", background:"#F5F5F0", borderRadius:50, fontSize:10, color:C.ink }}>{i}</span>))}</div></div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background:"white", borderRadius:20, padding:"28px", boxShadow:"0 2px 12px rgba(0,0,0,.05)", opacity:(selStage&&selFlavor)?1:.5, pointerEvents:(selStage&&selFlavor)?"auto":"none", transition:"opacity .3s" }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.ink, letterSpacing:".5px", textTransform:"uppercase", marginBottom:20 }}>③ 確認數量</div>
          {stage&&flavor&&(
            <div style={{ display:"flex", gap:16, alignItems:"center", padding:"16px 18px", background:"#F8F5F0", borderRadius:12, marginBottom:20 }}>
              <div style={{ fontSize:36 }}>{flavor.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600, color:C.ink }}>{flavor.name}</div>
                <div style={{ fontSize:12, color:C.slate, marginTop:2 }}>{stage.label} ∙ {stage.age}</div>
              </div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:stage.accentColor }}>NT${stage.priceUnit}</div>
            </div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.ink }}>數量</div>
            <div style={{ display:"flex", alignItems:"center", gap:14, background:"#F0EDE8", borderRadius:50, padding:"8px 20px" }}>
              <div onClick={()=>setQty(q=>Math.max(1,q-1))} style={{ width:28,height:28,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,fontWeight:500 }}>−</div>
              <div style={{ fontSize:20, fontWeight:700, color:C.ink, minWidth:28, textAlign:"center" }}>{qty}</div>
              <div onClick={()=>setQty(q=>q+1)} style={{ width:28,height:28,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,fontWeight:500 }}>+</div>
            </div>
            <div style={{ marginLeft:"auto", fontFamily:"Georgia,serif", fontSize:28, fontWeight:700, color:C.sageD }}>{total>0?`NT$${total.toLocaleString()}`:"—"}</div>
          </div>
          <button onClick={()=>{
            if(!selStage||!selFlavor) return;
            setCart(c=>[...c,{ emoji:flavor.emoji, name:flavor.name, stage:stage.label, type:`單包 ×${qty}`, price:stage.priceUnit*qty, qty:1 }]);
            setAdded(true); setTimeout(()=>setAdded(false),3000);
          }} style={{ width:"100%", padding:"14px", background:added?C.sageD:C.gold, color:added?"white":C.ink, border:"none", borderRadius:50, fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:"pointer", transition:"all .2s", marginBottom:12 }}>
            {added?"✓ 已加入購物車！":"加入購物車 🛍️"}
          </button>
          <div style={{ textAlign:"center", fontSize:13, color:C.slate }}>
            喜歡嗎？<span onClick={()=>setPage("recipes")} style={{ color:C.sageD, fontWeight:600, cursor:"pointer", marginLeft:4 }}>訂閱享 85 折優惠 →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FLOATING CART ─────────────────────────────────────────────────
function FloatingCart({ cart, setCart, setPage }) {
  const [open, setOpen] = useState(false);
  const total = cart.reduce((s,i)=>s+i.price*(i.qty||1),0);
  const count = cart.reduce((s,i)=>s+(i.qty||1),0);
  return (
    <>
      <div onClick={()=>setOpen(o=>!o)} style={{ position:"fixed", bottom:32, right:32, width:56, height:56, borderRadius:"50%", background:C.ink, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, cursor:"pointer", boxShadow:"0 4px 20px rgba(0,0,0,.25)", zIndex:500 }}>
        🛒
        {count>0&&<div style={{ position:"absolute", top:-4, right:-4, width:20, height:20, borderRadius:"50%", background:C.earth, color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{count}</div>}
      </div>
      {open&&(
        <div style={{ position:"fixed", bottom:100, right:32, width:320, background:C.white, border:`1px solid ${C.border}`, borderRadius:20, boxShadow:"0 8px 40px rgba(0,0,0,.15)", zIndex:500, overflow:"hidden" }}>
          <div style={{ padding:"18px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontFamily:"Georgia,serif", fontSize:16, fontWeight:500 }}>購物車</div>
            <div onClick={()=>setOpen(false)} style={{ cursor:"pointer", fontSize:18, color:C.light }}>✕</div>
          </div>
          <div style={{ padding:"16px 20px", maxHeight:280, overflowY:"auto" }}>
            {cart.length===0?<div style={{ textAlign:"center", padding:"24px 0", fontSize:13, color:C.light }}>購物車是空的</div>:
            cart.map((item,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, paddingBottom:14, borderBottom:i<cart.length-1?`1px solid ${C.border}`:"none" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:C.dark }}>{item.emoji} {item.name}</div>
                  <div style={{ fontSize:11, color:C.mid, marginTop:2 }}>{item.petName ? `${item.petName} ∙ `:""}{item.stage}{item.stage&&item.type?" ∙ ":""}{item.type}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.sageD }}>NT${(item.price*(item.qty||1)).toLocaleString()}</div>
                  <div onClick={()=>setCart(c=>c.filter((_,j)=>j!==i))} style={{ cursor:"pointer", fontSize:14, color:C.light }}>✕</div>
                </div>
              </div>
            ))}
          </div>
          {cart.length>0&&(
            <div style={{ padding:"16px 20px", borderTop:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ fontSize:14, fontWeight:500 }}>合計</div>
                <div style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:C.sageD }}>NT${total.toLocaleString()}</div>
              </div>
              <button onClick={()=>{ setOpen(false); setPage("checkout"); }} style={{ width:"100%", padding:"12px", background:C.earth, color:"white", border:"none", borderRadius:50, fontFamily:"inherit", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                前往結帳 →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── CHECKOUT PAGE ─────────────────────────────────────────────────
function CheckoutPage({ cart, setCart, setPage }) {
  const [step, setStep] = useState(1); // 1=review, 2=info, 3=confirm
  const [info, setInfo] = useState({ name:"", phone:"", email:"", address:"", district:"", note:"" });
  const [payment, setPayment] = useState("credit");
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const total = cart.reduce((s,i)=>s+i.price*(i.qty||1),0);
  const si = (k,v) => setInfo(f=>({...f,[k]:v}));
  const inp = { width:"100%", padding:"12px 16px", border:`1.5px solid ${C.border}`, borderRadius:10, fontFamily:"inherit", fontSize:14, color:C.dark, background:C.cream, outline:"none" };

  // ── Save order to Supabase ──────────────────────────────────────
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // 1. Insert customer
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .insert({ name: info.name, phone: info.phone, email: info.email, district: info.district, address: info.address })
        .select()
        .single();
      if (customerError) throw customerError;

      // 2. Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ customer_id: customer.id, total, payment_method: payment, note: info.note, status: "pending" })
        .select()
        .single();
      if (orderError) throw orderError;

      // 3. Insert order items
      const items = cart.map(item => ({
        order_id: order.id,
        product_name: item.name,
        product_emoji: item.emoji,
        product_type: item.type || "",
        pet_name: item.petName || "",
        price: item.price,
        qty: item.qty || 1,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(items);
      if (itemsError) throw itemsError;

      setPlaced(true);
    } catch (err) {
      console.error("Order submission error:", err);
      setSubmitError("訂單送出失敗，請稍後再試或聯繫我們。");
    } finally {
      setSubmitting(false);
    }
  };

  if(placed) return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", background:C.cream, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", maxWidth:480, padding:40 }}>
        <div style={{ fontSize:72, marginBottom:24 }}>🎉</div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, fontWeight:500, color:C.dark, marginBottom:16 }}>訂單已送出！</h1>
        <p style={{ fontSize:15, color:C.mid, lineHeight:1.8, fontWeight:300, marginBottom:12 }}>
          感謝您為毛孩選擇 PawFormula。我們的團隊將在 <strong>24 小時內</strong>以 LINE 或 Email 確認您的訂單細節。
        </p>
        <p style={{ fontSize:14, color:C.mid, lineHeight:1.8, fontWeight:300, marginBottom:32 }}>
          第一批鮮食預計 <strong>72 小時內</strong>出貨，出貨前會再次通知您配送時窗。
        </p>
        <div style={{ background:C.sageL, border:`1px solid ${C.sage}`, borderRadius:16, padding:"20px 24px", marginBottom:28, textAlign:"left" }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.sageD, marginBottom:10 }}>訂單摘要</div>
          {cart.map((item,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.dark, marginBottom:6 }}>
              <span>{item.emoji} {item.name} {item.petName?`（${item.petName}）`:""}</span>
              <span style={{ fontWeight:600 }}>NT${(item.price*(item.qty||1)).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${C.sage}`, marginTop:10, paddingTop:10, display:"flex", justifyContent:"space-between", fontWeight:700, color:C.sageD }}>
            <span>合計</span>
            <span>NT${total.toLocaleString()}</span>
          </div>
        </div>
        <div onClick={()=>{ setCart([]); setPage("home"); }} style={{ display:"inline-block", padding:"14px 32px", background:C.sage, color:"white", borderRadius:50, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          返回首頁
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", background:C.cream, minHeight:"100vh", color:C.dark }}>
      {/* Header */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div onClick={()=>setPage("home")} style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:600, cursor:"pointer" }}>
          Paw<span style={{ color:C.sage }}>Formula</span>
        </div>
        <div style={{ fontSize:13, color:C.mid }}>🔒 安全結帳</div>
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"40px 24px 80px", display:"grid", gridTemplateColumns:"1fr 360px", gap:32, alignItems:"start" }}>

        {/* LEFT: Steps */}
        <div>
          {/* Step tabs */}
          <div style={{ display:"flex", gap:0, marginBottom:28 }}>
            {[{n:1,l:"確認購物車"},{n:2,l:"填寫資料"},{n:3,l:"確認付款"}].map((s,i)=>(
              <div key={s.n} style={{ display:"flex", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", cursor:s.n<=step?"pointer":"default" }} onClick={()=>s.n<step&&setStep(s.n)}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:step>=s.n?C.sage:C.border, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600 }}>
                    {step>s.n?"✓":s.n}
                  </div>
                  <div style={{ fontSize:13, fontWeight:step===s.n?600:400, color:step>=s.n?C.dark:C.light }}>{s.l}</div>
                </div>
                {i<2&&<div style={{ width:32, height:2, background:step>s.n?C.sage:C.border, margin:"0 8px" }}/>}
              </div>
            ))}
          </div>

          {/* STEP 1: Cart review */}
          {step===1&&(
            <div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:500, marginBottom:20 }}>確認您的訂單</div>
              {cart.length===0?(
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"40px", textAlign:"center" }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
                  <div style={{ fontSize:15, color:C.mid }}>購物車是空的</div>
                  <div onClick={()=>setPage("recipes")} style={{ display:"inline-block", marginTop:16, padding:"10px 22px", background:C.sage, color:"white", borderRadius:50, fontSize:13, fontWeight:600, cursor:"pointer" }}>前往選購</div>
                </div>
              ):(
                <div>
                  {cart.map((item,i)=>(
                    <div key={i} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px", marginBottom:10, display:"flex", alignItems:"center", gap:16 }}>
                      <div style={{ fontSize:32, flexShrink:0 }}>{item.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:C.dark }}>{item.name}</div>
                        <div style={{ fontSize:12, color:C.mid, marginTop:3 }}>
                          {item.petName&&<span style={{ color:C.sage, fontWeight:500 }}>{item.petName} ∙ </span>}
                          {item.stage&&<span>{item.stage} ∙ </span>}
                          {item.type}
                        </div>
                      </div>
                      <div style={{ fontSize:16, fontWeight:700, color:C.sageD, flexShrink:0 }}>NT${(item.price*(item.qty||1)).toLocaleString()}</div>
                      <div onClick={()=>setCart(c=>c.filter((_,j)=>j!==i))} style={{ cursor:"pointer", fontSize:16, color:C.light, flexShrink:0 }}>✕</div>
                    </div>
                  ))}
                  <button onClick={()=>setStep(2)} style={{ width:"100%", marginTop:8, padding:"14px", background:C.sage, color:"white", border:"none", borderRadius:50, fontFamily:"inherit", fontSize:15, fontWeight:600, cursor:"pointer" }}>
                    繼續填寫資料 →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Contact info */}
          {step===2&&(
            <div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:500, marginBottom:20 }}>配送與聯絡資料</div>
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px 24px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:500, color:C.dark, marginBottom:6 }}>收件人姓名 *</label>
                    <input style={inp} value={info.name} onChange={e=>si("name",e.target.value)} placeholder="王小明"/>
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:500, color:C.dark, marginBottom:6 }}>手機號碼 *</label>
                    <input style={inp} value={info.phone} onChange={e=>si("phone",e.target.value)} placeholder="0912 345 678"/>
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:500, color:C.dark, marginBottom:6 }}>Email *</label>
                  <input style={inp} value={info.email} onChange={e=>si("email",e.target.value)} placeholder="your@email.com"/>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:500, color:C.dark, marginBottom:6 }}>行政區 *</label>
                  <select style={inp} value={info.district} onChange={e=>si("district",e.target.value)}>
                    <option value="">請選擇行政區</option>
                    {["中正區","大同區","中山區","松山區","大安區","萬華區","信義區","士林區","北投區","內湖區","南港區","文山區"].map(d=>(<option key={d}>{d}</option>))}
                  </select>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:500, color:C.dark, marginBottom:6 }}>詳細地址 *</label>
                  <input style={inp} value={info.address} onChange={e=>si("address",e.target.value)} placeholder="忠孝東路四段 100 號 3 樓"/>
                </div>
                <div style={{ marginBottom:6 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:500, color:C.dark, marginBottom:6 }}>備註（可留空）</label>
                  <input style={inp} value={info.note} onChange={e=>si("note",e.target.value)} placeholder="例如：請勿按門鈴，放門口即可"/>
                </div>
              </div>
              <div style={{ background:C.sageL, border:`1px solid ${C.sage}`, borderRadius:12, padding:"12px 16px", marginTop:12, fontSize:12, color:C.sageD }}>
                📍 目前配送範圍：<strong>台北市全區</strong>，每週二、五冷鏈配送，保溫箱加乾冰全程 -15°C 以下。
              </div>
              <div style={{ display:"flex", gap:10, marginTop:14 }}>
                <button onClick={()=>setStep(1)} style={{ flex:"0 0 auto", padding:"13px 20px", background:"white", color:C.mid, border:`1.5px solid ${C.border}`, borderRadius:50, fontFamily:"inherit", fontSize:13, cursor:"pointer" }}>← 返回</button>
                <button onClick={()=>{ if(!info.name||!info.phone||!info.email||!info.address||!info.district){alert("請填寫所有必填欄位");return;} setStep(3); }} style={{ flex:1, padding:"13px", background:C.sage, color:"white", border:"none", borderRadius:50, fontFamily:"inherit", fontSize:15, fontWeight:600, cursor:"pointer" }}>
                  繼續確認付款 →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step===3&&(
            <div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:500, marginBottom:20 }}>選擇付款方式</div>
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 24px", marginBottom:14 }}>
                {[
                  { id:"credit", icon:"💳", label:"信用卡 / 金融卡", sub:"Visa、Mastercard、JCB" },
                  { id:"linepay", icon:"🟢", label:"LINE Pay", sub:"LINE Pay 一鍵付款" },
                  { id:"atm", icon:"🏧", label:"ATM 轉帳", sub:"轉帳後請保留收據，48 小時內確認" },
                ].map((m,i)=>(
                  <div key={m.id} onClick={()=>setPayment(m.id)} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:i<2?`1px solid ${C.border}`:"none", cursor:"pointer" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${payment===m.id?C.sage:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {payment===m.id&&<div style={{ width:10, height:10, borderRadius:"50%", background:C.sage }}/>}
                    </div>
                    <div style={{ fontSize:22 }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:500, color:C.dark }}>{m.label}</div>
                      <div style={{ fontSize:12, color:C.mid }}>{m.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery info summary */}
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 20px", marginBottom:14 }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.dark, marginBottom:10 }}>配送資料確認</div>
                <div style={{ fontSize:13, color:C.mid, lineHeight:1.8 }}>
                  <div>👤 {info.name}　📞 {info.phone}</div>
                  <div>📧 {info.email}</div>
                  <div>📍 台北市{info.district} {info.address}</div>
                  {info.note&&<div>📝 {info.note}</div>}
                </div>
              </div>

              <div style={{ background:C.earthL, border:`1px solid ${C.earth}`, borderRadius:12, padding:"12px 16px", marginBottom:14, fontSize:12, color:"#8B5E3C" }}>
                💳 實際付款功能將於上線時啟用。點擊「確認下單」將儲存您的訂單資料。
              </div>

              {submitError && (
                <div style={{ background:"#FCEBEB", border:"1px solid #F09595", borderRadius:10, padding:"10px 14px", marginBottom:12, fontSize:13, color:"#A32D2D" }}>
                  {submitError}
                </div>
              )}

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setStep(2)} style={{ flex:"0 0 auto", padding:"13px 20px", background:"white", color:C.mid, border:`1.5px solid ${C.border}`, borderRadius:50, fontFamily:"inherit", fontSize:13, cursor:"pointer" }}>← 返回</button>
                <button onClick={handlePlaceOrder} disabled={submitting} style={{ flex:1, padding:"13px", background:submitting?C.light:C.earth, color:"white", border:"none", borderRadius:50, fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:submitting?"not-allowed":"pointer" }}>
                  {submitting ? "送出中…" : "確認下單 🐾"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Order summary */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"24px", position:"sticky", top:80 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:500, marginBottom:16 }}>訂單摘要</div>
          {cart.map((item,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:13 }}>
              <div style={{ color:C.dark, paddingRight:12 }}>
                {item.emoji} {item.name}
                {item.petName&&<div style={{ fontSize:11, color:C.sage, marginTop:2 }}>{item.petName}</div>}
                <div style={{ fontSize:11, color:C.mid }}>{item.type}</div>
              </div>
              <div style={{ fontWeight:600, color:C.dark, flexShrink:0 }}>NT${(item.price*(item.qty||1)).toLocaleString()}</div>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${C.border}`, marginTop:14, paddingTop:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.mid, marginBottom:6 }}>
              <span>小計</span><span>NT${total.toLocaleString()}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.mid, marginBottom:14 }}>
              <span>冷鏈配送費</span><span style={{ color:C.sage }}>免費</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:C.dark }}>
              <span>總計</span>
              <span style={{ color:C.sageD }}>NT${total.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ background:"#F8F8F8", borderRadius:10, padding:"12px 14px", marginTop:14, fontSize:12, color:C.mid, lineHeight:1.7 }}>
            🔒 256-bit SSL 加密安全結帳<br/>
            🔄 前兩週可免費調整配方<br/>
            ❌ 隨時可暫停或取消訂閱
          </div>
        </div>
      </div>
    </div>
  );
}
// ── ADMIN COMPONENTS ─────────────────────────────────────────────

const STATUS_COLORS = {
  pending:   { bg: "#FEF3C7", color: "#92400E", label: "待處理" },
  confirmed: { bg: "#DBEAFE", color: "#1E40AF", label: "已確認" },
  shipped:   { bg: "#EDE9FE", color: "#5B21B6", label: "已出貨" },
  delivered: { bg: "#D1FAE5", color: "#065F46", label: "已送達" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", label: "已取消" },
};

function Badge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{s.label}</span>;
}

function AdminLoginPage({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const ADMIN_PW = "pawformula2024";
  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans TC', sans-serif" }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "40px 36px", width: 360 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 600, color: C.dark, marginBottom: 4 }}>Paw<span style={{ color: C.sage }}>Formula</span></div>
        <div style={{ fontSize: 13, color: C.mid, marginBottom: 28 }}>後台管理系統</div>
        {error && <div style={{ background: "#FEE2E2", color: "#991B1B", fontSize: 12, padding: "8px 12px", borderRadius: 8, marginBottom: 14 }}>密碼錯誤，請再試一次</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: C.dark, display: "block", marginBottom: 6 }}>管理員密碼</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (pw === ADMIN_PW ? onLogin() : setError(true))}
            placeholder="輸入密碼"
            style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: C.dark, background: C.cream, outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={() => pw === ADMIN_PW ? onLogin() : setError(true)}
          style={{ width: "100%", padding: 12, background: C.sage, color: "white", border: "none", borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>登入</button>
        <div style={{ fontSize: 11, color: C.light, textAlign: "center", marginTop: 12 }}>預設密碼：pawformula2024</div>
      </div>
    </div>
  );
}

function AdminOrderModal({ order, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const handleSave = async () => { setSaving(true); await onUpdateStatus(order.id, status); setSaving(false); onClose(); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, fontFamily: "'Noto Sans TC', sans-serif" }}>
      <div style={{ background: C.white, borderRadius: 20, padding: 32, width: 480, maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500 }}>訂單詳情</div>
          <div onClick={onClose} style={{ cursor: "pointer", fontSize: 20, color: C.light }}>✕</div>
        </div>
        <div style={{ background: C.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 8 }}>👤 客戶資料</div>
          <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.9 }}>
            <div>姓名：<span style={{ color: C.dark, fontWeight: 500 }}>{order.customers?.name}</span></div>
            <div>電話：{order.customers?.phone}</div>
            <div>Email：{order.customers?.email}</div>
            <div>地址：台北市{order.customers?.district} {order.customers?.address}</div>
            {order.customers?.note && <div>備註：{order.customers?.note}</div>}
          </div>
        </div>
        <div style={{ background: C.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 8 }}>🛒 訂購內容</div>
          {order.order_items?.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingBottom: 6, marginBottom: 6, borderBottom: i < order.order_items.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <span>{item.product_emoji} {item.product_name} {item.pet_name ? `（${item.pet_name}）` : ""}</span>
              <span style={{ fontWeight: 600, color: C.dark }}>NT${(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <span>總計</span><span style={{ color: C.sage }}>NT${order.total?.toLocaleString()}</span>
          </div>
        </div>
        <div style={{ background: C.cream, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 6 }}>💳 付款方式</div>
          <div style={{ fontSize: 13, color: C.mid }}>{{ credit: "信用卡 / 金融卡", linepay: "LINE Pay", atm: "ATM 轉帳" }[order.payment_method] || order.payment_method}</div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.dark, display: "block", marginBottom: 8 }}>更新訂單狀態</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: C.dark, background: C.cream, outline: "none" }}>
            {Object.entries(STATUS_COLORS).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: "0 0 auto", padding: "11px 20px", background: "white", color: C.mid, border: `1.5px solid ${C.border}`, borderRadius: 50, fontFamily: "inherit", fontSize: 13, cursor: "pointer" }}>取消</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: 12, background: saving ? C.light : C.sage, color: "white", border: "none", borderRadius: 50, fontFamily: "inherit", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "儲存中…" : "儲存變更"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("orders"); // "orders" or "charts"

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select(`*, customers(*), order_items(*)`).order("created_at", { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  };
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => { await supabase.from("orders").update({ status }).eq("id", id); await fetchOrders(); };

  const deleteOrder = async (id) => {
    if (!window.confirm("確定要刪除這筆訂單嗎？此操作無法復原。")) return;
    await supabase.from("order_items").delete().eq("order_id", id);
    await supabase.from("orders").delete().eq("id", id);
    await fetchOrders();
  };

  const exportCSV = () => {
    const rows = [["訂單時間", "客戶姓名", "電話", "Email", "地址", "訂購內容", "總計", "付款方式", "狀態"]];
    orders.forEach(o => {
      rows.push([
        new Date(o.created_at).toLocaleString("zh-TW"),
        o.customers?.name || "",
        o.customers?.phone || "",
        o.customers?.email || "",
        `台北市${o.customers?.district || ""}${o.customers?.address || ""}`,
        o.order_items?.map(i => `${i.product_name} x${i.qty}`).join(" / ") || "",
        o.total,
        { credit: "信用卡", linepay: "LINE Pay", atm: "ATM" }[o.payment_method] || o.payment_method,
        STATUS_COLORS[o.status]?.label || o.status,
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `PawFormula_orders_${new Date().toLocaleDateString("zh-TW").replace(/\//g,"-")}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const filtered = orders
    .filter(o => filter === "all" || o.status === filter)
    .filter(o => !search || o.customers?.name?.includes(search) || o.customers?.phone?.includes(search) || o.customers?.email?.includes(search));

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  // Chart data — revenue by month
  const monthlyRevenue = orders.reduce((acc, o) => {
    const m = new Date(o.created_at).toLocaleDateString("zh-TW", { year: "numeric", month: "short" });
    acc[m] = (acc[m] || 0) + (o.total || 0);
    return acc;
  }, {});
  const monthLabels = Object.keys(monthlyRevenue).slice(-6);
  const monthValues = monthLabels.map(m => monthlyRevenue[m]);
  const maxVal = Math.max(...monthValues, 1);

  // Product popularity
  const productCount = {};
  orders.forEach(o => o.order_items?.forEach(i => { productCount[i.product_name] = (productCount[i.product_name] || 0) + (i.qty || 1); }));
  const topProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxProd = Math.max(...topProducts.map(p => p[1]), 1);

  return (
    <div style={{ fontFamily: "'Noto Sans TC', sans-serif", background: C.cream, minHeight: "100vh" }}>
      {/* Topbar */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 600, color: C.dark }}>
          Paw<span style={{ color: C.sage }}>Formula</span>
          <span style={{ fontSize: 12, fontWeight: 400, color: C.mid, marginLeft: 10 }}>後台管理</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/" style={{ fontSize: 12, padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 50, background: "white", color: C.mid, cursor: "pointer", fontFamily: "inherit", textDecoration: "none" }}>← 回到官網</a>
          <button onClick={exportCSV} style={{ fontSize: 12, padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 50, background: "white", color: C.mid, cursor: "pointer", fontFamily: "inherit" }}>⬇ 匯出 CSV</button>
          <button onClick={fetchOrders} style={{ fontSize: 12, padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 50, background: "white", color: C.mid, cursor: "pointer", fontFamily: "inherit" }}>🔄 重新整理</button>
          <button onClick={onLogout} style={{ fontSize: 12, padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 50, background: "white", color: C.mid, cursor: "pointer", fontFamily: "inherit" }}>登出</button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "總訂單數", value: orders.length, unit: "筆" },
            { label: "總營收", value: `NT$${totalRevenue.toLocaleString()}`, unit: "" },
            { label: "待處理", value: pendingCount, unit: "筆", alert: pendingCount > 0 },
            { label: "本月新客", value: orders.filter(o => new Date(o.created_at).getMonth() === new Date().getMonth()).length, unit: "位" },
          ].map((m, i) => (
            <div key={i} style={{ background: m.alert ? "#FEF3C7" : C.white, border: `1px solid ${m.alert ? "#FCD34D" : C.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: C.mid, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: m.alert ? "#92400E" : C.dark }}>{m.value}{m.unit && <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 3 }}>{m.unit}</span>}</div>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["orders", "📋 訂單管理"], ["charts", "📊 銷售分析"]].map(([key, label]) => (
            <div key={key} onClick={() => setTab(key)}
              style={{ padding: "8px 20px", borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer", border: `1.5px solid ${tab === key ? C.sage : C.border}`, background: tab === key ? C.sageL : C.white, color: tab === key ? C.sageD : C.mid }}>
              {label}
            </div>
          ))}
        </div>

        {/* ORDERS TAB */}
        {tab === "orders" && <>
          {/* Search + filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋客戶姓名、電話、Email…"
              style={{ flex: 1, minWidth: 200, padding: "8px 14px", border: `1.5px solid ${C.border}`, borderRadius: 50, fontSize: 13, fontFamily: "inherit", color: C.dark, background: C.white, outline: "none" }} />
            {[["all", "全部"], ...Object.entries(STATUS_COLORS).map(([k, v]) => [k, v.label])].map(([key, label]) => (
              <div key={key} onClick={() => setFilter(key)}
                style={{ padding: "6px 14px", borderRadius: 50, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1.5px solid ${filter === key ? C.sage : C.border}`, background: filter === key ? C.sageL : C.white, color: filter === key ? C.sageD : C.mid, whiteSpace: "nowrap" }}>
                {label}{key !== "all" && ` (${orders.filter(o => o.status === key).length})`}
              </div>
            ))}
          </div>

          {/* Orders table */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: "center", color: C.mid }}>載入中…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: C.mid }}><div style={{ fontSize: 36, marginBottom: 12 }}>🐾</div>找不到符合的訂單</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["下單時間", "客戶", "訂購內容", "總計", "付款", "狀態", "操作"].map((h, i) => (
                      <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.mid, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => (
                    <tr key={order.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.cream}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: C.mid }}>
                        {new Date(order.created_at).toLocaleDateString("zh-TW")}<br />
                        <span style={{ fontSize: 11 }}>{new Date(order.created_at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{order.customers?.name}</div>
                        <div style={{ fontSize: 11, color: C.mid }}>{order.customers?.phone}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: C.mid, maxWidth: 160 }}>
                        {order.order_items?.map((item, j) => <div key={j}>{item.product_emoji} {item.product_name}</div>)}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: C.dark, whiteSpace: "nowrap" }}>NT${order.total?.toLocaleString()}</td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: C.mid }}>{{ credit: "信用卡", linepay: "LINE Pay", atm: "ATM" }[order.payment_method] || order.payment_method}</td>
                      <td style={{ padding: "14px 16px" }}><Badge status={order.status} /></td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setSelected(order)} style={{ fontSize: 12, padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 50, background: "white", color: C.mid, cursor: "pointer", fontFamily: "inherit" }}>查看</button>
                          <button onClick={() => deleteOrder(order.id)} style={{ fontSize: 12, padding: "5px 12px", border: "1px solid #FCA5A5", borderRadius: 50, background: "white", color: "#DC2626", cursor: "pointer", fontFamily: "inherit" }}>刪除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>}

        {/* CHARTS TAB */}
        {tab === "charts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Monthly revenue chart */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 20 }}>每月營收</div>
              {monthLabels.length === 0 ? (
                <div style={{ textAlign: "center", color: C.mid, padding: "24px 0" }}>尚無資料</div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
                  {monthLabels.map((m, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 11, color: C.mid }}>NT${(monthValues[i]/1000).toFixed(1)}k</div>
                      <div style={{ width: "100%", background: C.sage, borderRadius: "4px 4px 0 0", height: `${Math.round((monthValues[i] / maxVal) * 120)}px`, minHeight: 4, transition: "height .3s" }} />
                      <div style={{ fontSize: 11, color: C.mid, textAlign: "center" }}>{m}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product popularity */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 20 }}>熱門商品排行</div>
              {topProducts.length === 0 ? (
                <div style={{ textAlign: "center", color: C.mid, padding: "24px 0" }}>尚無資料</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {topProducts.map(([name, count], i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 13, color: C.dark, width: 120, flexShrink: 0 }}>{name}</div>
                      <div style={{ flex: 1, background: C.cream, borderRadius: 50, height: 10, overflow: "hidden" }}>
                        <div style={{ width: `${Math.round((count / maxProd) * 100)}%`, height: "100%", background: C.earth, borderRadius: 50 }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, width: 30, textAlign: "right" }}>{count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment method breakdown */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, marginBottom: 20 }}>付款方式分佈</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[["credit", "信用卡", C.sage], ["linepay", "LINE Pay", "#06C755"], ["atm", "ATM 轉帳", C.earth]].map(([key, label, color]) => {
                  const count = orders.filter(o => o.payment_method === key).length;
                  const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                  return (
                    <div key={key} style={{ flex: 1, background: C.cream, borderRadius: 12, padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color }}>{pct}%</div>
                      <div style={{ fontSize: 12, color: C.mid, marginTop: 4 }}>{label}</div>
                      <div style={{ fontSize: 11, color: C.light, marginTop: 2 }}>{count} 筆</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      {selected && <AdminOrderModal order={selected} onClose={() => setSelected(null)} onUpdateStatus={updateStatus} />}
    </div>
  );
}

function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <AdminDashboard onLogout={() => setLoggedIn(false)} /> : <AdminLoginPage onLogin={() => setLoggedIn(true)} />;
}

// ── SITE PASSWORD GATE ────────────────────────────────────────────
const SITE_PASSWORD = "paw2024";

function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const check = () => pw === SITE_PASSWORD ? onUnlock() : setError(true);
  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Noto Sans TC', sans-serif" }}>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "48px 40px", width: 360, textAlign: "center" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 600, color: C.dark, marginBottom: 8 }}>
          Paw<span style={{ color: C.sage }}>Formula</span>
        </div>
        <div style={{ fontSize: 13, color: C.mid, marginBottom: 32 }}>網站目前僅供內部預覽</div>
        {error && <div style={{ background: "#FEE2E2", color: "#991B1B", fontSize: 12, padding: "8px 12px", borderRadius: 8, marginBottom: 14 }}>密碼錯誤，請再試一次</div>}
        <input
          type="password" value={pw} onChange={e => { setPw(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="請輸入預覽密碼"
          style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${error ? "#FCA5A5" : C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: C.dark, background: C.cream, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
        />
        <button onClick={check} style={{ width: "100%", padding: 13, background: C.sage, color: "white", border: "none", borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          進入網站
        </button>
      </div>
    </div>
  );
}

// ── CUSTOMER SITE ─────────────────────────────────────────────────
function CustomerSite() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const navigate = (p) => { setPage(p); window.scrollTo({top:0, behavior:"instant"}); };
  return (
    <div>
      <SharedNav page={page} setPage={navigate} />
      {page==="home"         && <HomePage            setPage={navigate} />}
      {page==="story_team"   && <StoryTeamPage       setPage={navigate} />}
      {page==="philosophy"   && <PhilosophyCertsPage setPage={navigate} />}
      {page==="faq"          && <FAQPage             setPage={navigate} />}
      {page==="intake"       && <IntakePage          setPage={navigate} cart={cart} setCart={setCart} />}
      {page==="recipes"      && <RecipesPage         setPage={navigate} cart={cart} setCart={setCart} />}
      {page==="single"       && <SinglePurchasePage  setPage={navigate} cart={cart} setCart={setCart} />}
      {page==="checkout"     && <CheckoutPage        setPage={navigate} cart={cart} setCart={setCart} />}
      <FloatingCart cart={cart} setCart={setCart} setPage={navigate} />
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("pf_unlocked") === "true");
  const unlock = () => { sessionStorage.setItem("pf_unlocked", "true"); setUnlocked(true); };

  if (window.location.pathname === "/admin") return <AdminApp />;
  if (window.location.pathname === "/dashboard") return <DashboardApp />;
  if (!unlocked) return <PasswordGate onUnlock={unlock} />;
  return <CustomerSite />;
}

// ── DASHBOARD (PawFormula_dashboard) ──────────────────────────────

// ── DESIGN TOKENS (light theme) ───────────────────────────────────
const DC = {
  bg:"#F4F6F9", surface:"#FFFFFF", surface2:"#F0F3F7",
  border:"#E2E8F0", border2:"#CBD5E1",
  sage:"#4A7150", sageL:"#E8F2EA", sageD:"#2D4F33", sageMid:"#7A9E7E",
  earth:"#9A6B3C", earthL:"#FDF0E6", earthD:"#7A4E24",
  gold:"#92700A", goldL:"#FEF9E7",
  red:"#C53030", redL:"#FFF5F5",
  blue:"#2B6CB0", blueL:"#EBF4FF",
  purple:"#553C9A", purpleL:"#FAF5FF",
  teal:"#2C7A7B", tealL:"#E6FFFA",
  dark:"#1A202C", mid:"#4A5568", light:"#718096", lighter:"#A0AEC0",
  // Species colors
  dogBg:"#EBF4FF", dogBorder:"#2B6CB0", dogText:"#1A365D",
  catBg:"#FAF5FF", catBorder:"#553C9A", catText:"#44337A",
};

// ── INGREDIENT DATA FROM EXCEL ────────────────────────────────────
const DOG_INGREDIENTS = [{"name":"雞（熟）","moisture":65.3,"kcal":165.0,"protein":31.0,"fat":3.57,"cho":0.0,"fiber":0.0,"dm":34.7,"dm_protein":89.34,"dm_fat":10.29,"dm_cho":0.0,"prot_1000":187.9,"fat_1000":21.6,"cho_1000":0.0,"ca_1000":0.091,"p_1000":1.382,"na_1000":0.4485},{"name":"牛（熟）","moisture":73.3,"kcal":116.0,"protein":23.7,"fat":2.41,"cho":0.0,"fiber":0.0,"dm":26.7,"dm_protein":88.76,"dm_fat":9.03,"dm_cho":0.0,"prot_1000":204.3,"fat_1000":20.8,"cho_1000":0.0,"ca_1000":0.112,"p_1000":1.897,"na_1000":0.4741},{"name":"豬（生）","moisture":68.8,"kcal":168.0,"protein":21.1,"fat":9.47,"cho":0.0,"fiber":0.0,"dm":31.2,"dm_protein":67.63,"dm_fat":30.35,"dm_cho":0.0,"prot_1000":125.6,"fat_1000":56.4,"cho_1000":0.0,"ca_1000":0.024,"p_1000":1.173,"na_1000":0.2381},{"name":"羊（熟）","moisture":58.0,"kcal":206.0,"protein":28.0,"fat":9.0,"cho":0.0,"fiber":0.0,"dm":42.0,"dm_protein":66.67,"dm_fat":21.43,"dm_cho":0.0,"prot_1000":135.9,"fat_1000":43.7,"cho_1000":0.0,"ca_1000":0.01,"p_1000":1.068,"na_1000":0.3883},{"name":"鴨（熟）","moisture":64.0,"kcal":201.0,"protein":24.0,"fat":11.0,"cho":0.0,"fiber":0.0,"dm":36.0,"dm_protein":66.67,"dm_fat":30.56,"dm_cho":0.0,"prot_1000":119.4,"fat_1000":54.7,"cho_1000":0.0,"ca_1000":0.065,"p_1000":0.995,"na_1000":0.398},{"name":"鮭魚","moisture":68.0,"kcal":206.0,"protein":22.0,"fat":12.0,"cho":0.0,"fiber":0.0,"dm":32.0,"dm_protein":68.75,"dm_fat":37.5,"dm_cho":0.0,"prot_1000":106.8,"fat_1000":58.3,"cho_1000":0.0,"ca_1000":0.073,"p_1000":1.214,"na_1000":0.2913},{"name":"鮪魚","moisture":70.0,"kcal":128.0,"protein":24.0,"fat":3.0,"cho":0.0,"fiber":0.0,"dm":30.0,"dm_protein":80.0,"dm_fat":10.0,"dm_cho":0.0,"prot_1000":187.5,"fat_1000":23.4,"cho_1000":0.0,"ca_1000":0.102,"p_1000":2.031,"na_1000":0.4688},{"name":"綠貽貝","moisture":82.0,"kcal":90.0,"protein":16.5,"fat":3.0,"cho":5.0,"fiber":0.3,"dm":18.0,"dm_protein":91.67,"dm_fat":16.67,"dm_cho":27.78,"prot_1000":183.3,"fat_1000":33.3,"cho_1000":55.6,"ca_1000":0.556,"p_1000":2.5,"na_1000":4.4444},{"name":"鵪鶉蛋","moisture":74.4,"kcal":158.0,"protein":13.1,"fat":11.1,"cho":0.4,"fiber":0.0,"dm":25.6,"dm_protein":51.17,"dm_fat":43.36,"dm_cho":1.56,"prot_1000":82.9,"fat_1000":70.3,"cho_1000":2.5,"ca_1000":0.405,"p_1000":1.43,"na_1000":0.8924},{"name":"雞蛋","moisture":76.2,"kcal":143.0,"protein":12.6,"fat":9.5,"cho":0.7,"fiber":0.0,"dm":23.8,"dm_protein":52.94,"dm_fat":39.92,"dm_cho":2.94,"prot_1000":88.1,"fat_1000":66.4,"cho_1000":4.9,"ca_1000":0.392,"p_1000":1.385,"na_1000":1.0},{"name":"雞心","moisture":71.0,"kcal":190.0,"protein":13.3,"fat":14.8,"cho":0.1,"fiber":0.0,"dm":29.0,"dm_protein":45.86,"dm_fat":51.03,"dm_cho":0.34,"prot_1000":70.0,"fat_1000":77.9,"cho_1000":0.5,"ca_1000":0.021,"p_1000":0.605,"na_1000":0.2632},{"name":"雞肝","moisture":76.5,"kcal":119.0,"protein":16.9,"fat":4.83,"cho":0.73,"fiber":0.0,"dm":23.5,"dm_protein":71.91,"dm_fat":20.55,"dm_cho":3.11,"prot_1000":142.0,"fat_1000":40.6,"cho_1000":6.1,"ca_1000":0.067,"p_1000":2.496,"na_1000":0.5966},{"name":"豬肝","moisture":70.7,"kcal":137.0,"protein":20.8,"fat":5.3,"cho":1.7,"fiber":0.0,"dm":29.3,"dm_protein":70.99,"dm_fat":18.09,"dm_cho":5.8,"prot_1000":151.8,"fat_1000":38.7,"cho_1000":12.4,"ca_1000":0.029,"p_1000":2.394,"na_1000":0.6131},{"name":"小麥","moisture":12.6,"kcal":362.0,"protein":14.1,"fat":2.6,"cho":69.2,"fiber":11.0,"dm":87.4,"dm_protein":16.13,"dm_fat":2.97,"dm_cho":79.18,"prot_1000":39.0,"fat_1000":7.2,"cho_1000":191.2,"ca_1000":0.052,"p_1000":0.666,"na_1000":0.0028},{"name":"薏仁","moisture":11.5,"kcal":378.0,"protein":14.1,"fat":6.1,"cho":66.2,"fiber":9.0,"dm":88.5,"dm_protein":15.93,"dm_fat":6.89,"dm_cho":74.8,"prot_1000":37.3,"fat_1000":16.1,"cho_1000":175.1,"ca_1000":0.05,"p_1000":0.796,"na_1000":0.0053},{"name":"白米","moisture":14.1,"kcal":354.0,"protein":7.0,"fat":0.7,"cho":77.8,"fiber":0.5,"dm":85.9,"dm_protein":8.15,"dm_fat":0.81,"dm_cho":90.57,"prot_1000":19.8,"fat_1000":2.0,"cho_1000":219.8,"ca_1000":0.014,"p_1000":0.229,"na_1000":0.0056},{"name":"蕃薯","moisture":70.0,"kcal":119.0,"protein":1.3,"fat":0.1,"cho":27.5,"fiber":1.5,"dm":30.0,"dm_protein":4.33,"dm_fat":0.33,"dm_cho":91.67,"prot_1000":10.9,"fat_1000":0.8,"cho_1000":231.1,"ca_1000":0.143,"p_1000":0.336,"na_1000":0.6134},{"name":"糙米","moisture":14.8,"kcal":355.0,"protein":7.8,"fat":2.3,"cho":74.0,"fiber":1.7,"dm":85.2,"dm_protein":9.15,"dm_fat":2.7,"dm_cho":86.85,"prot_1000":22.0,"fat_1000":6.5,"cho_1000":208.5,"ca_1000":0.082,"p_1000":0.715,"na_1000":0.0085},{"name":"豆芽","moisture":93.1,"kcal":24.0,"protein":2.3,"fat":0.2,"cho":4.1,"fiber":1.9,"dm":6.9,"dm_protein":33.33,"dm_fat":2.9,"dm_cho":59.42,"prot_1000":95.8,"fat_1000":8.3,"cho_1000":170.8,"ca_1000":2.333,"p_1000":0.958,"na_1000":0.6667},{"name":"芋頭","moisture":66.5,"kcal":127.0,"protein":1.8,"fat":0.15,"cho":34.0,"fiber":3.5,"dm":33.5,"dm_protein":5.37,"dm_fat":0.45,"dm_cho":101.49,"prot_1000":14.2,"fat_1000":1.2,"cho_1000":267.7,"ca_1000":0.331,"p_1000":0.646,"na_1000":0.0945},{"name":"羽衣甘藍","moisture":89.53,"kcal":35.0,"protein":2.92,"fat":1.49,"cho":4.42,"fiber":4.1,"dm":10.5,"dm_protein":27.89,"dm_fat":14.23,"dm_cho":42.22,"prot_1000":83.4,"fat_1000":42.6,"cho_1000":126.3,"ca_1000":7.257,"p_1000":1.571,"na_1000":1.5143},{"name":"地瓜葉","moisture":86.8,"kcal":42.0,"protein":2.49,"fat":0.51,"cho":8.83,"fiber":5.28,"dm":13.2,"dm_protein":18.86,"dm_fat":3.86,"dm_cho":66.89,"prot_1000":59.3,"fat_1000":12.1,"cho_1000":210.2,"ca_1000":18.571,"p_1000":1.929,"na_1000":0.1429},{"name":"青花苗","moisture":92.8,"kcal":36.0,"protein":2.57,"fat":0.0,"cho":3.57,"fiber":3.6,"dm":7.2,"dm_protein":35.69,"dm_fat":0.0,"dm_cho":49.58,"prot_1000":71.4,"fat_1000":0.0,"cho_1000":99.2,"ca_1000":2.972,"p_1000":0.0,"na_1000":0.0},{"name":"空心菜","moisture":92.47,"kcal":19.0,"protein":3.14,"fat":0.2,"cho":2.6,"fiber":2.1,"dm":7.5,"dm_protein":41.7,"dm_fat":2.66,"dm_cho":34.53,"prot_1000":165.3,"fat_1000":10.5,"cho_1000":136.8,"ca_1000":4.053,"p_1000":2.053,"na_1000":5.9474},{"name":"苦瓜","moisture":94.4,"kcal":19.0,"protein":0.9,"fat":0.1,"cho":4.1,"fiber":2.3,"dm":5.6,"dm_protein":16.07,"dm_fat":1.79,"dm_cho":73.21,"prot_1000":47.4,"fat_1000":5.3,"cho_1000":215.8,"ca_1000":1.053,"p_1000":1.632,"na_1000":0.1579},{"name":"南瓜","moisture":79.8,"kcal":74.0,"protein":1.9,"fat":0.2,"cho":17.3,"fiber":0.75,"dm":20.2,"dm_protein":9.41,"dm_fat":0.99,"dm_cho":85.64,"prot_1000":25.7,"fat_1000":2.7,"cho_1000":233.8,"ca_1000":0.189,"p_1000":0.622,"na_1000":0.0135},{"name":"菠菜","moisture":93.7,"kcal":18.0,"protein":2.2,"fat":0.3,"cho":2.4,"fiber":2.2,"dm":6.3,"dm_protein":34.92,"dm_fat":4.76,"dm_cho":38.1,"prot_1000":122.2,"fat_1000":16.7,"cho_1000":133.3,"ca_1000":4.5,"p_1000":2.444,"na_1000":2.3889},{"name":"紅蘿蔔","moisture":89.3,"kcal":39.0,"protein":1.1,"fat":0.1,"cho":8.9,"fiber":2.8,"dm":10.7,"dm_protein":10.28,"dm_fat":0.93,"dm_cho":83.18,"prot_1000":28.2,"fat_1000":2.6,"cho_1000":228.2,"ca_1000":0.692,"p_1000":0.744,"na_1000":2.2821},{"name":"花椰菜","moisture":93.0,"kcal":23.0,"protein":1.8,"fat":0.1,"cho":4.5,"fiber":2.0,"dm":7.0,"dm_protein":25.71,"dm_fat":1.43,"dm_cho":64.29,"prot_1000":78.3,"fat_1000":4.3,"cho_1000":195.7,"ca_1000":0.913,"p_1000":1.739,"na_1000":0.6087},{"name":"冬瓜","moisture":96.9,"kcal":11.0,"protein":0.4,"fat":0.1,"cho":2.4,"fiber":0.95,"dm":3.1,"dm_protein":12.9,"dm_fat":3.23,"dm_cho":77.42,"prot_1000":36.4,"fat_1000":9.1,"cho_1000":218.2,"ca_1000":1.0,"p_1000":1.455,"na_1000":0.1818},{"name":"彩椒（黃）","moisture":92.2,"kcal":28.0,"protein":0.8,"fat":0.3,"cho":6.0,"fiber":1.7,"dm":7.8,"dm_protein":10.26,"dm_fat":3.85,"dm_cho":76.92,"prot_1000":28.6,"fat_1000":10.7,"cho_1000":214.3,"ca_1000":0.25,"p_1000":0.714,"na_1000":0.0357},{"name":"白蘿蔔","moisture":95.2,"kcal":18.0,"protein":0.5,"fat":0.1,"cho":3.9,"fiber":1.6,"dm":4.8,"dm_protein":10.42,"dm_fat":2.08,"dm_cho":81.25,"prot_1000":27.8,"fat_1000":5.6,"cho_1000":216.7,"ca_1000":1.333,"p_1000":0.944,"na_1000":2.5556},{"name":"高麗菜","moisture":92.0,"kcal":24.0,"protein":1.4,"fat":0.2,"cho":2.9,"fiber":1.9,"dm":8.0,"dm_protein":17.5,"dm_fat":2.5,"dm_cho":36.25,"prot_1000":58.3,"fat_1000":8.3,"cho_1000":120.8,"ca_1000":2.042,"p_1000":1.333,"na_1000":0.75},{"name":"秋葵","moisture":90.0,"kcal":30.5,"protein":2.1,"fat":0.2,"cho":7.5,"fiber":3.95,"dm":10.0,"dm_protein":21.0,"dm_fat":2.0,"dm_cho":75.0,"prot_1000":68.9,"fat_1000":6.6,"cho_1000":245.9,"ca_1000":3.41,"p_1000":1.902,"na_1000":0.2623},{"name":"番茄","moisture":94.0,"kcal":21.5,"protein":0.9,"fat":0.2,"cho":4.2,"fiber":1.2,"dm":6.0,"dm_protein":15.0,"dm_fat":3.33,"dm_cho":70.0,"prot_1000":41.9,"fat_1000":9.3,"cho_1000":195.3,"ca_1000":0.465,"p_1000":1.116,"na_1000":0.2326},{"name":"青豆仁","moisture":79.0,"kcal":81.0,"protein":5.4,"fat":0.4,"cho":14.5,"fiber":5.1,"dm":21.0,"dm_protein":25.71,"dm_fat":1.9,"dm_cho":69.05,"prot_1000":66.7,"fat_1000":4.9,"cho_1000":179.0,"ca_1000":0.309,"p_1000":1.333,"na_1000":0.0617},{"name":"山藥","moisture":82.0,"kcal":80.0,"protein":2.4,"fat":0.1,"cho":18.0,"fiber":1.15,"dm":18.0,"dm_protein":13.33,"dm_fat":0.56,"dm_cho":100.0,"prot_1000":30.0,"fat_1000":1.2,"cho_1000":225.0,"ca_1000":0.137,"p_1000":0.4,"na_1000":0.0938},{"name":"蓮藕","moisture":82.0,"kcal":69.5,"protein":1.9,"fat":0.25,"cho":15.25,"fiber":3.0,"dm":18.0,"dm_protein":10.56,"dm_fat":1.39,"dm_cho":84.72,"prot_1000":27.3,"fat_1000":3.6,"cho_1000":219.4,"ca_1000":0.388,"p_1000":0.633,"na_1000":0.2806},{"name":"黑木耳","moisture":90.0,"kcal":29.5,"protein":1.7,"fat":0.1,"cho":7.5,"fiber":7.4,"dm":10.0,"dm_protein":17.0,"dm_fat":1.0,"dm_cho":75.0,"prot_1000":57.6,"fat_1000":3.4,"cho_1000":254.2,"ca_1000":1.186,"p_1000":0.407,"na_1000":0.2712},{"name":"枸杞","moisture":4.8,"kcal":347.0,"protein":12.3,"fat":1.3,"cho":77.8,"fiber":11.2,"dm":95.2,"dm_protein":12.92,"dm_fat":1.37,"dm_cho":81.72,"prot_1000":35.4,"fat_1000":3.7,"cho_1000":224.2,"ca_1000":0.144,"p_1000":0.548,"na_1000":1.5014},{"name":"南瓜籽","moisture":5.0,"kcal":559.0,"protein":30.0,"fat":49.0,"cho":11.0,"fiber":6.0,"dm":95.0,"dm_protein":31.58,"dm_fat":51.58,"dm_cho":11.58,"prot_1000":53.7,"fat_1000":87.7,"cho_1000":19.7,"ca_1000":0.098,"p_1000":1.646,"na_1000":0.0322},{"name":"芝麻","moisture":5.0,"kcal":573.0,"protein":18.0,"fat":50.0,"cho":23.0,"fiber":12.0,"dm":95.0,"dm_protein":18.95,"dm_fat":52.63,"dm_cho":24.21,"prot_1000":31.4,"fat_1000":87.3,"cho_1000":40.1,"ca_1000":1.702,"p_1000":1.098,"na_1000":0.0192},{"name":"乾操海帶","moisture":82.5,"kcal":43.0,"protein":1.7,"fat":0.6,"cho":9.6,"fiber":1.3,"dm":17.5,"dm_protein":9.71,"dm_fat":3.43,"dm_cho":54.86,"prot_1000":39.5,"fat_1000":14.0,"cho_1000":223.3,"ca_1000":3.907,"p_1000":0.977,"na_1000":5.4186},{"name":"蘋果","moisture":86.2,"kcal":50.0,"protein":0.3,"fat":0.2,"cho":13.1,"fiber":2.4,"dm":13.8,"dm_protein":2.17,"dm_fat":1.45,"dm_cho":94.93,"prot_1000":6.0,"fat_1000":4.0,"cho_1000":262.0,"ca_1000":0.06,"p_1000":0.2,"na_1000":0.04},{"name":"藍莓","moisture":85.3,"kcal":53.0,"protein":0.5,"fat":0.3,"cho":0.2,"fiber":1.4,"dm":14.7,"dm_protein":3.4,"dm_fat":2.04,"dm_cho":1.36,"prot_1000":9.4,"fat_1000":5.7,"cho_1000":3.8,"ca_1000":0.208,"p_1000":0.245,"na_1000":0.0},{"name":"香蕉","moisture":75.5,"kcal":91.0,"protein":1.25,"fat":0.25,"cho":23.0,"fiber":2.2,"dm":24.5,"dm_protein":5.1,"dm_fat":1.02,"dm_cho":93.88,"prot_1000":13.7,"fat_1000":2.7,"cho_1000":252.7,"ca_1000":0.06,"p_1000":0.275,"na_1000":0.033},{"name":"芭樂","moisture":88.5,"kcal":38.0,"protein":0.85,"fat":0.35,"cho":10.0,"fiber":4.5,"dm":11.5,"dm_protein":7.39,"dm_fat":3.04,"dm_cho":86.96,"prot_1000":22.4,"fat_1000":9.2,"cho_1000":263.2,"ca_1000":0.289,"p_1000":0.711,"na_1000":0.0789},{"name":"雞油","moisture":0.3,"kcal":891.0,"protein":0.0,"fat":99.8,"cho":0.0,"fiber":0.0,"dm":99.7,"dm_protein":0.0,"dm_fat":100.1,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":112.0,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0},{"name":"魚油","moisture":0.0,"kcal":902.0,"protein":0.0,"fat":100.0,"cho":0.0,"fiber":0.0,"dm":100.0,"dm_protein":0.0,"dm_fat":100.0,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":110.9,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0},{"name":"豬油","moisture":0.0,"kcal":902.0,"protein":0.0,"fat":100.0,"cho":0.0,"fiber":0.0,"dm":100.0,"dm_protein":0.0,"dm_fat":100.0,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":110.9,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0},{"name":"亞麻仁油","moisture":0.0,"kcal":884.0,"protein":0.0,"fat":100.0,"cho":0.0,"fiber":0.0,"dm":100.0,"dm_protein":0.0,"dm_fat":100.0,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":113.1,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0},{"name":"菜籽油","moisture":0.0,"kcal":884.0,"protein":0.0,"fat":100.0,"cho":0.0,"fiber":0.0,"dm":100.0,"dm_protein":0.0,"dm_fat":100.0,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":113.1,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0}];
const CAT_INGREDIENTS = [{"name":"雞（熟）","moisture":65.3,"kcal":165.0,"protein":31.0,"fat":3.57,"cho":0.0,"fiber":0.0,"dm":34.7,"dm_protein":89.34,"dm_fat":10.29,"dm_cho":0.0,"prot_1000":187.9,"fat_1000":21.6,"cho_1000":0.0,"ca_1000":0.091,"p_1000":1.382,"na_1000":0.4485},{"name":"牛（熟）","moisture":73.3,"kcal":116.0,"protein":23.7,"fat":2.41,"cho":0.0,"fiber":0.0,"dm":26.7,"dm_protein":88.76,"dm_fat":9.03,"dm_cho":0.0,"prot_1000":204.3,"fat_1000":20.8,"cho_1000":0.0,"ca_1000":0.112,"p_1000":1.897,"na_1000":0.4741},{"name":"豬（生）","moisture":68.8,"kcal":168.0,"protein":21.1,"fat":9.47,"cho":0.0,"fiber":0.0,"dm":31.2,"dm_protein":67.63,"dm_fat":30.35,"dm_cho":0.0,"prot_1000":125.6,"fat_1000":56.4,"cho_1000":0.0,"ca_1000":0.024,"p_1000":1.173,"na_1000":0.2381},{"name":"羊（熟）","moisture":58.0,"kcal":206.0,"protein":28.0,"fat":9.0,"cho":0.0,"fiber":0.0,"dm":42.0,"dm_protein":66.67,"dm_fat":21.43,"dm_cho":0.0,"prot_1000":135.9,"fat_1000":43.7,"cho_1000":0.0,"ca_1000":0.01,"p_1000":1.068,"na_1000":0.3883},{"name":"鴨（熟）","moisture":64.0,"kcal":201.0,"protein":24.0,"fat":11.0,"cho":0.0,"fiber":0.0,"dm":36.0,"dm_protein":66.67,"dm_fat":30.56,"dm_cho":0.0,"prot_1000":119.4,"fat_1000":54.7,"cho_1000":0.0,"ca_1000":0.065,"p_1000":0.995,"na_1000":0.398},{"name":"鮭魚","moisture":68.0,"kcal":206.0,"protein":22.0,"fat":12.0,"cho":0.0,"fiber":0.0,"dm":32.0,"dm_protein":68.75,"dm_fat":37.5,"dm_cho":0.0,"prot_1000":106.8,"fat_1000":58.3,"cho_1000":0.0,"ca_1000":0.073,"p_1000":1.214,"na_1000":0.2913},{"name":"鮪魚","moisture":70.0,"kcal":128.0,"protein":24.0,"fat":3.0,"cho":0.0,"fiber":0.0,"dm":30.0,"dm_protein":80.0,"dm_fat":10.0,"dm_cho":0.0,"prot_1000":187.5,"fat_1000":23.4,"cho_1000":0.0,"ca_1000":0.102,"p_1000":2.031,"na_1000":0.4688},{"name":"雞心","moisture":71.0,"kcal":190.0,"protein":13.3,"fat":14.8,"cho":0.1,"fiber":0.0,"dm":29.0,"dm_protein":45.86,"dm_fat":51.03,"dm_cho":0.34,"prot_1000":70.0,"fat_1000":77.9,"cho_1000":0.5,"ca_1000":0.021,"p_1000":0.605,"na_1000":0.2632},{"name":"雞肝","moisture":76.5,"kcal":119.0,"protein":16.9,"fat":4.83,"cho":0.73,"fiber":0.0,"dm":23.5,"dm_protein":71.91,"dm_fat":20.55,"dm_cho":3.11,"prot_1000":142.0,"fat_1000":40.6,"cho_1000":6.1,"ca_1000":0.067,"p_1000":2.496,"na_1000":0.5966},{"name":"豬肝","moisture":70.7,"kcal":137.0,"protein":20.8,"fat":5.3,"cho":1.7,"fiber":0.0,"dm":29.3,"dm_protein":70.99,"dm_fat":18.09,"dm_cho":5.8,"prot_1000":151.8,"fat_1000":38.7,"cho_1000":12.4,"ca_1000":0.029,"p_1000":2.394,"na_1000":0.6131},{"name":"小麥","moisture":12.6,"kcal":362.0,"protein":14.1,"fat":2.6,"cho":69.2,"fiber":11.0,"dm":87.4,"dm_protein":16.13,"dm_fat":2.97,"dm_cho":79.18,"prot_1000":39.0,"fat_1000":7.2,"cho_1000":191.2,"ca_1000":0.052,"p_1000":0.666,"na_1000":0.0028},{"name":"薏仁","moisture":11.5,"kcal":378.0,"protein":14.1,"fat":6.1,"cho":66.2,"fiber":9.0,"dm":88.5,"dm_protein":15.93,"dm_fat":6.89,"dm_cho":74.8,"prot_1000":37.3,"fat_1000":16.1,"cho_1000":175.1,"ca_1000":0.05,"p_1000":0.796,"na_1000":0.0053},{"name":"白米","moisture":14.1,"kcal":354.0,"protein":7.0,"fat":0.7,"cho":77.8,"fiber":0.5,"dm":85.9,"dm_protein":8.15,"dm_fat":0.81,"dm_cho":90.57,"prot_1000":19.8,"fat_1000":2.0,"cho_1000":219.8,"ca_1000":0.014,"p_1000":0.229,"na_1000":0.0056},{"name":"蕃薯","moisture":70.0,"kcal":119.0,"protein":1.3,"fat":0.1,"cho":27.5,"fiber":1.5,"dm":30.0,"dm_protein":4.33,"dm_fat":0.33,"dm_cho":91.67,"prot_1000":10.9,"fat_1000":0.8,"cho_1000":231.1,"ca_1000":0.143,"p_1000":0.336,"na_1000":0.6134},{"name":"糙米","moisture":14.8,"kcal":355.0,"protein":7.8,"fat":2.3,"cho":74.0,"fiber":1.7,"dm":85.2,"dm_protein":9.15,"dm_fat":2.7,"dm_cho":86.85,"prot_1000":22.0,"fat_1000":6.5,"cho_1000":208.5,"ca_1000":0.082,"p_1000":0.715,"na_1000":0.0085},{"name":"豆芽","moisture":93.1,"kcal":24.0,"protein":2.3,"fat":0.2,"cho":4.1,"fiber":1.9,"dm":6.9,"dm_protein":33.33,"dm_fat":2.9,"dm_cho":59.42,"prot_1000":95.8,"fat_1000":8.3,"cho_1000":170.8,"ca_1000":2.333,"p_1000":0.958,"na_1000":0.6667},{"name":"苦瓜","moisture":94.4,"kcal":19.0,"protein":0.9,"fat":0.1,"cho":4.1,"fiber":2.3,"dm":5.6,"dm_protein":16.07,"dm_fat":1.79,"dm_cho":73.21,"prot_1000":47.4,"fat_1000":5.3,"cho_1000":215.8,"ca_1000":1.053,"p_1000":1.632,"na_1000":0.1579},{"name":"南瓜","moisture":79.8,"kcal":74.0,"protein":1.9,"fat":0.2,"cho":17.3,"fiber":0.75,"dm":20.2,"dm_protein":9.41,"dm_fat":0.99,"dm_cho":85.64,"prot_1000":25.7,"fat_1000":2.7,"cho_1000":233.8,"ca_1000":0.189,"p_1000":0.622,"na_1000":0.0135},{"name":"菠菜","moisture":93.7,"kcal":18.0,"protein":2.2,"fat":0.3,"cho":2.4,"fiber":2.2,"dm":6.3,"dm_protein":34.92,"dm_fat":4.76,"dm_cho":38.1,"prot_1000":122.2,"fat_1000":16.7,"cho_1000":133.3,"ca_1000":4.5,"p_1000":2.444,"na_1000":2.3889},{"name":"紅蘿蔔","moisture":89.3,"kcal":39.0,"protein":1.1,"fat":0.1,"cho":8.9,"fiber":2.8,"dm":10.7,"dm_protein":10.28,"dm_fat":0.93,"dm_cho":83.18,"prot_1000":28.2,"fat_1000":2.6,"cho_1000":228.2,"ca_1000":0.692,"p_1000":0.744,"na_1000":2.2821},{"name":"花椰菜","moisture":93.0,"kcal":23.0,"protein":1.8,"fat":0.1,"cho":4.5,"fiber":2.0,"dm":7.0,"dm_protein":25.71,"dm_fat":1.43,"dm_cho":64.29,"prot_1000":78.3,"fat_1000":4.3,"cho_1000":195.7,"ca_1000":0.913,"p_1000":1.739,"na_1000":0.6087},{"name":"冬瓜","moisture":96.9,"kcal":11.0,"protein":0.4,"fat":0.1,"cho":2.4,"fiber":0.95,"dm":3.1,"dm_protein":12.9,"dm_fat":3.23,"dm_cho":77.42,"prot_1000":36.4,"fat_1000":9.1,"cho_1000":218.2,"ca_1000":1.0,"p_1000":1.455,"na_1000":0.1818},{"name":"彩椒（黃）","moisture":92.2,"kcal":28.0,"protein":0.8,"fat":0.3,"cho":6.0,"fiber":1.7,"dm":7.8,"dm_protein":10.26,"dm_fat":3.85,"dm_cho":76.92,"prot_1000":28.6,"fat_1000":10.7,"cho_1000":214.3,"ca_1000":0.25,"p_1000":0.714,"na_1000":0.0357},{"name":"白蘿蔔","moisture":95.2,"kcal":18.0,"protein":0.5,"fat":0.1,"cho":3.9,"fiber":1.6,"dm":4.8,"dm_protein":10.42,"dm_fat":2.08,"dm_cho":81.25,"prot_1000":27.8,"fat_1000":5.6,"cho_1000":216.7,"ca_1000":1.333,"p_1000":0.944,"na_1000":2.5556},{"name":"高麗菜","moisture":92.0,"kcal":24.0,"protein":1.4,"fat":0.2,"cho":2.9,"fiber":1.9,"dm":8.0,"dm_protein":17.5,"dm_fat":2.5,"dm_cho":36.25,"prot_1000":58.3,"fat_1000":8.3,"cho_1000":120.8,"ca_1000":2.042,"p_1000":1.333,"na_1000":0.75},{"name":"秋葵","moisture":90.0,"kcal":30.5,"protein":2.1,"fat":0.2,"cho":7.5,"fiber":3.95,"dm":10.0,"dm_protein":21.0,"dm_fat":2.0,"dm_cho":75.0,"prot_1000":68.9,"fat_1000":6.6,"cho_1000":245.9,"ca_1000":3.41,"p_1000":1.902,"na_1000":0.2623},{"name":"番茄","moisture":94.0,"kcal":21.5,"protein":0.9,"fat":0.2,"cho":4.2,"fiber":1.2,"dm":6.0,"dm_protein":15.0,"dm_fat":3.33,"dm_cho":70.0,"prot_1000":41.9,"fat_1000":9.3,"cho_1000":195.3,"ca_1000":0.465,"p_1000":1.116,"na_1000":0.2326},{"name":"青豆仁","moisture":79.0,"kcal":81.0,"protein":5.4,"fat":0.4,"cho":14.5,"fiber":5.1,"dm":21.0,"dm_protein":25.71,"dm_fat":1.9,"dm_cho":69.05,"prot_1000":66.7,"fat_1000":4.9,"cho_1000":179.0,"ca_1000":0.309,"p_1000":1.333,"na_1000":0.0617},{"name":"山藥","moisture":82.0,"kcal":80.0,"protein":2.4,"fat":0.1,"cho":18.0,"fiber":1.15,"dm":18.0,"dm_protein":13.33,"dm_fat":0.56,"dm_cho":100.0,"prot_1000":30.0,"fat_1000":1.2,"cho_1000":225.0,"ca_1000":0.137,"p_1000":0.4,"na_1000":0.0938},{"name":"蓮藕","moisture":82.0,"kcal":69.5,"protein":1.9,"fat":0.25,"cho":15.25,"fiber":3.0,"dm":18.0,"dm_protein":10.56,"dm_fat":1.39,"dm_cho":84.72,"prot_1000":27.3,"fat_1000":3.6,"cho_1000":219.4,"ca_1000":0.388,"p_1000":0.633,"na_1000":0.2806},{"name":"黑木耳","moisture":90.0,"kcal":29.5,"protein":1.7,"fat":0.1,"cho":7.5,"fiber":7.4,"dm":10.0,"dm_protein":17.0,"dm_fat":1.0,"dm_cho":75.0,"prot_1000":57.6,"fat_1000":3.4,"cho_1000":254.2,"ca_1000":1.186,"p_1000":0.407,"na_1000":0.2712},{"name":"枸杞","moisture":4.8,"kcal":347.0,"protein":12.3,"fat":1.3,"cho":77.8,"fiber":11.2,"dm":95.2,"dm_protein":12.92,"dm_fat":1.37,"dm_cho":81.72,"prot_1000":35.4,"fat_1000":3.7,"cho_1000":224.2,"ca_1000":0.144,"p_1000":0.548,"na_1000":1.5014},{"name":"南瓜籽","moisture":5.0,"kcal":559.0,"protein":30.0,"fat":49.0,"cho":11.0,"fiber":6.0,"dm":95.0,"dm_protein":31.58,"dm_fat":51.58,"dm_cho":11.58,"prot_1000":53.7,"fat_1000":87.7,"cho_1000":19.7,"ca_1000":0.098,"p_1000":1.646,"na_1000":0.0322},{"name":"芝麻","moisture":5.0,"kcal":573.0,"protein":18.0,"fat":50.0,"cho":23.0,"fiber":12.0,"dm":95.0,"dm_protein":18.95,"dm_fat":52.63,"dm_cho":24.21,"prot_1000":31.4,"fat_1000":87.3,"cho_1000":40.1,"ca_1000":1.702,"p_1000":1.098,"na_1000":0.0192},{"name":"乾操海帶","moisture":82.5,"kcal":43.0,"protein":1.7,"fat":0.6,"cho":9.6,"fiber":1.3,"dm":17.5,"dm_protein":9.71,"dm_fat":3.43,"dm_cho":54.86,"prot_1000":39.5,"fat_1000":14.0,"cho_1000":223.3,"ca_1000":3.907,"p_1000":0.977,"na_1000":5.4186},{"name":"蘋果","moisture":86.2,"kcal":50.0,"protein":0.3,"fat":0.2,"cho":13.1,"fiber":2.4,"dm":13.8,"dm_protein":2.17,"dm_fat":1.45,"dm_cho":94.93,"prot_1000":6.0,"fat_1000":4.0,"cho_1000":262.0,"ca_1000":0.06,"p_1000":0.2,"na_1000":0.04},{"name":"藍莓","moisture":85.3,"kcal":53.0,"protein":0.5,"fat":0.3,"cho":0.2,"fiber":1.4,"dm":14.7,"dm_protein":3.4,"dm_fat":2.04,"dm_cho":1.36,"prot_1000":9.4,"fat_1000":5.7,"cho_1000":3.8,"ca_1000":0.208,"p_1000":0.245,"na_1000":0.0},{"name":"香蕉","moisture":75.5,"kcal":91.0,"protein":1.25,"fat":0.25,"cho":23.0,"fiber":2.2,"dm":24.5,"dm_protein":5.1,"dm_fat":1.02,"dm_cho":93.88,"prot_1000":13.7,"fat_1000":2.7,"cho_1000":252.7,"ca_1000":0.06,"p_1000":0.275,"na_1000":0.033},{"name":"芭樂","moisture":88.5,"kcal":38.0,"protein":0.85,"fat":0.35,"cho":10.0,"fiber":4.5,"dm":11.5,"dm_protein":7.39,"dm_fat":3.04,"dm_cho":86.96,"prot_1000":22.4,"fat_1000":9.2,"cho_1000":263.2,"ca_1000":0.289,"p_1000":0.711,"na_1000":0.0789},{"name":"雞油","moisture":0.3,"kcal":891.0,"protein":0.0,"fat":99.8,"cho":0.0,"fiber":0.0,"dm":99.7,"dm_protein":0.0,"dm_fat":100.1,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":112.0,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0},{"name":"魚油","moisture":0.0,"kcal":902.0,"protein":0.0,"fat":100.0,"cho":0.0,"fiber":0.0,"dm":100.0,"dm_protein":0.0,"dm_fat":100.0,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":110.9,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0},{"name":"豬油","moisture":0.0,"kcal":902.0,"protein":0.0,"fat":100.0,"cho":0.0,"fiber":0.0,"dm":100.0,"dm_protein":0.0,"dm_fat":100.0,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":110.9,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0},{"name":"亞麻仁油","moisture":0.0,"kcal":884.0,"protein":0.0,"fat":100.0,"cho":0.0,"fiber":0.0,"dm":100.0,"dm_protein":0.0,"dm_fat":100.0,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":113.1,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0},{"name":"菜籽油","moisture":0.0,"kcal":884.0,"protein":0.0,"fat":100.0,"cho":0.0,"fiber":0.0,"dm":100.0,"dm_protein":0.0,"dm_fat":100.0,"dm_cho":0.0,"prot_1000":0.0,"fat_1000":113.1,"cho_1000":0.0,"ca_1000":0.0,"p_1000":0.0,"na_1000":0.0}];

// ── STATIC DATA ───────────────────────────────────────────────────
const RECIPE_NAME  = { chicken:"雞肉鮮蔬", beef:"牛肉滋補", lamb:"羊肉低敏", fish:"鮮魚護心", duck:"鴨肉關節", pork:"豬肉能量" };
const HEALTH_LABEL = { ckd:"腎臟病 CKD", cardiac:"心臟病", pancreatitis:"胰臟炎", diabetes:"糖尿病", obesity:"肥胖", arthritis:"關節炎", liver:"肝臟疾病", ibd:"腸胃問題", skin:"皮膚過敏", cancer:"腫瘤" };
const ALLERGY_LABEL= { chicken:"雞肉", beef:"牛肉", pork:"豬肉", fish:"魚類", egg:"蛋類", dairy:"乳製品", wheat:"小麥", corn:"玉米", soy:"大豆" };
const ALLERGEN_MAP = { chicken:["chicken"], beef:["beef"], pork:["pork"], fish:["fish"], duck:[], lamb:[] };

// ── BASE RECIPES (150g per pack, AAFCO adult dog verified) ────────
const BASE_RECIPES = {
  chicken:[{name:"雞（熟）",g:80},{name:"雞肝",g:10},{name:"地瓜葉",g:18},{name:"花椰菜",g:15},{name:"南瓜",g:15},{name:"紅蘿蔔",g:8},{name:"魚油",g:3},{name:"蛋殼粉",g:0.3},{name:"水",g:0.7}],
  beef:   [{name:"牛（熟）",g:80},{name:"雞肝",g:10},{name:"菠菜",g:18},{name:"花椰菜",g:12},{name:"蕃薯",g:12},{name:"紅蘿蔔",g:8},{name:"魚油",g:3},{name:"蛋殼粉",g:0.6},{name:"水",g:6.4}],
  lamb:   [{name:"羊（熟）",g:80},{name:"雞肝",g:8},{name:"地瓜葉",g:18},{name:"南瓜",g:15},{name:"高麗菜",g:15},{name:"蕃薯",g:8},{name:"亞麻仁油",g:3},{name:"蛋殼粉",g:0.3},{name:"水",g:2.7}],
  fish:   [{name:"鮭魚",g:60},{name:"鮪魚",g:20},{name:"雞肝",g:8},{name:"菠菜",g:18},{name:"花椰菜",g:15},{name:"南瓜",g:12},{name:"魚油",g:2},{name:"蛋殼粉",g:0.7},{name:"水",g:14.3}],
  duck:   [{name:"鴨（熟）",g:78},{name:"雞肝",g:10},{name:"地瓜葉",g:18},{name:"高麗菜",g:15},{name:"南瓜",g:12},{name:"紅蘿蔔",g:8},{name:"魚油",g:3},{name:"蛋殼粉",g:0.2},{name:"水",g:5.8}],
  pork:   [{name:"豬（生）",g:78},{name:"豬肝",g:10},{name:"地瓜葉",g:18},{name:"花椰菜",g:15},{name:"蕃薯",g:12},{name:"南瓜",g:8},{name:"魚油",g:3},{name:"蛋殼粉",g:0.2},{name:"水",g:5.8}],
};
const COST_PER_KG = {"雞（熟）":350,"牛（熟）":900,"羊（熟）":1100,"鴨（熟）":550,"豬（生）":400,"鮭魚":800,"鮪魚":500,"雞肝":200,"豬肝":250,"地瓜葉":50,"花椰菜":80,"南瓜":60,"紅蘿蔔":50,"菠菜":80,"高麗菜":40,"蕃薯":50,"魚油":800,"亞麻仁油":600,"蛋殼粉":30,"水":0};
const FIXED_COST = 53; // packaging + labour + freezing + overhead + delivery per pack

// Per-100g nutrition lookup from DOG_INGREDIENTS
const MG_PER_100G = {"雞（熟）":0.029,"牛（熟）":0.012,"豬（生）":0.022,"羊（熟）":0.025,"鴨（熟）":0.022,"鮭魚":0.03,"鮪魚":0.03,"綠貽貝":0.042,"鵪鶉蛋":0.013,"雞蛋":0.012,"雞心":0.015,"雞肝":0.019,"豬肝":0.018,"小麥":0.137,"薏仁":0.159,"白米":0.02,"蕃薯":0.021,"糙米":0.105,"豆芽":0.014,"芋頭":0.032,"羽衣甘藍":0.033,"地瓜葉":0.07,"青花苗":0.0,"空心菜":0.071,"苦瓜":0.014,"南瓜":0.017,"菠菜":0.062,"紅蘿蔔":0.011,"花椰菜":0.012,"冬瓜":0.005,"彩椒（黃）":0.01,"白蘿蔔":0.002,"高麗菜":0.011,"秋葵":0.054,"番茄":0.011,"青豆仁":0.033,"山藥":0.013,"蓮藕":0.016,"黑木耳":0.015,"枸杞":0.1,"南瓜籽":0.592,"芝麻":0.315,"乾操海帶":0.121,"蘋果":0.003,"藍莓":0.005,"香蕉":0.029,"芭樂":0.014,"雞油":0.0,"魚油":0.0,"豬油":0.0,"亞麻仁油":0.0,"菜籽油":0.0};
const NUTR_LOOKUP = {};
DOG_INGREDIENTS.forEach(i => {
  NUTR_LOOKUP[i.name] = {
    kcal:    i.kcal/100,
    protein: i.protein/100,
    fat:     i.fat/100,
    cho:     i.cho/100,
    ca:      i.ca_1000 ? i.kcal/100/1000*i.ca_1000 : 0,
    p:       i.p_1000  ? i.kcal/100/1000*i.p_1000  : 0,
    na:      i.na_1000 ? i.kcal/100/1000*i.na_1000 : 0,
    mg:      (MG_PER_100G[i.name]||0) / 100,
    moisture:i.moisture/100,
  };
});
// Add eggshell powder manually (not in DOG_INGREDIENTS: Ca=36.2g/100g, no kcal)
NUTR_LOOKUP["蛋殼粉"] = { kcal:0, protein:0.03755, fat:0.00185, cho:0, ca:0.362, p:0.00106, na:0, mg:0.0006, moisture:0 };
NUTR_LOOKUP["水"]     = { kcal:0, protein:0, fat:0, cho:0, ca:0, p:0, na:0, mg:0, moisture:1 };

function calcRecipeNutrition(items) {
  // items: [{name, g}, ...]
  const t = { kcal:0, protein:0, fat:0, cho:0, ca:0, p:0, na:0, mg:0, weight:0, moisture_g:0 };
  items.forEach(({name, g}) => {
    const n = NUTR_LOOKUP[name];
    if (!n) return;
    t.kcal      += n.kcal     * g;
    t.protein   += n.protein  * g;
    t.fat       += n.fat      * g;
    t.cho       += n.cho      * g;
    t.ca        += n.ca       * g;
    t.p         += n.p        * g;
    t.na        += (n.na||0)  * g;
    t.mg        += (n.mg||0)  * g;
    t.moisture_g+= n.moisture * g;
    t.weight    += g;
  });
  t.h2o_pct    = t.weight > 0 ? t.moisture_g / t.weight * 100 : 0;
  t.ca_p       = t.p > 0 ? t.ca / t.p : 0;
  t.prot_1000  = t.kcal > 0 ? t.protein / t.kcal * 1000 : 0;
  t.fat_1000   = t.kcal > 0 ? t.fat     / t.kcal * 1000 : 0;
  t.ca_1000    = t.kcal > 0 ? t.ca      / t.kcal * 1000 : 0;
  t.p_1000     = t.kcal > 0 ? t.p       / t.kcal * 1000 : 0;
  t.na_100kcal = t.kcal > 0 ? t.na      / t.kcal * 100  : 0;
  t.mg_1000    = t.kcal > 0 ? t.mg      / t.kcal * 1000 : 0;
  return t;
}

function calcCostPerPack(items) {
  return items.reduce((s, {name, g}) => s + (COST_PER_KG[name]||0) * g / 1000, 0);
}

// Status config: removed vet_review as separate step — new -> approved -> in_production -> shipped
const STATUS = {
  new:           { label:"新訂單",  color:DC.blue,   bg:DC.blueL,   dot:"#2B6CB0", next:"in_production" },
  in_production: { label:"生產中",  color:DC.earth,  bg:DC.earthL,  dot:"#9A6B3C", next:"shipped" },
  shipped:       { label:"已出貨",  color:DC.teal,   bg:DC.tealL,   dot:"#2C7A7B", next:null },
};

// ── MOCK DATA ─────────────────────────────────────────────────────
const MOCK = [
  {
    id:"CF-0041", created_at:"2026-03-26 14:32", status:"new",
    ship_date:"2026-04-05",
    pet_profile:{ petName:"Mochi", ownerName:"王小明", ownerPhone:"0912-345-678", ownerEmail:"wang@gmail.com", species:"cat", breed:"布偶貓", sex:"male_neutered", age:3, weight:4.2, idealWeight:4.0, size:"toy", sizeMult:1.1, bcs:"6", activity:"sedentary", actMult:1.2, health:["ckd"], healthNote:"IRIS stage 2，目前服用降磷藥 Epakitin", allergies:["beef"], allergyNote:"", goals:["maintain","gut"], dietNote:"目前餵 Royal Canin 腎臟處方乾糧", treatFreq:"occasional", delivery:"biweekly", address:"台北市大安區忠孝東路四段 100 號 3F" },
    nutrition_data:null, assigned_recipe:"fish", vet_approved:false, vet_notes:"", plan_price:6500,
    owner_notes:"飼主表示 Mochi 食慾不穩定，建議先少量試吃",
    past_orders:[],
  },
  {
    id:"CF-0040", created_at:"2026-03-26 11:15", status:"new",
    ship_date:"2026-04-05",
    pet_profile:{ petName:"奶油", ownerName:"林小華", ownerPhone:"0923-456-789", ownerEmail:"lin@gmail.com", species:"dog", breed:"柴犬", sex:"female_spayed", age:7.5, weight:9.8, idealWeight:9.0, size:"medium", sizeMult:1.0, bcs:"7", activity:"low", actMult:1.4, health:["arthritis","obesity"], healthNote:"後腿關節退化，X光確認 grade 2", allergies:["chicken"], allergyNote:"", goals:["lose","joint"], dietNote:"目前混餵乾糧加自製鮮食", treatFreq:"daily_moderate", delivery:"weekly", address:"台北市信義區松仁路 200 號 12F" },
    nutrition_data:null, assigned_recipe:"duck", vet_approved:false, vet_notes:"請確認 EPA/DHA 劑量", plan_price:5800,
    owner_notes:"",
    past_orders:[
      { id:"CF-0031", date:"2026-02-10", recipe:"duck", status:"shipped", notes:"第一次訂購，飼主反饋適口性良好" },
    ],
  },
  {
    id:"CF-0039", created_at:"2026-03-25 16:50", status:"in_production",
    ship_date:"2026-04-04",
    pet_profile:{ petName:"小橘", ownerName:"陳大衛", ownerPhone:"0934-567-890", ownerEmail:"chen@gmail.com", species:"cat", breed:"米克斯", sex:"male_intact", age:1.5, weight:3.8, idealWeight:3.8, size:"toy", sizeMult:1.1, bcs:"5", activity:"moderate", actMult:1.6, health:["skin"], healthNote:"疑似食物過敏", allergies:["chicken","beef","pork"], allergyNote:"", goals:["skin"], dietNote:"之前試過多個品牌都有過敏", treatFreq:"none", delivery:"biweekly", address:"台北市中山區南京東路二段 55 號 5F" },
    nutrition_data:{ rer:192, mer:338, adjustments:[{label:"蛋白質來源",value:"新型蛋白質（羊/鴨）",flag:"info"},{label:"Omega-3",value:"加強補充 EPA/DHA",flag:"info"}] },
    assigned_recipe:"lamb", vet_approved:true, vet_notes:"確認羊肉低敏配方，補充 Omega-3", plan_price:5800,
    owner_notes:"過敏症狀在前次訂購後改善明顯，本次繼續同配方",
    past_orders:[
      { id:"CF-0028", date:"2026-02-01", recipe:"lamb", status:"shipped", notes:"皮膚過敏改善中，繼續觀察" },
      { id:"CF-0015", date:"2026-01-05", recipe:"lamb", status:"shipped", notes:"第一次嘗試羊肉配方，初期適口性普通" },
    ],
  },
  {
    id:"CF-0038", created_at:"2026-03-25 09:20", status:"in_production",
    ship_date:"2026-04-04",
    pet_profile:{ petName:"花花", ownerName:"吳美麗", ownerPhone:"0945-678-901", ownerEmail:"wu@gmail.com", species:"dog", breed:"貴賓犬", sex:"female_spayed", age:10, weight:5.5, idealWeight:5.5, size:"toy", sizeMult:1.1, bcs:"5", activity:"low", actMult:1.4, health:["cardiac"], healthNote:"確診擴張性心肌病（DCM）", allergies:["none"], allergyNote:"", goals:["senior"], dietNote:"目前只吃罐頭，食慾不太好", treatFreq:"occasional", delivery:"weekly", address:"台北市松山區民生東路三段 88 號" },
    nutrition_data:{ rer:204, mer:314, adjustments:[{label:"鈉含量",value:"50–80mg/100kcal",flag:"warning"},{label:"牛磺酸",value:"800mg/天",flag:"warning"},{label:"左旋肉鹼",value:"50mg/kg/天",flag:"info"}] },
    assigned_recipe:"fish", vet_approved:true, vet_notes:"鈉嚴格控制，牛磺酸 800mg/天", plan_price:5500,
    owner_notes:"花花食慾較差，建議每日分 3 次餵食",
    past_orders:[
      { id:"CF-0033", date:"2026-02-25", recipe:"fish", status:"shipped", notes:"心臟配方第二批，血檢指標穩定" },
      { id:"CF-0020", date:"2026-01-20", recipe:"fish", status:"shipped", notes:"心臟病確診後首次訂製，飼主配合度高" },
    ],
  },
  {
    id:"CF-0037", created_at:"2026-03-24 14:00", status:"shipped",
    ship_date:"2026-04-03",
    pet_profile:{ petName:"豆豆", ownerName:"張建國", ownerPhone:"0956-789-012", ownerEmail:"zhang@gmail.com", species:"dog", breed:"黃金獵犬", sex:"male_neutered", age:4, weight:28, idealWeight:28, size:"large", sizeMult:0.9, bcs:"5", activity:"active", actMult:2.0, health:["none"], healthNote:"", allergies:["none"], allergyNote:"", goals:["maintain"], dietNote:"目前餵乾糧", treatFreq:"daily_moderate", delivery:"biweekly", address:"台北市北投區中央南路二段 10 號" },
    nutrition_data:{ rer:501, mer:902, adjustments:[] },
    assigned_recipe:"beef", vet_approved:true, vet_notes:"標準成年活力犬配方", plan_price:5500,
    owner_notes:"",
    past_orders:[
      { id:"CF-0029", date:"2026-02-15", recipe:"beef", status:"shipped", notes:"標準配方，飼主滿意度高" },
      { id:"CF-0018", date:"2026-01-10", recipe:"chicken", status:"shipped", notes:"首次訂購，後改為牛肉配方" },
    ],
  },
];

// ── NUTRITION CALCULATOR ──────────────────────────────────────────
function calcNutrition(p) {
  const w   = parseFloat(p.idealWeight || p.weight || 5);
  const rer = Math.round(70 * Math.pow(w, 0.75));
  const isNeutered = p.sex === "male_neutered" || p.sex === "female_spayed";
  // Multipliers from Excel Requirement Calculator sheet
  let stageMult = isNeutered ? 1.6 : 1.8;
  if (p.age < 4/12) stageMult = 3.0;
  else if (p.age < 1) stageMult = 2.0;
  else if (p.age >= 7) stageMult = 1.3;
  const mer = Math.round(rer * stageMult * (p.actMult || 1.6) * (p.sizeMult || 1.0));

  // Estimated daily nutrient targets (Atwater coefficients + AAFCO guidelines)
  const protein = Math.round(mer * 0.25 / 4);
  const fat     = Math.round(mer * 0.30 / 9);
  const cho     = Math.round(mer * 0.35 / 4);
  const water   = Math.round(w * 50);

  // Health condition adjustments from Excel Requirement Calculator
  const adj = [];
  const h = p.health || [];
  if (h.includes("ckd")) {
    adj.push({ label:"磷含量",   value:"< 1.5 g / 1,000 kcal",         flag:"warning" });
    adj.push({ label:"蛋白質",   value:"25–55 g / 1,000 kcal（降低 25–50%）", flag:"warning" });
    adj.push({ label:"含水量",   value:"≥ 70%",                         flag:"info" });
  }
  if (h.includes("cardiac")) {
    adj.push({ label:"鈉含量",   value:"50–80 mg / 100 kcal",           flag:"warning" });
    adj.push({ label:"牛磺酸",   value:"500–1,000 mg / 天",             flag:"warning" });
    adj.push({ label:"左旋肉鹼", value:"50 mg / kg / 天",               flag:"info" });
    adj.push({ label:"Omega-3",  value:"115 mg EPA+DHA / kg / 天",      flag:"info" });
  }
  if (h.includes("pancreatitis")) {
    adj.push({ label:"脂肪（高血脂）",  value:"< 20 g / 1,000 kcal",   flag:"warning" });
    adj.push({ label:"脂肪（無高血脂）",value:"< 35 g / 1,000 kcal",   flag:"warning" });
    adj.push({ label:"蛋白質",          value:"< 75 g / 1,000 kcal",   flag:"info" });
    adj.push({ label:"餵食方式",        value:"每日 4–6 小份",          flag:"info" });
  }
  if (h.includes("arthritis")) {
    adj.push({ label:"Omega-3 EPA+DHA", value:"1–3 mg / kcal",         flag:"info" });
    adj.push({ label:"葡萄糖胺",        value:"500–1,000 mg / 天",      flag:"info" });
    adj.push({ label:"軟骨素",          value:"400–800 mg / 天",        flag:"info" });
  }
  if (h.includes("obesity")) {
    adj.push({ label:"熱量目標", value:`${Math.round(rer*1.0)} kcal（1.0× RER 理想體重）`, flag:"warning" });
    adj.push({ label:"减重速度", value:"1% 體重 / 週",                  flag:"info" });
  }
  if (h.includes("diabetes")) {
    adj.push({ label:"碳水化合物", value:"< 15% DM",                    flag:"warning" });
    adj.push({ label:"蛋白質",     value:"> 45% DM",                    flag:"info" });
  }
  if (h.includes("liver")) {
    adj.push({ label:"銅",   value:"< 1.2 mg / 1,000 kcal",            flag:"warning" });
    adj.push({ label:"鋅",   value:"> 50 mg / 1,000 kcal",             flag:"info" });
    adj.push({ label:"蛋白質（無肝性腦病）", value:"≥ 45 g / 1,000 kcal", flag:"info" });
  }
  if (h.includes("skin")) {
    adj.push({ label:"蛋白質來源", value:"新型蛋白質（羊/鴨）",         flag:"info" });
    adj.push({ label:"Omega-3",    value:"加強補充 EPA/DHA",            flag:"info" });
  }
  return { rer, mer, protein, fat, cho, water, stageMult, adj };
}

// ── SPECIES BADGE ────────────────────────────────────────────────
const SpeciesBadge = ({ species, size }) => {
  const isDog = species === "dog";
  const big = size === "lg";
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding: big ? "5px 14px" : "2px 10px",
      borderRadius:50, fontSize: big ? 13 : 11, fontWeight:700,
      background: isDog ? DC.dogBg : DC.catBg,
      color:       isDog ? DC.dogText : DC.catText,
      border: isDog ? "1.5px solid " + DC.dogBorder : "1.5px solid " + DC.catBorder,
    }}>
      <span style={{ width: big?10:8, height: big?10:8, borderRadius:"50%", background: isDog ? DC.dogBorder : DC.catBorder, flexShrink:0 }}/>
      {isDog ? "DOG" : "CAT"}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.new;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 12px", borderRadius:50, fontSize:11, fontWeight:600, background:s.bg, color:s.color, border:`1px solid ${s.color}40` }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot }}/>
      {s.label}
    </span>
  );
};
const Tag = ({ label, color, bg }) => (
  <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:50, fontSize:11, fontWeight:500, background:bg, color, border:`1px solid ${color}30`, margin:"2px 3px" }}>{label}</span>
);
const NRow = ({ label, value, flag, last }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom: last ? "none" : `1px solid ${DC.border}` }}>
    <span style={{ fontSize:12, color:DC.mid }}>{label}</span>
    <span style={{ fontSize:12, fontWeight:600, color: flag==="warning"?DC.earth : flag==="info"?DC.blue : DC.sage }}>{value}</span>
  </div>
);

// ── DRY MATTER CALCULATOR ─────────────────────────────────────────
function DryMatterCalc({ species, recipeId, grams, setGrams }) {
  const ingredients = species === "dog" ? DOG_INGREDIENTS : CAT_INGREDIENTS;
  // Use shared grams state; fall back to internal state if not provided (standalone use)
  const baseItems = recipeId ? (BASE_RECIPES[recipeId] || BASE_RECIPES.chicken) : [];
  const [localSelected, setLocalSelected] = useState(baseItems.map(i=>({...ingredients.find(x=>x.name===i.name)||{name:i.name,kcal:0,protein:0,fat:0,cho:0,moisture:0,ca_1000:0,p_1000:0,na_1000:0}})));
  const [searchQ, setSearchQ] = useState("");

  // Selected ingredients = recipe ingredients
  const selected = baseItems.map(({name}) => {
    const ing = ingredients.find(x=>x.name===name) || DOG_INGREDIENTS.find(x=>x.name===name) || {name,kcal:0,protein:0,fat:0,cho:0,moisture:0,ca_1000:0,p_1000:0,na_1000:0};
    return ing;
  }).filter(i=>i.kcal>0||i.name==="蛋殼粉"||i.name==="水");

  const addIngredient = (ing) => {
    if (!baseItems.find(b=>b.name===ing.name)) {
      // Add new ingredient to grams
      setGrams(prev=>({...prev,[ing.name]:100}));
      // Also add to baseItems workaround — just update grams
    }
  };

  const filteredList = ingredients.filter(i=>
    (!searchQ || i.name.includes(searchQ)) && !baseItems.find(b=>b.name===i.name)
  );

  // Calculate totals from shared grams state
  const allItems = [
    ...baseItems.map(({name})=>({name,g:parseFloat(grams[name])||0})),
  ];
  const totals = allItems.reduce((acc,{name,g})=>{
    const n = NUTR_LOOKUP[name];
    if (!n) return acc;
    return {
      weight:   acc.weight   + g,
      kcal:     acc.kcal     + n.kcal*g,
      protein:  acc.protein  + n.protein*g,
      fat:      acc.fat      + n.fat*g,
      cho:      acc.cho      + n.cho*g,
      ca:       acc.ca       + n.ca*g,
      p:        acc.p        + n.p*g,
      na:       acc.na       + (n.na||0)*g,
      mg:       acc.mg       + (n.mg||0)*g,
      moist:    acc.moist    + n.moisture*g,
    };
  }, {weight:0,kcal:0,protein:0,fat:0,cho:0,ca:0,p:0,na:0,mg:0,moist:0});

  const dm_pct = totals.weight > 0 ? (totals.weight - totals.moist) / totals.weight * 100 : 0;
  const dm = dm_pct / 100;
  const dm_protein = dm > 0 && totals.weight > 0 ? (totals.protein/totals.weight*100)/dm_pct*100 : 0;
  const dm_fat     = dm > 0 && totals.weight > 0 ? (totals.fat/totals.weight*100)/dm_pct*100 : 0;
  const dm_cho     = dm > 0 && totals.weight > 0 ? (totals.cho/totals.weight*100)/dm_pct*100 : 0;
  const prot_1000  = totals.kcal > 0 ? totals.protein/totals.kcal*1000 : 0;
  const fat_1000   = totals.kcal > 0 ? totals.fat/totals.kcal*1000    : 0;
  const cho_1000   = totals.kcal > 0 ? totals.cho/totals.kcal*1000    : 0;
  const ca_1000    = totals.kcal > 0 ? totals.ca/totals.kcal*1000     : 0;
  const p_1000     = totals.kcal > 0 ? totals.p/totals.kcal*1000      : 0;
  const na_1000    = totals.kcal > 0 ? totals.na/totals.kcal*1000     : 0;
  const mg_1000    = totals.kcal > 0 ? totals.mg/totals.kcal*1000     : 0;
  const ca_p       = totals.p > 0 ? totals.ca/totals.p : 0;

  const inp = { padding:"5px 8px", border:`1px solid ${DC.border}`, borderRadius:6, fontSize:12, color:DC.dark, background:"white", outline:"none", textAlign:"right", fontFamily:"inherit" };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
      {/* LEFT: ingredient table */}
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:DC.dark, marginBottom:10 }}>配方食材（克數同步配方調整 Tab）</div>
        <div style={{ background:DC.surface2, borderRadius:10, overflow:"hidden", border:`1px solid ${DC.border}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 72px", padding:"7px 12px", background:DC.surface2, borderBottom:`1px solid ${DC.border}`, fontSize:11, fontWeight:600, color:DC.lighter, textTransform:"uppercase" }}>
            <span>食材</span><span style={{textAlign:"right"}}>克數</span>
          </div>
          {baseItems.map(({name})=>(
            <div key={name} style={{ display:"grid", gridTemplateColumns:"1fr 72px", padding:"8px 12px", borderBottom:`1px solid ${DC.border}`, alignItems:"center", background:"white" }}>
              <span style={{ fontSize:13, color:DC.dark }}>{name}</span>
              <div style={{ display:"flex", alignItems:"center", gap:4, justifyContent:"flex-end" }}>
                <input type="number" min="0" max="300" step="0.1"
                  value={grams[name]??0}
                  onChange={e=>setGrams(prev=>({...prev,[name]:e.target.value}))}
                  style={{...inp, width:52}}
                  onFocus={e=>{e.target.style.borderColor=DC.sage;}}
                  onBlur={e=>{e.target.style.borderColor=DC.border;}}
                />
                <span style={{fontSize:11,color:DC.lighter}}>g</span>
              </div>
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 72px", padding:"9px 12px", background:DC.sageL, borderTop:`1px solid ${DC.sage}30` }}>
            <span style={{ fontSize:12, fontWeight:600, color:DC.sage }}>總重量</span>
            <span style={{ fontSize:12, fontWeight:700, color:DC.sage, textAlign:"right", paddingRight:18 }}>{totals.weight.toFixed(1)}g</span>
          </div>
        </div>
      </div>

      {/* RIGHT: results */}
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:DC.dark, marginBottom:10 }}>計算結果</div>
        {totals.weight === 0 ? (
          <div style={{ background:DC.surface2, borderRadius:10, padding:"32px", textAlign:"center", color:DC.lighter }}>克數全為 0</div>
        ) : (
          <div>
            <div style={{ background:DC.surface2, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:700, color:DC.mid, letterSpacing:".8px", textTransform:"uppercase", marginBottom:8 }}>現食基礎（As-Fed）</div>
              <NRow label="總熱量"   value={`${totals.kcal.toFixed(0)} kcal`} />
              <NRow label="水分"     value={`${(totals.moist/totals.weight*100).toFixed(1)} %`} />
              <NRow label="蛋白質"   value={`${totals.protein.toFixed(1)} g`} />
              <NRow label="脂肪"     value={`${totals.fat.toFixed(1)} g`} />
              <NRow label="碳水化合物" value={`${totals.cho.toFixed(1)} g`} />
              <NRow label="鈣 (Ca)" value={`${(totals.ca*1000).toFixed(0)} mg`} />
              <NRow label="磷 (P)"  value={`${(totals.p*1000).toFixed(0)} mg`} />
              <NRow label="鈉 (Na)" value={`${(totals.na*1000).toFixed(0)} mg`} />
              <NRow label="鎂 (Mg)" value={`${(totals.mg*1000).toFixed(0)} mg`} last />
            </div>
            <div style={{ background:DC.sageL, border:`1px solid ${DC.sageMid}40`, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:700, color:DC.sageD, letterSpacing:".8px", textTransform:"uppercase", marginBottom:8 }}>乾物基礎（DM%: {dm_pct.toFixed(1)}%）</div>
              <NRow label="蛋白質 DM%" value={`${dm_protein.toFixed(1)} %`} flag="info" />
              <NRow label="脂肪 DM%"   value={`${dm_fat.toFixed(1)} %`}     flag="info" />
              <NRow label="碳水 DM%"   value={`${dm_cho.toFixed(1)} %`}     flag="info" last />
            </div>
            <div style={{ background:DC.goldL, border:`1px solid ${DC.gold}40`, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:DC.gold, letterSpacing:".8px", textTransform:"uppercase", marginBottom:8 }}>代謝能基礎（Per 1,000 kcal ME）</div>
              <NRow label="蛋白質"   value={`${prot_1000.toFixed(1)} g`} />
              <NRow label="脂肪"     value={`${fat_1000.toFixed(1)} g`} />
              <NRow label="碳水化合物" value={`${cho_1000.toFixed(1)} g`} />
              <NRow label="鈣 (Ca)" value={`${ca_1000.toFixed(3)} g`} />
              <NRow label="磷 (P)"  value={`${p_1000.toFixed(3)} g`} />
              <NRow label="鈉 (Na)" value={`${na_1000.toFixed(3)} g`} />
              <NRow label="鎂 (Mg)" value={`${mg_1000.toFixed(3)} g`} />
              <NRow label="Ca:P 比例" value={`${ca_p.toFixed(2)}:1`} flag={ca_p>=1.0&&ca_p<=1.3?"info":"warning"} last />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ── FORMULA ADJUSTMENT TAB ───────────────────────────────────────
function FormulaTab({ order, p, nut, recipe, grams, setGrams, onSave, onClose, saving, setSaving }) {
  const recipeId  = recipe || order.assigned_recipe || "chicken";
  const baseItems = BASE_RECIPES[recipeId] || BASE_RECIPES.chicken;
  const adjItems  = baseItems.map(({name}) => ({ name, g: parseFloat(grams[name])||0 }));
  const baseNutr  = calcRecipeNutrition(baseItems);
  const adjNutr   = calcRecipeNutrition(adjItems);
  const baseCost  = calcCostPerPack(baseItems) + FIXED_COST;
  const adjCost   = calcCostPerPack(adjItems)  + FIXED_COST;

  const packsPerDay   = adjNutr.kcal > 0 ? nut.mer / adjNutr.kcal : 0;
  const packsPerMonth = Math.ceil(packsPerDay * 31);
  const packsBase     = baseNutr.kcal > 0 ? nut.mer / baseNutr.kcal : 0;

  const setG = (name, val) => setGrams(prev => ({...prev, [name]: val}));

  const healthActive = (p.health||[]).filter(h=>h!=="none");
  const suggestions = [];
  if (healthActive.includes("ckd"))          { suggestions.push({color:DC.earth,text:"CKD：建議將主蛋白質降至 60–65g，增加水量至 20g 以上（目標含水量 ≥75%）"}); suggestions.push({color:DC.earth,text:"CKD：磷含量目標 <1.5g/1000kcal，可減少雞肝用量（雞肝磷含量較高）"}); }
  if (healthActive.includes("pancreatitis")) { suggestions.push({color:DC.red,  text:"胰臟炎：移除或大幅減少魚油（降至 1g 以下），整體脂肪目標 <20g/1000kcal"}); }
  if (healthActive.includes("cardiac"))      { suggestions.push({color:DC.earth,text:"心臟病：嚴格控制鈉含量，增加魚油至 4–5g 以提升 Omega-3"}); }
  if (healthActive.includes("obesity"))      { suggestions.push({color:DC.blue, text:"肥胖：以理想體重計算 MER，整體份量減少約 20–25%，配方比例不變"}); }
  if (healthActive.includes("arthritis"))    { suggestions.push({color:DC.blue, text:"關節炎：增加魚油至 5g，鴨肉配方已內建較高 Omega-3"}); }
  if (healthActive.includes("diabetes"))     { suggestions.push({color:DC.earth,text:"糖尿病：減少蕃薯等澱粉類，增加蔬菜比例，目標碳水 <15% DM"}); }
  if (healthActive.includes("liver"))        { suggestions.push({color:DC.red,  text:"肝臟疾病：避免使用豬肝，以雞肝替代；嚴格控制銅含量"}); }

  const flags = [];
  if (adjNutr.prot_1000 < 45)               flags.push({text:`蛋白質偏低 ${adjNutr.prot_1000.toFixed(0)}g/1000kcal（最低 45g）`,  color:DC.red});
  if (adjNutr.fat_1000  < 13.8)             flags.push({text:`脂肪偏低 ${adjNutr.fat_1000.toFixed(0)}g/1000kcal（最低 13.8g）`,    color:DC.red});
  if (adjNutr.ca_p < 1.0)                   flags.push({text:`Ca:P 偏低 ${adjNutr.ca_p.toFixed(2)}（建議 1.0–1.3）`,               color:DC.red});
  if (adjNutr.ca_p > 1.3)                   flags.push({text:`Ca:P 偏高 ${adjNutr.ca_p.toFixed(2)}（建議 1.0–1.3）`,               color:DC.earth});
  if (adjNutr.h2o_pct < 60)                 flags.push({text:`含水量偏低 ${adjNutr.h2o_pct.toFixed(0)}%（建議 ≥65%）`,              color:DC.earth});

  const inp = { padding:"5px 8px", border:`1px solid ${DC.border}`, borderRadius:6, fontSize:13, color:DC.dark, background:"white", outline:"none", textAlign:"right", fontFamily:"inherit" };

  // 4. Send to production button from this tab
  const handleSendToProduction = async () => {
    if (!recipe) { alert("請先在審核 ＆ 備註 Tab 指派食譜"); return; }
    setSaving(true);
    await onSave(order.id, {
      status:"in_production",
      assigned_recipe:recipe,
      vet_approved:true,
      nutrition_data:{ rer:nut.rer, mer:nut.mer, adjustments:nut.adj, adjusted_grams:grams },
    });
    setSaving(false);
    onClose();
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:DC.dark, marginBottom:3 }}>
            {RECIPE_NAME[recipeId]||"雞肉鮮蔬"} — 配方調整
          </div>
          <div style={{ fontSize:12, color:DC.mid }}>每包 150g ∙ 基礎配方自動載入 ∙ 修改克數即時更新 ∙ 切換 Tab 資料保持不變</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setGrams(()=>{const m={};baseItems.forEach(({name,g})=>{m[name]=g;});return m;})}
            style={{ padding:"6px 14px", background:DC.surface2, border:`1px solid ${DC.border}`, borderRadius:50, fontSize:12, color:DC.mid, cursor:"pointer", fontFamily:"inherit" }}>
            重設
          </button>
          {order.status==="new"&&(
            <button onClick={handleSendToProduction} disabled={saving}
              style={{ padding:"6px 16px", background:DC.sage, color:"white", border:"none", borderRadius:50, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              {saving?"處理中…":"核准並送生產"}
            </button>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div style={{ background:DC.earthL, border:`1px solid ${DC.earth}30`, borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:600, color:DC.earth, marginBottom:8 }}>建議調整方向（依健康狀況）</div>
          {suggestions.map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:8, fontSize:12, color:s.color, marginBottom:i<suggestions.length-1?5:0, lineHeight:1.5 }}>
              <span style={{flexShrink:0}}>→</span>{s.text}
            </div>
          ))}
        </div>
      )}
      {flags.length > 0 && (
        <div style={{ background:DC.redL, border:`1px solid ${DC.red}30`, borderRadius:10, padding:"10px 16px", marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:600, color:DC.red, marginBottom:6 }}>AAFCO 警告</div>
          {flags.map((f,i)=><div key={i} style={{ fontSize:12, color:f.color, marginBottom:i<flags.length-1?3:0 }}>⚠ {f.text}</div>)}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* LEFT: ingredient editor */}
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:DC.dark, marginBottom:10 }}>食材克數調整</div>
          <div style={{ background:DC.surface2, borderRadius:10, overflow:"hidden", border:`1px solid ${DC.border}` }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 70px 70px", gap:0, padding:"7px 14px", background:DC.surface2, borderBottom:`1px solid ${DC.border}`, fontSize:11, fontWeight:600, color:DC.lighter, textTransform:"uppercase", letterSpacing:".5px" }}>
              <span>食材</span><span style={{textAlign:"right"}}>基礎</span><span style={{textAlign:"right"}}>調整後</span>
            </div>
            {baseItems.map(({name,g:baseG})=>{
              const adjG = parseFloat(grams[name])||0;
              const changed = Math.abs(adjG - baseG) > 0.05;
              return (
                <div key={name} style={{ display:"grid", gridTemplateColumns:"1fr 70px 70px", gap:0, padding:"8px 14px", borderBottom:`1px solid ${DC.border}`, alignItems:"center", background:changed?"#F0FBF2":"white" }}>
                  <span style={{ fontSize:13, color:changed?DC.sage:DC.dark, fontWeight:changed?600:400 }}>{name}</span>
                  <span style={{ fontSize:12, color:DC.lighter, textAlign:"right", paddingRight:8 }}>{baseG}g</span>
                  <div style={{ display:"flex", alignItems:"center", gap:3, justifyContent:"flex-end" }}>
                    <input type="number" min="0" max="300" step="0.1"
                      value={grams[name]??baseG}
                      onChange={e=>setG(name,e.target.value)}
                      style={{...inp, width:52}}
                      onFocus={e=>{e.target.style.borderColor=DC.sage;e.target.style.background="#F5FDF6";}}
                      onBlur={e=>{e.target.style.borderColor=DC.border;e.target.style.background="white";}}
                    />
                    <span style={{ fontSize:11, color:DC.lighter }}>g</span>
                  </div>
                </div>
              );
            })}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 70px 70px", gap:0, padding:"9px 14px", background:DC.sageL, borderTop:`1px solid ${DC.sage}30` }}>
              <span style={{ fontSize:12, fontWeight:600, color:DC.sage }}>總重量</span>
              <span style={{ fontSize:12, color:DC.lighter, textAlign:"right", paddingRight:8 }}>{baseItems.reduce((s,i)=>s+i.g,0).toFixed(0)}g</span>
              <span style={{ fontSize:12, fontWeight:700, color:DC.sage, textAlign:"right", paddingRight:18 }}>{adjItems.reduce((s,i)=>s+i.g,0).toFixed(1)}g</span>
            </div>
          </div>
        </div>

        {/* RIGHT: live comparison */}
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:DC.dark, marginBottom:10 }}>即時營養比對</div>
          <div style={{ background:DC.surface2, borderRadius:10, padding:"13px 14px", marginBottom:10 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              {[
                {label:"每包熱量", base:`${baseNutr.kcal.toFixed(0)} kcal`, adj:`${adjNutr.kcal.toFixed(0)} kcal`, changed:Math.abs(adjNutr.kcal-baseNutr.kcal)>1},
                {label:"每日包數", base:`${packsBase.toFixed(1)} 包`,        adj:`${packsPerDay.toFixed(1)} 包`,    changed:Math.abs(packsPerDay-packsBase)>0.05},
                {label:"每月包數", base:`${Math.ceil(packsBase*31)} 包`,     adj:`${packsPerMonth} 包`,             changed:Math.ceil(packsBase*31)!==packsPerMonth},
                {label:"總成本",   base:`NT$${baseCost.toFixed(0)}`,         adj:`NT$${adjCost.toFixed(0)}`,        changed:Math.abs(adjCost-baseCost)>0.5},
              ].map(r=>(
                <div key={r.label} style={{ background:"white", borderRadius:8, padding:"9px 11px" }}>
                  <div style={{ fontSize:10, color:DC.lighter, marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontSize:10, color:DC.lighter, marginBottom:2 }}>基礎：{r.base}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:r.changed?DC.sage:DC.dark }}>{r.adj}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, color:DC.mid, background:DC.sageL, borderRadius:6, padding:"6px 10px" }}>
              MER {nut.mer} kcal ÷ {adjNutr.kcal.toFixed(0)} kcal/包 = <strong style={{color:DC.sage}}>{packsPerDay.toFixed(1)} 包/天</strong> × 31天 = <strong style={{color:DC.sage}}>{packsPerMonth} 包/月</strong>
            </div>
          </div>

          {/* Macro bars */}
          <div style={{ background:DC.surface2, borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:600, color:DC.lighter, marginBottom:8, textTransform:"uppercase", letterSpacing:".5px" }}>宏量營養素</div>
            {[
              {label:"蛋白質", b:baseNutr.protein, a:adjNutr.protein, u:"g"},
              {label:"脂肪",   b:baseNutr.fat,     a:adjNutr.fat,     u:"g"},
              {label:"碳水",   b:baseNutr.cho,     a:adjNutr.cho,     u:"g"},
              {label:"含水量", b:baseNutr.h2o_pct, a:adjNutr.h2o_pct, u:"%"},
            ].map(({label,b,a,u})=>{
              const changed = Math.abs(a-b)>0.05;
              return (
                <div key={label} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                    <span style={{color:DC.mid}}>{label}</span>
                    <div style={{ display:"flex", gap:10 }}>
                      <span style={{color:DC.lighter,fontSize:11}}>基礎 {b.toFixed(1)}{u}</span>
                      <span style={{fontWeight:600, color:changed?DC.sage:DC.dark}}>{a.toFixed(1)}{u} {changed?(a>b?"▲":"▼"):""}</span>
                    </div>
                  </div>
                  <div style={{height:5, background:"#E8E8E8", borderRadius:3, overflow:"hidden"}}>
                    <div style={{width:`${Math.min(100,b>0?a/b*100:0)}%`, height:"100%", background:changed?DC.sage:DC.border2, borderRadius:3, transition:"width .3s"}}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Minerals: Ca, P, Na, Mg */}
          <div style={{ background: adjNutr.ca_p>=1.0&&adjNutr.ca_p<=1.3?DC.sageL:DC.earthL, border:`1px solid ${adjNutr.ca_p>=1.0&&adjNutr.ca_p<=1.3?DC.sage:DC.earth}40`, borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:adjNutr.ca_p>=1.0&&adjNutr.ca_p<=1.3?DC.sage:DC.earth, marginBottom:8, textTransform:"uppercase", letterSpacing:".5px" }}>礦物質（per pack）</div>
            <NRow label="鈣 Ca"  value={`${(adjNutr.ca*1000).toFixed(0)}mg（基礎 ${(baseNutr.ca*1000).toFixed(0)}mg）`}  flag={adjNutr.ca_p>=1.0&&adjNutr.ca_p<=1.3?"info":"warning"} />
            <NRow label="磷 P"   value={`${(adjNutr.p*1000).toFixed(0)}mg（基礎 ${(baseNutr.p*1000).toFixed(0)}mg）`}   />
            <NRow label="鈉 Na"  value={`${(adjNutr.na*1000).toFixed(0)}mg（基礎 ${(baseNutr.na*1000).toFixed(0)}mg）`}  />
            <NRow label="鎂 Mg"  value={`${(adjNutr.mg*1000).toFixed(0)}mg（基礎 ${(baseNutr.mg*1000).toFixed(0)}mg）`}  last />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, paddingTop:8, borderTop:`1px solid ${adjNutr.ca_p>=1.0&&adjNutr.ca_p<=1.3?DC.sage:DC.earth}30` }}>
              <span style={{ fontSize:12, color:DC.mid }}>Ca:P 比例（目標 1.0–1.3）</span>
              <span style={{ fontSize:16, fontWeight:700, color:adjNutr.ca_p>=1.0&&adjNutr.ca_p<=1.3?DC.sage:DC.red }}>
                {adjNutr.ca_p.toFixed(2)}:1 {adjNutr.ca_p>=1.0&&adjNutr.ca_p<=1.3?"✓":"✗"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ORDER DETAIL MODAL ────────────────────────────────────────────
function OrderDetail({ order, onClose, onSave }) {
  const p   = order.pet_profile || {};
  const nut = calcNutrition(p);
  const st  = STATUS[order.status] || STATUS.new;

  const [recipe,     setRecipe]     = useState(order.assigned_recipe || "");
  const [vetOk,      setVetOk]      = useState(order.vet_approved || false);
  const [notes,      setNotes]      = useState(order.vet_notes || "");
  const [ownerNotes, setOwnerNotes] = useState(order.owner_notes || "");
  const [saving,     setSaving]     = useState(false);
  const [tab,        setTab]        = useState("profile");

  // 6. Grams state lifted here so it persists across tab switches
  const recipeId   = recipe || order.assigned_recipe || "chicken";
  const baseItems  = BASE_RECIPES[recipeId] || BASE_RECIPES.chicken;
  const [grams, setGrams] = useState(() => {
    const m = {};
    baseItems.forEach(({name, g}) => { m[name] = g; });
    return m;
  });

  // 8. Ship date = created_at + 10 days
  const shipDate = (() => {
    try {
      const d = new Date(order.created_at);
      d.setDate(d.getDate() + 10);
      return d.toISOString().slice(0,10);
    } catch { return order.ship_date || "—"; }
  })();

  const healthActive  = (p.health   ||[]).filter(h=>h!=="none");
  const allergyActive = (p.allergies||[]).filter(a=>a!=="none");

  // 4. Approve → jump directly to in_production (skip approved)
  const handleApprove = async () => {
    if (!vetOk)  { alert("請先勾選獸醫審核通過"); return; }
    if (!recipe) { alert("請先指派食譜"); return; }
    setSaving(true);
    await onSave(order.id, {
      status:"in_production",
      assigned_recipe:recipe, vet_approved:vetOk, vet_notes:notes,
      owner_notes:ownerNotes,
      nutrition_data:{ rer:nut.rer, mer:nut.mer, adjustments:nut.adj },
    });
    setSaving(false);
    onClose();
  };
  const handleAdvance = async () => {
    if (!st.next) return;
    setSaving(true);
    await onSave(order.id, { status:st.next, vet_notes:notes, owner_notes:ownerNotes });
    setSaving(false);
    onClose();
  };

  const tabStyle = t => ({
    padding:"10px 20px", cursor:"pointer", fontSize:13, fontWeight:tab===t?600:400,
    color:tab===t?DC.sage:DC.mid,
    borderBottom:`2px solid ${tab===t?DC.sage:"transparent"}`,
    transition:"all .2s", background:"transparent", border:"none", fontFamily:"inherit",
  });

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:900, display:"flex", alignItems:"flex-start", justifyContent:"center", overflowY:"auto", padding:"20px 16px" }}>
      <div style={{ background:DC.surface, border:`1px solid ${DC.border}`, borderRadius:16, width:"100%", maxWidth:1000, boxShadow:"0 20px 60px rgba(0,0,0,.15)", marginBottom:40 }}>

        {/* Header */}
        <div style={{ padding:"20px 28px 16px", borderBottom:`1px solid ${DC.border}`, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:11, color:DC.light, marginBottom:4 }}>{order.id} · {order.created_at} · 預計出貨 <strong style={{color:DC.sage}}>{shipDate}</strong></div>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
              <span style={{ fontFamily:"Georgia,serif", fontSize:22, fontWeight:500, color:DC.dark }}>{p.petName || "—"}</span>
              <SpeciesBadge species={p.species} size="lg" />
              <StatusBadge status={order.status} />
            </div>
            <div style={{ fontSize:13, color:DC.mid }}>{p.ownerName} · {p.ownerPhone} · {p.ownerEmail}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:DC.light, padding:"4px 8px" }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${DC.border}`, paddingLeft:20, background:DC.surface }}>
          <button style={tabStyle("profile")}   onClick={()=>setTab("profile")}>寵物資料</button>
          <button style={tabStyle("nutrition")} onClick={()=>setTab("nutrition")}>營養計算</button>
          <button style={tabStyle("formula")}   onClick={()=>setTab("formula")}>配方調整</button>
          <button style={tabStyle("dm")}        onClick={()=>setTab("dm")}>乾物計算機</button>
          <button style={tabStyle("approve")}   onClick={()=>setTab("approve")}>審核 ＆ 備註</button>
        </div>

        <div style={{ padding:"24px 28px" }}>

          {/* ── PROFILE ── */}
          {tab==="profile" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", textTransform:"uppercase", color:DC.light, marginBottom:12 }}>基本資料</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                  {[
                    ["物種", p.species==="dog"?"狗狗":"貓咪"],
                    ["品種", p.breed||"—"],
                    ["性別", {male_intact:"公（未結紮）",male_neutered:"公（已結紮）",female_intact:"母（未絕育）",female_spayed:"母（已絕育）"}[p.sex]||"—"],
                    ["年齡", p.age<1?`${Math.round(p.age*12)} 個月`:`${p.age} 歲`],
                    ["體重", `${p.weight} kg`],
                    ["理想體重", p.idealWeight?`${p.idealWeight} kg`:"未填"],
                    ["體型", {toy:"小型",medium:"中型",large:"大型",giant:"超大型"}[p.size]||"—"],
                    ["BCS", `${p.bcs} / 9`],
                  ].map(([k,v])=>(
                    <div key={k} style={{ background:DC.surface2, borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ fontSize:10, color:DC.lighter, marginBottom:2 }}>{k}</div>
                      <div style={{ fontSize:13, fontWeight:500, color:DC.dark }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:DC.surface2, borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                  <div style={{ fontSize:10, color:DC.lighter, marginBottom:2 }}>活動量</div>
                  <div style={{ fontSize:13, color:DC.dark }}>
                    {({sedentary:"宅家型",low:"悠閒型",moderate:"活潑型",active:"運動型",very_active:"競技型"})[p.activity]||"—"}
                    <span style={{ color:DC.lighter, marginLeft:8 }}>× {p.actMult}</span>
                  </div>
                </div>
                <div style={{ background:DC.surface2, borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:DC.lighter, marginBottom:2 }}>目前飲食</div>
                  <div style={{ fontSize:12, color:DC.mid, lineHeight:1.5 }}>{p.dietNote||"未填"}</div>
                </div>
              </div>
              <div>
                {healthActive.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", textTransform:"uppercase", color:DC.earth, marginBottom:8 }}>健康狀況</div>
                    <div style={{ marginBottom:6 }}>{healthActive.map(h=><Tag key={h} label={HEALTH_LABEL[h]||h} color={DC.earth} bg={DC.earthL}/>)}</div>
                    {p.healthNote && <div style={{ fontSize:12, color:DC.mid, background:DC.earthL, borderRadius:8, padding:"10px 12px", lineHeight:1.6 }}>{p.healthNote}</div>}
                  </div>
                )}
                {allergyActive.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", textTransform:"uppercase", color:DC.red, marginBottom:8 }}>食物過敏</div>
                    {allergyActive.map(a=><Tag key={a} label={ALLERGY_LABEL[a]||a} color={DC.red} bg={DC.redL}/>)}
                    {p.allergyNote && <div style={{ fontSize:12, color:DC.mid, background:DC.redL, borderRadius:8, padding:"10px 12px", marginTop:6, lineHeight:1.6 }}>{p.allergyNote}</div>}
                  </div>
                )}
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", textTransform:"uppercase", color:DC.light, marginBottom:8 }}>健康目標</div>
                  <div>{(p.goals||[]).map(g=><Tag key={g} label={({maintain:"維持體重",lose:"健康減重",gain:"增重",joint:"關節保健",skin:"皮膚毛髮",gut:"腸胃健康",senior:"熟齡保養",immunity:"免疫力"})[g]||g} color={DC.blue} bg={DC.blueL}/>)}</div>
                </div>
                <div style={{ background:DC.surface2, borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:DC.lighter, marginBottom:2 }}>配送資料</div>
                  <div style={{ fontSize:12, color:DC.mid }}>
                    {({weekly:"每週配送",biweekly:"每兩週配送",monthly:"每月配送"})[p.delivery]||p.delivery}
                    <br/>{p.address}
                  </div>
                </div>

                {/* 5a. Owner notes */}
                <div style={{ marginTop:12 }}>
                  <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", textTransform:"uppercase", color:DC.light, marginBottom:6 }}>飼主備註</div>
                  <textarea
                    value={ownerNotes} onChange={e=>setOwnerNotes(e.target.value)}
                    placeholder="記錄飼主特殊需求、溝通紀錄、注意事項…"
                    style={{ width:"100%", padding:"10px 12px", background:DC.surface2, border:`1px solid ${DC.border}`, borderRadius:8, color:DC.dark, fontFamily:"'Noto Sans TC',sans-serif", fontSize:12, resize:"vertical", minHeight:72, outline:"none", lineHeight:1.6, boxSizing:"border-box" }}
                    onFocus={e=>e.target.style.borderColor=DC.sage}
                    onBlur={e=>e.target.style.borderColor=DC.border}
                  />
                </div>

                {/* 5b. Past orders */}
                {(order.past_orders||[]).length > 0 && (
                  <div style={{ marginTop:12 }}>
                    <div style={{ fontSize:11, fontWeight:600, letterSpacing:"1.2px", textTransform:"uppercase", color:DC.light, marginBottom:8 }}>過往訂單紀錄</div>
                    {(order.past_orders||[]).map((po,i)=>(
                      <div key={i} style={{ background:DC.surface2, borderRadius:8, padding:"10px 12px", marginBottom:6, borderLeft:`3px solid ${DC.sage}` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                          <span style={{ fontSize:12, fontWeight:500, color:DC.dark }}>{po.id}</span>
                          <span style={{ fontSize:11, color:DC.lighter }}>{po.date}</span>
                        </div>
                        <div style={{ display:"flex", gap:8, marginBottom:po.notes?4:0 }}>
                          <Tag label={RECIPE_NAME[po.recipe]||po.recipe} color={DC.sage} bg={DC.sageL} />
                          <Tag label={({shipped:"已出貨",in_production:"生產中",new:"新訂單"})[po.status]||po.status} color={DC.teal} bg={DC.tealL} />
                        </div>
                        {po.notes && <div style={{ fontSize:11, color:DC.mid, lineHeight:1.5 }}>{po.notes}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {(order.past_orders||[]).length === 0 && (
                  <div style={{ marginTop:12, fontSize:12, color:DC.lighter, textAlign:"center", padding:"12px", background:DC.surface2, borderRadius:8 }}>
                    這是此寵物的第一筆訂單
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── NUTRITION ── */}
          {tab==="nutrition" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
                {[
                  { label:"計算體重", value:`${p.idealWeight||p.weight} kg`, color:DC.dark },
                  { label:"RER = 70 × BW^0.75", value:`${nut.rer} kcal`, color:DC.sage },
                  { label:"MER（最終目標）", value:`${nut.mer} kcal`, color:DC.gold },
                  { label:"綜合乘數", value:`× ${(nut.mer/nut.rer).toFixed(2)}`, color:DC.blue },
                ].map(c=>(
                  <div key={c.label} style={{ background:DC.surface2, borderRadius:10, padding:"14px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:DC.light, marginBottom:4, lineHeight:1.4 }}>{c.label}</div>
                    <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:700, color:c.color }}>{c.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:DC.dark, marginBottom:10 }}>每日營養目標（估算）</div>
                  <div style={{ background:DC.surface2, borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
                    <NRow label="蛋白質（25% kcal ÷ 4）" value={`${nut.protein} g`} />
                    <NRow label="脂肪（30% kcal ÷ 9）"   value={`${nut.fat} g`} />
                    <NRow label="碳水化合物（35% kcal ÷ 4）" value={`${nut.cho} g`} />
                    <NRow label="水分需求（50ml × kg）"   value={`${nut.water} ml`} last />
                  </div>
                  <div style={{ background:DC.surface2, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:11, fontWeight:600, color:DC.light, marginBottom:8, textTransform:"uppercase", letterSpacing:".8px" }}>MER 計算明細</div>
                    <NRow label="RER 基礎"     value={`${nut.rer} kcal`} />
                    <NRow label="生命階段乘數" value={`× ${nut.stageMult}`} />
                    <NRow label="活動量乘數"   value={`× ${p.actMult||1.6}`} />
                    <NRow label="體型乘數"     value={`× ${p.sizeMult||1.0}`} />
                    <NRow label="MER 合計"     value={`${nut.mer} kcal`} flag="info" last />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color: nut.adj.length>0?DC.earth:DC.sage, marginBottom:10 }}>
                    {nut.adj.length > 0 ? "療癒配方調整項目" : "無特殊調整需求"}
                  </div>
                  {nut.adj.length > 0 ? (
                    <div style={{ background:DC.earthL, border:`1px solid ${DC.earth}30`, borderRadius:10, padding:"12px 14px" }}>
                      {nut.adj.map((a,i)=><NRow key={i} label={a.label} value={a.value} flag={a.flag} last={i===nut.adj.length-1}/>)}
                    </div>
                  ) : (
                    <div style={{ background:DC.sageL, borderRadius:10, padding:"24px", textAlign:"center", color:DC.sage, fontSize:13 }}>
                      此毛孩健康良好，使用標準配方即可。
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── FORMULA ADJUSTMENT ── */}
          {tab==="formula" && (
            <FormulaTab order={order} p={p} nut={nut} recipe={recipe} grams={grams} setGrams={setGrams} onSave={onSave} onClose={onClose} saving={saving} setSaving={setSaving} />
          )}

          {/* ── DRY MATTER ── */}
          {tab==="dm" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:DC.dark, marginBottom:3 }}>乾物計算機（DM Basis Calculator）</div>
                  <div style={{ fontSize:12, color:DC.mid }}>已自動載入 <strong>{RECIPE_NAME[recipeId]||"雞肉鮮蔬"}</strong> 配方食材，可直接調整克數重新計算。</div>
                </div>
                <SpeciesBadge species={p.species} size="lg" />
              </div>
              <DryMatterCalc species={p.species} recipeId={recipeId} grams={grams} setGrams={setGrams} />
            </div>
          )}

          {/* ── APPROVE ── */}
          {tab==="approve" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:DC.dark, marginBottom:10 }}>指派食譜</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
                  {Object.entries(RECIPE_NAME).filter(([id])=>!(ALLERGEN_MAP[id]||[]).some(a=>allergyActive.includes(a))).map(([id,name])=>(
                    <div key={id} onClick={()=>setRecipe(id)} style={{
                      border:`1.5px solid ${recipe===id?DC.sage:DC.border}`,
                      borderRadius:8, padding:"12px 8px", textAlign:"center", cursor:"pointer",
                      background:recipe===id?DC.sageL:"white", transition:"all .2s",
                    }}>
                      <div style={{ fontSize:12, color:recipe===id?DC.sage:DC.dark, fontWeight:recipe===id?600:400 }}>{name}</div>
                    </div>
                  ))}
                </div>
                {allergyActive.length > 0 && <div style={{ fontSize:11, color:DC.red, marginBottom:12 }}>含過敏原食譜已隱藏（{allergyActive.map(a=>ALLERGY_LABEL[a]).filter(Boolean).join("、")}）</div>}

                {/* Vet approval */}
                <div onClick={()=>setVetOk(v=>!v)} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                  background:vetOk?DC.sageL:"white", border:`1.5px solid ${vetOk?DC.sage:DC.border}`,
                  borderRadius:10, cursor:"pointer", marginBottom:12, transition:"all .2s",
                }}>
                  <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${vetOk?DC.sage:DC.border}`, display:"flex", alignItems:"center", justifyContent:"center", background:vetOk?DC.sage:"white", flexShrink:0 }}>
                    {vetOk&&<span style={{ color:"white", fontSize:11, fontWeight:700 }}>✓</span>}
                  </div>
                  <div style={{ fontSize:13, color:vetOk?DC.sageD:DC.mid, fontWeight:vetOk?600:400 }}>獸醫營養師已審核通過</div>
                </div>

                {/* 4. Actions: new → in_production directly */}
                <div style={{ display:"flex", gap:8 }}>
                  {order.status === "new" && (
                    <button onClick={handleApprove} disabled={saving} style={{ flex:1, padding:"11px", background:DC.sage, color:"white", border:"none", borderRadius:50, fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                      {saving?"處理中…":"核准並直接送生產"}
                    </button>
                  )}
                  {order.status === "in_production" && (
                    <button onClick={handleAdvance} disabled={saving} style={{ flex:1, padding:"11px", background:DC.teal, color:"white", border:"none", borderRadius:50, fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                      {saving?"處理中…":"標記為已出貨"}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:DC.dark, marginBottom:8 }}>內部備註</div>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)}
                  placeholder="輸入審核備註、配方調整說明…"
                  style={{ width:"100%", padding:"12px", background:DC.surface2, border:`1px solid ${DC.border}`, borderRadius:10, color:DC.dark, fontFamily:"'Noto Sans TC',sans-serif", fontSize:13, resize:"vertical", minHeight:180, outline:"none", lineHeight:1.7, boxSizing:"border-box" }}
                  onFocus={e=>e.target.style.borderColor=DC.sage}
                  onBlur={e=>e.target.style.borderColor=DC.border}
                />
                <button onClick={async ()=>{ setSaving(true); await onSave(order.id,{vet_notes:notes,assigned_recipe:recipe,vet_approved:vetOk}); setSaving(false); }}
                  style={{ marginTop:10, padding:"9px 20px", background:"white", color:DC.mid, border:`1px solid ${DC.border}`, borderRadius:50, fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>
                  {saving?"儲存中…":"儲存備註"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ORDER ROW ─────────────────────────────────────────────────────
function OrderRow({ order, onClick }) {
  const p   = order.pet_profile || {};
  const nut = calcNutrition(p);
  const healthActive  = (p.health   ||[]).filter(h=>h!=="none");
  const allergyActive = (p.allergies||[]).filter(a=>a!=="none");

  return (
    <div onClick={onClick} style={{
      background:DC.surface, border:`1px solid ${DC.border}`,
      borderRadius:12, padding:"14px 20px", marginBottom:8,
      cursor:"pointer", transition:"all .2s",
    }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=DC.sage; e.currentTarget.style.boxShadow="0 2px 12px rgba(74,113,80,.12)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=DC.border; e.currentTarget.style.boxShadow="none"; }}
    >
      <div style={{ display:"grid", gridTemplateColumns:"190px 1fr auto", gap:16, alignItems:"center" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <span style={{ fontFamily:"Georgia,serif", fontSize:17, fontWeight:500, color:DC.dark }}>{p.petName||"—"}</span>
            <SpeciesBadge species={p.species} />
          </div>
          <div style={{ fontSize:12, color:DC.mid }}>{p.ownerName} · {p.breed}</div>
          <div style={{ fontSize:11, color:DC.lighter, marginTop:2 }}>{order.id} · {order.created_at?.slice(0,10)}</div>
        </div>
        <div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginBottom:5 }}>
            {healthActive.map(h=><Tag key={h} label={HEALTH_LABEL[h]||h} color={DC.earth} bg={DC.earthL}/>)}
            {allergyActive.map(a=><Tag key={a} label={`✕ ${ALLERGY_LABEL[a]||a}`} color={DC.red} bg={DC.redL}/>)}
            {order.assigned_recipe && <Tag label={RECIPE_NAME[order.assigned_recipe]} color={DC.sage} bg={DC.sageL}/>}
          </div>
          <div style={{ fontSize:12, color:DC.light }}>
            MER <span style={{ color:DC.dark, fontWeight:600 }}>{nut.mer} kcal</span>
            <span style={{ margin:"0 6px", color:DC.border }}>|</span>
            {({weekly:"每週",biweekly:"每兩週",monthly:"每月"})[p.delivery]} 配送
            <span style={{ margin:"0 6px", color:DC.border }}>|</span>
            NT${(order.plan_price||0).toLocaleString()} / 月
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <StatusBadge status={order.status} />
          {order.vet_approved && <div style={{ fontSize:11, color:DC.sage, marginTop:5 }}>已獸醫審核</div>}
          {order.ship_date && <div style={{ fontSize:11, color:DC.mid, marginTop:4 }}>預計出貨 {order.ship_date}</div>}
        </div>
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────
function LoginGate({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pw === "pawformula2026") onLogin();
    else { setErr(true); setTimeout(()=>setErr(false), 2000); }
  };
  return (
    <div style={{ background:DC.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Noto Sans TC',sans-serif" }}>
      <div style={{ background:DC.surface, border:`1px solid ${DC.border}`, borderRadius:16, padding:"44px 40px", width:360, textAlign:"center", boxShadow:"0 4px 24px rgba(0,0,0,.08)" }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:600, color:DC.dark, marginBottom:4 }}>
          Paw<span style={{ color:DC.sage }}>Formula</span>
        </div>
        <div style={{ fontSize:13, color:DC.mid, marginBottom:28 }}>客製化訂單管理後台</div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
          placeholder="請輸入密碼"
          style={{ width:"100%", padding:"11px 16px", background:DC.surface2, border:`1.5px solid ${err?DC.red:DC.border}`, borderRadius:8, color:DC.dark, fontFamily:"inherit", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:err?6:14, textAlign:"center" }}
        />
        {err && <div style={{ fontSize:12, color:DC.red, marginBottom:10 }}>密碼錯誤</div>}
        <button onClick={submit} style={{ width:"100%", padding:"12px", background:DC.sage, color:"white", border:"none", borderRadius:50, fontFamily:"inherit", fontSize:14, fontWeight:600, cursor:"pointer" }}>登入</button>
        <div style={{ fontSize:11, color:DC.lighter, marginTop:14 }}>預設密碼：pawformula2026</div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────
function DashboardApp() {
  const [loggedIn,     setLoggedIn]  = useState(false);
  const [orders,       setOrders]    = useState(MOCK);
  const [selected,     setSelected]  = useState(null);
  const [filterStatus, setFilter]    = useState("all");
  const [searchQ,      setSearchQ]   = useState("");
  const [activeTab,    setActiveTab] = useState("orders");

  const updateOrder = (id, changes) => {
    setOrders(prev => prev.map(o => o.id===id ? {...o,...changes} : o));
  };

  const filtered = orders.filter(o => {
    const p = o.pet_profile || {};
    const matchStatus = filterStatus==="all" || o.status===filterStatus;
    const q = searchQ.toLowerCase();
    const matchSearch = !q
      || (p.petName||"").toLowerCase().includes(q)
      || (p.ownerName||"").toLowerCase().includes(q)
      || (p.ownerPhone||"").replace(/-/g,"").includes(q.replace(/-/g,""))
      || (p.ownerEmail||"").toLowerCase().includes(q)
      || (o.id||"").toLowerCase().includes(q)
      || (p.breed||"").toLowerCase().includes(q)
      || (p.address||"").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = Object.fromEntries(Object.keys(STATUS).map(s=>[s, orders.filter(o=>o.status===s).length]));

  if (!loggedIn) return <LoginGate onLogin={()=>setLoggedIn(true)} />;

  return (
    <div style={{ fontFamily:"'Noto Sans TC',sans-serif", background:DC.bg, minHeight:"100vh", color:DC.dark }}>

      {/* NAV */}
      <div style={{ background:DC.surface, borderBottom:`1px solid ${DC.border}`, padding:"0 28px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:24 }}>
          <div style={{ fontFamily:"Georgia,serif", fontSize:19, fontWeight:600, color:DC.dark }}>
            Paw<span style={{ color:DC.sage }}>Formula</span>
            <span style={{ fontSize:11, color:DC.light, marginLeft:8, fontFamily:"inherit", fontWeight:400 }}>客製化訂單管理</span>
          </div>
          <div style={{ display:"flex", gap:2 }}>
            {[{id:"orders",label:"訂單列表"},{id:"analytics",label:"數據總覽"}].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ padding:"5px 14px", borderRadius:50, fontSize:13, fontWeight:activeTab===t.id?600:400, color:activeTab===t.id?DC.sage:DC.mid, background:activeTab===t.id?DC.sageL:"transparent", border:"none", cursor:"pointer" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <a href="#" style={{ padding:"5px 12px", borderRadius:50, fontSize:12, color:DC.mid, border:`1px solid ${DC.border}`, textDecoration:"none" }}>客戶網站</a>
          <a href="#" style={{ padding:"5px 12px", borderRadius:50, fontSize:12, color:DC.mid, border:`1px solid ${DC.border}`, textDecoration:"none" }}>後台系統</a>
          <button onClick={()=>setLoggedIn(false)} style={{ width:30, height:30, borderRadius:"50%", background:DC.sageL, border:"none", cursor:"pointer", fontSize:12, color:DC.sage, fontWeight:700 }}>登出</button>
        </div>
      </div>

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"22px 20px" }}>

        {/* ANALYTICS */}
        {activeTab==="analytics" && (
          <div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:20, fontWeight:500, color:DC.dark, marginBottom:18 }}>數據總覽</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
              {[
                { label:"總訂單", value:orders.length, color:DC.dark },
                { label:"新訂單", value:counts.new||0, color:DC.blue },
                { label:"生產中", value:counts.in_production||0, color:DC.earth },
                { label:"已出貨", value:counts.shipped||0, color:DC.sage },
              ].map(c=>(
                <div key={c.label} style={{ background:DC.surface, border:`1px solid ${DC.border}`, borderRadius:12, padding:"16px 18px" }}>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:26, fontWeight:700, color:c.color }}>{c.value}</div>
                  <div style={{ fontSize:12, color:DC.mid, marginTop:4 }}>{c.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ background:DC.surface, border:`1px solid ${DC.border}`, borderRadius:12, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:600, color:DC.dark, marginBottom:14 }}>健康狀況分布</div>
                {[{k:"ckd",l:"腎臟病 CKD"},{k:"cardiac",l:"心臟病"},{k:"arthritis",l:"關節炎"},{k:"obesity",l:"肥胖"},{k:"skin",l:"皮膚過敏"},{k:"pancreatitis",l:"胰臟炎"}].map(({k,l})=>{
                  const n = orders.filter(o=>(o.pet_profile?.health||[]).includes(k)).length;
                  const pct = orders.length>0 ? Math.round(n/orders.length*100) : 0;
                  return (
                    <div key={k} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:DC.mid, marginBottom:4 }}>
                        <span>{l}</span><span style={{ color:DC.earth }}>{n} 筆</span>
                      </div>
                      <div style={{ height:5, background:DC.surface2, borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:DC.earth, borderRadius:3 }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background:DC.surface, border:`1px solid ${DC.border}`, borderRadius:12, padding:"18px 20px" }}>
                <div style={{ fontSize:13, fontWeight:600, color:DC.dark, marginBottom:14 }}>食譜指派分布</div>
                {Object.entries(RECIPE_NAME).map(([id,name])=>{
                  const n = orders.filter(o=>o.assigned_recipe===id).length;
                  const pct = orders.length>0 ? Math.round(n/orders.length*100) : 0;
                  return (
                    <div key={id} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:DC.mid, marginBottom:4 }}>
                        <span>{name}</span><span style={{ color:DC.sage }}>{n} 筆</span>
                      </div>
                      <div style={{ height:5, background:DC.surface2, borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:DC.sage, borderRadius:3 }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab==="orders" && (
          <div>
            {/* Status filter cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
              {Object.entries(STATUS).map(([status,cfg])=>(
                <div key={status} onClick={()=>setFilter(filterStatus===status?"all":status)}
                  style={{ background:filterStatus===status?cfg.bg:DC.surface, border:`1px solid ${filterStatus===status?cfg.color:DC.border}`, borderRadius:10, padding:"12px 14px", cursor:"pointer", transition:"all .2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:cfg.dot }}/>
                    <span style={{ fontSize:11, color:DC.mid }}>{cfg.label}</span>
                  </div>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:700, color:filterStatus===status?cfg.color:DC.dark }}>{counts[status]||0}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center" }}>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                placeholder="搜尋寵物名稱、飼主、訂單編號、品種…"
                style={{ flex:1, padding:"9px 16px", background:DC.surface, border:`1px solid ${DC.border}`, borderRadius:50, color:DC.dark, fontFamily:"inherit", fontSize:13, outline:"none" }}
                onFocus={e=>e.target.style.borderColor=DC.sage}
                onBlur={e=>e.target.style.borderColor=DC.border}
              />
              {filterStatus!=="all" && <button onClick={()=>setFilter("all")} style={{ padding:"9px 14px", background:DC.surface, border:`1px solid ${DC.border}`, borderRadius:50, fontSize:12, color:DC.mid, cursor:"pointer" }}>× 清除</button>}
              <span style={{ fontSize:12, color:DC.light, whiteSpace:"nowrap" }}>{filtered.length} 筆</span>
            </div>


            {filtered.length===0 ? (
              <div style={{ textAlign:"center", padding:"48px 0", color:DC.lighter }}>
                <div style={{ fontSize:14 }}>找不到符合條件的訂單</div>
              </div>
            ) : filtered.map(o=>(
              <OrderRow key={o.id} order={o} onClick={()=>setSelected(o)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <OrderDetail
          order={orders.find(o=>o.id===selected.id)||selected}
          onClose={()=>setSelected(null)}
          onSave={async (id,changes)=>{ updateOrder(id,changes); setSelected(p=>({...p,...changes})); }}
        />
      )}
    </div>
  );
}
