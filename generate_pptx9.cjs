const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// Define Color Palette from the Reference Style (Dark Theme)
const c = {
    bg: "0B1320",         
    mint: "2DD4BF",       
    white: "F8FAFC",      
    lightGray: "94A3B8",  
    panelBg: "1E293B",    
    panelBorder: "334155", 
    orange: "FB923C",     
    blue: "3B82F6"        
};

// Common Title Master for all content slides
pptx.defineSlideMaster({
  title: "DARK_MASTER",
  background: { color: c.bg },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.05, fill: { color: c.mint } } },
    { text: { text: "TensPilot+ Smart Telemetry Ecosystem", options: { x: 0.5, y: 5.3, w: 4, h: 0.3, color: c.lightGray, fontSize: 10 } } },
    { text: { text: "CODET Project Presentation", options: { x: 8.8, y: 5.3, w: 4, h: 0.3, align: "right", color: c.lightGray, fontSize: 10 } } }
  ]
});

const addContentTitle = (slide, text) => {
    slide.addText(text, { x: 0.5, y: 0.3, w: 9.0, h: 0.6, fontFace: "Calibri", fontSize: 32, bold: true, color: c.mint, align: "left", valign: "middle" });
};

const addPlaceholder = (slide, x, y, w, h, text) => {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: c.panelBg }, line: { color: c.panelBorder, width: 1 }, rectRadius: 0.1 });
  slide.addText(text, { x, y, w, h, fontSize: 14, color: c.lightGray, align: "center", valign: "middle" });
};

const addImage = (slide, x, y, w, h, path) => {
  slide.addImage({ path: path, x: x, y: y, w: w, h: h, sizing: { type: "contain", w: w, h: h } });
};

// Image Paths
const img_active = "C:/Users/user/.gemini/antigravity/brain/654d5fca-da82-411d-9603-635f30f85081/media__1780910364340.png";
const img_summary = "C:/Users/user/.gemini/antigravity/brain/654d5fca-da82-411d-9603-635f30f85081/media__1780910364350.png";
const img_chat = "C:/Users/user/.gemini/antigravity/brain/654d5fca-da82-411d-9603-635f30f85081/media__1780910364353.png";
const img_home = "C:/Users/user/.gemini/antigravity/brain/654d5fca-da82-411d-9603-635f30f85081/media__1780910364365.jpg";
const img_profile = "C:/Users/user/.gemini/antigravity/brain/654d5fca-da82-411d-9603-635f30f85081/media__1780910364858.png";

// --- SLIDE 1: TITLE SLIDE ---
let slide1 = pptx.addSlide({ masterName: "DARK_MASTER" });
slide1.addText("TensPilot+", { x: 0.5, y: 2.0, w: 9, h: 1, fontFace: "Calibri", fontSize: 60, bold: true, color: c.mint, align: "center" });
slide1.addText("Design of a Dual-Mode TENS Device", { x: 0.5, y: 3.1, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 28, color: c.white, align: "center" });
slide1.addText("with a Companion Web Application", { x: 0.5, y: 3.65, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 20, color: c.lightGray, align: "center", italic: true });

// --- SLIDE 2: PRESENTATION OUTLINE ---
let slide2 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide2, "Presentation Outline");
slide2.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 2.8, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide2.addText("Hardware", { x: 0.5, y: 1.5, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.mint, align: "center" });
slide2.addText("• The Problem\n• Core Device Design\n• Two Therapy Modes\n• Testing & Validation", { x: 0.7, y: 2.2, w: 2.4, h: 2.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 20 });

