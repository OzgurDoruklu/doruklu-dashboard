export const state = {
    reportSchema: {
        id: "report_" + Math.random().toString(36).substring(2, 9),
        version: "2.5",
        components: []
    },
    activeComponentId: null,
    draggedType: null,         // Sol menüden sürüklenen tip
    movingComponentId: null,   // Canvas içinde yeri değiştirilen bileşenin ID'si
    dragOffsetX: 0,            // Sürüklerken fare koordinat sapması
    dragOffsetY: 0
};

export const defaultSampleData = {
    "card": { value: "₺42,500", subtitle: "Bugünkü Toplam Satış", trend: "+12.4%" },
    "table": [
        { ID: 1, Urun: "Laptop", Adet: 4, Tutar: "₺96,000" },
        { ID: 2, Urun: "Monitör", Adet: 12, Tutar: "₺48,000" },
        { ID: 3, Urun: "Klavye", Adet: 35, Tutar: "₺14,000" }
    ],
    "bar-chart": [
        { label: "Oca", value: 40 }, { label: "Şub", value: 85 }, 
        { label: "Mar", value: 60 }, { label: "Nis", value: 95 }
    ],
    "line-chart": [
        { label: "Pzt", value: 20 }, { label: "Sal", value: 45 }, 
        { label: "Çar", value: 30 }, { label: "Per", value: 80 }
    ],
    "pie-chart": [
        { label: "Direkt", value: 50 }, { label: "Sosyal", value: 30 }, { label: "E-Posta", value: 20 }
    ],
    "gauge": { current: 72, target: 100, unit: "% Başarı" }
};

export function updateComponentProperty(id, property, value) {
    const comp = state.reportSchema.components.find(c => c.id === id);
    if (comp) {
        comp[property] = value;
    }
}

export function deleteComponentFromState(id) {
    state.reportSchema.components = state.reportSchema.components.filter(c => c.id !== id);
    if (state.activeComponentId === id) state.activeComponentId = null;
}

export function clearReportState() {
    state.reportSchema.components = [];
    state.activeComponentId = null;
    state.draggedType = null;
    state.movingComponentId = null;
}