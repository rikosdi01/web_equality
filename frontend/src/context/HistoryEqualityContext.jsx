import { createContext, useContext, useEffect, useState } from 'react';
import React from "react";
import HistoryEqualityRepository from '../repository/HistoryEqualityRepository';

const HistoryEqualityContext = createContext();

export const HistoryEqualityProvider = ({ children }) => {
    const [historyEqualities, setHistoryEqualities] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        const unsubscribe = HistoryEqualityRepository.getHistoryEquality((fetchedHistoryEquality) => {
            setHistoryEqualities(fetchedHistoryEquality);
            setIsLoading(false); // Set loading false setelah data diambil
        });

        return () => unsubscribe();
    }, []);

    return (
        <HistoryEqualityContext.Provider value={{ historyEqualities, isLoading }}>
            {children}
        </HistoryEqualityContext.Provider>
    );
};

export const useHistoryEquality = () => useContext(HistoryEqualityContext);