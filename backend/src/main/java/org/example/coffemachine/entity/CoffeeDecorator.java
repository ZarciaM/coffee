package org.example.coffemachine.entity;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public abstract class CoffeeDecorator implements CoffeeInterface {
    protected Coffee wrapped;


    @Override
    public int getCost() {
        return wrapped.getCost() + getAddins().stream().map(AddIn::getPrice).reduce(0, Integer::sum);
    }
    @Override
    public List<AddIn> getAddins() {
        return wrapped.getAddins();
    }
}
