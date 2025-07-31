import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Loading from '../components/ui/loading';
import CryptoPayment from '../components/payment/CryptoPayment';
import LoginButton from '../components/auth/LoginButton';
import api from '../lib/api';
import { ArrowLeft, Star, Download, Users, Shield, Check, Bitcoin } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.product);
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'private':
        return 'category-private';
      case 'web2':
        return 'category-web2';
      case 'web3':
        return 'category-web3';
      default:
        return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading product details..." />
      </div>
    );
  }
gap
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Product not found'}</p>
          <Link to="/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/products">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-8xl font-bold text-muted-foreground/20">
                    {product.game?.charAt(0) || 'G'}
                  </div>
                </div>
              )}
            </div>

            {/* Gallery */}
            {product.gallery_images && product.gallery_images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.gallery_images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-video bg-muted rounded overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getCategoryStyle(product.category)} text-white border-0`}>
                  {product.category}
                </Badge>
                {product.is_featured && (
                  <Badge className="cheat-gradient text-black border-0">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-muted-foreground">{product.game}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews_count} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span>{product.downloads_count || 0} downloads</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{product.stock_quantity} users</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold cheat-gradient-text">
              ${product.price_usd}
              <span className="text-base text-muted-foreground ml-2">
                {product.license_type}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Included Features</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {product.requirements && (
              <div>
                <h3 className="text-lg font-semibold mb-3">System Requirements</h3>
                <div className="cheat-card rounded-lg p-4 space-y-2">
                  {Object.entries(product.requirements).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">{key.replace('_', ' ')}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Anti-ban Protection */}
            <div className="cheat-card rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">Anti-ban protection guaranteed</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Our advanced protection systems ensure your account stays safe while using our cheats.
              </p>
            </div>

            {/* Purchase Section */}
            {showPayment ? (
              <CryptoPayment
                product={product}
                onPaymentComplete={() => {
                  setShowPayment(false);
                  // Redirect to success page or show success message
                }}
                onCancel={() => setShowPayment(false)}
              />
            ) : (
              <div className="space-y-4">
                {!isAuthenticated ? (
                  <div className="text-center p-6 cheat-card rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Login Required</h3>
                    <p className="text-muted-foreground mb-4">
                      Please login to purchase this product
                    </p>
                    <LoginButton />
                  </div>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full cheat-button text-lg py-6"
                    onClick={() => setShowPayment(true)}
                  >
                    <Bitcoin className="mr-2 h-5 w-5" />
                    Purchase for ${product.price_usd} (Crypto Only)
                  </Button>
                )}
                
                {/* Payment Info */}
                <div className="text-center text-sm text-muted-foreground">
                  <p>💰 We accept Bitcoin, Ethereum, USDT, and other cryptocurrencies</p>
                  <p>🔒 Secure payments powered by NowPayments</p>
                </div>
              </div>
            )}

            {/* Support Info */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold">5.2k</div>
                <div className="text-muted-foreground">Users</div>
              </div>
              <div>
                <div className="font-semibold">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
              <div>
                <div className="font-semibold">Auto</div>
                <div className="text-muted-foreground">Update</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

