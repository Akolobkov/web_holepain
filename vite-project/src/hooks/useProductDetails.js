// hooks/useProductDetails.js
import { useState, useEffect } from 'react';

// hooks/useProductDetails.js
export const useProductDetails = (productId) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productId) {
                setError('Product ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                console.log(`🔄 Fetching product details for ID: ${productId}`);
                
                // Явно указываем полный URL
                const response = await fetch(`http://localhost:300/api/product-details/${productId}`);
                console.log(`📡 Response status: ${response.status}`);
                
                // Проверяем content-type
                const contentType = response.headers.get('content-type');
                console.log(`📄 Content-Type: ${contentType}`);
                
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.log('❌ Received non-JSON response:', text.substring(0, 200));
                    throw new Error('Server returned HTML instead of JSON. Check if server is running.');
                }
                
                const productData = await response.json();
                console.log('📦 Received product data:', productData);
                setProduct(productData);
                
            } catch (err) {
                console.error('❌ Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    return { product, loading, error };
};