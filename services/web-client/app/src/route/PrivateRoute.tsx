"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRefreshTokenFromCookies } from '../services/AuthServices';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const refreshToken = getRefreshTokenFromCookies();
        
        if (router && !refreshToken) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default PrivateRoute;
