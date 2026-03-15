/**
 * @fileoverview Manages the popup user interface and communicates with the background service worker.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM Elements for performance
    const elements = {
        startBtn: document.getElementById('startRecording'),
        stopBtn: document.getElementById('stopRecording'),
        generateBtn: document.getElementById('generateTutorial'),
        clearBtn: document.getElementById('clearSteps'),
        statusIndicator: document.getElementById('statusIndicator'),
        stepCounter: document.getElementById('stepCounter'),
        statusPanel: document.getElementById('statusPanel'),
        recordingBadge: document.getElementById('recordingBadge'),
        statusText: document.getElementById('statusText')
    };

    // Prevent errors if HTML was tampered with
    if (!Object.values(elements).every(el => el !== null)) {
        console.error("[RecordSnap] Critical layout missing in popup.html");
        alert("Error: Popup HTML is corrupted!");
        return;
    }

    let state = {
        steps: 0,
        isRecording: false
    };

    /**
     * Refreshes the UI based on the current state.
     */
    function renderUI() {
        try {
            elements.startBtn.disabled = state.isRecording;
            elements.stopBtn.disabled = !state.isRecording;
            elements.generateBtn.disabled = state.isRecording || state.steps === 0;
            elements.clearBtn.disabled = state.isRecording || state.steps === 0;

            elements.stepCounter.textContent = state.steps.toString();

            if (state.isRecording) {
                elements.statusIndicator.classList.add('recording');
                elements.statusPanel.classList.add('recording');
                elements.recordingBadge.style.display = 'flex';
                elements.statusText.textContent = 'Active';
                elements.statusText.classList.add('active');
                // Update button text to show it's recording
                elements.stopBtn.innerHTML = '<span class="btn-icon">■</span><span class="btn-text">Stop (' + state.steps + ')</span>';
            } else {
                elements.statusIndicator.classList.remove('recording');
                elements.statusPanel.classList.remove('recording');
                elements.recordingBadge.style.display = 'none';
                elements.statusText.textContent = 'Idle';
                elements.statusText.classList.remove('active');
                elements.stopBtn.innerHTML = '<span class="btn-icon">■</span><span class="btn-text">Stop Recording</span>';
            }
        } catch (error) {
            console.error("[RecordSnap] Error updating UI:", error);
        }
    }

    // --- EVENT LISTENERS ---

    elements.startBtn.addEventListener('click', () => {
        console.log("[RecordSnap] Start button clicked");
        state.isRecording = true;
        renderUI();
        chrome.runtime.sendMessage({ action: "startRecording" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("[RecordSnap] Error starting recording:", chrome.runtime.lastError);
            } else {
                console.log("[RecordSnap] Recording started successfully");
            }
        });
        // Keep popup open for a moment to show state change
        setTimeout(() => {
            // Popup will auto-close or user can close it
        }, 500);
    });

    elements.stopBtn.addEventListener('click', () => {
        console.log("[RecordSnap] Stop button clicked");
        state.isRecording = false;
        renderUI();
        chrome.runtime.sendMessage({ action: "stopRecording" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("[RecordSnap] Error stopping recording:", chrome.runtime.lastError);
            } else {
                console.log("[RecordSnap] Recording stopped successfully");
                alert(`Recording stopped.\n\n${state.steps} steps captured.\n\nClick "Generate Tutorial" to view.`);
            }
        });
    });

    elements.generateBtn.addEventListener('click', () => {
        if (state.steps === 0) {
            alert("No steps recorded yet! Start recording first.");
            return;
        }
        console.log("[RecordSnap] Generate tutorial clicked");
        chrome.runtime.sendMessage({ action: "generateTutorial" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("[RecordSnap] Error generating tutorial:", chrome.runtime.lastError);
            }
        });
    });

    elements.clearBtn.addEventListener('click', () => {
        if (state.steps === 0) return;
        const confirmClear = confirm("Are you sure you want to delete all recorded steps?");
        if (!confirmClear) return;

        console.log("[RecordSnap] Clearing steps");
        state.steps = 0;
        renderUI();
        chrome.runtime.sendMessage({ action: "clearSteps" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("[RecordSnap] Error clearing steps:", chrome.runtime.lastError);
            }
        });
    });

    // --- MESSAGING & INITIALIZATION ---

    // Listener to update step count pushed live from background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("[RecordSnap] Message received:", message);
        if (message && message.action === "updateStepCount") {
            state.steps = typeof message.count === 'number' ? message.count : 0;
            console.log("[RecordSnap] Step count updated to:", state.steps);
            renderUI();
        }
    });

    // Safely fetch initial state from storage
    chrome.storage.local.get(['steps', 'isRecording'], (result) => {
        if (chrome.runtime.lastError) {
            console.error("[RecordSnap] Initial state fetch failed:", chrome.runtime.lastError);
            return;
        }

        console.log("[RecordSnap] Initial state loaded:", result);
        state.steps = Array.isArray(result.steps) ? result.steps.length : 0;
        state.isRecording = Boolean(result.isRecording);
        console.log("[RecordSnap] State initialized - Steps:", state.steps, "Recording:", state.isRecording);
        renderUI();
    });
});
