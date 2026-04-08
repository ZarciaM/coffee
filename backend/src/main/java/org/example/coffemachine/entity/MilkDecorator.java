package org.example.coffemachine.entity;

public class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee wrapped) {
        super(wrapped);

        wrapped.getAddins().add(new AddIn("Milk", 500));
    }



}