slide2.addShape(pptx.ShapeType.roundRect, { x: 3.6, y: 1.3, w: 2.8, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide2.addText("Software", { x: 3.6, y: 1.5, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.blue, align: "center" });
slide2.addText("• Patient Application\n• Cloud Synchronization\n• Doctor Dashboard\n• Gemini AI Assistant", { x: 3.8, y: 2.2, w: 2.4, h: 2.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 20 });

slide2.addShape(pptx.ShapeType.roundRect, { x: 6.7, y: 1.3, w: 2.8, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide2.addText("Impact", { x: 6.7, y: 1.5, w: 2.8, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.orange, align: "center" });
slide2.addText("• Market Comparison\n• Addressing SDGs\n• Accessibility\n• Conclusion", { x: 6.9, y: 2.2, w: 2.4, h: 2.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 20 });

// --- SLIDE 3: PROBLEM & MOTIVATION ---
let slide3 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide3, "1. The Problem & Our Solution");
slide3.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide3.addText("The Problem", { x: 0.8, y: 1.5, w: 3.7, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.orange });
slide3.addText("• Standard TENS machines are \"dumb\" hardware.\n• No tracking of pulse width, frequency, or intensity.\n• Reliance on unreliable paper diaries.\n• Doctors have zero visibility into home therapy.", { x: 0.8, y: 2.2, w: 3.7, h: 2.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 20 });
slide3.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide3.addText("Our Solution", { x: 5.5, y: 1.5, w: 3.7, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.blue });
slide3.addText("A low-cost, locally developed TENS device integrated with intelligent monitoring software to bridge the gap between home and hospital. Transforming qualitative guessing into quantitative data.", { x: 5.5, y: 2.2, w: 3.7, h: 2.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 20 });

// --- SLIDE 4: HARDWARE DESIGN ---
let slide4 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide4, "2. Hardware Design & Testing");
addPlaceholder(slide4, 0.5, 1.3, 4.5, 3.6, "[ Insert Circuit / Prototype / Testing Image Here ]");
slide4.addText("Internal Components", { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.white });
slide4.addText("• Microcontroller Unit (Arduino Uno)\n• Battery Supply (5V Power Bank)\n• L298N H-Bridge Driver\n• Pulse Generation Circuit\n• Hardware Safety Features", { x: 5.2, y: 1.8, w: 4.3, h: 1.5, fontFace: "Calibri", fontSize: 16, color: c.lightGray, lineSpacing: 15 });
slide4.addText("Operational Capabilities", { x: 5.2, y: 3.5, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint });
slide4.addText("• Tested on 12 Volunteers\n• Frequency (1–120 Hz) & Pulse Width Control\n• Intensity (mA) Control\n• Portable Operation (4+ Hours)", { x: 5.2, y: 4.0, w: 4.3, h: 1.0, fontFace: "Calibri", fontSize: 16, color: c.white, lineSpacing: 15 });

// --- SLIDE 5: SOFTWARE ECOSYSTEM (PATIENT) ---
let slide5 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide5, "3. Ecosystem: Patient Application");
addImage(slide5, 0.5, 1.1, 2.0, 3.8, img_home);
addImage(slide5, 2.6, 1.1, 2.0, 3.8, img_active);
addImage(slide5, 4.7, 1.1, 2.0, 3.8, img_summary);
slide5.addText("App Features", { x: 7.0, y: 1.5, w: 2.5, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.mint });
slide5.addText("• Intuitive Setup\n\n• Live Logging\n\n• Pain Tracking Algorithm\n\n• Therapy Suggestions\n\n• Offline Access (PWA)", { x: 7.0, y: 2.2, w: 2.5, h: 2.5, fontFace: "Calibri", fontSize: 15, color: c.white });

// --- SLIDE 6: SOFTWARE ECOSYSTEM (DOCTOR) ---
let slide6 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide6, "4. Ecosystem: Cloud Sync & Monitoring");
addImage(slide6, 0.5, 1.1, 5.5, 3.8, img_profile);
slide6.addText("Clinical Tools", { x: 6.3, y: 1.5, w: 3.0, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.mint });
slide6.addText("• Secure Cloud Synchronization\n\n• Direct Link to Doctor\n\n• Track Global Compliance\n\n• Monitor Effectiveness\n\n• Adjust Therapy Plans", { x: 6.3, y: 2.2, w: 3.0, h: 2.5, fontFace: "Calibri", fontSize: 16, color: c.white });

