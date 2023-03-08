package com.ez.service;

import com.ez.entity.Category;
import com.ez.exception.IDNotFoundException;
import com.ez.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.ez.constant.Constant.*;

@Service
public class CategoryService{

    private Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    private CategoryRepository categoryRepository;

    // search categories by pageNumber and based on the search criteria.
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size
    //  - searchTerm: ID, name
    //  - status: '', 'Active', 'Inactive'
    public List<Category> searchCategories(int pageNumber, int pageSize, String searchTerm, String status){

        LOGGER.info("search categories");

        return categoryRepository.searchCategories(pageNumber, pageSize, searchTerm, status);
    }

    // calculate total of categories based on the search criteria
    public long getTotalOfCategories(String searchTerm, String status) {
        LOGGER.info("get total of categories");

        return categoryRepository.getTotalOfCategories(searchTerm, status);
    }

    // create new category
    public Category createCategory(Category category){

        LOGGER.info("create new category");

        // new user
        Category newCategory = new Category(category.getName(), category.getStatus());

        // save new category into database
        categoryRepository.save(newCategory);

        return newCategory;
    }

    // find category by category id
    public Category findById(Long id) throws IDNotFoundException {

        LOGGER.info("find category by id");

        // find category by category id
        return categoryRepository.findById(id).orElseThrow(() -> new IDNotFoundException(NO_CATEGORY_FOUND_BY_ID + id));
    }

    // update existing category
    public Category updateCategory(Category category) throws IDNotFoundException {

        LOGGER.info("Update category");

        // get existing category(persistent)
        Category existingCategory = categoryRepository.findById(category.getId())
                .orElseThrow(() -> new IDNotFoundException(NO_CATEGORY_FOUND_BY_ID + category.getId()));

        // set new values to existing category
        existingCategory.setName(category.getName());
        existingCategory.setStatus(category.getStatus());

        // update existing category(persistent)
        categoryRepository.save(existingCategory);

        return existingCategory;
    }

}
