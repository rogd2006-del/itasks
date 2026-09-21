package com.meowmeowrahul.to_do.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int taskId;
    private String header;
    private String content;

    @Builder.Default
    private int priority=0;       // 0->Least/Default
                                  // 1->Medium
                                  //2->High
                                  //3->Highest

    private LocalDate addedDate;
    @Builder.Default
    private LocalDate endDate = LocalDate.parse("1979-01-01");
    @Builder.Default
    private boolean isCompleted = false;




    @ElementCollection
    @CollectionTable(name = "task_labels", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "label")
    private Set<String> labels;

    @ManyToOne
    @JoinColumn(name = "user_id",insertable = false,updatable = false)
    @JsonBackReference
    private Users user;






}
