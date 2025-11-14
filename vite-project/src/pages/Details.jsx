import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useProductDetails } from '../hooks/useProductDetails';
import styles from './Details.module.css';

function Details() {
    const { id } = useParams();
    const { product, loading, error } = useProductDetails(id);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    console.log('🔍 RENDER Details:', { product, loading, error });

    const handleAddToCart = () => {
        if (!product) return;
        alert(`Товар "${product.title}" добавлен в корзину!`);
    };

    const handleBuyNow = () => {
        if (!product) return;
        alert(`Переход к оформлению: ${product.title}`);
    };

    const handleQuantityChange = (value) => {
        const newQuantity = Math.max(1, Math.min(10, value));
        setQuantity(newQuantity);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.content}>
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <h2>Загрузка товара...</h2>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={styles.container}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.content}>
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <h2>Товар не найден</h2>
                            <p>{error}</p>
                            <Link to="/catalog">Вернуться в каталог</Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            
            <main style={{ flex: 1, padding: '20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Хлебные крошки */}
                    <nav style={{ marginBottom: '20px' }}>
                        <Link to="/" style={{ color: '#007bff' }}>Главная</Link>
                        <span style={{ margin: '0 10px' }}>/</span>
                        <Link to="/catalog" style={{ color: '#007bff' }}>Каталог</Link>
                        <span style={{ margin: '0 10px' }}>/</span>
                        <span>{product.title}</span>
                    </nav>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        {/* Изображение */}
                        <div>
                            <img 
                                src={product.image || 'https://via.placeholder.com/500x400'} 
                                alt={product.title}
                                style={{ width: '100%', borderRadius: '8px' }}
                            />
                        </div>

                        {/* Информация */}
                        <div>
                            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{product.title}</h1>
                            <p style={{ color: '#666', marginBottom: '20px' }}>{product.description}</p>
                            
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c5aa0', marginBottom: '20px' }}>
                                {product.price.toLocaleString('ru-RU')} ₽
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <span style={{ 
                                    color: product.inStock ? 'green' : 'red',
                                    fontWeight: 'bold'
                                }}>
                                    {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                                </span>
                            </div>

                            {/* Количество */}
                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>Количество:</span>
                                <button 
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    style={{ padding: '5px 10px' }}
                                >-</button>
                                <span style={{ padding: '0 10px' }}>{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    style={{ padding: '5px 10px' }}
                                >+</button>
                            </div>

                            {/* Кнопки */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#2c5aa0',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: product.inStock ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Купить сейчас
                                </button>
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                    style={{
                                        padding: '12px 24px',
                                        background: 'transparent',
                                        color: '#2c5aa0',
                                        border: '1px solid #2c5aa0',
                                        borderRadius: '4px',
                                        cursor: product.inStock ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    В корзину
                                </button>
                            </div>

                            {/* Гарантия */}
                            {product.warranty && (
                                <div style={{ color: '#666' }}>
                                    <strong>Гарантия:</strong> {product.warranty}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Описание и характеристики */}
                    <div style={{ marginTop: '40px' }}>
                        <h2>Описание</h2>
                        <p>{product.fullDescription}</p>

                        {product.features && product.features.length > 0 && (
                            <>
                                <h2>Особенности</h2>
                                <ul>
                                    {product.features.map((feature, index) => (
                                        <li key={index}>✓ {feature}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {product.specifications && product.specifications.length > 0 && (
                            <>
                                <h2>Характеристики</h2>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {product.specifications.map((spec, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '8px', fontWeight: 'bold', width: '30%' }}>{spec.name}</td>
                                                <td style={{ padding: '8px' }}>{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Details;