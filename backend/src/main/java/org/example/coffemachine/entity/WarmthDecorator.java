package org.example.coffemachine.entity;

public class WarmthDecorator extends CoffeeDecorator {

    public WarmthDecorator(Coffee wrapped) {
        super(wrapped);
        wrapped.getAddins().add(new AddIn("warmth", 100));
    }
}
