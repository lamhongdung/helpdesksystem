package com.ez.service;

import com.ez.entity.Category;
import com.ez.repository.CategoryRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
public class CategoryServiceTest {

    @MockBean
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    // CategoryService.searchCategories() - JUnit test for searching categories
    @DisplayName("CategoryService.searchCategories() - JUnit test for searching categories")
    @Test
    public void whenSearchCategories_thenReturnCategoryList() {

        int pageNumber = 0;
        int pageSize = 5;
        String searchTerm = "";
        String status = "";

        List<Category> mockCodeCategoryList = new ArrayList<>();

        Category category1 = new Category(1L, "category1", "Active");
        Category category2 = new Category(2L, "category2", "Active");
        mockCodeCategoryList.add(category1);
        mockCodeCategoryList.add(category2);

        // when categoryRepository.searchCategories() is invoked
        // then return categoryList
        Mockito.when(categoryRepository.searchCategories(pageNumber, pageSize, searchTerm, status))
                .thenReturn(mockCodeCategoryList);

        // action
        List<Category> categoryList =
                categoryService.searchCategories(pageNumber, pageSize, searchTerm, status);

        // verify
        assertThat(categoryList.size()).isEqualTo(2);

    }

    // CategoryService.getTotalOfCategories() - JUnit test for getting total of categories
    @DisplayName("CategoryService.getTotalOfCategories() - JUnit test for getting total of categories")
    @Test
    public void whenGetTotalOfCategories_thenReturn9() {

        String searchTerm = "";
        String status = "";
        Long mockTotalOfCategories = 9L;

        // when categoryRepository.getTotalOfCategories() is invoked
        // then return mockTotalOfCategories value
        Mockito.when(categoryRepository.getTotalOfCategories(searchTerm, status))
                .thenReturn(mockTotalOfCategories);

        // action
        Long totalOfCategories = categoryService.getTotalOfCategories(searchTerm, status);

        // verify
        assertThat(totalOfCategories).isEqualTo(mockTotalOfCategories);

    }

    // CategoryService.createCategory() - JUnit test for creating new category
    @DisplayName("CategoryService.createCategory() - JUnit test for creating new category")
    @Test
    public void whenSaveCategory_thenReturnCategory() {

        Category category = new Category("cate1", "Active");
        Category hardCodeCategory = new Category(1L, "cate1", "Active");

        // when categoryRepository.save() is invoked
        // then return 'savedCategory' object
//        Mockito.when(categoryRepository.save(category)).thenReturn(hardCodeCategory);
        Mockito.when(categoryRepository.save(any(Category.class))).thenReturn(hardCodeCategory);

        // action
        Category savedCategory = categoryService.createCategory(category);

        // verify
        assertThat(savedCategory).isNotNull();

    }

    // CategoryService.findById() - JUnit test for finding category by id
    @DisplayName("CategoryService.findById() - JUnit test for finding category by id")
    @Test
    public void whenFindById_thenCategory() {

        Long id = 1L;
        Category mockCategory = new Category(id, "category 1", "Active");

        // when categoryRepository.findById() is invoked
        // then return mockCategory object
        Mockito.when(categoryRepository.findById(anyLong()))
                .thenReturn(Optional.of(mockCategory));

        // action
        Category category = categoryService.findById(id);

        // verify
        assertThat(category.getId()).isEqualTo(id);

    }

    // CategoryService.updateCategory() - JUnit test for update category
    @DisplayName("CategoryService.updateCategory() - JUnit test for update category")
    @Test
    public void whenUpdateCategory_thenCategory() {

        Long id = 1L;
        Category mockCategory = new Category(id, "category 1", "Active");

        // update category name
        Category mockUpdateCategory = new Category(id, "category 1 - update", "Active");

        // when categoryRepository.findById() is invoked
        // then return mockCategory object
        Mockito.when(categoryRepository.findById(anyLong()))
                .thenReturn(Optional.of(mockCategory));

        // when categoryRepository.save() is invoked
        // then return mockUpdateCategory object
        Mockito.when(categoryRepository.save(any(Category.class)))
                .thenReturn(mockUpdateCategory);

        // action
        Category category = categoryService.updateCategory(mockUpdateCategory);

        // verify
        assertThat(category.getName()).isEqualTo("category 1 - update");

    }
}
