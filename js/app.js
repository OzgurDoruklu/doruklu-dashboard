import { state, updateComponentProperty, deleteComponentFromState, clearReportState } from './state.js';
import { initCanvas, renderCanvas } from './canvas.js';
import { downloadReportJSON } from './storage.js';
import { saveSchemaToSupabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    
    initCanvas(handleComponentSelection);

    // Sol Menü Sürükleme Dinleyicileri
    document.querySelectorAll('.toolbox-item').forEach(item => {
        item.addEventListener('dragstart', () => {
            state.draggedType = item.getAttribute('data-type');
            state.movingComponentId = null; // Canvas içi hareketi sıfırla
            item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    // Toolbar Aksiyonları
    document.getElementById('btn-clear').addEventListener('click', () => {
        clearReportState();
        renderCanvas(handleComponentSelection);
        handleComponentSelection(null);
    });

    document.getElementById('btn-export').addEventListener('click', () => {
        downloadReportJSON();
    });

    document.getElementById('btn-save').addEventListener('click', () => {
        saveSchemaToSupabase((msg, colorClass) => {
            const statusEl = document.getElementById('status-text');
            statusEl.innerText = msg;
            statusEl.className = colorClass;
        });
    });

    // Realtime Giriş Dinleyicileri
    const insTitle = document.getElementById('ins-title');
    const insQuery = document.getElementById('ins-query');
    const insSampleData = document.getElementById('ins-sample-data');

    insTitle.addEventListener('input', () => {
        if (!state.activeComponentId) return;
        updateComponentProperty(state.activeComponentId, 'title', insTitle.value);
        const activeDom = document.getElementById(state.activeComponentId);
        if (activeDom) {
            const titleHook = activeDom.querySelector('.component-title-hook');
            if (titleHook) titleHook.innerText = insTitle.value;
        }
    });

    insQuery.addEventListener('input', () => {
        if (!state.activeComponentId) return;
        updateComponentProperty(state.activeComponentId, 'query', insQuery.value);
    });

    // Sample Veri Canlı Değişim Yönetimi
    insSampleData.addEventListener('input', () => {
        if (!state.activeComponentId) return;
        try {
            const parsedJSON = JSON.parse(insSampleData.value);
            updateComponentProperty(state.activeComponentId, 'sampleData', parsedJSON);
            // Canlı render etmek için canvas'ı tazele
            renderCanvas(handleComponentSelection);
        } catch (e) {
            // Kullanıcı yazarken geçici syntax hatalarında patlamaması için sessizce bekle
        }
    });

    document.addEventListener('componentDelete', (e) => {
        deleteComponentFromState(e.detail);
        renderCanvas(handleComponentSelection);
        if (state.activeComponentId === null) handleComponentSelection(null);
    });
});

function handleComponentSelection(id) {
    state.activeComponentId = id;
    const placeholder = document.getElementById('inspector-placeholder');
    const panel = document.getElementById('inspector-panel');

    if (id) {
        const comp = state.reportSchema.components.find(c => c.id === id);
        placeholder.className = 'hidden';
        panel.className = 'space-y-4';

        document.getElementById('ins-id').value = comp.id;
        document.getElementById('ins-title').value = comp.title;
        document.getElementById('ins-query').value = comp.query;
        document.getElementById('ins-sample-data').value = JSON.stringify(comp.sampleData, null, 2);
    } else {
        placeholder.className = 'text-xs text-slate-400 italic';
        panel.className = 'hidden';
    }
}