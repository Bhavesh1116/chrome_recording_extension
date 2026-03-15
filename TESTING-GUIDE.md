# 🧪 RecordSnap Testing Guide

## ✅ What Gets Recorded

### Clicks (All Types):
- ✅ Button clicks
- ✅ Link clicks
- ✅ Div/Span clicks (with onclick)
- ✅ Image clicks
- ✅ Icon clicks
- ✅ Submit buttons
- ✅ Custom elements

### Form Interactions:
- ✅ Text input (after 1 second of typing)
- ✅ Email input
- ✅ Password input
- ✅ Search input
- ✅ Textarea input
- ✅ Checkbox toggle
- ✅ Radio button selection
- ✅ Dropdown selection

### What DOESN'T Get Recorded:
- ❌ Recording indicator clicks (ignored!)
- ❌ Highlight box clicks (ignored!)
- ❌ Mouse movements
- ❌ Scrolling
- ❌ Keyboard shortcuts
- ❌ Right-clicks
- ❌ Hover effects

---

## 🎯 Testing Checklist

### Basic Tests:

1. **Button Click Test**
   - [ ] Click any button
   - [ ] See purple highlight with step number
   - [ ] Check console: "Step X sent successfully"
   - [ ] Verify step counter increases

2. **Link Click Test**
   - [ ] Click any link
   - [ ] See highlight
   - [ ] Action type should be "Link"
   - [ ] Description should say "Open..."

3. **Text Input Test**
   - [ ] Type in text field
   - [ ] Wait 1 second
   - [ ] See highlight appear
   - [ ] Action type should be "Type"

4. **Checkbox Test**
   - [ ] Click checkbox
   - [ ] See highlight immediately
   - [ ] Action type should be "Toggle"
   - [ ] Checked state recorded

5. **Dropdown Test**
   - [ ] Select dropdown option
   - [ ] See highlight
   - [ ] Action type should be "Select"
   - [ ] Selected value recorded

### Advanced Tests:

6. **Recording Indicator Test**
   - [ ] Start recording
   - [ ] Click red indicator
   - [ ] Should NOT create a step
   - [ ] Should show stop confirmation
   - [ ] Check console: "Ignoring own element click"

7. **Multiple Clicks Test**
   - [ ] Click button 3 times fast
   - [ ] Should record only 1 step (debounced)
   - [ ] Wait 250ms between clicks
   - [ ] Should record each click

8. **Form Submission Test**
   - [ ] Fill form fields
   - [ ] Click submit button
   - [ ] All fields should be recorded
   - [ ] Submit click should be recorded

9. **Performance Test**
   - [ ] Record 20+ steps
   - [ ] Page should stay smooth
   - [ ] No lag while scrolling
   - [ ] Highlights appear instantly

10. **Playback Test**
    - [ ] Generate tutorial
    - [ ] Click "Play Tutorial"
    - [ ] Auto-plays every 3 seconds
    - [ ] Manual controls work
    - [ ] Exit works properly

---

## 🐛 Common Issues & Solutions

### Issue: Click not detected
**Solution:**
- Check if recording indicator is visible
- Look for console message: "Click detected"
- Try clicking center of element
- Refresh page and try again

### Issue: Recording indicator click creates step
**Solution:**
- This is now fixed!
- Check console: Should say "Ignoring own element click"
- If still happening, reload extension

### Issue: Text input not recording
**Solution:**
- Wait 1 second after typing
- Or press Tab/Enter to trigger change event
- Check if field has value
- Look for console: "Input detected"

### Issue: Too many duplicate steps
**Solution:**
- This is now fixed with debouncing!
- 250ms delay between same element clicks
- Check console: "Debounced duplicate action"

### Issue: Page feels laggy
**Solution:**
- Close other extensions
- Refresh page
- Check if other screen recorders running
- Should be <50ms lag (imperceptible)

---

## 📊 Console Messages Guide

