const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();

pptx.layout = 'LAYOUT_16x9';

// Define a highly visual Master Slide
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: "0B1120" }, // Deep slate background
  objects: [
    // Top sleek accent
    { rect: { x: 0, y: 0, w: "100%", h: 0.1, fill: { color: "10B981" } } }, // Emerald green (Nigerian accent)
    { rect: { x: 0, y: 0.1, w: "100%", h: 0.05, fill: { color: "3B82F6" } } }, // Blue accent
    // Footer
    { text: { text: "TENSPILOT+ SMART TELEMETRY", options: { x: 0.5, y: 5.2, w: 5, h: 0.5, color: "475569", fontSize: 10, bold: true } } },
    { text: { text: "CODET Engineering Project Presentation", options: { x: 7.0, y: 5.2, w: 3.0, h: 0.5, color: "475569", fontSize: 10, align: "right" } } }
  ]
});

// Helper function to create Image Placeholders
const addPlaceholder = (slide, x, y, w, h, text) => {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: "1E293B" }, line: { color: "64748B", width: 2, dashType: "dash" } });
  slide.addText(text, { x, y, w, h, fontSize: 14, color: "94A3B8", align: "center", valign: "middle" });
};

// Slide 1: Title Slide
let slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide1.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.0, w: 9, h: 2.5, fill: { color: "1E293B" }, rectRadius: 0.2 });
slide1.addText("TensPilot+", { x: 0.5, y: 1.2, w: 9, h: 1, fontSize: 55, bold: true, color: "10B981", align: "center", shadow: { type: "outer", color: "000000", blur: 5, offset: 3, angle: 45 } });
slide1.addText("Smart Telemetry-Enabled TENS System for Affordable Pain Management", { x: 0.5, y: 2.2, w: 9, h: 0.6, fontSize: 22, color: "F8FAFC", align: "center" });
slide1.addText("Theme: Improving Access to Safe, Intelligent, and Remote Electrotherapy for Nigerians", { x: 0.5, y: 2.8, w: 9, h: 0.5, fontSize: 14, color: "94A3B8", align: "center", italic: true });
addPlaceholder(slide1, 1, 3.8, 3.5, 1.3, "[ Hardware Photo ]");
addPlaceholder(slide1, 5.5, 3.8, 3.5, 1.3, "[ App Screenshot ]");