// --- SLIDE 7: AI INTEGRATION ---
let slide7 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide7, "5. AI Integration: Gemini Virtual Assistant");
addImage(slide7, 0.5, 1.1, 5.0, 3.8, img_chat);
slide7.addText("Gemini-Powered Capabilities", { x: 5.8, y: 1.5, w: 3.7, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.white });
slide7.addText("• Recommends electrode placement based on pain type.\n• Provides therapy guidance 24/7.", { x: 5.8, y: 2.1, w: 3.7, h: 1.0, fontFace: "Calibri", fontSize: 16, color: c.lightGray, lineSpacing: 15 });
slide7.addText("Key Benefits", { x: 5.8, y: 3.2, w: 3.7, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.mint });
slide7.addText("• Reduces patient misinformation.\n• Improves therapy adherence and confidence.", { x: 5.8, y: 3.8, w: 3.7, h: 1.0, fontFace: "Calibri", fontSize: 16, color: c.lightGray, lineSpacing: 15 });

// --- SLIDE 8: TWO THERAPY MODES ---
let slide8 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide8, "6. Two Therapy Modes");
slide8.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide8.addText("CONVENTIONAL MODE", { x: 0.5, y: 1.5, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.orange, align: "center" });
slide8.addText("20–120 Hz", { x: 0.5, y: 2.0, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 24, bold: true, color: c.white, align: "center" });
slide8.addText("Fast pain relief (10–20 minutes)\n\nFor acute pain & muscle soreness\n\nSmooth tingling sensation", { x: 0.5, y: 2.6, w: 4.3, h: 1.5, fontFace: "Calibri", fontSize: 16, color: c.lightGray, align: "center", lineSpacing: 15 });

slide8.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide8.addText("ACUPUNCTURE-LIKE MODE", { x: 5.2, y: 1.5, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.mint, align: "center" });
slide8.addText("1–10 Hz", { x: 5.2, y: 2.0, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 24, bold: true, color: c.white, align: "center" });
slide8.addText("Longer relief (90–180 minutes)\n\nFor chronic & neuropathic pain\n\nRhythmic tapping with contractions", { x: 5.2, y: 2.6, w: 4.3, h: 1.5, fontFace: "Calibri", fontSize: 16, color: c.lightGray, align: "center", lineSpacing: 15 });

// --- SLIDE 9: MARKET COMPARISON ---
let slide9 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide9, "7. Innovative Edge & Market Comparison");
slide9.addTable([
  [ { text: "Feature", options: { bold: true, color: c.bg, fill: c.mint } }, { text: "Imported Smart TENS", options: { bold: true, color: c.white, fill: c.panelBg } }, { text: "TensPilot+", options: { bold: true, color: c.bg, fill: c.mint } } ],
  [ { text: "Cost", options: { color: c.white, fill: c.panelBg } }, { text: "Highly Expensive", options: { color: c.orange, align: "center", fill: c.bg } }, { text: "Low Cost & Accessible", options: { color: c.mint, bold: true, align: "center", fill: c.bg } } ],
  [ { text: "Monitoring", options: { color: c.white, fill: c.panelBg } }, { text: "Limited / Bluetooth Only", options: { color: c.lightGray, align: "center", fill: c.panelBg } }, { text: "Global Cloud Telemetry", options: { color: c.mint, bold: true, align: "center", fill: c.panelBg } } ],
  [ { text: "AI Guidance", options: { color: c.white, fill: c.panelBg } }, { text: "None", options: { color: c.orange, align: "center", fill: c.bg } }, { text: "Gemini Integrated", options: { color: c.mint, bold: true, align: "center", fill: c.bg } } ],
  [ { text: "Nigeria-Focused", options: { color: c.white, fill: c.panelBg } }, { text: "No", options: { color: c.orange, align: "center", fill: c.panelBg } }, { text: "Yes (Offline/PWA)", options: { color: c.mint, bold: true, align: "center", fill: c.panelBg } } ]
], { x: 0.5, y: 1.5, w: 9, h: 3.0, fontSize: 16, border: { type: "solid", pt: 1, color: c.panelBorder }, rowH: [0.6, 0.6, 0.6, 0.6, 0.6] });

