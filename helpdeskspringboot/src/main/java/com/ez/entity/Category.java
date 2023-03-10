package com.ez.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Category {

    @Id
    // GenerationType.IDENTITY: id is generated by mySQL
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Min(value = 1, message = "Value of id must be greater than or equal to 1")
    private Long id;

    @Size(min = 1, max = 50, message = "Length of the category name must be between 1 and 50 characters")
    private String name;

    //    @NotBlank(message = "Status must have value")
    @Pattern(regexp = "Active|Inactive", message = "Value of status must be 'Active' or 'Inactive'")
    private String status;

    public Category(String name, String status) {
        this.name = name;
        this.status = status;
    }
}
