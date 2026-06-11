const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();

pptx.layout = 'LAYOUT_16x9';

// Define a highly visual Master Slide
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "0B1120" }, // Deep rich slate/black
  objects: [
    // Top gradient-style sleek accent
    { rect: { x: 0, y: 0, w: "100%", h: 0.15, fill: { color: "10B981" } } }, // Emerald green
    { rect: { x: 0, y: 0.15, w: "100%", h: 0.05, fill: { color: "3B82F6" } } }, // Electric blue
    // Footer
    { text: { text: "TENSPILOT+ SMART TELEMETRY", options: { x: 0.5, y: 5.2, w: 5, h: 0.5, color: "334155", fontSize: 10, bold: true } } },
    { text: { text: "CODET Engineering Project Presentation", options: { x: 7.0, y: 5.2, w: 3.0, h: 0.5, color: "334155", fontSize: 10, align: "right" } } }
  ]
});

// Helper function to create stylish Image Placeholders
const addPlaceholder = (slide, x, y, w, h, text) => {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: "1E293B" }, line: { color: "64748B", width: 2, dashType: "dash" }, rectRadius: 0.1 });
  slide.addText(text, { x, y, w, h, fontSize: 14, color: "94A3B8", align: "center", valign: "middle" });
};

// --- Slide 1: Title Slide ---
let slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide1.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.8, w: 9, h: 2.2, fill: { color: "0F172A" }, rectRadius: 0.1, line: { color: "1E293B", width: 1 } });
slide1.addText("TensPilot+", { x: 0.5, y: 0.9, w: 9, h: 1, fontSize: 60, bold: true, color: "10B981", align: "center", shadow: { type: "outer", color: "000000", blur: 10, offset: 4, angle: 45 } });
slide1.addText("Smart Telemetry-Enabled TENS System", { x: 0.5, y: 1.8, w: 9, h: 0.6, fontSize: 24, color: "F8FAFC", align: "center" });
slide1.addText("Improving Access to Safe, Intelligent, and Remote Electrotherapy for Nigerians", { x: 0.5, y: 2.4, w: 9, h: 0.4, fontSize: 14, color: "3B82F6", align: "center", italic: true });

addPlaceholder(slide1, 1.2, 3.2, 3.5, 1.8, "[ Insert Hardware Photo ]");
addPlaceholder(slide1, 5.3, 3.2, 3.5, 1.8, "[ Insert App Screenshot ]");

// --- Slide 2: Problem & Motivation ---
let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide2.addText("1. Problem & Motivation", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });

// Problem Box
slide2.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: "0F172A" }, line: { color: "EF4444", width: 2 }, rectRadius: 0.1 });
slide2.addText("The Problem", { x: 0.7, y: 1.4, w: 4, h: 0.5, fontSize: 22, bold: true, color: "EF4444" });
slide2.addText("• Patients over-depend on drugs.\n• Frequent, expensive hospital visits.\n• Standard TENS machines are \"dumb\" (no tracking).\n• Doctors have zero visibility into home therapy.", { x: 0.7, y: 2.0, w: 4, h: 2.5, fontSize: 16, color: "CBD5E1" });

// Motivation Box
slide2.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: "0F172A" }, line: { color: "3B82F6", width: 2 }, rectRadius: 0.1 });
slide2.addText("Our Solution", { x: 5.4, y: 1.4, w: 4, h: 0.5, fontSize: 22, bold: true, color: "3B82F6" });
slide2.addText("A low-cost, locally developed TENS device integrated with intelligent monitoring software to bridge the gap between home and hospital.", { x: 5.4, y: 2.0, w: 3.9, h: 2.5, fontSize: 18, color: "F8FAFC" });

// --- Slide 3: Hardware Design ---
let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide3.addText("2. Hardware Design: The Core Device", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });
addPlaceholder(slide3, 0.5, 1.3, 4.5, 3.6, "[ Insert Circuit / Prototype Image Here ]");

