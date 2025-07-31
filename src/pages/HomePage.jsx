import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import ProductCard from '../components/products/ProductCard';
import { Button } from '../components/ui/button';
import Loading from '../components/ui/loading';
import api from '../lib/api';
import { ArrowRight } from 'lucide-react';
import TypewriterText from '../components/TypewriterText.jsx';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/api/products?featured=true&per_page=6');
        if (response.data.success) {
          setFeaturedProducts(response.data.products);
        }
      } catch (err) {
        setError('Failed to load featured products');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
               <TypewriterText className="rainbow-text text-10xl" 
              text="Featured Products"
               delay={500} 
               speed={150} />
              
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <TypewriterText
              text="Discover our most popular and highly-rated gaming enhancements"
               delay={100} 
               cursorColor={"white"}
               speed={60} />  
                        </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loading size="lg" text="Loading featured products..." />
            </div>
          ) : error ? (
            <div className="text-center text-destructive">
              <p>{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {featuredProducts.length === 0 && (
                <div className="text-center text-muted-foreground">
                  <p>No featured products available at the moment.</p>
                </div>
              )}

              {featuredProducts.length > 0 && (
                <div className="text-center">
                  <Link to="/products">
                    <Button size="lg" variant="outline" className="group neon-border">
                      View All Products
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <TypewriterText className="rainbow-text text-10xl" 
              text="Explore Categories"
               delay={500} 
               speed={150} 
               
               />
              
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <TypewriterText  
              text="Choose from our diverse range of gaming enhancement categories"
               delay={100} 
               cursorColor={"white"}
               speed={60} />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/products?category=private" className="group">
              <div className="card-base rounded-lg p-8 text-center group-hover:cheat-glow transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full category-private flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  Private Cheats
                </h3>
                <p className="text-muted-foreground mb-6">
                  Exclusive collection of private cheats for premium members only. 
                  Premium quality, limited slots, maximum security.
                </p>
                <Button className="cheat-button group-hover:scale-105 transition-transform">
                  Explore Private
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>

            <Link to="/products?category=web2" className="group">
              <div className="card-base rounded-lg p-8 text-center group-hover:cheat-glow transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full category-web2 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  Web2 Gaming Cheats
                </h3>
                <p className="text-muted-foreground mb-6">
                  Discover our premium collection of Web2 gaming cheats for traditional games. 
                  High quality, secure, and constantly updated.
                </p>
                <Button className="cheat-button group-hover:scale-105 transition-transform">
                  Browse Web2
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>

            <Link to="/products?category=web3" className="group">
              <div className="card-base rounded-lg p-8 text-center group-hover:cheat-glow transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full category-web3 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  Web3 Gaming Cheats
                </h3>
                <p className="text-muted-foreground mb-6">
                  Explore our cutting-edge collection of Web3 gaming cheats for blockchain games. 
                  Next-generation tools for the future of gaming.
                </p>
                <Button className="cheat-button group-hover:scale-105 transition-transform">
                  Discover Web3
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

