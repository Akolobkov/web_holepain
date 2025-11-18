// hooks/useProductDetails.js
import { useState, useEffect } from 'react';
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
                
                const response = await fetch(`http://localhost:300/api/product-details/${productId}`);
                
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                
                const productData = await response.json();
                
                // Обрабатываем изображения
                if (productData.images && productData.images.length > 0) {
                    // Убеждаемся, что у всех изображений есть URL
                    productData.images = productData.images.map(img => ({
                        ...img,
                        url: img.url || `data:${img.mimeType};base64,${img.data}`
                    }));
                }
                
                setProduct(productData);
                
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    return { product, loading, error };
};