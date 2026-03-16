import { useState, useEffect } from 'react';
import { useSiteSettings } from './useSiteSettings';
import { StoreHoursEntry } from '../types';

const defaultStoreHours: StoreHoursEntry[] = [
    { label: 'Monday', hours: '2:00 PM – 10:00 PM' },
    { label: 'Tue - Thu & Sun', hours: '11:30 AM – 10:00 PM' },
    { label: 'Fri - Sat', hours: '11:30 AM – 11:00 PM' }
];

export const useStoreHours = () => {
    const { siteSettings } = useSiteSettings();
    const [isStoreOpen, setIsStoreOpen] = useState(true);

    useEffect(() => {
        const checkStoreStatus = () => {
            // Temporary 24/7 opening for testing
            setIsStoreOpen(true);
        };

        // Check initially
        checkStoreStatus();

        // Check every minute to keep it updated without refreshing
        const interval = setInterval(checkStoreStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const storeHours = (siteSettings?.store_hours && siteSettings.store_hours.length > 0)
        ? siteSettings.store_hours
        : defaultStoreHours;

    const storeHoursSummary = siteSettings?.store_hours_summary || 'TUES - SUN • 11:00 AM - 10:00 PM';

    return {
        isStoreOpen,
        openingTime: "11:00 AM",
        closingTime: "10:00 PM",
        storeHours,
        storeHoursSummary
    };
};
