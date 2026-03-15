/**
 * @fileoverview Optimized content script - Lightweight and fast
 */

console.log("[RecordSnap] ✅ Content script loaded!");

// Lightweight state
let isRecording = false;
let lastAction = { el: null, time: 0 };
const DEBOUNCE = 200; // Reduced for better responsiveness

// Passive event listeners for better performance
const eventOptions = { passive: true, capture: true };

// Listen for recording state (optimized)
chrome.storage.onChanged.addListener((changes) => {
    if (changes.isRecording) {
        isRecording = changes.isRecording.newValue;
        toggleIndicator(isRecording);
    }
});

// Initialize
chrome.storage.local.get(['isRecording'], (r) => {
    isRecording = r.isRecording || false;
    if (isRecording) toggleIndicator(true);
});

// Inject minimal styles once
if (!document.getElementById('rs-styles')) {
    const s = document.createElement('style');
    s.id = 'rs-styles';
    s.textContent = `
        @keyframes rs-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes rs-blink{0%,100%{opacity:1}50%{opacity:.5}}
        .rs-hl{position:absolute;border:3px solid #3b82f6;background:rgba(59,130,246,.1);border-radius:6px;z-index:2147483646;pointer-events:none;box-shadow:0 0 12px rgba(59,130,246,.3);animation:rs-pulse .5s ease-out;transition:opacity .4s}
        .rs-badge{position:absolute;top:-12px;left:-12px;width:24px;height:24px;background:#3b82f6;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font:bold 12px -apple-system,sans-serif;box-shadow:0 2px 8px rgba(59,130,246,.4)}
        .rs-ind{position:fixed;top:16px;right:16px;background:#dc2626;color:#fff;padding:10px 16px;border-radius:6px;font:600 12px -apple-system,sans-serif;z-index:2147483647;box-shadow:0 2px 12px rgba(220,38,38,.3);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:8px;letter-spacing:0.5px}
        .rs-ind:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(220,38,38,.4)}
        .rs-rec-dot{width:8px;height:8px;background:#fff;border-radius:50%;animation:rs-blink 1.5s infinite}
    `;
    document.head.appendChild(s);
}

// Toggle indicator (professional, no emojis)
function toggleIndicator(show) {
    let ind = document.getElementById('rs-ind');
    if (show && !ind) {
        ind = document.createElement('div');
        ind.id = 'rs-ind';
        ind.className = 'rs-ind';
        ind.innerHTML = '<span class="rs-rec-dot"></span><span>RECORDING</span>';
        
        // Prevent this click from being recorded
        ind.onclick = (e) => {
            e.stopPropagation(); // Stop event bubbling
            e.preventDefault();  // Prevent default action
            
            chrome.storage.local.get(['steps'], (r) => {
                const count = (r.steps || []).length;
                if (confirm(`Stop recording?\n\n${count} steps captured.`)) {
                    chrome.runtime.sendMessage({ action: 'stopRecording' });
                }
            });
        };
        
        // Also prevent mousedown/mouseup from being captured
        ind.onmousedown = (e) => {
            e.stopPropagation();
            e.preventDefault();
        };
        ind.onmouseup = (e) => {
            e.stopPropagation();
            e.preventDefault();
        };
        
        document.body.appendChild(ind);
    } else if (!show && ind) {
        ind.remove();
    }
}

// Optimized highlight (no DOM queries)
function showHighlight(el, num) {
    const r = el.getBoundingClientRect();
    const hl = document.createElement('div');
    hl.className = 'rs-hl';
    hl.style.cssText = `top:${r.top+scrollY}px;left:${r.left+scrollX}px;width:${r.width}px;height:${r.height}px`;
    
    const badge = document.createElement('div');
    badge.className = 'rs-badge';
    badge.textContent = num;
    hl.appendChild(badge);
    
    document.body.appendChild(hl);
    
    // Auto-remove (memory efficient)
    setTimeout(() => {
        hl.style.opacity = '0';
        setTimeout(() => hl.remove(), 400);
    }, 1200);
}

// Get minimal selector (fast)
function getSelector(el) {
    return el.id ? `#${el.id}` : 
           el.name ? `[name="${el.name}"]` : 
           el.className ? `.${el.className.split(' ')[0]}` :
           el.tagName.toLowerCase();
}

