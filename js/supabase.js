import { state } from './state.js';

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
let supabaseClient = null;

if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

export async function saveSchemaToSupabase(uiStatusCallback) {
    if (!supabaseClient) {
        alert("Supabase henüz konfigüre edilmedi! Lütfen 'js/supabase.js' dosyasındaki URL ve KEY alanlarını doldurun.");
        return;
    }

    uiStatusCallback('Kaydediliyor...', 'text-amber-500');

    const { error } = await supabaseClient
        .from('reports')
        .upsert({ 
            id: state.reportSchema.id, 
            schema: state.reportSchema 
        });

    if (error) {
        console.error(error);
        uiStatusCallback('Hata Oluştu', 'text-red-500');
        alert("Kayıt sırasında hata: " + error.message);
    } else {
        uiStatusCallback('Supabase\'e Kaydedildi', 'text-emerald-500');
    }
}