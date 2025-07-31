import React from 'react';
import TypewriterText from '../components/TypewriterText.jsx';
const faqs = [
	{
		question: 'Como faço para comprar um produto?',
		answer: 'Basta navegar até a página de produtos, escolher o item desejado e seguir o processo de checkout.',
	},
	{
		question: 'Quais métodos de pagamento são aceitos?',
		answer: 'Aceitamos pagamentos via cartão de crédito, Pix e criptomoedas.',
	},
	{
		question: 'Como acesso meus produtos comprados?',
		answer: 'Após a compra, acesse a seção "Meus Produtos" no menu do usuário.',
	},
	{
		question: 'Preciso de suporte, como proceder?',
		answer: 'Entre em contato pelo nosso formulário de suporte ou pelo e-mail informado no rodapé do site.',
	},
	{
		question: 'Posso pedir reembolso?',
		answer: 'Consulte nossa política de reembolso na página de termos e condições.',
	},
];

const FAQPage = () => {
	return (
		<div className="container mx-auto py-12 px-4 max-w-2xl">
			<h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
			
            <TypewriterText 
            className="rainbow-text"
            text=" FAQ - Perguntas Frequentes"
            delay={500}
            speed={150}
            />
               
			</h1>
			<div className="space-y-6">
				{faqs.map((faq, idx) => (
					<div key={idx} className="card-base">
						<h2 className="text-lg font-semibold text-white mb-2 flex items-center">
							<span className="mr-2">❓</span>
							{faq.question}
						</h2>
						<p className="text-gray-200 text-base pl-6">{faq.answer}</p>
					</div>
				))}
			</div>
			{/* Removed support button as requested */}
		</div>
	);
};

export default FAQPage;
