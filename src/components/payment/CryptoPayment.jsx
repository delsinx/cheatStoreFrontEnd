import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api from '../../lib/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Bitcoin, 
  Coins, 
  Clock, 
  Copy, 
  ExternalLink, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const CryptoPayment = ({ product, onPaymentComplete, onCancel }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [step, setStep] = useState('select'); // 'select', 'payment', 'waiting', 'completed'
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [estimate, setEstimate] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Carregar moedas suportadas
  useEffect(() => {
    loadSupportedCurrencies();
  }, []);

  // Timer para expiração do pagamento
  useEffect(() => {
    if (paymentInfo?.expires_at) {
      const interval = setInterval(() => {
        const now = new Date();
        const expires = new Date(paymentInfo.expires_at);
        const diff = expires - now;
        
        if (diff <= 0) {
          setTimeLeft('Expired');
          clearInterval(interval);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [paymentInfo]);

  const loadSupportedCurrencies = async () => {
    try {
      const response = await api.get('/api/payments/currencies');
      if (response.data.success) {
        setCurrencies(response.data.currencies);
      }
    } catch (error) {
      console.error('Error loading currencies:', error);
      // Fallback currencies
      setCurrencies([
        { code: 'BTC', name: 'Bitcoin', icon: '₿', popular: true },
        { code: 'ETH', name: 'Ethereum', icon: 'Ξ', popular: true },
        { code: 'USDT', name: 'Tether USD', icon: '₮', popular: true },
        { code: 'USDC', name: 'USD Coin', icon: '$', popular: true }
      ]);
    }
  };

  const getEstimate = async (currency) => {
    try {
      setLoading(true);
      const response = await api.post('/api/payments/estimate', {
        amount_usd: product.price_usd,
        currency: currency
      });
      
      if (response.data.success) {
        setEstimate(response.data.estimate);
      }
    } catch (error) {
      console.error('Error getting estimate:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAccessTokenSilently();
      const response = await api.post('/api/payments/create', {
        product_id: product.id,
        currency: selectedCurrency
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPaymentInfo(response.data.payment);
        setStep('payment');
      } else {
        setError('Failed to create payment');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Payment creation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openPaymentUrl = () => {
    if (paymentInfo?.payment_url) {
      window.open(paymentInfo.payment_url, '_blank');
    }
  };

  const CurrencyIcon = ({ currency }) => {
    const icons = {
      'BTC': Bitcoin,
      'ETH': Coins,
      'USDT': Coins,
      'USDC': Coins,
      'LTC': Coins,
      'BNB': Coins
    };
    const Icon = icons[currency] || Coins;
    return <Icon className="h-5 w-5" />;
  };

  if (step === 'select') {
    return (
      <Card className="cheat-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="h-6 w-6" />
            Choose Cryptocurrency
          </CardTitle>
          <p className="text-muted-foreground">
            Select your preferred cryptocurrency for payment
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Popular currencies */}
          <div>
            <h4 className="font-medium mb-3">Popular Currencies</h4>
            <div className="grid grid-cols-2 gap-3">
              {currencies.filter(c => c.popular).map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency.code.toLowerCase());
                    getEstimate(currency.code.toLowerCase());
                  }}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedCurrency === currency.code.toLowerCase()
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CurrencyIcon currency={currency.code} />
                    <div className="text-left">
                      <div className="font-medium">{currency.code}</div>
                      <div className="text-sm text-muted-foreground">{currency.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Other currencies */}
          {currencies.filter(c => !c.popular).length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Other Currencies</h4>
              <div className="grid grid-cols-3 gap-2">
                {currencies.filter(c => !c.popular).map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency.code.toLowerCase());
                      getEstimate(currency.code.toLowerCase());
                    }}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      selectedCurrency === currency.code.toLowerCase()
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CurrencyIcon currency={currency.code} />
                      <span>{currency.code}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Estimate */}
          {estimate && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Estimated Amount:</span>
                <span className="font-mono font-medium">
                  {estimate.estimated_amount} {selectedCurrency.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ≈ ${product.price_usd} USD
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={createPayment} 
              disabled={loading || !selectedCurrency}
              className="flex-1 cheat-button"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'payment') {
    return (
      <Card className="cheat-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyIcon currency={paymentInfo.currency} />
            Pay with {paymentInfo.currency}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {timeLeft === 'Expired' ? (
                <span className="text-destructive">Payment Expired</span>
              ) : (
                <span>Time remaining: {timeLeft}</span>
              )}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment amount */}
          <div className="text-center p-6 bg-muted/50 rounded-lg">
            <div className="text-3xl font-mono font-bold mb-2">
              {paymentInfo.crypto_amount} {paymentInfo.currency}
            </div>
            <div className="text-muted-foreground">
              ≈ ${product.price_usd} USD
            </div>
          </div>

          {/* Payment address */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Send {paymentInfo.currency} to this address:
            </label>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <code className="flex-1 text-sm font-mono break-all">
                {paymentInfo.address}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(paymentInfo.address)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="font-medium mb-2">Payment Instructions:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Send exactly {paymentInfo.crypto_amount} {paymentInfo.currency}</li>
              <li>• Use the address above (copy to avoid errors)</li>
              <li>• Payment will be confirmed automatically</li>
              <li>• Do not send from an exchange (use personal wallet)</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            {paymentInfo.payment_url && (
              <Button onClick={openPaymentUrl} className="flex-1 cheat-button">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Payment Page
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default CryptoPayment;

