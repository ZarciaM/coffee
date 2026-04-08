import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ProfilePage: React.FC = () => {
    const { userProfile, fetchUserProfile } = useOrderStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await fetchUserProfile();
            setLoading(false);
        };
        loadData();
    }, [fetchUserProfile]);

    if (loading) {
        return (
            <div className="min-h-screen py-8 bg-linear-to-br from-gray-50 via-white to-purple-50">
                <div className="container mx-auto px-4">
                    <LoadingSpinner message="Chargement du profil..." size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-linear-to-br from-gray-50 via-white to-purple-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

                    <div className="grid grid-cols-1 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Informations Personnelles</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <User className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Nom complet</p>
                                            <p className="font-medium text-lg">{userProfile?.name || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{userProfile?.email || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Adresse</p>
                                            <p className="font-medium">{userProfile?.address || 'Non spécifiée'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};