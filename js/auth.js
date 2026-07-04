import { supabase, AppState, PLATFORM_VERSION } from 'https://cdn.doruklu.com/supabase-config.js';
import { ui as globalUI } from 'https://cdn.doruklu.com/ui.js';
import { initSubdomainAuth } from 'https://cdn.doruklu.com/auth.js';

export async function initAuth() {
    await initSubdomainAuth('doruklu_dashboard', async (user, profile) => {
        // App ekranını göster
        const appContent = document.getElementById('dashboard-screen');
        if (appContent) appContent.style.display = 'flex';

        // Global Header'ı render et
        globalUI.renderGlobalHeader("Analiz Paneli");

        // Versiyon bilgisini yaz
        document.getElementById('version-text').innerText = PLATFORM_VERSION;

        // 1. Kişisel Performans Verilerini Yükle
        document.getElementById('user-score').innerText = profile.total_score || 0;

        // Kullanıcının oyun oturumları
        const { count: userSessionsCount, data: sessionsData } = await supabase
            .from('game_sessions')
            .select('score_delta', { count: 'exact' })
            .eq('player_id', user.id);

        document.getElementById('user-sessions').innerText = userSessionsCount || 0;

        let avgScore = 0;
        if (sessionsData && sessionsData.length > 0) {
            const totalDelta = sessionsData.reduce((acc, s) => acc + (s.score_delta || 0), 0);
            avgScore = Math.round(totalDelta / sessionsData.length);
        }
        document.getElementById('user-avg-score').innerText = (avgScore >= 0 ? '+' : '') + avgScore;

        // 2. Global İstatistikleri Yükle (Sadece Admin / Super Admin)
        if (profile.role === 'admin' || profile.role === 'super_admin') {
            document.getElementById('admin-analytics-section').style.display = 'block';

            // Toplam Kayıtlı Oyuncu sayısı
            const { count: playersCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });
            document.getElementById('global-players').innerText = playersCount || 0;

            // Toplam Flashcard sayısı
            const { count: flashcardsCount } = await supabase
                .from('flashcards')
                .select('*', { count: 'exact', head: true });
            document.getElementById('global-flashcards').innerText = flashcardsCount || 0;

            // Toplam Oynanan Oyun sayısı
            const { count: totalSessionsCount } = await supabase
                .from('game_sessions')
                .select('*', { count: 'exact', head: true });
            document.getElementById('global-sessions').innerText = totalSessionsCount || 0;
        }

        // 3. Liderlik Tablosunu Yükle (Top 5)
        const { data: topPlayers } = await supabase
            .from('profiles')
            .select('display_name, avatar_url, total_score')
            .order('total_score', { ascending: false })
            .limit(5);

        if (topPlayers && topPlayers.length > 0) {
            const container = document.getElementById('leaderboard-container');
            container.innerHTML = topPlayers.map((player, idx) => {
                const rank = idx + 1;
                const displayName = player.display_name || 'Gizemli Oyuncu';
                const score = player.total_score || 0;
                let avatarHTML = '';
                
                if (player.avatar_url) {
                    avatarHTML = `<img src="${player.avatar_url}" alt="${displayName}">`;
                } else {
                    const initial = displayName.charAt(0).toUpperCase();
                    avatarHTML = `<div style="width:100%; height:100%; background: linear-gradient(135deg, #6366f1, #a855f7); color:white; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1rem;">${initial}</div>`;
                }

                return `
                    <div class="leaderboard-item">
                        <span class="leaderboard-rank rank-${rank}">#${rank}</span>
                        <div class="leaderboard-user">
                            <div class="leaderboard-avatar">${avatarHTML}</div>
                            <span class="leaderboard-name">${displayName}</span>
                        </div>
                        <span class="leaderboard-score">${score} Puan</span>
                    </div>
                `;
            }).join('');
        } else {
            document.getElementById('leaderboard-container').innerHTML = `
                <div style="color:var(--text-secondary); text-align:center; padding:20px;">Liderlik tablosu henüz boş.</div>
            `;
        }
    });
}

document.addEventListener('DOMContentLoaded', initAuth);
