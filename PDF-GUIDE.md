# 📄 RecordSnap PDF Export Guide

## ✨ Professional PDF Features

### What's Included:

**1. Cover Page:**
- 🎨 Gradient header (purple/blue)
- 📝 Tutorial title
- 📊 Total steps count
- 📅 Generation date & time
- ✨ Professional branding

**2. Each Step Contains:**
- 🔢 Numbered badge (colored circle)
- 📝 Step description (bold, clear)
- ⚡ Action type (Click, Type, etc.)
- ⏰ Timestamp
- 📸 High-quality screenshot
- 🖼️ Screenshot border
- ➖ Separator line

**3. Footer:**
- 📄 Page numbers (Page X of Y)
- 🏷️ "Created with RecordSnap" branding

---

## 🎯 PDF Layout

```
┌─────────────────────────────────────┐
│  COVER PAGE                         │
│  ┌───────────────────────────────┐  │
│  │ [Gradient Header]             │  │
│  │ RecordSnap Tutorial           │  │
│  │ Step-by-Step Guide            │  │
│  └───────────────────────────────┘  │
│                                     │
│  Total Steps: 10                    │
│  Generated: 12/25/2024, 3:45 PM     │
│  Created with RecordSnap            │
│  ─────────────────────────────────  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  STEP PAGE                          │
│                                     │
│  ① Click the "Submit" button       │
│     Action: Click                   │
│     Time: 3:45:23 PM                │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     [Screenshot Image]        │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  ─────────────────────────────────  │
│                                     │
│  ② Enter text in "Name" field      │
│     Action: Type                    │
│     Time: 3:45:25 PM                │
│                                     │
│  ┌───────────────────────────────┐  │
│  │     [Screenshot Image]        │  │
│  └───────────────────────────────┘  │
│                                     │
│  Page 1 of 3 | Created with...     │
└─────────────────────────────────────┘
```

---

## 📐 Technical Specifications

### Page Settings:
- **Format**: A4 (210mm × 297mm)
- **Orientation**: Portrait
- **Margins**: 20mm all sides
- **Font**: Helvetica

### Cover Page:
- **Header Height**: 60mm
- **Header Color**: RGB(102, 126, 234)
- **Title Size**: 32pt (bold)
- **Subtitle Size**: 14pt (normal)

### Step Layout:
- **Step Number**: 5mm radius circle
- **Badge Color**: RGB(102, 126, 234)
- **Description**: 14pt (bold)
- **Details**: 10pt (normal)
- **Max Image Width**: 170mm
- **Max Image Height**: 120mm

### Colors:
- **Primary**: #667eea (Purple)
- **Text**: #000000 (Black)
- **Meta**: #646464 (Gray)
- **Border**: #c8c8c8 (Light Gray)
- **Separator**: #e6e6e6 (Very Light Gray)

---

## 🚀 Export Process

### Step-by-Step:

1. **Click "Export PDF"**
   - Button shows: "⚙️ Generating PDF..."
   - Progress updates: "Processing 1/10..."

2. **Processing Steps:**
   - Creates cover page
   - Adds tutorial info
   - Processes each step:
     - Adds step number badge
     - Adds description
     - Adds action details
     - Loads screenshot
     - Resizes image (maintains aspect ratio)
     - Adds image border
     - Adds separator line
   - Adds page numbers to all pages

3. **Completion:**
   - PDF downloads automatically
   - Filename: `RecordSnap-Tutorial-[timestamp].pdf`
   - Success toast appears
   - Button resets to "Export PDF"

---

## 📊 Image Handling

### Screenshot Processing:

**1. Load Image:**
```javascript
- Loads base64 screenshot
- Gets original dimensions
- Calculates aspect ratio
```

**2. Resize Logic:**
```javascript
Max Width: 170mm
Max Height: 120mm

If width > max:
  - Scale down to max width
  - Adjust height proportionally

If height > max:
  - Scale down to max height
  - Adjust width proportionally
```