// Slide 2: The Problem
let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide2.addText("The Problem: Pain Management Challenges in Nigeria", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide2.addText([
  { text: "Many patients suffer from:\n", options: { bold: true, color: "F8FAFC", fontSize: 18 } },
  { text: "• Chronic pain & Musculoskeletal disorders\n• Cancer-related & Post-operative pain\n\n", options: { color: "CBD5E1", fontSize: 16 } },
  { text: "Current Challenges:\n", options: { bold: true, color: "EF4444", fontSize: 18 } },
  { text: "• Over-dependence on pain medication (drugs)\n• Frequent, expensive hospital visits\n• Poor monitoring of home therapy\n• No feedback loop to clinicians", options: { color: "CBD5E1", fontSize: 16 } }
], { x: 0.5, y: 1.5, w: 5, h: 3.5, bullet: false });
addPlaceholder(slide2, 6, 1.5, 3.5, 3.5, "[ Picture of patient with pain / Statistics on chronic pain ]");

// Slide 3: Why We Built This Device
let slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide3.addText("Motivation: Why We Built This Device", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 4.2, h: 3.2, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide3.addText("Traditional TENS Machines:", { x: 0.7, y: 1.7, w: 3.8, h: 0.5, fontSize: 20, bold: true, color: "EF4444" });
slide3.addText("❌ Work in isolation\n❌ No treatment records\n❌ No remote monitoring\n❌ No clinician feedback\n❌ No guidance for users", { x: 0.7, y: 2.3, w: 3.8, h: 2, fontSize: 16, color: "CBD5E1", bullet: false });

slide3.addShape(pptx.ShapeType.rect, { x: 5.3, y: 1.5, w: 4.2, h: 3.2, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide3.addText("Our Solution:", { x: 5.5, y: 1.7, w: 3.8, h: 0.5, fontSize: 20, bold: true, color: "3B82F6" });
slide3.addText("A low-cost, locally developed TENS device integrated with intelligent monitoring software to bridge the gap between home and hospital.", { x: 5.5, y: 2.3, w: 3.8, h: 2, fontSize: 18, color: "F8FAFC" });

// Slide 4: Hardware Design
let slide4 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide4.addText("Hardware Design: The Core Device", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
addPlaceholder(slide4, 0.5, 1.5, 4.5, 3.5, "[ Insert Circuit / Prototype / Components Image Here ]");
slide4.addText([
  { text: "Internal Components:\n", options: { bold: true, color: "F8FAFC", fontSize: 20 } },
  { text: "• Microcontroller Unit (Arduino)\n• Battery Supply\n• Electrodes\n• Pulse Generation Circuit\n• Hardware Safety Features\n\n", options: { color: "CBD5E1", fontSize: 16 } },
  { text: "How it Works:\n", options: { bold: true, color: "3B82F6", fontSize: 18 } },
  { text: "Generates controlled electrical pulses that stimulate nerves and reduce pain without medication.", options: { color: "94A3B8", fontSize: 16 } }
], { x: 5.2, y: 1.5, w: 4.3, h: 3.5, bullet: false });

// Slide 5: Hardware Demonstration
let slide5 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide5.addText("Hardware Demonstration: Device in Action", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
addPlaceholder(slide5, 0.5, 1.5, 4.5, 3.5, "[ Insert Patient Testing / Electrode Placement Photo Here ]");
slide5.addText([
  { text: "Operational Capabilities:\n", options: { bold: true, color: "F8FAFC", fontSize: 20 } },
  { text: "• Frequency (Hz) Control\n• Pulse Width (µs) Control\n• Intensity (mA) Adjustment\n• Portable Battery Operation", options: { color: "CBD5E1", fontSize: 18 } }
], { x: 5.2, y: 1.5, w: 4.3, h: 3.5, bullet: false });

// Slide 6: Innovative Features
let slide6 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide6.addText("Innovative Features: What Makes TensPilot+ Different?", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide6.addTable([
  [ { text: "Feature", options: { bold: true, color: "F8FAFC", fill: "3B82F6" } }, { text: "Traditional TENS", options: { bold: true, color: "F8FAFC", fill: "1E293B" } }, { text: "TensPilot+", options: { bold: true, color: "F8FAFC", fill: "10B981" } } ],
  [ { text: "Core Function", options: { color: "F8FAFC" } }, { text: "Pain relief only", options: { color: "94A3B8" } }, { text: "Pain relief + Monitoring", options: { color: "10B981", bold: true } } ],
  [ { text: "Data Storage", options: { color: "F8FAFC" } }, { text: "No data storage", options: { color: "94A3B8" } }, { text: "Cloud telemetry records", options: { color: "10B981", bold: true } } ],
  [ { text: "Clinical Access", options: { color: "F8FAFC" } }, { text: "No clinician access", options: { color: "94A3B8" } }, { text: "Live Doctor Dashboard", options: { color: "10B981", bold: true } } ],
  [ { text: "Guidance", options: { color: "F8FAFC" } }, { text: "None", options: { color: "94A3B8" } }, { text: "AI Assistant", options: { color: "10B981", bold: true } } ],
  [ { text: "Care Model", options: { color: "F8FAFC" } }, { text: "Hospital-dependent", options: { color: "94A3B8" } }, { text: "Smart Home-based care", options: { color: "10B981", bold: true } } ]
], { x: 0.5, y: 1.5, w: 9, h: 2.5, fontSize: 16, border: { type: "solid", pt: 1, color: "334155" }, rowH: [0.5, 0.4, 0.4, 0.4, 0.4, 0.4] });
slide6.addText("Highlights: Real-time telemetry, AI physiotherapy assistant, Remote monitoring, Treatment analytics.", { x: 0.5, y: 4.3, w: 9, h: 0.5, fontSize: 14, color: "3B82F6", bold: true, align: "center" });

// Slide 7: Software Ecosystem
let slide7 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide7.addText("Software Ecosystem: Patient Application", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
addPlaceholder(slide7, 0.5, 1.5, 3.0, 3.5, "[ Screenshot: App Home Page ]");
addPlaceholder(slide7, 3.7, 1.5, 3.0, 3.5, "[ Screenshot: Session Logging ]");
slide7.addText([
  { text: "App Features:\n", options: { bold: true, color: "3B82F6", fontSize: 20 } },
  { text: "• Live Session Recording\n• Pain Tracking Algorithm\n• Treatment Recommendations\n• Offline Functionality (PWA)", options: { color: "CBD5E1", fontSize: 16 } }
], { x: 6.9, y: 1.5, w: 3.0, h: 3.5, bullet: false });

// Slide 8: Doctor Dashboard
let slide8 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide8.addText("Software Ecosystem: Remote Clinical Dashboard", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
addPlaceholder(slide8, 0.5, 1.5, 5.5, 3.5, "[ Screenshot: Doctor Dashboard / Patient Records / Analytics ]");
slide8.addText([
  { text: "Doctors Can:\n", options: { bold: true, color: "3B82F6", fontSize: 20 } },
  { text: "• Track compliance rates globally\n• Monitor treatment effectiveness\n• Review pain progression\n• Adjust remote therapy plans", options: { color: "CBD5E1", fontSize: 18 } }
], { x: 6.2, y: 1.5, w: 3.5, h: 3.5, bullet: false });

// Slide 9: Artificial Intelligence Integration
let slide9 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide9.addText("AI Integration: Virtual Physiotherapy Assistant", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
addPlaceholder(slide9, 0.5, 1.5, 4.0, 3.5, "[ Screenshot: Gemini AI Chat ]");
slide9.addText([
  { text: "Gemini-Powered Capabilities:\n", options: { bold: true, color: "F8FAFC", fontSize: 18 } },
  { text: "• Answers medical & technical questions\n• Recommends electrode placement\n• Provides therapy guidance 24/7\n\n", options: { color: "CBD5E1", fontSize: 16 } },
  { text: "Key Benefits:\n", options: { bold: true, color: "10B981", fontSize: 18 } },
  { text: "• Reduces patient misinformation\n• Improves therapy adherence\n• Enhances patient confidence at home", options: { color: "CBD5E1", fontSize: 16 } }
], { x: 4.8, y: 1.5, w: 4.7, h: 3.5, bullet: false });

// Slide 10: SDGs Addressed
let slide10 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide10.addText("Sustainable Development Goals (SDGs)", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });

slide10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 4.3, h: 1.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide10.addText("SDG 3: Good Health & Well-Being", { x: 0.7, y: 1.6, w: 4, h: 0.4, fontSize: 18, bold: true, color: "4ADE80" });
slide10.addText("Improved pain management & Better quality of life.", { x: 0.7, y: 2.1, w: 4, h: 0.8, fontSize: 14, color: "CBD5E1" });

slide10.addShape(pptx.ShapeType.rect, { x: 5.2, y: 1.5, w: 4.3, h: 1.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide10.addText("SDG 9: Industry, Innovation & Infrastructure", { x: 5.4, y: 1.6, w: 4, h: 0.4, fontSize: 18, bold: true, color: "F97316" });
slide10.addText("AI-enabled healthcare innovation through local hardware.", { x: 5.4, y: 2.1, w: 4, h: 0.8, fontSize: 14, color: "CBD5E1" });

slide10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.4, w: 4.3, h: 1.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide10.addText("SDG 10: Reduced Inequalities", { x: 0.7, y: 3.5, w: 4, h: 0.4, fontSize: 18, bold: true, color: "EC4899" });
slide10.addText("Affordable care for underserved populations and rural areas.", { x: 0.7, y: 4.0, w: 4, h: 0.8, fontSize: 14, color: "CBD5E1" });

slide10.addShape(pptx.ShapeType.rect, { x: 5.2, y: 3.4, w: 4.3, h: 1.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide10.addText("SDG 17: Partnerships for the Goals", { x: 5.4, y: 3.5, w: 4, h: 0.4, fontSize: 18, bold: true, color: "3B82F6" });
slide10.addText("Connects patients and clinicians digitally across the country.", { x: 5.4, y: 4.0, w: 4, h: 0.8, fontSize: 14, color: "CBD5E1" });

// Slide 11: Why It Is Better for Nigerians
let slide11 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide11.addText("Why It Is Better for Nigerians", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide11.addText([
  { text: "Imported systems assume:\n", options: { bold: true, color: "EF4444", fontSize: 20 } },
  { text: "Reliable internet • High-end smartphones • Expensive proprietary hardware\n\n", options: { color: "CBD5E1", fontSize: 16 } },
  { text: "TensPilot+ is Designed for Local Conditions:\n", options: { bold: true, color: "3B82F6", fontSize: 20 } },
  { text: "✅ Low Cost\n✅ Uses existing/local TENS hardware\n✅ Works Offline via Service Workers\n✅ Runs on low-end Android phones via Browser\n✅ Reduces transportation costs for patients\n✅ Suitable for rural healthcare clinics", options: { color: "F8FAFC", fontSize: 18 } }
], { x: 0.5, y: 1.5, w: 9, h: 3.5, bullet: false });

// Slide 12: Benefits for Women, Children & Elderly
let slide12 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide12.addText("Benefits for Vulnerable Demographics", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });

slide12.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 2.8, h: 3.5, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide12.addText("Women", { x: 0.5, y: 1.7, w: 2.8, h: 0.5, fontSize: 22, bold: true, color: "EC4899", align: "center" });
slide12.addText("• Chronic pelvic pain\n• Post-surgical pain\n• Cancer-related pain\n• Menstrual pain management", { x: 0.7, y: 2.4, w: 2.4, h: 2.5, fontSize: 16, color: "CBD5E1" });

slide12.addShape(pptx.ShapeType.rect, { x: 3.6, y: 1.5, w: 2.8, h: 3.5, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide12.addText("Children", { x: 3.6, y: 1.7, w: 2.8, h: 0.5, fontSize: 22, bold: true, color: "3B82F6", align: "center" });
slide12.addText("• Non-drug pain management\n• Reduced medication exposure\n• Home-based monitoring", { x: 3.8, y: 2.4, w: 2.4, h: 2.5, fontSize: 16, color: "CBD5E1" });

slide12.addShape(pptx.ShapeType.rect, { x: 6.7, y: 1.5, w: 2.8, h: 3.5, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide12.addText("Elderly", { x: 6.7, y: 1.7, w: 2.8, h: 0.5, fontSize: 22, bold: true, color: "10B981", align: "center" });
slide12.addText("• Arthritis management\n• Reduced clinic visits\n• Safe, remote clinician oversight", { x: 6.9, y: 2.4, w: 2.4, h: 2.5, fontSize: 16, color: "CBD5E1" });

// Slide 13: Market Comparison
let slide13 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide13.addText("Market Comparison: Competitive Advantage", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });
slide13.addTable([
  [ { text: "Feature", options: { bold: true, color: "F8FAFC", fill: "3B82F6" } }, { text: "Conventional TENS", options: { bold: true, color: "F8FAFC", fill: "1E293B" } }, { text: "Imported Smart TENS", options: { bold: true, color: "F8FAFC", fill: "1E293B" } }, { text: "TensPilot+", options: { bold: true, color: "F8FAFC", fill: "10B981" } } ],
  [ { text: "Low Cost", options: { color: "F8FAFC" } }, { text: "✓", options: { color: "10B981", align: "center" } }, { text: "✗", options: { color: "EF4444", align: "center" } }, { text: "✓", options: { color: "10B981", bold: true, align: "center" } } ],
  [ { text: "Remote Monitoring", options: { color: "F8FAFC" } }, { text: "✗", options: { color: "EF4444", align: "center" } }, { text: "Limited", options: { color: "EAB308", align: "center" } }, { text: "✓", options: { color: "10B981", bold: true, align: "center" } } ],
  [ { text: "AI Guidance", options: { color: "F8FAFC" } }, { text: "✗", options: { color: "EF4444", align: "center" } }, { text: "✗", options: { color: "EF4444", align: "center" } }, { text: "✓", options: { color: "10B981", bold: true, align: "center" } } ],
  [ { text: "Doctor Dashboard", options: { color: "F8FAFC" } }, { text: "✗", options: { color: "EF4444", align: "center" } }, { text: "✗", options: { color: "EF4444", align: "center" } }, { text: "✓", options: { color: "10B981", bold: true, align: "center" } } ],
  [ { text: "Offline Use", options: { color: "F8FAFC" } }, { text: "✓", options: { color: "10B981", align: "center" } }, { text: "Limited", options: { color: "EAB308", align: "center" } }, { text: "✓", options: { color: "10B981", bold: true, align: "center" } } ],
  [ { text: "Nigeria-Focused", options: { color: "F8FAFC" } }, { text: "✗", options: { color: "EF4444", align: "center" } }, { text: "✗", options: { color: "EF4444", align: "center" } }, { text: "✓", options: { color: "10B981", bold: true, align: "center" } } ]
], { x: 0.5, y: 1.5, w: 9, h: 3.2, fontSize: 14, border: { type: "solid", pt: 1, color: "334155" }, rowH: [0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4] });

// Slide 14: Future Expansion
let slide14 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide14.addText("Future Expansion: Roadmap", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, bold: true, color: "10B981" });

slide14.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 8.5, h: 0.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide14.addText("Phase 1: Standalone TENS hardware", { x: 0.5, y: 1.5, w: 8.5, h: 0.6, fontSize: 18, color: "CBD5E1", align: "center" });

slide14.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.2, w: 8.5, h: 0.6, fill: { color: "2563EB" }, rectRadius: 0.1 });
slide14.addText("Phase 2: Telemetry software (Current Phase)", { x: 0.5, y: 2.2, w: 8.5, h: 0.6, fontSize: 18, color: "F8FAFC", bold: true, align: "center" });

slide14.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.9, w: 8.5, h: 0.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide14.addText("Phase 3: Bluetooth-enabled hardware integration", { x: 0.5, y: 2.9, w: 8.5, h: 0.6, fontSize: 18, color: "CBD5E1", align: "center" });

slide14.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.6, w: 8.5, h: 0.6, fill: { color: "1E293B" }, rectRadius: 0.1 });
slide14.addText("Phase 4: Official Hospital deployment", { x: 0.5, y: 3.6, w: 8.5, h: 0.6, fontSize: 18, color: "CBD5E1", align: "center" });

slide14.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.3, w: 8.5, h: 0.6, fill: { color: "10B981" }, rectRadius: 0.1 });
slide14.addText("Phase 5: National pain-management platform", { x: 0.5, y: 4.3, w: 8.5, h: 0.6, fontSize: 18, color: "F8FAFC", bold: true, align: "center" });

// Slide 15: Conclusion
let slide15 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide15.addShape(pptx.ShapeType.rect, { x: 1, y: 1.0, w: 8, h: 3.5, fill: { color: "1E293B" }, rectRadius: 0.2 });
slide15.addText("TensPilot+", { x: 1, y: 1.2, w: 8, h: 0.8, fontSize: 44, bold: true, color: "3B82F6", align: "center" });
slide15.addText("A practical, affordable, and intelligent electrotherapy ecosystem that:", { x: 1, y: 1.8, w: 8, h: 0.5, fontSize: 18, color: "F8FAFC", align: "center" });
slide15.addText("• Relieves pain\n• Supports clinicians\n• Empowers patients\n• Reduces healthcare burden\n• Advances digital health innovation in Nigeria", { x: 1, y: 2.3, w: 8, h: 1.5, fontSize: 18, color: "CBD5E1", align: "center", bullet: false });
slide15.addText("\"From Pain Relief to Intelligent Pain Management.\"", { x: 1, y: 3.8, w: 8, h: 0.5, fontSize: 20, color: "10B981", bold: true, italic: true, align: "center" });


pptx.writeFile({ fileName: "TensPilot_Final_Hardware_Software_Presentation.pptx" }).then(() => {
    console.log("PPTX created successfully.");
});
