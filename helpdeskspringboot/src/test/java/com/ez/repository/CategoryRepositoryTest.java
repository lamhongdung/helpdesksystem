package com.ez.repository;

import com.ez.entity.Category;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

//@ExtendWith(SpringExtension.class)
@DataJpaTest
// use real database for test
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class CategoryRepositoryTest {

    @Autowired
    private CategoryRepository categoryRepository;

    //
    @DisplayName("Unit test for creating new category")
    @Test
    public void whenCreateNewCategory_thenReturnIdGreater0(){

        // create new category
        Category category = new Category("test 1", "Active");

        // save new category into database
        Category savedCategory = categoryRepository.save(category);

        // verify data
        Assertions.assertThat(savedCategory).isNotNull();
        Assertions.assertThat(savedCategory.getId()).isGreaterThan(0);
        Assertions.assertThat(savedCategory.getName()).isEqualTo("test 1");

    }
}