// --- SLIDE 10: SDGs ---
let slide10 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide10, "8. Addressing Sustainable Development Goals");
slide10.addText("SDG 3: Good Health", { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.mint });
slide10.addText("Improved pain management & better quality of life.", { x: 0.5, y: 1.8, w: 4.3, h: 1.0, fontFace: "Calibri", fontSize: 16, color: c.white });
slide10.addText("SDG 9: Industry & Innovation", { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.blue });
slide10.addText("AI-enabled healthcare innovation through local hardware.", { x: 5.2, y: 1.8, w: 4.3, h: 1.0, fontFace: "Calibri", fontSize: 16, color: c.white });
slide10.addText("SDG 10: Reduced Inequalities", { x: 0.5, y: 3.3, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.orange });
slide10.addText("Affordable care for underserved populations & rural areas.", { x: 0.5, y: 3.8, w: 4.3, h: 1.0, fontFace: "Calibri", fontSize: 16, color: c.white });
slide10.addText("SDG 17: Partnerships", { x: 5.2, y: 3.3, w: 4.3, h: 0.5, fontFace: "Calibri", fontSize: 20, bold: true, color: c.mint });
slide10.addText("Connects patients and clinicians digitally across regions.", { x: 5.2, y: 3.8, w: 4.3, h: 1.0, fontFace: "Calibri", fontSize: 16, color: c.white });

// --- SLIDE 11: IMPACT & ACCESSIBILITY ---
let slide11 = pptx.addSlide({ masterName: "DARK_MASTER" });
addContentTitle(slide11, "9. Impact & Accessibility");
slide11.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide11.addText("Designed for Nigeria", { x: 0.8, y: 1.5, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.mint });
slide11.addText("✅ Works Offline via Service Workers\n✅ Runs on low-end Android phones\n✅ Reduces transportation costs\n✅ Suitable for rural healthcare", { x: 0.8, y: 2.2, w: 3.7, h: 2.0, fontFace: "Calibri", fontSize: 18, color: c.white, lineSpacing: 15 });
slide11.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: c.panelBg }, rectRadius: 0.1 });
slide11.addText("Vulnerable Demographics", { x: 5.5, y: 1.5, w: 4, h: 0.5, fontFace: "Calibri", fontSize: 22, bold: true, color: c.blue });
slide11.addText("• Women: Chronic pelvic & menstrual pain.\n• Children: Non-drug, safe pain relief.\n• Elderly: Arthritis care with reduced clinic visits.", { x: 5.5, y: 2.2, w: 3.7, h: 2.0, fontFace: "Calibri", fontSize: 18, color: c.white, lineSpacing: 15 });

// --- SLIDE 12: THANK YOU ---
let slide12 = pptx.addSlide({ masterName: "DARK_MASTER" });
slide12.addText("Thank You For Listening!", { x: 0.5, y: 2.0, w: 9, h: 1, fontFace: "Calibri", fontSize: 52, bold: true, color: c.mint, align: "center" });
slide12.addText("TensPilot+", { x: 0.5, y: 3.0, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 24, color: c.white, align: "center" });
slide12.addText("Any Questions?", { x: 0.5, y: 3.6, w: 9, h: 0.5, fontFace: "Calibri", fontSize: 20, color: c.lightGray, align: "center", italic: true });

pptx.writeFile({ fileName: "TensPilot_Final_DarkTheme.pptx" }).then(() => {
    console.log("PPTX created successfully.");
});
