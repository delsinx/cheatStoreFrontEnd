import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Loading from '../components/ui/loading';
import CryptoPayment from '../components/payment/CryptoPayment';
import api from '../lib/api';
import { ShoppingCart, CreditCard, Shield, ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ cart: [], total_items: 0, total_price: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const cryptoOptions = [
    { value: 'btc', label: 'Bitcoin (BTC)', icon: '₿' },
    { value: 'eth', label: 'Ethereum (ETH)', icon: 'Ξ' },
    { value: 'usdt', label: 'Tether (USDT)', icon: '₮' },
    { value: 'usdc', label: 'USD Coin (USDC)', icon: '$' },
    { value: 'ltc', label: 'Litecoin (LTC)', icon: 'Ł' },
    { value: 'bnb', label: 'Binance Coin (BNB)', icon: 'B' }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/api/cart');
      if (response.data.success) {
        setCart(response.data);
        if (response.data.cart.length === 0) {
          navigate('/cart');
        }
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const processOrder = async () => {
    if (!selectedCrypto) {
      setError('Please select a cryptocurrency');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Para múltiplos produtos, criar pedidos separados
      const orders = [];
      
      for (const item of cart.cart) {
        const response = await api.post('/api/orders/create', {
          product_id: item.product_id,
          payment_method: selectedCrypto,
          quantity: item.quantity
        });

        if (response.data.success) {
          orders.push(response.data);
        }
      }

      if (orders.length > 0) {
        // Usar o primeiro pedido para o pagamento (em produção, seria um pagamento consolidado)
        setPaymentData(orders[0]);
        
        // Limpar carrinho após criar pedidos
        await api.delete('/api/cart/clear');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process order');
      console.error('Error processing order:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <CreditCard className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Please log in to complete your purchase.
          </p>
          <Button onClick={() => loginWithRedirect()} size="lg" className="cheat-button">
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center">
          <Loading size="lg" text="Loading checkout..." />
        </div>
      </div>
    );
  }

  if (error && !paymentData) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-destructive">
          <p>{error}</p>
          <Button onClick={() => navigate('/cart')} variant="outline" className="mt-4">
            Back to Cart
          </Button>
        </div>
      </div>
    );
  }

  if (paymentData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CryptoPayment 
          paymentData={paymentData} 
          onSuccess={() => navigate('/orders')}
          onCancel={() => navigate('/cart')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/cart')} 
          className="inline-flex items-center text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card className="cheat-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.cart.map((item) => (
                <div key={item.product_id} className="flex items-center space-x-4 p-3 rounded-lg border border-border">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image_url || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.game}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.product.category}
                      </Badge>
                      <span className="text-xs">Qty: {item.quantity}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span>${cart.total_price.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span>$0.00</span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="cheat-gradient-text">${cart.total_price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method */}
        <div>
          <Card className="cheat-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Cryptocurrency
                </label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your preferred cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoOptions.map((crypto) => (
                      <SelectItem key={crypto.value} value={crypto.value}>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">{crypto.icon}</span>
                          <span>{crypto.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="text-destructive text-sm p-3 rounded-lg bg-destructive/10">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Button 
                  className="w-full cheat-button" 
                  size="lg"
                  onClick={processOrder}
                  disabled={processing || !selectedCrypto}
                >
                  {processing ? (
                    <>
                      <Loading size="sm" className="mr-2" />
                      Processing Order...
                    </>
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure cryptocurrency payment</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Why Cryptocurrency?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Anonymous and secure transactions</li>
                  <li>• No chargebacks or payment disputes</li>
                  <li>• Fast processing and instant delivery</li>
                  <li>• Global accessibility</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

