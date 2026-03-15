# 🚀 RecordSnap Installation Guide

## Quick Start (5 Minutes)

### Step 1: Download Extension
- Download or clone this folder to your computer
- Make sure all files are in one folder

### Step 2: Open Chrome Extensions
1. Open Google Chrome
2. Type in address bar: `chrome://extensions/`
3. Press Enter

### Step 3: Enable Developer Mode
- Look at top-right corner
- Toggle ON the "Developer mode" switch

### Step 4: Load Extension
1. Click "Load unpacked" button (top-left)
2. Select the RecordSnap folder
3. Click "Select Folder"

### Step 5: Done! 🎉
- You'll see RecordSnap icon in your extensions
- Pin it to toolbar for easy access

---

## 📖 How to Use

### Recording Steps:

1. **Open test.html** in your browser (included in folder)
2. **Click RecordSnap icon** in toolbar
3. **Click "Start Recording"** button
4. **Perform actions** on the test page:
   - Fill form fields
   - Click buttons
   - Select dropdowns
   - Check checkboxes
5. **Watch the magic!** 
   - You'll see a "🔴 Recording" indicator on page
   - Each action shows a purple highlight with step number
   - Step counter updates in popup
6. **Click "Stop Recording"** when done
7. **Click "Generate Tutorial"** to see results!

---

## ✨ Features You'll See

### Visual Feedback:
- **Recording Indicator**: Red badge shows "🔴 Recording" on page
- **Step Highlights**: Purple gradient border appears on clicked elements
- **Step Numbers**: Each action shows its step number in a badge
- **Real-time Counter**: Popup shows how many steps recorded

### Tutorial Page:
- Beautiful step-by-step guide
- Screenshots of each action
- Professional PDF export
- Print-friendly layout

---

## 🐛 Troubleshooting

### Extension not loading?
- Make sure all files are in the folder
- Check that manifest.json exists
- Try reloading the extension

### Recording not working?
1. Open browser console (F12)
2. Look for "[RecordSnap]" messages
3. Make sure you clicked "Start Recording"
4. Check if recording indicator appears on page

### No highlights showing?
- Refresh the page after starting recording
- Make sure you're clicking actual elements (not empty space)
- Check browser console for errors

### Screenshots not capturing?
- Some pages block screenshots (chrome://, file://)
- Try on regular websites (google.com, test.html)
- Extension needs "activeTab" permission

---

## 🎯 Best Practices

1. **Start Fresh**: Clear old steps before new recording
2. **One Action at a Time**: Wait for highlight to appear
3. **Meaningful Actions**: Click buttons, fill forms, navigate
4. **Test Page First**: Use included test.html to learn
5. **Check Console**: Open DevTools to see what's happening

---

## 📁 Required Files

Make sure these files exist:
- ✅ manifest.json
- ✅ background.js
- ✅ content.js
- ✅ popup.html
- ✅ popup.js
- ✅ popup.css (or style.css)
- ✅ tutorial.html
- ✅ tutorial.js
- ✅ tutorial.css
- ✅ jspdf.umd.min.js
- ✅ test.html (for testing)

---

## 🎬 Quick Test

1. Load extension in Chrome
2. Open `test.html` from the folder
3. Click extension icon
4. Click "Start Recording"
5. Fill the form on test page
6. Click "Stop Recording"
7. Click "Generate Tutorial"
8. See your beautiful tutorial! 🎉

---

## 💡 Tips

- **Console Logs**: Check browser console for detailed logs
- **Step Counter**: Watch popup counter increase with each action
- **Visual Feedback**: Look for purple highlights on page
- **Recording Indicator**: Red badge confirms recording is active

---

## ❓ Need Help?

Check browser console (F12) for error messages.
All RecordSnap messages start with "[RecordSnap]"

---

**Made with 💜 by RecordSnap Team**

Enjoy creating professional tutorials! 🚀
