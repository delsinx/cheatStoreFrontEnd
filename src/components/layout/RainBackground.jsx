// matriRain integration for React
import { useEffect, useRef } from 'react';

const RainBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Adiciona o script matriRain.js se não estiver presente
    if (!window.MatriRain) {
      const script = document.createElement('script');
      script.src = '/matriRain.js';
      script.async = true;
      script.onload = () => {
        if (window.MatriRain && canvasRef.current) {
          const rain = new window.MatriRain({
            canvas: canvasRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            fontSize: 18,
            speed: 60,
            opacity: 0.25,
            color: '#00ff41',
            backgroundAlpha: 0,
          });
          rain.start();
        }
      };
      document.body.appendChild(script);
    } else if (canvasRef.current) {
      const rain = new window.MatriRain({
        canvas: canvasRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
        fontSize: 18,
        speed: 60,
        opacity: 0.25,
        color: '#00ff41',
        backgroundAlpha: 0,
      });
      rain.start();
    }
    // Não remove o script para manter o efeito
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="matriRain-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default RainBackground;
