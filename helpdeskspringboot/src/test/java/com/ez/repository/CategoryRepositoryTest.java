package com.ez.repository;

import com.ez.entity.Category;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.jdbc.JdbcTestUtils;

//@ExtendWith(SpringExtension.class)
@DataJpaTest
// use real database for test
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class CategoryRepositoryTest {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private JdbcTemplate jdbcTemplate;
    Category category;

    @BeforeEach
    public void setup() {

        // delete all data
        JdbcTestUtils.deleteFromTables(jdbcTemplate,
                "comment", "ticket", "fileStorage",
                "teamSupporter", "team", "priority",
                "category", "user");

        // create new category
        category = new Category("unit test - category 1", "Active");

    }

    //
    @DisplayName("Unit test for creating new category")
    @Test
//    @Rollback(value = false)
    public void whenCreateNewCategory_thenReturnIdGreater0() {

        // save new category into database
        Category savedCategory = categoryRepository.save(category);

        // verify data
        Assertions.assertThat(savedCategory).isNotNull();
        Assertions.assertThat(savedCategory.getId()).isGreaterThan(0);
        Assertions.assertThat(savedCategory.getName()).isEqualTo("unit test - category 1");

    }
}
