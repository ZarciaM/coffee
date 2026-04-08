import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight, Clock, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <section className="relative overflow-hidden bg-linear-to-br from-purple-50 via-white to-pink-50 py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                                Bienvenue chez{' '}
                                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    E-Coffee
                                </span>
                            </h1>
                            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl">
                                Découvrez l'art du café avec notre machine intelligente.
                                Commandez, personnalisez et dégustez votre café préféré en quelques clics.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                                <Link to="/commander">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 md:px-8 md:py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto"
                                    >
                                        <span>Commander maintenant</span>
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </motion.button>
                                </Link>
                                <Link to="/history">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 md:px-8 md:py-4 bg-white text-purple-600 font-bold rounded-xl border-2 border-purple-200 hover:border-purple-300 transition-colors w-full sm:w-auto"
                                    >
                                        Voir mon historique
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative w-full h-64 md:h-80 lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1498804103079-a6351b050096"
                                    alt="Coffee Machine"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />

                                <motion.div
                                    className="absolute bottom-4 md:bottom-8 right-4 md:right-8 w-12 h-12 md:w-20 md:h-20"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="w-full h-full bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                                        <Coffee className="w-6 h-6 md:w-10 md:h-10 text-white" />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                            Pourquoi choisir E-Coffee ?
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
                            Une expérience de commande de café révolutionnaire avec les derniers patterns de design
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {[
                            {
                                icon: <Clock className="w-6 h-6 md:w-8 md:h-8" />,
                                title: "Préparation rapide",
                                description: "Votre café préparé en quelques secondes avec notre technologie avancée",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: <Truck className="w-6 h-6 md:w-8 md:h-8" />,
                                title: "Livraison flexible",
                                description: "4 modes de livraison pour recevoir votre café où vous voulez",
                                color: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: <CreditCard className="w-6 h-6 md:w-8 md:h-8" />,
                                title: "Paiement sécurisé",
                                description: "3 modes de paiement sécurisés pour une transaction en toute confiance",
                                color: "from-purple-500 to-pink-500"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-linear-to-br from-gray-50 to-white rounded-xl md:rounded-2xl p-4 md:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-linear-to-r ${feature.color} flex items-center justify-center mb-4 md:mb-6`}>
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                                <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20 bg-linear-to-r from-gray-900 via-purple-900 to-gray-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                            Prêt à déguster votre café idéal ?
                        </h2>
                        <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
                            Rejoignez notre communauté de connaisseurs et découvrez l'expérience E-Coffee
                        </p>
                        <Link to="/commander">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 md:px-12 md:py-5 bg-linear-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all"
                            >
                                <div className="flex items-center justify-center space-x-2 md:space-x-3">
                                    <Coffee className="w-4 h-4 md:w-6 md:h-6" />
                                    <span>Commander mon premier café</span>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};