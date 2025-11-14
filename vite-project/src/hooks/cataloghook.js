// src/hooks/useProducts.js
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:300';

export const useProducts = () => {
    const [products, setProducts] = useState({
        kitchens: [],
        bedrooms: [],
        gostinniye: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log('🔄 Fetching products from API...');
                const response = await fetch(`${API_BASE_URL}/api/products`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('✅ Products loaded:', data);
                
                setProducts(data);
            } catch (err) {
                console.error('❌ Error fetching products:', err);
                setError(err.message);
                
                // Fallback to mock data if API is not available
                setProducts({
                    kitchens: [
                        {
                            id: 1,
                            title: "Кухонный гарнитур 'Милена'",
                            description: "Цвет материала фасада: белый арт, Цвет материала корпуса: белый",
                            price: 45900,
                            image: null
                        }
                    ],
                    bedrooms: [],
                    gostinniye: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};