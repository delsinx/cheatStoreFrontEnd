import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Download, 
  Calendar, 
  Star,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const PurchasedPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPurchasedProducts();
  }, []);

  const fetchPurchasedProducts = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await fetch('/api/profile/purchased-products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts(data.purchased_products);
        } else {
          setError(data.error);
        }
      } else {
        setError('Failed to fetch purchased products');
      }
    } catch (error) {
      console.error('Error fetching purchased products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (orderId) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/profile/orders/${orderId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // In a real implementation, this would trigger the actual download
          alert('Download started! (This is a demo)');
        } else {
          alert(data.error);
        }
      } else {
        alert('Failed to start download');
      }
    } catch (error) {
      console.error('Error downloading:', error);
      alert(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isDownloadExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'private': 'bg-purple-100 text-purple-800 border-purple-200',
      'web2': 'bg-blue-100 text-blue-800 border-blue-200',
      'web3': 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'}
      >
        {category?.charAt(0).toUpperCase() + category?.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchPurchasedProducts}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Purchases</h1>
          <p className="text-muted-foreground">
            Access and download your purchased products.
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't purchased any products yet. Browse our store to find the perfect cheats for your games!
              </p>
              <Button onClick={() => window.location.href = '/products'}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={`${product.id}-${product.order_id}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <Package className="h-16 w-16" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    {getCategoryBadge(product.category)}
                  </div>
                  
                  {/* Download Status */}
                  <div className="absolute top-3 right-3">
                    {product.download_available ? (
                      isDownloadExpired(product.download_expires_at) ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expired
                        </Badge>
                      ) : (
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Available
                        </Badge>
                      )
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Processing
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Product Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Game & Rating */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Game: <span className="font-medium text-foreground">{product.game}</span>
                      </span>
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Purchase Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(product.purchase_date)}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    {/* Download Section */}
                    <div className="pt-2 border-t">
                      {product.download_available && !isDownloadExpired(product.download_expires_at) ? (
                        <div className="space-y-2">
                          <Button 
                            onClick={() => handleDownload(product.order_id)}
                            className="w-full flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download Now
                          </Button>
                          {product.download_expires_at && (
                            <p className="text-xs text-muted-foreground text-center">
                              Expires: {formatDate(product.download_expires_at)}
                            </p>
                          )}
                        </div>
                      ) : isDownloadExpired(product.download_expires_at) ? (
                        <div className="text-center">
                          <p className="text-sm text-red-500 mb-2">Download link has expired</p>
                          <Button variant="outline" size="sm" disabled>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Expired
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Download being prepared</p>
                          <Button variant="outline" size="sm" disabled>
                            <Clock className="h-4 w-4 mr-2" />
                            Processing
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedPage;