// Get description (better text extraction)
function getDesc(type, el) {
    // Try multiple ways to get meaningful text
    let txt = '';
    
    // Check for browser action
    if (el.getAttribute && el.getAttribute('data-action')) {
        return el.textContent || 'Browser action';
    }
    
    // For buttons and links, get text content
    if (el.tagName === 'BUTTON' || el.tagName === 'A') {
        txt = el.textContent || el.innerText || el.getAttribute('aria-label') || '';
    }
    // For inputs, get placeholder or label
    else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        txt = el.placeholder || el.name || el.id || el.getAttribute('aria-label') || '';
        // Try to find associated label
        if (!txt && el.id) {
            const label = document.querySelector(`label[for="${el.id}"]`);
            if (label) txt = label.textContent;
        }
    }
    // For divs/spans with onclick or role
    else if (el.onclick || el.getAttribute('role')) {
        txt = el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '';
    }
    // For other elements
    else {
        txt = el.innerText || el.textContent || el.alt || el.title || el.getAttribute('aria-label') || '';
    }
    
    txt = txt.trim().substring(0, 40);
    const name = txt ? `"${txt}"` : `${el.tagName.toLowerCase()} element`;
    
    return type === 'Click' ? `Click ${name}` :
           type === 'Button Click' ? `Click ${name} button` :
           type === 'Link' ? `Navigate to ${name}` :
           type === 'Browser Navigation' ? `Browser back/forward navigation` :
           type === 'Section Navigation' ? `Navigate to page section` :
           type === 'Type' ? `Enter text in ${name}` :
           type === 'Toggle' ? `Toggle ${name}` :
           type === 'Select' ? `Select ${name}` : `Interact with ${name}`;
}

// Record action (optimized with better validation)
function record(type, el, extra = {}) {
    if (!el || !isRecording) return;
    
    // Double-check: ignore RecordSnap elements
    if (el.id === 'rs-ind' || el.closest('#rs-ind') || 
        el.classList.contains('rs-hl') || el.classList.contains('rs-badge')) {
        return;
    }
    
    // Less aggressive debouncing for different elements
    const now = Date.now();
    if (lastAction.el === el && now - lastAction.time < DEBOUNCE) {
        console.log('[RecordSnap] Debounced duplicate action');
        return;
    }
    lastAction = { el, time: now };
    
    // Get step count fast
    chrome.storage.local.get(['steps'], (r) => {
        const steps = r.steps || [];
        const num = steps.length + 1;
        
        console.log(`[RecordSnap] Recording step ${num}:`, type, el.tagName);
        
        showHighlight(el, num);
        
        const rect = el.getBoundingClientRect();
        
        // Get element text for better descriptions
        let elementText = '';
        if (el.tagName === 'BUTTON' || el.tagName === 'A') {
            elementText = el.textContent || el.innerText || '';
        } else if (el.tagName === 'INPUT') {
            elementText = el.placeholder || el.value || '';
        } else {
            elementText = el.textContent || el.innerText || '';
        }
        elementText = elementText.trim().substring(0, 50);
        
        const data = {
            actionType: type,
            elementText: elementText,
            description: getDesc(type, el),
            selector: getSelector(el),
            timestamp: Date.now(),
            tag: el.tagName,
            coords: {
                top: rect.top + scrollY,
                left: rect.left + scrollX,
                width: rect.width,
                height: rect.height
            },
            ...extra
        };
        
        // Send async (non-blocking)
        setTimeout(() => {
            chrome.runtime.sendMessage({ 
                action: 'recordStep', 
                stepData: data 
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('[RecordSnap] Failed to send step:', chrome.runtime.lastError);
                } else {
                    console.log(`[RecordSnap] Step ${num} sent successfully`);
                }
            });
        }, 100);
    });
}

