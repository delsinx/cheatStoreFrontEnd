import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Zap, Globe } from 'lucide-react';
import TypewriterText from '../TypewriterText.jsx';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="md:text-8xl md:text-8xl font-bold mb-4">
            <TypewriterText 
            className="rainbow-text"
            text="TFD BOOST"
            delay={500}
            speed={150}
            />
           
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <TypewriterText 
            className=""
            showCursorDuringTyping={false}
            text="The ultimate destination for premium gaming enhancements. 
            Dominate every game with our undetectable solutions."
            cursorColor={"white"}
            delay={500}
            speed={70}
            />
            
            
             
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-12">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">99.9%</div>
            <div className="text-sm md:text-base text-muted-foreground">Undetected</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">24/7</div>
            <div className="text-sm md:text-base text-muted-foreground">Support</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link to="/products?category=web2">
            <Button size="lg" className="cheat-button text-lg px-8 py-6 group">
              <Zap className="mr-2 h-5 w-5" />
              Explore Web2 Cheats
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link to="/products?category=web3">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground group neon-border">
              <Globe className="mr-2 h-5 w-5" />
              Web3 Gaming
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card-base text-center group hover:cheat-glow transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full category-private flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Private Cheats</h3>
            <p className="text-sm text-muted-foreground">Exclusive collection of private cheats for premium members only. Premium quality, limited slots, maximum security.</p>
          </div>

          <div className="card-base text-center group hover:cheat-glow transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full category-web2 flex items-center justify-center">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Web2 Gaming</h3>
            <p className="text-sm text-muted-foreground">Discover our premium collection of Web2 gaming cheats for traditional games. High quality, secure, and constantly updated.</p>
          </div>

          <div className="card-base text-center group hover:cheat-glow transition-all duration-300">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full category-web3 flex items-center justify-center">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Web3 Gaming</h3>
            <p className="text-sm text-muted-foreground">Explore our cutting-edge collection of Web3 gaming cheats for blockchain games. Next-generation tools for the future of gaming.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

