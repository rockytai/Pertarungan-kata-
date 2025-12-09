
import { Player } from '../types';
import { LeaderboardEntry, VersusLeaderboardEntry } from '../types';

const LB_KEY = 'clash_leaderboard';
const VERSUS_KEY = 'clash_leaderboard_versus';

export const getLeaderboard = (level: number): LeaderboardEntry[] => {
    try {
        const data = JSON.parse(localStorage.getItem(LB_KEY) || '{}');
        return data[level] || [];
    } catch {
        return [];
    }
};

export const saveScore = (level: number, player: Player, timeMs: number) => {
    try {
        const data = JSON.parse(localStorage.getItem(LB_KEY) || '{}');
        const currentLevelScores: LeaderboardEntry[] = data[level] || [];
        
        // Check if player already has a better score
        const existingIndex = currentLevelScores.findIndex(s => s.playerName === player.name);
        if (existingIndex !== -1) {
            if (currentLevelScores[existingIndex].timeMs > timeMs) {
                // Update with better time
                currentLevelScores[existingIndex] = {
                    playerName: player.name,
                    avatar: player.avatar,
                    timeMs,
                    date: Date.now()
                };
            }
        } else {
             currentLevelScores.push({
                playerName: player.name,
                avatar: player.avatar,
                timeMs,
                date: Date.now()
            });
        }

        // Sort by time (ascending) - REMOVED SLICE TO SHOW ALL SCORES
        const sorted = currentLevelScores.sort((a, b) => a.timeMs - b.timeMs);
        
        data[level] = sorted;
        localStorage.setItem(LB_KEY, JSON.stringify(data));
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
