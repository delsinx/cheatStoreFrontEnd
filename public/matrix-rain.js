document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const characters = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン一二三四五六七八九十百千万円日本語文字数学";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }

    const speeds = [];
    for (let i = 0; i < columns; i++) {
        speeds[i] = Math.random() * 3 + 1;
    }

    const trailLengths = [];
    for (let i = 0; i < columns; i++) {
        trailLengths[i] = Math.floor(Math.random() * 15) + 5;
    }

    const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 1)"; // Fundo preto puro
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            for (let j = 0; j < trailLengths[i]; j++) {
                const charY = drops[i] - (j * fontSize);

                if (charY < 0 || charY > canvas.height) continue;

                const char = characters[Math.floor(Math.random() * characters.length)];
                const opacity = 1 - (j / trailLengths[i]);
                const brightness = Math.random();
                let color;

                if (j === 0) {
                    color = `rgba(0, 255, 255, ${opacity})`;
                } else if (brightness > 0.98) {
                    color = `rgba(0, 255, 255, ${opacity * 0.8})`;
                } else if (brightness > 0.95) {
                    color = `rgba(0, 153, 204, ${opacity})`;
                } else if (brightness > 0.8) {
                    color = `rgba(0, 102, 153, ${opacity})`;
                } else {
                    color = `rgba(0, 51, 102, ${opacity})`;
                }

                ctx.fillStyle = color;
                ctx.fillText(char, i * fontSize, charY);
            }

            drops[i] += speeds[i];

            if (drops[i] - (trailLengths[i] * fontSize) > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    };

    setInterval(draw, 50);

    // Estilo básico para o body e canvas para cobrir a tela
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
});


