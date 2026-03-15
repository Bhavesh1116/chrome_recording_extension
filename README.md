# 🎬 RecordSnap - Professional Tutorial Generator

<div align="center">

**Automatically record user interactions and generate beautiful, professional step-by-step tutorials with screenshots.**

![Version](https://img.shields.io/badge/version-2.0-blue)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/license-MIT-orange)

</div>

---

## ✨ Features

- 🎯 **Smart Recording** - Automatically captures clicks, typing, form interactions
- 📸 **Screenshot Capture** - Takes high-quality screenshots of each step
- 🎨 **Professional UI** - Modern gradient design with smooth animations
- 📄 **PDF Export** - Generate beautiful PDF tutorials with one click
- 🔔 **Toast Notifications** - Real-time feedback for all actions
- 💫 **Smooth Animations** - Professional transitions and hover effects
- 🎭 **Visual Highlights** - Elegant gradient borders show recorded elements
- 📱 **Responsive Design** - Works perfectly on all screen sizes

---

## 🚀 Installation

1. **Download** or clone this repository
2. Open **Chrome** and navigate to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the RecordSnap folder
6. Done! 🎉

---

## 📖 How to Use

### Step 1: Start Recording
1. Click the RecordSnap extension icon in your browser
2. Click the **"Start Recording"** button
3. You'll see a recording indicator

### Step 2: Perform Actions
- Click buttons, links, or any elements
- Fill out forms and input fields
- Select dropdown options
- Every action is automatically captured with a screenshot!

### Step 3: Stop Recording
- Click the **"Stop Recording"** button when done
- You'll see the total number of steps captured

### Step 4: Generate Tutorial
- Click **"Generate Tutorial"** to view your steps
- Review the beautiful step-by-step guide
- Export as PDF or print directly

---

## 🎨 What's New in v2.0

### UI/UX Improvements
- ✅ Modern gradient color scheme (Purple/Blue)
- ✅ Smooth fade-in animations for all elements
- ✅ Professional button hover effects with ripple
- ✅ Toast notifications for user feedback
- ✅ Recording badge indicator
- ✅ Enhanced status panel with icons
- ✅ Improved step counter with gradient text

### Technical Improvements
- ✅ Better error handling
- ✅ Optimized screenshot capture
- ✅ Improved CSS selector generation
- ✅ Lazy loading for images
- ✅ Staggered card animations
- ✅ Professional PDF styling
- ✅ Better XSS protection

---

## 🛠️ Technical Stack

- **Manifest V3** - Latest Chrome Extension API
- **Vanilla JavaScript** - No dependencies, pure performance
- **CSS3 Animations** - Smooth, hardware-accelerated
- **jsPDF** - Professional PDF generation
- **Chrome Storage API** - Reliable data persistence

---

## 📁 Project Structure

```
RecordSnap/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (handles storage & screenshots)
├── content.js            # Content script (records user actions)
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic & UI management
├── style.css             # Popup styling
├── tutorial.html         # Tutorial viewer page
├── tutorial.js           # Tutorial generation logic
├── tutorial.css          # Tutorial page styling
└── jspdf.umd.min.js     # PDF export library
```

---

## 🎯 Key Features Explained

### Smart Element Detection
RecordSnap intelligently identifies:
- Buttons and clickable elements
- Form inputs (text, checkbox, radio, select)
- Links and navigation elements
- Custom interactive components

### Professional Highlights
When you interact with an element:
- Beautiful gradient border appears
- Smooth pulse animation
- Fades out elegantly
- Doesn't interfere with page functionality

### Automatic Screenshots
- Captures visible tab content
- High-quality PNG format
- Includes scroll position
- Handles errors gracefully

---

## 🔧 Customization

### Change Color Scheme
Edit the gradient colors in `style.css` and `tutorial.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjust Animation Speed
Modify transition durations:
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🐛 Troubleshooting

**Screenshots not capturing?**
- Ensure you've granted all permissions
- Some pages (chrome://, file://) can't be captured due to browser security

**Recording not starting?**
- Check browser console for errors
- Reload the extension from chrome://extensions/

**PDF export not working?**
- Ensure jspdf.umd.min.js is present
- Check browser console for errors

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 🙏 Credits

Created with ❤️ for making tutorial creation effortless and professional.

---

## 🚀 Future Enhancements

- [ ] Video recording support
- [ ] Cloud storage integration
- [ ] Custom branding options
- [ ] Multi-language support
- [ ] Keyboard shortcut recording
- [ ] Edit steps before export
- [ ] Share tutorials online

---

<div align="center">

**Made with 💜 by RecordSnap Team**

[Report Bug](https://github.com/yourusername/recordsnap/issues) · [Request Feature](https://github.com/yourusername/recordsnap/issues)

</div>