slide3.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.6, fill: { color: "0F172A" }, rectRadius: 0.1 });
slide3.addText("Internal Components", { x: 5.4, y: 1.4, w: 4, h: 0.5, fontSize: 22, bold: true, color: "F8FAFC" });
slide3.addText("• Microcontroller Unit (Arduino)\n• Battery Supply\n• Electrodes\n• Pulse Generation Circuit", { x: 5.4, y: 2.0, w: 4, h: 1.5, fontSize: 16, color: "CBD5E1" });
slide3.addText("How it Works", { x: 5.4, y: 3.5, w: 4, h: 0.5, fontSize: 20, bold: true, color: "3B82F6" });
slide3.addText("Generates controlled electrical pulses to stimulate nerves.", { x: 5.4, y: 4.0, w: 4, h: 0.8, fontSize: 14, color: "94A3B8" });

// --- Slide 4: Hardware Demonstration ---
let slide4 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide4.addText("3. Hardware Demonstration", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });
addPlaceholder(slide4, 0.5, 1.3, 5.0, 3.6, "[ Insert Patient Testing / Electrode Placement Photo ]");

slide4.addShape(pptx.ShapeType.roundRect, { x: 5.8, y: 1.3, w: 3.7, h: 3.6, fill: { color: "0F172A" }, rectRadius: 0.1 });
slide4.addText("Capabilities", { x: 6.0, y: 1.5, w: 3.3, h: 0.5, fontSize: 22, bold: true, color: "F8FAFC" });
slide4.addText("• Frequency (Hz) Control\n\n• Pulse Width (µs) Control\n\n• Intensity (mA) Control\n\n• Portable Operation", { x: 6.0, y: 2.2, w: 3.3, h: 2.5, fontSize: 18, color: "CBD5E1" });

// --- Slide 5: Software Ecosystem (Patient) ---
let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide5.addText("4. Ecosystem: Patient Application", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });
addPlaceholder(slide5, 0.5, 1.3, 3.0, 3.6, "[ Screenshot: App Home Page ]");
addPlaceholder(slide5, 3.7, 1.3, 3.0, 3.6, "[ Screenshot: Session Logging ]");

slide5.addShape(pptx.ShapeType.roundRect, { x: 6.9, y: 1.3, w: 2.9, h: 3.6, fill: { color: "0F172A" }, rectRadius: 0.1 });
slide5.addText("App Features", { x: 7.1, y: 1.5, w: 2.5, h: 0.5, fontSize: 20, bold: true, color: "3B82F6" });
slide5.addText("• Live Logging\n\n• Pain Tracking Algorithm\n\n• Therapy Suggestions\n\n• Offline Access (PWA)", { x: 7.1, y: 2.2, w: 2.5, h: 2.5, fontSize: 16, color: "CBD5E1" });

// --- Slide 6: Software Ecosystem (Doctor) ---
let slide6 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide6.addText("5. Ecosystem: Doctor Dashboard", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });
addPlaceholder(slide6, 0.5, 1.3, 5.5, 3.6, "[ Screenshot: Doctor Dashboard Analytics ]");

slide6.addShape(pptx.ShapeType.roundRect, { x: 6.2, y: 1.3, w: 3.3, h: 3.6, fill: { color: "0F172A" }, rectRadius: 0.1 });
slide6.addText("Clinical Tools", { x: 6.4, y: 1.5, w: 2.9, h: 0.5, fontSize: 20, bold: true, color: "3B82F6" });
slide6.addText("• Track Global Compliance\n\n• Monitor Effectiveness\n\n• Review Pain Progression\n\n• Adjust Therapy Plans", { x: 6.4, y: 2.2, w: 2.9, h: 2.5, fontSize: 16, color: "CBD5E1" });

// --- Slide 7: AI Integration ---
let slide7 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide7.addText("6. AI Integration: Gemini Virtual Assistant", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });
addPlaceholder(slide7, 0.5, 1.3, 4.0, 3.6, "[ Screenshot: Gemini AI Chat ]");

slide7.addShape(pptx.ShapeType.roundRect, { x: 4.8, y: 1.3, w: 4.7, h: 3.6, fill: { color: "0F172A" }, rectRadius: 0.1 });
slide7.addText("Gemini-Powered Capabilities", { x: 5.0, y: 1.5, w: 4.3, h: 0.5, fontSize: 20, bold: true, color: "F8FAFC" });
slide7.addText("• Recommends electrode placement based on pain type.\n• Provides therapy guidance 24/7.", { x: 5.0, y: 2.0, w: 4.3, h: 1.0, fontSize: 16, color: "CBD5E1" });

