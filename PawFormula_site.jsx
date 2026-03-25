import { useState } from "react";

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
  const total = cart.reduce((s,i)=>s+i.price*(i.qty||1),0);
  const si = (k,v) => setInfo(f=>({...f,[k]:v}));
  const inp = { width:"100%", padding:"12px 16px", border:`1.5px solid ${C.border}`, borderRadius:10, fontFamily:"inherit", fontSize:14, color:C.dark, background:C.cream, outline:"none" };

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
                ⚠️ 目前為展示版本，實際付款功能串接後啟用。點擊「確認下單」將模擬完成訂購流程。
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setStep(2)} style={{ flex:"0 0 auto", padding:"13px 20px", background:"white", color:C.mid, border:`1.5px solid ${C.border}`, borderRadius:50, fontFamily:"inherit", fontSize:13, cursor:"pointer" }}>← 返回</button>
                <button onClick={()=>setPlaced(true)} style={{ flex:1, padding:"13px", background:C.earth, color:"white", border:"none", borderRadius:50, fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:"pointer" }}>
                  確認下單 🐾
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
export default function App() {
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
