import { createContext, useContext, useEffect, useState } from 'react';
import React from "react";
import EqualityProductsRepository from '../repository/EqualityProductsRepository';

const EqualityProductsContext = createContext();

export const EqualityProductsProvider = ({ children }) => {
    const [equalityProducts, setEqualityProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        const unsubscribe = EqualityProductsRepository.getEqualityProducts((fetchedEqualityProducts) => {
            setEqualityProducts(fetchedEqualityProducts);
            setIsLoading(false); // Set loading false setelah data diambil
        });

        return () => unsubscribe();
    }, []);

    return (
        <EqualityProductsContext.Provider value={{ equalityProducts, isLoading }}>
            {children}
        </EqualityProductsContext.Provider>
    );
};

export const useEqualityProducts = () => useContext(EqualityProductsContext);