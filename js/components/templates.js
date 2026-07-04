export function getComponentHTML(comp) {
    let data = comp.sampleData;
    let internalHTML = `<div class="text-[11px] font-bold text-slate-400 uppercase tracking-tight component-title-hook mb-1">${comp.title}</div>`;
    
    try {
        if (comp.type === 'card') {
            internalHTML += `
                <div class="text-2xl font-bold text-slate-800 mt-1">${data.value || '0'}</div>
                <div class="flex justify-between items-center text-[10px] mt-1">
                    <span class="text-slate-400">${data.subtitle || ''}</span>
                    <span class="text-emerald-500 font-medium">${data.trend || ''}</span>
                </div>`;
        } 
        
        else if (comp.type === 'table') {
            let rows = Array.isArray(data) ? data : [];
            let headers = rows.length > 0 ? Object.keys(rows[0]) : ['No Data'];
            
            internalHTML += `<div class="flex-1 mt-1 border border-slate-100 rounded-xs bg-slate-50 overflow-auto text-[10px] max-h-[90px]">`;
            internalHTML += `<table class="w-full text-left border-collapse"><thead><tr class="bg-slate-200 sticky top-0">`;
            headers.forEach(h => internalHTML += `<th class="p-1 font-medium border-b border-slate-300">${h}</th>`);
            internalHTML += `</tr></thead><tbody>`;
            
            rows.forEach(row => {
                internalHTML += `<tr class="hover:bg-slate-100 border-b border-slate-100">`;
                headers.forEach(h => internalHTML += `<td class="p-1 text-slate-600">${row[h]}</td>`);
                internalHTML += `</tr>`;
            });
            internalHTML += `</tbody></table></div>`;
        } 
        
        else if (comp.type === 'bar-chart') {
            let items = Array.isArray(data) ? data : [];
            internalHTML += `<div class="flex-1 flex items-end justify-between gap-2 bg-slate-50 p-2 border border-slate-100 rounded-sm h-[85px]">`;
            items.forEach(item => {
                internalHTML += `
                    <div class="flex flex-col items-center flex-1 h-full justify-end">
                        <div class="text-[8px] text-slate-400 mb-0.5">${item.value}</div>
                        <div class="bg-indigo-500 w-full rounded-t-xs transition-all" style="height: ${Math.min(item.value, 100)}%;"></div>
                        <div class="text-[9px] text-slate-500 truncate w-full text-center mt-1">${item.label}</div>
                    </div>`;
            });
            internalHTML += `</div>`;
        } 
        
        else if (comp.type === 'line-chart') {
            let items = Array.isArray(data) ? data : [];
            internalHTML += `<div class="flex-1 flex items-end justify-between gap-1 bg-slate-50 p-2 border border-slate-100 rounded-sm h-[85px] relative">`;
            items.forEach(item => {
                internalHTML += `
                    <div class="flex flex-col items-center flex-1 h-full justify-end relative">
                        <div class="absolute bg-purple-600 w-2 h-2 rounded-full z-10 border border-white" style="bottom: ${Math.min(item.value, 90)}%; margin-bottom:12px;"></div>
                        <div class="text-[9px] text-slate-500 mt-auto">${item.label}</div>
                    </div>`;
            });
            internalHTML += `</div>`;
        } 
        
        else if (comp.type === 'pie-chart') {
            let items = Array.isArray(data) ? data : [];
            internalHTML += `<div class="flex-1 flex items-center gap-2 bg-slate-50 p-2 border border-slate-100 rounded-sm h-[85px]">`;
            internalHTML += `<div class="w-12 h-12 rounded-full border-4 border-pink-400 border-r-slate-200 border-b-amber-300 animate-spin-slow shrink-0"></div>`;
            internalHTML += `<div class="flex flex-col gap-0.5 overflow-hidden w-full text-[9px]">`;
            items.forEach(item => {
                internalHTML += `<div class="flex justify-between text-slate-600 truncate"><span>• ${item.label}</span><span class="font-bold">${item.value}</span></div>`;
            });
            internalHTML += `</div></div>`;
        } 
        
        else if (comp.type === 'gauge') {
            let current = data.current || 0;
            let target = data.target || 100;
            let percent = Math.min(Math.round((current / target) * 100), 100);
            internalHTML += `
                <div class="flex-1 bg-slate-50 p-2 border border-slate-100 rounded-sm flex flex-col justify-center items-center h-[85px]">
                    <div class="text-xl font-black text-cyan-600">${percent}%</div>
                    <div class="w-full bg-slate-200 h-2 rounded-full mt-1 overflow-hidden">
                        <div class="bg-cyan-500 h-full transition-all" style="width: ${percent}%"></div>
                    </div>
                    <div class="text-[9px] text-slate-400 mt-1">${current} / ${target} ${data.unit || ''}</div>
                </div>`;
        }
    } catch (e) {
        internalHTML += `<div class="text-xs text-red-500 bg-red-50 p-2 rounded-sm border border-red-200 mt-1">JSON Format Hatası!</div>`;
    }

    // Üst üste binmeyi önlemek için taşınabilirliği vurgulayan Drag Handle simgesi ekliyoruz
    internalHTML += `<div class="absolute top-1.5 right-6 text-[10px] text-slate-300 select-none">⋮⋮</div>`;
    internalHTML += `<button data-delete-id="${comp.id}" class="absolute top-0 right-1 text-slate-400 hover:text-red-500 text-base font-bold px-1 cursor-pointer transition z-20">&times;</button>`;

    return internalHTML;
}