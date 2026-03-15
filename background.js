/**
 * @fileoverview Optimized background worker with browser action tracking
 */

console.log("[RecordSnap] 🚀 Background worker started!");

let mediaRecorder = null;
let recordedChunks = [];
let videoBlob = null;
let isRecording = false;

// Initialize
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 
        steps: [], 
        isRecording: false,
        videoUrl: null
    });
});

// Track recording state
chrome.storage.onChanged.addListener((changes) => {
    if (changes.isRecording) {
        isRecording = changes.isRecording.newValue;
        console.log("[RecordSnap] Recording state changed:", isRecording);
    }
});

// Initialize recording state
chrome.storage.local.get(['isRecording'], (result) => {
    isRecording = result.isRecording || false;
});

// Track browser navigation actions
chrome.webNavigation.onCommitted.addListener((details) => {
    if (!isRecording || details.frameId !== 0) return; // Only main frame
    
    const transitionTypes = {
        'reload': 'Page Reload',
        'typed': 'URL Typed',
        'auto_bookmark': 'Bookmark Click',
        'link': 'Link Navigation',
        'form_submit': 'Form Submit',
        'generated': 'Browser Generated',
        'keyword': 'Search',
        'keyword_generated': 'Search Result'
    };
    
    const actionType = transitionTypes[details.transitionType] || 'Navigation';
    
    console.log("[RecordSnap] Browser action detected:", actionType, details.url);
    
    // Create step for browser action
    const stepData = {
        actionType: actionType,
        elementText: details.url,
        description: `${actionType}: ${new URL(details.url).hostname}`,
        selector: 'browser-action',
        timestamp: Date.now(),
        tag: 'BROWSER',
        coords: { top: 0, left: 0, width: 0, height: 0 },
        url: details.url,
        transitionType: details.transitionType
    };
    
    // Save step
    saveStepWithoutScreenshot(stepData);
});

// Track tab updates (refresh, URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!isRecording) return;
    
    // Detect refresh
    if (changeInfo.status === 'loading' && tab.active) {
        console.log("[RecordSnap] Page refresh detected");
        
        const stepData = {
            actionType: 'Page Refresh',
            elementText: tab.url,
            description: `Refresh page: ${new URL(tab.url).hostname}`,
            selector: 'browser-refresh',
            timestamp: Date.now(),
            tag: 'BROWSER',
            coords: { top: 0, left: 0, width: 0, height: 0 },
            url: tab.url
        };
        
        saveStepWithoutScreenshot(stepData);
    }
});

// Track history navigation (back/forward)
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (!isRecording || details.frameId !== 0) return;
    
    console.log("[RecordSnap] History navigation detected");
    
    const stepData = {
        actionType: 'Browser Navigation',
        elementText: details.url,
        description: `Navigate: ${new URL(details.url).pathname}`,
        selector: 'browser-history',
        timestamp: Date.now(),
        tag: 'BROWSER',
        coords: { top: 0, left: 0, width: 0, height: 0 },
        url: details.url
    };
    
    saveStepWithoutScreenshot(stepData);
});

// Save step without screenshot (for browser actions)
function saveStepWithoutScreenshot(data) {
    chrome.storage.local.get(['steps'], (r) => {
        const steps = r.steps || [];
        data.stepNumber = steps.length + 1;
        data.screenshot = null;
        steps.push(data);
        
        chrome.storage.local.set({ steps }, () => {
            console.log(`[RecordSnap] ✅ Browser action step ${data.stepNumber} saved`);
            
            // Notify popup
            chrome.runtime.sendMessage({
                action: 'updateStepCount',
                count: steps.length
            }).catch(() => {});
        });
    });
}

// Message handler
chrome.runtime.onMessage.addListener((msg, sender, respond) => {
    if (!msg?.action) return false;
    
    switch (msg.action) {
        case 'startRecording':
            startRecording(respond);
            break;
        case 'stopRecording':
            stopRecording(respond);
            break;
        case 'recordStep':
            recordStep(msg.stepData, respond);
            break;
        case 'generateTutorial':
            generateTutorial(respond);
            break;
        case 'clearSteps':
            clearSteps(respond);
            break;
        default:
            respond({ success: false });
    }
    return true;
});

// Start recording with video capture
async function startRecording(respond) {
    try {
        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Start tab capture
        const streamId = await chrome.tabCapture.getMediaStreamId({
            targetTabId: tab.id
        });
        
        // Set recording state
        await chrome.storage.local.set({ isRecording: true });
        
        console.log("[RecordSnap] ✅ Recording started");
        respond({ success: true });
        
        // Start video recording in offscreen document (future enhancement)
        startVideoCapture(streamId);
        
    } catch (err) {
        console.error("[RecordSnap] Start error:", err);
        await chrome.storage.local.set({ isRecording: true }); // Still allow step recording
        respond({ success: true });
    }
}

// Start video capture (lightweight)
function startVideoCapture(streamId) {
    // This will be enhanced in future for actual video recording
    // For now, we focus on optimized screenshot capture
    console.log("[RecordSnap] Video capture ready:", streamId);
}

// Stop recording
async function stopRecording(respond) {
    await chrome.storage.local.set({ isRecording: false });
    
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
    
    console.log("[RecordSnap] ⏹️ Recording stopped");
    respond({ success: true });
}

// Record step with optimized screenshot
function recordStep(data, respond) {
    if (!data) {
        respond({ success: false });
        return;
    }
    
    // Capture screenshot asynchronously (non-blocking)
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (!tabs?.[0]) {
            saveStep(data, null);
            respond({ success: true });
            return;
        }
        
        try {
            // Optimized screenshot capture
            const dataUrl = await chrome.tabs.captureVisibleTab(tabs[0].windowId, {
                format: 'jpeg', // JPEG is faster than PNG
                quality: 85     // Good quality, smaller size
            });
            
            saveStep(data, dataUrl);
            respond({ success: true });
        } catch (err) {
            console.warn("[RecordSnap] Screenshot failed:", err.message);
            saveStep(data, null);
            respond({ success: true });
        }
    });
}

// Save step (optimized)
function saveStep(data, screenshot) {
    chrome.storage.local.get(['steps'], (r) => {
        const steps = r.steps || [];
        data.stepNumber = steps.length + 1;
        data.screenshot = screenshot;
        steps.push(data);
        
        chrome.storage.local.set({ steps }, () => {
            console.log(`[RecordSnap] ✅ Step ${data.stepNumber} saved`);
            
            // Notify popup (non-blocking)
            chrome.runtime.sendMessage({
                action: 'updateStepCount',
                count: steps.length
            }).catch(() => {});
        });
    });
}

// Generate tutorial
function generateTutorial(respond) {
    chrome.tabs.create({ 
        url: chrome.runtime.getURL('tutorial.html') 
    }, () => {
        respond({ success: true });
    });
}

// Clear steps
function clearSteps(respond) {
    chrome.storage.local.set({ steps: [], videoUrl: null }, () => {
        chrome.runtime.sendMessage({
            action: 'updateStepCount',
            count: 0
        }).catch(() => {});
        respond({ success: true });
    });
}

console.log("[RecordSnap] 🎬 Ready!");
