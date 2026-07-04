import { state, defaultSampleData } from './state.js';
import { getComponentHTML } from './components/templates.js';

const canvas = document.getElementById('canvas');

export function initCanvas(onComponentSelected) {
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // Drop tetiklenmesi için şart
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();

        // 1. Sol menüden YENİ bir component mi bırakıldı?
        if (state.draggedType) {
            const x = Math.round((e.clientX - rect.left - 60) / 20) * 20;
            const y = Math.round((e.clientY - rect.top - 20) / 20) * 20;
            createNewComponent(state.draggedType, Math.max(0, x), Math.max(0, y), onComponentSelected);
        } 
        // 2. Canvas içindeki MEVCUT bir component mi taşındı?
        else if (state.movingComponentId) {
            const x = Math.round((e.clientX - rect.left - state.dragOffsetX) / 20) * 20;
            const y = Math.round((e.clientY - rect.top - state.dragOffsetY) / 20) * 20;
            
            const comp = state.reportSchema.components.find(c => c.id === state.movingComponentId);
            if (comp) {
                comp.style.x = Math.max(0, x);
                comp.style.y = Math.max(0, y);
            }
            state.movingComponentId = null; // Sıfırla
            renderCanvas(onComponentSelected);
        }
    });

    canvas.addEventListener('click', () => {
        onComponentSelected(null);
    });
}

function createNewComponent(type, x, y, callback) {
    const id = "comp_" + Math.random().toString(36).substring(2, 7);
    const defaultTitle = type.toUpperCase() + " Bileşeni";
    
    const component = {
        id: id,
        type: type,
        title: defaultTitle,
        query: `SELECT * FROM custom_view_${type}`,
        sampleData: JSON.parse(JSON.stringify(defaultSampleData[type])), // Derin kopyalama
        style: { x: x, y: y, width: 280, height: 140 }
    };

    state.reportSchema.components.push(component);
    state.draggedType = null; // Sıfırla
    renderCanvas(callback);
    callback(id);
}

export function renderCanvas(onComponentSelected) {
    canvas.innerHTML = '';

    state.reportSchema.components.forEach(comp => {
        const el = document.createElement('div');
        el.id = comp.id;
        el.setAttribute('draggable', 'true'); // Canvas içinde de sürüklenebilir yaptık
        
        const isSelected = state.activeComponentId === comp.id;
        el.className = `absolute bg-white border-2 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200'} rounded-lg shadow-xs p-3 cursor-move select-none flex flex-col justify-between overflow-hidden`;
        
        el.style.left = `${comp.style.x}px`;
        el.style.top = `${comp.style.y}px`;
        el.style.width = `${comp.style.width}px`;
        el.style.height = `${comp.style.height}px`;

        el.innerHTML = getComponentHTML(comp);

        // Canvas İçi Sürükleme Başlangıcı (Yer Değiştirme Kuralları)
        el.addEventListener('dragstart', (e) => {
            state.movingComponentId = comp.id;
            state.draggedType = null; // Menüden çekilmediğini garanti et
            
            const elRect = el.getBoundingClientRect();
            state.dragOffsetX = e.clientX - elRect.left;
            state.dragOffsetY = e.clientY - elRect.top;
            el.classList.add('dragging');
        });

        el.addEventListener('dragend', () => {
            el.classList.remove('dragging');
        });

        el.addEventListener('click', (e) => {
            e.stopPropagation();
            activateComponentInUI(comp.id, onComponentSelected);
        });

        const delBtn = el.querySelector(`[data-delete-id="${comp.id}"]`);
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.dispatchEvent(new CustomEvent('componentDelete', { detail: comp.id }));
        });

        canvas.appendChild(el);
    });

    document.getElementById('url-preview').innerText = `Oluşacak URL: /reports/render/${state.reportSchema.id}`;
}

function activateComponentInUI(id, callback) {
    state.activeComponentId = id;
    callback(id);
    state.reportSchema.components.forEach(c => {
        const dom = document.getElementById(c.id);
        if (dom) {
            if (c.id === id) {
                dom.classList.add('border-indigo-500', 'ring-2', 'ring-indigo-100');
                dom.classList.remove('border-slate-200');
            } else {
                dom.classList.remove('border-indigo-500', 'ring-2', 'ring-indigo-100');
                dom.classList.add('border-slate-200');
            }
        }
    });
}