### Normal Messages:
```
[RecordSnap] ✅ Content script loaded!
[RecordSnap] 🎬 Recording state: true
[RecordSnap] Click detected: BUTTON <button>
[RecordSnap] Recording step 1: Click BUTTON
[RecordSnap] ✅ Step 1 sent successfully
```

### Ignored Actions:
```
[RecordSnap] Ignoring own element click
[RecordSnap] Debounced duplicate action
```

### Errors:
```
[RecordSnap] ❌ Failed to send step: [error]
[RecordSnap] Screenshot failed: [reason]
```

---

## 🎬 Step-by-Step Test Procedure

### Test 1: Basic Recording
1. Open test.html
2. Open browser console (F12)
3. Click extension icon
4. Click "Start Recording"
5. Look for: "🔴 Recording" on page
6. Click "Submit Form" button
7. Check console: "Click detected: BUTTON"
8. Check console: "Step 1 sent successfully"
9. See purple highlight with "1" badge
10. Click "Stop Recording"
11. Click "Generate Tutorial"
12. Verify step appears in tutorial

### Test 2: Form Filling
1. Start recording
2. Type name: "John Doe"
3. Wait 1 second
4. Check console: "Input detected"
5. Type email: "john@example.com"
6. Wait 1 second
7. Select country: "United States"
8. Check checkbox: "Technology"
9. Click submit
10. Stop recording
11. Should have 5 steps total

### Test 3: Recording Indicator
1. Start recording
2. Click red indicator
3. Check console: "Ignoring own element click"
4. Verify NO new step created
5. Cancel stop dialog
6. Click a button
7. Verify step IS created
8. Click indicator again
9. Confirm stop
10. Recording should stop

### Test 4: Performance
1. Start recording
2. Click 20 different buttons rapidly
3. Page should stay smooth
4. Scroll up and down
5. No lag should be felt
6. All clicks should be recorded
7. Stop recording
8. Generate tutorial
9. All 20 steps should appear

### Test 5: Playback
1. Record 5+ steps
2. Generate tutorial
3. Click "▶️ Play Tutorial"
4. Watch auto-play (3s per step)
5. Click "⏸️ Pause"
6. Click "⏭️ Next"
7. Click "⏮️ Previous"
8. Click "❌ Exit"
9. Back to normal view

---

## 🎯 Expected Results

### After Each Click:
1. Purple highlight appears (instantly)
2. Step number badge shows (1, 2, 3...)
3. Console shows: "Click detected"
4. Console shows: "Step X sent successfully"
5. Highlight fades after 1.2 seconds
6. Step counter increases in popup

### After Recording:
1. Tutorial page opens
2. All steps listed with screenshots
3. Each step has description
4. Playback button available
5. PDF export works
6. Print works

---

## 💡 Pro Testing Tips

1. **Always check console**: F12 → Console tab
2. **Look for error messages**: Red text in console
3. **Test on test.html first**: Known working page
4. **Try different websites**: Google, GitHub, etc.
5. **Test with DevTools open**: See real-time logs
6. **Clear old recordings**: Start fresh each test
7. **Reload extension**: After code changes
8. **Test in incognito**: No other extensions

---

## 🚀 Quick Test Commands

### In Console:
```javascript
// Check if recording
chrome.storage.local.get(['isRecording'], console.log)

// Check step count
chrome.storage.local.get(['steps'], r => console.log(r.steps.length))

// Clear all steps
chrome.storage.local.set({steps: []})

// View all steps
chrome.storage.local.get(['steps'], console.log)
```

---

## ✅ Final Checklist

Before reporting issues:
- [ ] Extension loaded properly
- [ ] test.html opens without errors
- [ ] Recording indicator appears
- [ ] Console shows no errors
- [ ] Clicks create highlights
- [ ] Steps appear in tutorial
- [ ] Playback mode works
- [ ] No lag while recording
- [ ] Recording indicator ignored
- [ ] Debouncing works

---

**Happy Testing! 🧪**