// Event handlers (capture ALL clicks including navigation)
document.addEventListener('click', (e) => {
    if (!isRecording) return;
    
    const el = e.target;
    
    // Ignore RecordSnap's own elements
    if (el.id === 'rs-ind' || el.closest('#rs-ind') || 
        el.classList.contains('rs-hl') || el.closest('.rs-hl')) {
        console.log('[RecordSnap] Ignoring own element click');
        return;
    }
    
    const tag = el.tagName;
    
    // Skip form inputs (handled by change event) but NOT buttons
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        if (el.type !== 'submit' && el.type !== 'button') return;
    }
    
    // Determine action type
    let actionType = 'Click';
    if (tag === 'A' || el.closest('a')) {
        actionType = 'Link';
    } else if (tag === 'BUTTON' || el.getAttribute('role') === 'button') {
        actionType = 'Button Click';
    }
    
    console.log('[RecordSnap] Click detected:', tag, actionType, el);
    record(actionType, el);
}, { capture: true }); // Use capture phase for better detection

// Capture mousedown for better click detection
document.addEventListener('mousedown', (e) => {
    if (!isRecording) return;
    
    const el = e.target;
    
    // Ignore RecordSnap elements
    if (el.id === 'rs-ind' || el.closest('#rs-ind') || 
        el.classList.contains('rs-hl') || el.closest('.rs-hl')) {
        return;
    }
    
    // Store mousedown target for comparison
    window._rsMouseDownTarget = el;
    window._rsMouseDownTime = Date.now();
}, { capture: true });

// Capture mouseup to detect clicks that might be missed
document.addEventListener('mouseup', (e) => {
    if (!isRecording) return;
    
    const el = e.target;
    
    // Check if mousedown and mouseup are on same element (valid click)
    if (window._rsMouseDownTarget === el && 
        Date.now() - window._rsMouseDownTime < 500) {
        
        // This is a valid click that might have been missed
        console.log('[RecordSnap] Mouseup detected on:', el.tagName);
    }
}, { capture: true });

document.addEventListener('change', (e) => {
    if (!isRecording) return;
    
    const el = e.target;
    const tag = el.tagName;
    
    console.log('[RecordSnap] Change detected:', tag, el);
    
    if (tag === 'INPUT') {
        if (el.type === 'checkbox' || el.type === 'radio') {
            record('Toggle', el, { checked: el.checked });
        } else {
            record('Type', el, { value: el.value });
        }
    } else if (tag === 'TEXTAREA') {
        record('Type', el, { value: el.value });
    } else if (tag === 'SELECT') {
        record('Select', el, { value: el.value });
    }
}, { capture: true });

// Also capture input events for better text field detection
document.addEventListener('input', (e) => {
    if (!isRecording) return;
    
    const el = e.target;
    const tag = el.tagName;
    
    // Only for text inputs and textareas
    if ((tag === 'INPUT' && el.type === 'text') || 
        (tag === 'INPUT' && el.type === 'email') || 
        (tag === 'INPUT' && el.type === 'password') ||
        (tag === 'INPUT' && el.type === 'search') ||
        tag === 'TEXTAREA') {
        
        // Debounce input events (wait for user to finish typing)
        clearTimeout(el._inputTimeout);
        el._inputTimeout = setTimeout(() => {
            if (el.value.trim()) {
                console.log('[RecordSnap] Input detected:', el.value);
                record('Type', el, { value: el.value });
            }
        }, 1000); // Wait 1 second after user stops typing
    }
}, { capture: true });

// Also capture popstate (browser back/forward)
window.addEventListener('popstate', () => {
    if (!isRecording) return;
    console.log('[RecordSnap] Browser back/forward detected');
    
    // Create a pseudo-element for navigation
    const navElement = document.createElement('div');
    navElement.textContent = 'Browser Back/Forward Button';
    navElement.setAttribute('data-action', 'browser-navigation');
    record('Browser Navigation', navElement, { 
        url: window.location.href,
        action: 'back/forward',
        type: 'popstate'
    });
});

// Capture hashchange (URL hash changes)
window.addEventListener('hashchange', () => {
    if (!isRecording) return;
    console.log('[RecordSnap] Hash change detected:', window.location.hash);
    
    const navElement = document.createElement('div');
    navElement.textContent = 'Page Section Navigation';
    navElement.setAttribute('data-action', 'hash-change');
    record('Section Navigation', navElement, { 
        hash: window.location.hash,
        url: window.location.href
    });
});

// Capture beforeunload (page leaving)
window.addEventListener('beforeunload', () => {
    if (!isRecording) return;
    console.log('[RecordSnap] Page unload detected');
});

console.log("[RecordSnap] Ready - All event listeners attached!");
