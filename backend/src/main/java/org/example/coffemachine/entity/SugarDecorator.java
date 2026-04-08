package org.example.coffemachine.entity;

public class SugarDecorator extends CoffeeDecorator {

    public SugarDecorator(Coffee wrapped) {
        super(wrapped);
        wrapped.getAddins().add(new AddIn("sugar", 200));
    }
}
