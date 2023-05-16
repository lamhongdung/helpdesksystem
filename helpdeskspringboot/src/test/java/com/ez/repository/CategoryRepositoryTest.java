package com.ez.repository;

import com.ez.entity.Category;
import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.jdbc.JdbcTestUtils;

import java.util.List;

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

    // @BeforeEach: run this method setup() before each test method
    @BeforeEach
    public void setup() {

        // delete all data in tables:
        // comment, ticket, fileStorage, teamSupporter, team,
        // priority, category, user.
        JdbcTestUtils.deleteFromTables(jdbcTemplate,
                "comment", "ticket", "fileStorage",
                "teamSupporter", "team", "priority",
                "category", "user");

        // create new category
        category = new Category("JUnit test - category 1", "Active");

    }

    // JUnit test for creating new category - CategoryRepository.save()
    @DisplayName("CategoryRepository.save() - JUnit test for creating new category")
    @Test
//    @Rollback(value = false)
    public void whenCreateNewCategory_thenReturnIdGreaterZero() {

        // save new category into database
        Category savedCategory = categoryRepository.save(category);

        // verify data
        assertThat(savedCategory).isNotNull();
        assertThat(savedCategory.getId()).isGreaterThan(0);
        assertThat(savedCategory.getName()).isEqualTo("JUnit test - category 1");

    }

    // JUnit test for update existing category - CategoryRepository.save()
    @DisplayName("CategoryRepository.save() - JUnit test for update existing category")
    @Test
    public void whenUpdateCategory_thenReturnCategoryIsUpdated() {

        // save new category into database
        Category savedCategory = categoryRepository.save(category);

        // get category by id
        Category existingCategory = categoryRepository.findById(savedCategory.getId()).get();

        // change values of category
        existingCategory.setName("JUnit test - update category 1");
        Category updatedCategory = categoryRepository.save(existingCategory);

        // verify data
        assertThat(updatedCategory.getName()).isEqualTo("JUnit test - update category 1");

    }

    // JUnit test for searching category - CategoryRepository.searchCategories()
    @DisplayName("CategoryRepository.searchCategories() - JUnit test for searching category")
    @Test
    public void whenSearchCategory_thenReturnCategoryList() {

        // save new category1 into database
        Category savedCategory1 = categoryRepository.save(category);

        // save new category2 into database
        Category category2 = new Category("JUnit test - category 2", "Active");
        Category savedCategory2 = categoryRepository.save(category2);

        // search categories
        List<Category> categoryList = categoryRepository.searchCategories(0, 5, "","");

        // verify data
        assertThat(categoryList.size()).isEqualTo(2);

    }

    // JUnit test for getting total of categories - CategoryRepository.getTotalOfCategories()
    @DisplayName("CategoryRepository.getTotalOfCategories() - JUnit test for getting total of categories")
    @Test
    public void whenGetTotalCategories_thenReturnTotalCategories() {

        // save new category1 into database
        Category savedCategory1 = categoryRepository.save(category);

        // save new category2 into database
        Category category2 = new Category("JUnit test - category 2", "Active");
        Category savedCategory2 = categoryRepository.save(category2);

        // get total of categories
        Long totalOfCategories = categoryRepository.getTotalOfCategories("","");

        // verify data
        assertThat(totalOfCategories).isEqualTo(2);

    }
}
