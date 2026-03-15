/**
 * @fileoverview Optimized tutorial page with playback mode
 */

let allSteps = [];
let currentPlaybackIndex = 0;
let playbackInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    const els = {
        loading: document.getElementById('loading'),
        emptyState: document.getElementById('emptyState'),
        stepsContainer: document.getElementById('tutorialSteps'),
        playbackMode: document.getElementById('playbackMode'),
        playbackScreen: document.getElementById('playbackScreen'),
        currentStep: document.getElementById('currentStep'),
        currentStepNum: document.getElementById('currentStepNum'),
        totalSteps: document.getElementById('totalSteps'),
        playbackBtn: document.getElementById('playbackBtn'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        exitPlaybackBtn: document.getElementById('exitPlaybackBtn'),
        printBtn: document.getElementById('printBtn'),
        exportPdfBtn: document.getElementById('exportPdfBtn')
    };

    // Load steps
    chrome.storage.local.get(['steps'], (result) => {
        allSteps = result.steps || [];
        els.loading.style.display = 'none';

        if (allSteps.length === 0) {
            els.emptyState.style.display = 'block';
            return;
        }

        // Render all steps
        allSteps.forEach(step => renderStep(step, els.stepsContainer));
        
        // Setup playback
        els.totalSteps.textContent = allSteps.length;
    });

    // Playback controls
    els.playbackBtn?.addEventListener('click', () => startPlayback());
    els.prevBtn?.addEventListener('click', () => showStep(currentPlaybackIndex - 1));
    els.nextBtn?.addEventListener('click', () => showStep(currentPlaybackIndex + 1));
    els.pauseBtn?.addEventListener('click', () => togglePause());
    els.exitPlaybackBtn?.addEventListener('click', () => exitPlayback());
    els.printBtn?.addEventListener('click', () => window.print());
    els.exportPdfBtn?.addEventListener('click', () => exportPDF());

    // Playback functions
    function startPlayback() {
        if (allSteps.length === 0) return;
        els.playbackMode.style.display = 'flex';
        currentPlaybackIndex = 0;
        showStep(0);
        startAutoPlay();
    }

    function showStep(index) {
        if (index < 0 || index >= allSteps.length) return;
        currentPlaybackIndex = index;
        
        const step = allSteps[index];
        els.currentStepNum.textContent = index + 1;
        
        els.currentStep.innerHTML = `
            <h2>Step ${step.stepNumber}</h2>
            <p style="font-size: 20px; margin: 20px 0;">${step.description}</p>
            ${step.screenshot ? `<img src="${step.screenshot}" alt="Step ${step.stepNumber}">` : '<p>No screenshot</p>'}
            <p style="margin-top: 20px; color: #64748b;">Action: ${step.actionType}</p>
        `;
    }

    function startAutoPlay() {
        if (playbackInterval) clearInterval(playbackInterval);
        playbackInterval = setInterval(() => {
            if (currentPlaybackIndex < allSteps.length - 1) {
                showStep(currentPlaybackIndex + 1);
            } else {
                clearInterval(playbackInterval);
                playbackInterval = null;
            }
        }, 3000); // 3 seconds per step
    }

    function togglePause() {
        if (playbackInterval) {
            clearInterval(playbackInterval);
            playbackInterval = null;
            els.pauseBtn.textContent = '▶️ Play';
        } else {
            startAutoPlay();
            els.pauseBtn.textContent = '⏸️ Pause';
        }
    }

    function exitPlayback() {
        if (playbackInterval) clearInterval(playbackInterval);
        els.playbackMode.style.display = 'none';
    }

    // Render step card
    function renderStep(step, container) {
        const card = document.createElement('div');
        card.className = 'step-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        card.innerHTML = `
            <div class="step-header">
                <div class="step-number">${step.stepNumber}</div>
                <div class="step-content">
                    <h3 class="step-description">${step.description}</h3>
                    <div class="step-meta">
                        <span><strong>Action:</strong> ${step.actionType}</span>
                        <span><strong>Time:</strong> ${new Date(step.timestamp).toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
            ${step.screenshot ? `
                <div class="step-screenshot-container">
                    <img src="${step.screenshot}" class="step-screenshot" alt="Step ${step.stepNumber}" loading="lazy">
                </div>
            ` : '<div class="step-screenshot-container" style="padding:40px;color:#94a3b8">No screenshot</div>'}
        `;

        container.appendChild(card);

        // Animate
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, step.stepNumber * 30);
    }

    // Export Professional PDF with Screenshots
    async function exportPDF() {
        if (!window.jspdf || allSteps.length === 0) {
            alert('❌ Cannot export PDF');
            return;
        }

        els.exportPdfBtn.disabled = true;
        els.exportPdfBtn.innerHTML = '⚙️ Generating PDF...';

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.width;
            const pageHeight = pdf.internal.pageSize.height;
            const margin = 20;
            let y = margin;

            // Cover Page
            pdf.setFillColor(102, 126, 234);
            pdf.rect(0, 0, pageWidth, 60, 'F');
            
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(32);
            pdf.setFont('helvetica', 'bold');
            pdf.text('RecordSnap Tutorial', pageWidth / 2, 35, { align: 'center' });
            
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Step-by-Step Guide', pageWidth / 2, 45, { align: 'center' });
            
            // Info box
            y = 80;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(12);
            pdf.text(`Total Steps: ${allSteps.length}`, margin, y);
            y += 8;
            pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
            y += 8;
            pdf.text(`Created with RecordSnap`, margin, y);
            
            // Divider
            y += 10;
            pdf.setDrawColor(102, 126, 234);
            pdf.setLineWidth(0.5);
            pdf.line(margin, y, pageWidth - margin, y);
            
            // Process each step
            for (let i = 0; i < allSteps.length; i++) {
                const step = allSteps[i];
                
                // Update progress
                els.exportPdfBtn.innerHTML = `Processing ${i + 1}/${allSteps.length}...`;
                
                // Check if we need a new page
                if (y > pageHeight - 100) {
                    pdf.addPage();
                    y = margin;
                }
                
                y += 15;
                
                // Step number badge (colored circle)
                pdf.setFillColor(102, 126, 234);
                pdf.circle(margin + 5, y - 2, 5, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text(step.stepNumber.toString(), margin + 5, y + 1, { align: 'center' });
                
                // Step description
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                const descLines = pdf.splitTextToSize(step.description, pageWidth - margin * 2 - 20);
                pdf.text(descLines, margin + 15, y);
                y += descLines.length * 7;
                
                // Step details
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Action: ${step.actionType}`, margin + 15, y);
                y += 6;
                pdf.text(`Time: ${new Date(step.timestamp).toLocaleTimeString()}`, margin + 15, y);
                y += 10;
                
                // Screenshot
                if (step.screenshot) {
                    try {
                        // Load image to get dimensions
                        const img = await loadImage(step.screenshot);
                        
                        const maxWidth = pageWidth - margin * 2;
                        const maxHeight = 120;
                        
                        let imgWidth = maxWidth;
                        let imgHeight = (img.height * maxWidth) / img.width;
                        
                        if (imgHeight > maxHeight) {
                            imgHeight = maxHeight;
                            imgWidth = (img.width * maxHeight) / img.height;
                        }
                        
                        // Check if image fits on current page
                        if (y + imgHeight > pageHeight - margin) {
                            pdf.addPage();
                            y = margin;
                        }
                        
                        const xOffset = margin + (maxWidth - imgWidth) / 2;
                        
                        // Add image
                        pdf.addImage(step.screenshot, 'JPEG', xOffset, y, imgWidth, imgHeight);
                        
                        // Image border
                        pdf.setDrawColor(200, 200, 200);
                        pdf.setLineWidth(0.5);
                        pdf.rect(xOffset, y, imgWidth, imgHeight);
                        
                        y += imgHeight + 15;
                        
                    } catch (err) {
                        console.warn(`Failed to add image for step ${step.stepNumber}:`, err);
                        pdf.setTextColor(150, 150, 150);
                        pdf.setFontSize(10);
                        pdf.text('📷 Screenshot unavailable', margin + 15, y);
                        y += 10;
                    }
                } else {
                    pdf.setTextColor(150, 150, 150);
                    pdf.setFontSize(10);
                    pdf.text('📷 No screenshot captured', margin + 15, y);
                    y += 10;
                }
                
                // Separator line
                if (i < allSteps.length - 1) {
                    pdf.setDrawColor(230, 230, 230);
                    pdf.setLineWidth(0.3);
                    pdf.line(margin, y, pageWidth - margin, y);
                }
                
                // Small delay to prevent blocking
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            // Footer on last page
            const totalPages = pdf.internal.pages.length - 1;
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(150, 150, 150);
                pdf.text(
                    `Page ${i} of ${totalPages} | Created with RecordSnap`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }
            
            // Save PDF
            pdf.save(`RecordSnap-Tutorial-${Date.now()}.pdf`);
            
            // Success message
            els.exportPdfBtn.disabled = false;
            els.exportPdfBtn.innerHTML = 'Export PDF';
            
            // Show success toast
            showToast('PDF exported successfully');
            
        } catch (error) {
            console.error('[RecordSnap] PDF export error:', error);
            alert('Failed to export PDF. Please try again.');
            els.exportPdfBtn.disabled = false;
            els.exportPdfBtn.innerHTML = 'Export PDF';
        }
    }
    
    // Helper: Load image and get dimensions
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
    
    // Helper: Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #059669;
            color: white;
            padding: 14px 20px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});
