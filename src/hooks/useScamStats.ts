import { useState, useEffect } from 'react';

const API_BASE = 'https://api.counterapi.dev/v1/christmas-scam-leoclub';

export function useScamStats() {
    const [visits, setVisits] = useState<number>(0);
    const [victims, setVictims] = useState<number>(0);

    const incrementVisit = async () => {
        try {
            const res = await fetch(`${API_BASE}/visits/up`);
            const data = await res.json();
            if (data.count) setVisits(data.count);
        } catch (e) {
            console.error("Failed to track visit", e);
        }
    };

    const incrementVictim = async () => {
        try {
            const res = await fetch(`${API_BASE}/victims/up`);
            const data = await res.json();
            if (data.count) setVictims(data.count);
        } catch (e) {
            console.error("Failed to track victim", e);
        }
    };

    const fetchStats = async () => {
        try {
            // Parallel fetch
            const [visitRes, victimRes] = await Promise.all([
                fetch(`${API_BASE}/visits`),
                fetch(`${API_BASE}/victims`)
            ]);

            const visitData = await visitRes.json();
            const victimData = await victimRes.json();

            // Handle cases where the counter might not exist yet (defaults to 0 or null from some APIs, but counterapi usually returns error or object)
            if (visitData.count) setVisits(visitData.count);
            if (victimData.count) setVictims(victimData.count);

        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };

    return { visits, victims, incrementVisit, incrementVictim, fetchStats };
}