**3. Positioning:**
```javascript
- Center horizontally on page
- Add 0.5mm border
- Maintain aspect ratio
- Add spacing below
```

**4. Page Break:**
```javascript
If image doesn't fit:
  - Add new page
  - Place image at top
  - Continue with next step
```

---

## 🎨 Styling Details

### Step Number Badge:
- **Shape**: Circle (5mm radius)
- **Background**: Gradient (purple)
- **Text**: White, bold, 10pt
- **Position**: Left margin + 5mm

### Description:
- **Font**: Helvetica Bold
- **Size**: 14pt
- **Color**: Black
- **Position**: Indented 15mm from left

### Action Details:
- **Font**: Helvetica Normal
- **Size**: 10pt
- **Color**: Gray (#646464)
- **Spacing**: 6mm between lines

### Screenshot:
- **Border**: 0.5mm gray line
- **Spacing**: 15mm below
- **Alignment**: Center
- **Quality**: Original (JPEG 85%)

---

## 💡 Best Practices

### For Best PDF Quality:

1. **Record Clear Actions:**
   - Click center of elements
   - Wait for highlights
   - Avoid rapid clicking

2. **Good Screenshots:**
   - Full page visible
   - No overlapping windows
   - Good lighting/contrast
   - Clear text

3. **Meaningful Descriptions:**
   - Use descriptive button text
   - Label form fields
   - Clear element names

4. **Optimal Step Count:**
   - 5-20 steps ideal
   - Too many = large file
   - Too few = incomplete guide

---

## 📏 File Size Estimates

### Per Step:
- **Text only**: ~5 KB
- **With screenshot**: ~200-800 KB
- **Average**: ~400 KB per step

### Total PDF Size:
- **5 steps**: ~2 MB
- **10 steps**: ~4 MB
- **20 steps**: ~8 MB
- **50 steps**: ~20 MB

---

## 🐛 Troubleshooting

### PDF Export Fails:
- **Check**: jsPDF library loaded
- **Solution**: Reload page, try again
- **Fallback**: Use Print → Save as PDF

### Images Not Showing:
- **Cause**: Screenshot capture failed
- **Shows**: "📷 Screenshot unavailable"
- **Solution**: Re-record with better timing

### Large File Size:
- **Cause**: Many high-res screenshots
- **Solution**: Record fewer steps
- **Alternative**: Use Print (browser compression)

### Slow Export:
- **Normal**: 10ms delay per step
- **Expected**: 10 steps = ~1 second
- **Progress**: Shows "Processing X/Y"

---

## 🎯 Export Options

### Option 1: Export PDF (Recommended)
- ✅ Professional layout
- ✅ Cover page
- ✅ Page numbers
- ✅ High quality
- ✅ Portable
- ❌ Larger file size

### Option 2: Print → Save as PDF
- ✅ Browser native
- ✅ Smaller file size
- ✅ Fast
- ❌ No cover page
- ❌ Basic layout
- ❌ No page numbers

---

## 📝 Example Output

### Cover Page:
```
╔═══════════════════════════════════╗
║  [Purple Gradient Background]     ║
║                                   ║
║    RecordSnap Tutorial            ║
║    Step-by-Step Guide             ║
║                                   ║
╚═══════════════════════════════════╝

Total Steps: 5
Generated: December 25, 2024, 3:45:23 PM
Created with RecordSnap
─────────────────────────────────────
```

### Step Example:
```
① Click the "Submit Form" button
  Action: Click
  Time: 3:45:23 PM

  ┌─────────────────────────────┐
  │                             │
  │   [Screenshot of button]    │
  │                             │
  └─────────────────────────────┘
─────────────────────────────────────
```

---

## ✅ Quality Checklist

Before exporting:
- [ ] All steps have descriptions
- [ ] Screenshots are clear
- [ ] No duplicate steps
- [ ] Logical step order
- [ ] Meaningful action names
- [ ] Good image quality
- [ ] Reasonable step count (5-20)

---

**Create Professional Documentation! 📄**
