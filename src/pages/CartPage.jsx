import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Loading from '../components/ui/loading';
import api from '../lib/api';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ cart: [], total_items: 0, total_price: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState(null);

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
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      if (newQuantity === 0) {
        await removeFromCart(productId);
        return;
      }

      const response = await api.put('/api/cart/update', {
        product_id: productId,
        quantity: newQuantity
      });

      if (response.data.success) {
        fetchCart();
      }
    } catch (err) {
      console.error('Error updating cart:', err);
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeFromCart = async (productId) => {
    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      const response = await api.delete('/api/cart/remove', {
        data: { product_id: productId }
      });

      if (response.data.success) {
        fetchCart();
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete('/api/cart/clear');
      if (response.data.success) {
        fetchCart();
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-muted-foreground mb-8">
            Please log in to view your cart and make purchases.
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
          <Loading size="lg" text="Loading your cart..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-destructive">
          <p>{error}</p>
          <Button onClick={fetchCart} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (cart.cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products">
            <Button size="lg" className="cheat-button">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="cheat-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shopping Cart ({cart.total_items} items)
              </CardTitle>
              {cart.cart.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive"
                >
                  Clear Cart
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.cart.map((item) => (
                <div key={item.product_id} className="flex items-center space-x-4 p-4 rounded-lg border border-border">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image_url || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.product.game}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.product.category}
                      </Badge>
                      <span className="text-sm font-medium text-primary">
                        ${item.product.price_usd}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      disabled={updating[item.product_id] || item.quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      disabled={updating[item.product_id]}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product_id)}
                      disabled={updating[item.product_id]}
                      className="text-destructive hover:text-destructive mt-1 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="cheat-card sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.total_items} items)</span>
                <span>${cart.total_price.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>$0.00</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="cheat-gradient-text">${cart.total_price.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button 
                  className="w-full cheat-button" 
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Secure payment with cryptocurrency
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Payment Methods</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Badge variant="outline">Bitcoin</Badge>
                  <Badge variant="outline">Ethereum</Badge>
                  <Badge variant="outline">USDT</Badge>
                  <Badge variant="outline">USDC</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