slide7.addText("Key Benefits", { x: 5.0, y: 3.2, w: 4.3, h: 0.5, fontSize: 20, bold: true, color: "10B981" });
slide7.addText("• Reduces patient misinformation.\n• Improves therapy adherence and confidence.", { x: 5.0, y: 3.8, w: 4.3, h: 1.0, fontSize: 16, color: "CBD5E1" });

// --- Slide 8: Market Comparison (Combined 6 & 13) ---
let slide8 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide8.addText("7. Innovative Edge & Market Comparison", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });

slide8.addTable([
  [ { text: "Feature", options: { bold: true, color: "0F172A", fill: "3B82F6" } }, { text: "Imported Smart TENS", options: { bold: true, color: "F8FAFC", fill: "1E293B" } }, { text: "TensPilot+", options: { bold: true, color: "0F172A", fill: "10B981" } } ],
  [ { text: "Cost", options: { color: "F8FAFC" } }, { text: "Highly Expensive", options: { color: "EF4444", align: "center" } }, { text: "Low Cost & Accessible", options: { color: "10B981", bold: true, align: "center" } } ],
  [ { text: "Monitoring", options: { color: "F8FAFC" } }, { text: "Limited / Bluetooth Only", options: { color: "EAB308", align: "center" } }, { text: "Global Cloud Telemetry", options: { color: "10B981", bold: true, align: "center" } } ],
  [ { text: "AI Guidance", options: { color: "F8FAFC" } }, { text: "None", options: { color: "EF4444", align: "center" } }, { text: "Gemini Integrated", options: { color: "10B981", bold: true, align: "center" } } ],
  [ { text: "Nigeria-Focused", options: { color: "F8FAFC" } }, { text: "No", options: { color: "EF4444", align: "center" } }, { text: "Yes (Offline/PWA)", options: { color: "10B981", bold: true, align: "center" } } ]
], { x: 0.5, y: 1.5, w: 9, h: 3.0, fontSize: 16, border: { type: "solid", pt: 1, color: "334155" }, rowH: [0.6, 0.6, 0.6, 0.6, 0.6] });

// --- Slide 9: SDGs ---
let slide9 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide9.addText("8. Sustainable Development Goals", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });

slide9.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 1.7, fill: { color: "0F172A" }, line: { color: "4ADE80", width: 2 }, rectRadius: 0.1 });
slide9.addText("SDG 3: Good Health", { x: 0.7, y: 1.4, w: 4, h: 0.5, fontSize: 20, bold: true, color: "4ADE80" });
slide9.addText("Improved pain management & better quality of life.", { x: 0.7, y: 1.9, w: 4, h: 1.0, fontSize: 16, color: "F8FAFC" });

slide9.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 1.7, fill: { color: "0F172A" }, line: { color: "F97316", width: 2 }, rectRadius: 0.1 });
slide9.addText("SDG 9: Industry & Innovation", { x: 5.4, y: 1.4, w: 4, h: 0.5, fontSize: 20, bold: true, color: "F97316" });
slide9.addText("AI-enabled healthcare innovation through local hardware.", { x: 5.4, y: 1.9, w: 4, h: 1.0, fontSize: 16, color: "F8FAFC" });

slide9.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 3.3, w: 4.3, h: 1.7, fill: { color: "0F172A" }, line: { color: "EC4899", width: 2 }, rectRadius: 0.1 });
slide9.addText("SDG 10: Reduced Inequalities", { x: 0.7, y: 3.4, w: 4, h: 0.5, fontSize: 20, bold: true, color: "EC4899" });
slide9.addText("Affordable care for underserved populations & rural areas.", { x: 0.7, y: 3.9, w: 4, h: 1.0, fontSize: 16, color: "F8FAFC" });

slide9.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 3.3, w: 4.3, h: 1.7, fill: { color: "0F172A" }, line: { color: "3B82F6", width: 2 }, rectRadius: 0.1 });
slide9.addText("SDG 17: Partnerships", { x: 5.4, y: 3.4, w: 4, h: 0.5, fontSize: 20, bold: true, color: "3B82F6" });
slide9.addText("Connects patients and clinicians digitally.", { x: 5.4, y: 3.9, w: 4, h: 1.0, fontSize: 16, color: "F8FAFC" });

