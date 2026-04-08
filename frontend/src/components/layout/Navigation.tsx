import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Menu, X, Home, History, User } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';

export const Navigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const { orderHistory } = useOrderStore();

    const navItems = [
        { path: '/', label: 'Accueil', icon: <Home className="w-5 h-5" /> },
        { path: '/commander', label: 'Commander', icon: <Coffee className="w-5 h-5" /> },
        { path: '/history', label: 'Historique', icon: <History className="w-5 h-5" />, badge: orderHistory.length },
        { path: '/profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <nav className="hidden lg:block bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center space-x-3">
                            <motion.div
                                className="w-10 h-10 rounded-lg bg-linear-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Coffee className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold bg-linear-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                                    E-Coffee
                                </h1>
                            </div>
                        </Link>

                        <div className="flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="relative"
                                >
                                    <motion.div
                                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${isActive(item.path)
                                                ? 'bg-linear-to-r from-purple-50 to-pink-50 text-purple-600 font-medium'
                                                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                        {item.badge && item.badge > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center"
                                            >
                                                {item.badge}
                                            </motion.span>
                                        )}
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>En ligne</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <nav className="lg:hidden bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center">
                                <Coffee className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold bg-linear-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                                    E-Coffee
                                </h1>
                            </div>
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="py-4 space-y-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <motion.div
                                                className={`flex items-center justify-between px-4 py-3 rounded-lg ${isActive(item.path)
                                                        ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                whileHover={{ x: 5 }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {item.icon}
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                                {item.badge && item.badge > 0 && (
                                                    <span className="w-6 h-6 bg-white text-purple-600 text-xs rounded-full flex items-center justify-center">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </>
    );
};