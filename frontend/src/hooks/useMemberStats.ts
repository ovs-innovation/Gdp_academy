import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMyBookings } from '../services/bookingService';

export const useMemberStats = () => {
    const { token } = useAuth() as any;
    const [stats, setStats] = useState({
        totalClasses: 0,
        completedClasses: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                const bookings = await getMyBookings(token);
                
                const now = new Date();
                
                const completedBookings = bookings.filter((b: any) => {
                    const lessonDate = b.lesson?.scheduledAt ? new Date(b.lesson.scheduledAt) : new Date(b.sessionDate);
                    return lessonDate <= now || b.status === 'completed';
                });

                setStats({
                    totalClasses: bookings.length,
                    completedClasses: completedBookings.length,
                    loading: false
                });
            } catch (err) {
                console.error('Failed to fetch member stats', err);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, [token]);

    return stats;
};
