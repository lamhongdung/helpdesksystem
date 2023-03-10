package com.ez.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Priority {

    @Id
    // GenerationType.IDENTITY: id is generated by mySQL
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Min(value = 1, message = "Value of id must be greater than or equal to 1")
    private Long id;

    @Size(min = 1, max = 50, message = "Length of the priority name must be between 1 and 50 characters")
    private String name;

    @Min(value = 0, message = "Value of the 'resolve in(hours)' must be greater than or equal to 0")
    private Long resolveIn;

    //    @NotBlank(message = "Status must have value")
    @Pattern(regexp = "Active|Inactive", message = "Value of status must be 'Active' or 'Inactive'")
    private String status;

    public Priority(String name, long resolveIn, String status) {
        this.name = name;
        this.resolveIn = resolveIn;
        this.status = status;
    }

}
