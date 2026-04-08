import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-black text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Coffee className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">E-Coffee</h3>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Révolutionnez votre expérience café 
                            <br />avec notre technologie avancée.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-base font-bold mb-3">Navigation</h4>
                        <ul className="space-y-2">
                            {[
                                { path: '/', label: 'Accueil' },
                                { path: '/commander', label: 'Commander' },
                                { path: '/history', label: 'Historique' },
                                { path: '/profile', label: 'Profil' },
                            ].map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-base font-bold mb-3">Contact</h4>
                        <div className="space-y-2">
                            <p className="text-gray-400 text-sm">contact.e-coffee@gmail.com</p>
                            <p className="text-gray-400 text-sm">+261 32 89 544 76</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 my-6" />

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} E-Coffee Tous droits reservé
                    </p>
                </div>
            </div>
        </footer>
    );
};