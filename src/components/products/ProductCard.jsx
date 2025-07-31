import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Star, Download, Users, DollarSign, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import api from '../../lib/api';

const ProductCard = ({ product }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [addingToCart, setAddingToCart] = useState(false);

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    setAddingToCart(true);
    try {
      const response = await api.post('/api/cart/add', {
        product_id: product.id,
        quantity: 1
      });

      if (response.data.success) {
        // Trigger a cart update in the header
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

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

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'private':
        return 'Private';
      case 'web2':
        return 'Web2 Category';
      case 'web3':
        return 'Web3 Category';
      default:
        return category;
    }
  };

  return (
    <div className="card-base overflow-hidden group hover:cheat-glow transition-all duration-300 hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-bold text-muted-foreground/20">
              {product.game?.charAt(0) || 'G'}
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getCategoryStyle(product.category)} text-white border-0 text-xs font-semibold`}>
            {getCategoryLabel(product.category)}
          </Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-background/90 text-foreground border border-border text-sm font-bold">
            ${product.price_usd}
          </Badge>
        </div>

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute bottom-3 left-3">
            <Badge className="cheat-gradient text-black border-0 text-xs font-semibold">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Title and Game */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.game}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.short_description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{product.rating || '4.8'}</span>
            <span>({product.reviews_count || '124'})</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Download className="h-3 w-3" />
            <span>{product.downloads_count || '1.2k'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{product.stock_quantity || '∞'}</span>
          </div>
        </div>

        {/* Features Preview */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {product.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full group-hover:border-primary">
              <Eye className="mr-2 h-4 w-4" />
              Details
            </Button>
          </Link>
          <Button 
            onClick={addToCart}
            disabled={addingToCart}
            className="cheat-button"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addingToCart ? 'Adding...' : 'Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

