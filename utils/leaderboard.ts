
import { Player, BattleMode } from '../types';
import { LeaderboardEntry, VersusLeaderboardEntry } from '../types';

const LB_QUIZ_KEY = 'clash_lb_quiz';
const LB_MATCH_KEY = 'clash_lb_match';
const VERSUS_KEY = 'clash_leaderboard_versus';

export const getLeaderboard = (level: number, mode: BattleMode): LeaderboardEntry[] => {
    try {
        const key = mode === 'QUIZ' ? LB_QUIZ_KEY : LB_MATCH_KEY;
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        return data[level] || [];
    } catch {
        return [];
    }
};

export const saveScore = (level: number, player: Player, timeMs: number, score: number, mode: BattleMode) => {
    try {
        const key = mode === 'QUIZ' ? LB_QUIZ_KEY : LB_MATCH_KEY;
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const currentLevelScores: LeaderboardEntry[] = data[level] || [];
        
        // Check if player already has a better entry
        const existingIndex = currentLevelScores.findIndex(s => s.playerName === player.name);
        
        const newEntry: LeaderboardEntry = {
            playerName: player.name,
            avatar: player.avatar,
            timeMs,
            score,
            date: Date.now()
        };

        if (existingIndex !== -1) {
            const existing = currentLevelScores[existingIndex];
            
            if (mode === 'QUIZ') {
                // QUIZ: Higher Score is Better
                if (score > existing.score) {
                    currentLevelScores[existingIndex] = newEntry;
                }
            } else {
                // MATCH: Lower Time is Better (if time > 0)
                // If existing time is 0 (legacy/error), replace it.
                // If new time is faster than existing time, replace it.
                if (existing.timeMs === 0 || (timeMs > 0 && timeMs < existing.timeMs)) {
                    currentLevelScores[existingIndex] = newEntry;
                }
            }
        } else {
             currentLevelScores.push(newEntry);
        }

        // Sorting Logic
        let sorted = [];
        if (mode === 'QUIZ') {
            // Sort by Score DESC, then Time ASC
            sorted = currentLevelScores.sort((a, b) => {
                const scoreA = a.score || 0;
                const scoreB = b.score || 0;
                if (scoreA !== scoreB) return scoreB - scoreA;
                return a.timeMs - b.timeMs;
            });
        } else {
            // Sort by Time ASC, then Score DESC
            sorted = currentLevelScores.sort((a, b) => {
                // Filter out 0 times (invalid) for sorting if necessary, but assuming valid data:
                if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
                return b.score - a.score;
            });
        }
        
        data[level] = sorted;
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save score", e);
    }
};

export const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
};

// --- VERSUS LEADERBOARD ---

export const getVersusLeaderboard = (): VersusLeaderboardEntry[] => {
    try {
        const data = JSON.parse(localStorage.getItem(VERSUS_KEY) || '[]');
        return data.sort((a: VersusLeaderboardEntry, b: VersusLeaderboardEntry) => b.wins - a.wins);
    } catch {
        return [];
    }
}

export const saveVersusWin = (player: Player) => {
    try {
        // Do not save for Computer
        if (player.isComputer) return;

        const data: VersusLeaderboardEntry[] = JSON.parse(localStorage.getItem(VERSUS_KEY) || '[]');
        const index = data.findIndex(p => p.playerName === player.name);
        
        if (index !== -1) {
            data[index].wins += 1;
            data[index].lastPlayed = Date.now();
            // Update avatar if changed
            data[index].avatar = player.avatar;
        } else {
            data.push({
                playerName: player.name,
                avatar: player.avatar,
                wins: 1,
                lastPlayed: Date.now()
            });
        }
        localStorage.setItem(VERSUS_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed save versus", e);
    }
}
