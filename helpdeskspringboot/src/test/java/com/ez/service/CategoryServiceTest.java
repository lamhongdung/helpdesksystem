package com.ez.service;

import com.ez.entity.Category;
import com.ez.repository.CategoryRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.BDDMockito;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
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
    public void whenSaveCategory_thenReturnCategory(){

//        Category  category = new Category(1L, "cate1","Active");
        Category  category = new Category("cate1","Active");

        BDDMockito.given(categoryRepository.save(category)).willReturn(category);
//        System.out.println(categoryRepository);
//        System.out.println(categoryService);
//
//        //
        Category savedCategory = categoryService.createCategory(category);
//
//
//        System.out.println(savedCategory);
//        //
//        Assertions.assertThat(savedCategory).isNotNull();

    }
}
