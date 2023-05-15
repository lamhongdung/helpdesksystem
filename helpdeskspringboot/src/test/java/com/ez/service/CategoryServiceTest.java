package com.ez.service;

import com.ez.entity.Category;
import com.ez.repository.CategoryRepository;
import static org.assertj.core.api.Assertions.assertThat;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@ExtendWith(SpringExtension.class)
public class CategoryServiceTest {

    @MockBean
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    //    @BeforeEach
//    public void setup(){
//
//        categoryRepository = Mockito.mock(CategoryRepository.class);
//        categoryService = new CategoryService(categoryRepository);
//    }
    @Test
    public void whenSaveCategory_thenReturnCategory() {

//        Category  category = new Category(1L, "cate1","Active");
        Category category = new Category("cate1", "Active");
        Category savedCategory = new Category(1L, "cate1", "Active");

        Mockito.when(categoryRepository.save(category)).thenReturn(savedCategory);
//        BDDMockito.given(categoryRepository.save(category)).willReturn(category);
//        System.out.println(categoryRepository);
//        System.out.println(categoryService);
//
//        //
        Category savedCategory2 = categoryService.createCategory(category);

        assertThat(savedCategory2).isNotNull();
//
//
//        System.out.println(savedCategory);
//        //
//        Assertions.assertThat(savedCategory).isNotNull();

    }
}
