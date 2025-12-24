import { useState } from 'react';

const API_BASE = 'https://api.counterapi.dev/v1/christmas-scam-leoclub';

/**
 * Custom hook to manage scam statistics (visits and victims).
 * Interacts with a simple counter API to track and retrieve stats.
 * 
 * @returns {Object} An object containing:
 * - visits: Number of site visits.
 * - victims: Number of users who "fell" for the scam (clicked the gift).
 * - incrementVisit: Function to increment the visit counter.
 * - incrementVictim: Function to increment the victim counter.
 * - fetchStats: Function to fetch current statistics without incrementing.
 */
export function useScamStats() {
    const [visits, setVisits] = useState<number>(0);
    const [victims, setVictims] = useState<number>(0);

    /**
     * Increments the visit count on the remote API.
     * Should be called once when the app loads.
     */
    const incrementVisit = async () => {
        try {
            const res = await fetch(`${API_BASE}/visits/up`);
            const data = await res.json();
            if (data.count) setVisits(data.count);
        } catch (e) {
            console.error("Failed to track visit", e);
        }
    };

    /**
     * Increments the victim count on the remote API.
     * Should be called when the user clicks the main gift box.
     */
    const incrementVictim = async () => {
        try {
            const res = await fetch(`${API_BASE}/victims/up`);
            const data = await res.json();
            if (data.count) setVictims(data.count);
        } catch (e) {
            console.error("Failed to track victim", e);
        }
    };

    /**
     * Fetches the current stats for visits and victims.
     * Useful for periodic updates or initial load if not incrementing.
     */
    const fetchStats = async () => {
        try {
            // Parallel fetch for efficiency
            const [visitRes, victimRes] = await Promise.all([
                fetch(`${API_BASE}/visits`),
                fetch(`${API_BASE}/victims`)
            ]);

            const visitData = await visitRes.json();
            const victimData = await victimRes.json();

            // Handle cases where the counter might not exist yet 
            // (defaults to 0 or null from some APIs, but counterapi usually returns error or object)
            if (visitData.count) setVisits(visitData.count);
            if (victimData.count) setVictims(victimData.count);

        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };

    return { visits, victims, incrementVisit, incrementVictim, fetchStats };
}
