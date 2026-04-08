import React, { useEffect } from 'react';
import { CoffeeCard } from './CoffeeCard';
import { useOrderStore } from '../store/useOrderStore';
import { LoadingSpinner } from './LoadingSpinner';

export const CoffeeSelector: React.FC = () => {
    const { coffees, selectedCoffee, setSelectedCoffee, fetchCoffees, loading } = useOrderStore();

    useEffect(() => {
        if (coffees.length === 0) {
            fetchCoffees();
        }
    }, [coffees.length, fetchCoffees]);

    if (loading) {
        return <LoadingSpinner message="Chargement des cafés..." size="md" />;
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Choisissez votre café</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {coffees.length > 0 ? (
                    coffees.map(coffee => (
                        <CoffeeCard
                            key={coffee.id}
                            coffee={coffee}
                            isSelected={selectedCoffee?.id === coffee.id}
                            onClick={() => setSelectedCoffee(coffee)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">Aucun café disponible pour le moment</p>
                    </div>
                )}
            </div>
        </div>
    );
};