// --- Slide 10: Impact (Combined 11 & 12) ---
let slide10 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide10.addText("9. Impact & Accessibility", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });

slide10.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: "0F172A" }, rectRadius: 0.1, line: { color: "3B82F6", width: 2 } });
slide10.addText("Designed for Nigeria", { x: 0.7, y: 1.5, w: 4, h: 0.5, fontSize: 22, bold: true, color: "3B82F6" });
slide10.addText("✅ Works Offline via Service Workers\n✅ Runs on low-end Android phones\n✅ Reduces transportation costs\n✅ Suitable for rural healthcare", { x: 0.7, y: 2.2, w: 4, h: 2.5, fontSize: 18, color: "F8FAFC" });

slide10.addShape(pptx.ShapeType.roundRect, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: "0F172A" }, rectRadius: 0.1, line: { color: "EC4899", width: 2 } });
slide10.addText("Vulnerable Demographics", { x: 5.4, y: 1.5, w: 4, h: 0.5, fontSize: 22, bold: true, color: "EC4899" });
slide10.addText("• Women: Chronic pelvic & menstrual pain.\n• Children: Non-drug, safe pain relief.\n• Elderly: Arthritis care with reduced clinic visits.", { x: 5.4, y: 2.2, w: 4, h: 2.5, fontSize: 18, color: "CBD5E1" });

// --- Slide 11: Future Expansion ---
let slide11 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide11.addText("10. Future Expansion Roadmap", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "10B981" });

slide11.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 1.5, w: 8.5, h: 0.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide11.addText("Phase 1: Standalone TENS hardware", { x: 0.5, y: 1.5, w: 8.5, h: 0.6, fontSize: 18, color: "CBD5E1", align: "center" });

slide11.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 2.2, w: 8.5, h: 0.6, fill: { color: "3B82F6" }, rectRadius: 0.1 });
slide11.addText("Phase 2: Telemetry software (Current Phase)", { x: 0.5, y: 2.2, w: 8.5, h: 0.6, fontSize: 18, color: "0F172A", bold: true, align: "center" });

slide11.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 2.9, w: 8.5, h: 0.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide11.addText("Phase 3: Bluetooth-enabled hardware integration", { x: 0.5, y: 2.9, w: 8.5, h: 0.6, fontSize: 18, color: "CBD5E1", align: "center" });

slide11.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 3.6, w: 8.5, h: 0.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide11.addText("Phase 4: Official Hospital deployment", { x: 0.5, y: 3.6, w: 8.5, h: 0.6, fontSize: 18, color: "CBD5E1", align: "center" });

slide11.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 4.3, w: 8.5, h: 0.6, fill: { color: "10B981" }, rectRadius: 0.1 });
slide11.addText("Phase 5: National pain-management platform", { x: 0.5, y: 4.3, w: 8.5, h: 0.6, fontSize: 18, color: "0F172A", bold: true, align: "center" });

// --- Slide 12: Conclusion ---
let slide12 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide12.addShape(pptx.ShapeType.roundRect, { x: 1, y: 1.0, w: 8, h: 3.5, fill: { color: "0F172A" }, line: { color: "3B82F6", width: 2 }, rectRadius: 0.2 });
slide12.addText("TensPilot+", { x: 1, y: 1.2, w: 8, h: 0.8, fontSize: 48, bold: true, color: "10B981", align: "center" });
slide12.addText("A practical, affordable, and intelligent electrotherapy ecosystem that:", { x: 1, y: 1.8, w: 8, h: 0.5, fontSize: 18, color: "F8FAFC", align: "center" });
slide12.addText("• Relieves pain\n• Supports clinicians\n• Empowers patients\n• Reduces healthcare burden", { x: 1, y: 2.3, w: 8, h: 1.2, fontSize: 18, color: "CBD5E1", align: "center", bullet: false });
slide12.addText("\"From Pain Relief to Intelligent Pain Management.\"", { x: 1, y: 3.6, w: 8, h: 0.5, fontSize: 22, color: "3B82F6", bold: true, italic: true, align: "center" });


pptx.writeFile({ fileName: "TensPilot_12Slide_Visual_Presentation.pptx" }).then(() => {
    console.log("PPTX created successfully.");
});
