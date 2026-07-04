import { state } from './state.js';

export function downloadReportJSON() {
    if (state.reportSchema.components.length === 0) {
        alert("Canvas boş, indirilecek bir şema yok.");
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.reportSchema, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${state.reportSchema.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}