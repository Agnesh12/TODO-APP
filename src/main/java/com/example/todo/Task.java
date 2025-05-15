package com.example.todo;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
@Table(name = "tasks")
public class Task {
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Setter
    private String text;

    @Setter
    private boolean completed;

    public long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public boolean isCompleted() {
        return completed;
    }
}
