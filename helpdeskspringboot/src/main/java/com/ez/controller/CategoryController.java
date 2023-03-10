package com.ez.controller;

import com.ez.entity.Category;
import com.ez.exception.ResourceNotFoundException;
import com.ez.service.CategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class CategoryController {

    private Logger LOGGER=LoggerFactory.getLogger(getClass());

    @Autowired
    CategoryService categoryService;

    //
    // search categories by pageNumber based on the search criteria
    //
    // url: ex: /category-search?pageNumber=0&pageSize=5&searchTerm=""&status=""
    // parameters:
    //  - pageNumber: page number
    //  - pageSize: page size(default = 5)
    //  - searchTerm: word to search(ID, name). '' is for search all
    //  - status: ''(all), 'Active', 'Inactive'
    @GetMapping("/category-search")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<List<Category>> searchCategories(@RequestParam int pageNumber,
                                                           @RequestParam int pageSize,
                                                           @RequestParam(defaultValue = "") String searchTerm,
                                                           @RequestParam(defaultValue = "") String status) {

        // get all categories of 1 page
        List<Category> categories = categoryService.searchCategories(pageNumber, pageSize, searchTerm, status);

        return new ResponseEntity<>(categories, OK);
    }

    //
    // calculate total of categories based on the search criteria.
    // use this total of categories value to calculate total pages for pagination.
    //
    // url: ex: /total-of-categories?searchTerm=""&status=""
    @GetMapping("/total-of-categories")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Long> getTotalOfCategories(@RequestParam(defaultValue = "") String searchTerm,
                                                     @RequestParam(defaultValue = "") String status) {

        // calculate total of categories based on the search criteria
        long totalOfCategories = categoryService.getTotalOfCategories(searchTerm, status);

        return new ResponseEntity<>(totalOfCategories, HttpStatus.OK);
    }

    @PostMapping("/category-create")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Category> createCategory(@RequestBody @Valid Category category, BindingResult bindingResult)
            throws BindException {

        LOGGER.info("validate data");

        // if category data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.error("Category data is invalid");

            throw new BindException(bindingResult);
        }

        Category newCategory = categoryService.createCategory(category);

        return new ResponseEntity<>(newCategory, OK);
    }

    // find category by id.
    // this method is used for Edit Category
    @GetMapping("/category-list/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Category> findById(@PathVariable Long id) throws ResourceNotFoundException {

        LOGGER.info("find category by id: " + id);

        Category category = categoryService.findById(id);

        return new ResponseEntity<>(category, OK);
    }

    // edit existing category
    @PutMapping("/category-edit")
    // only the ROLE_ADMIN can access this address
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Category> editCategory(@RequestBody @Valid Category category, BindingResult bindingResult)
            throws ResourceNotFoundException, BindException {

        LOGGER.info("validate data");

        // if category data is invalid then throw exception
        if (bindingResult.hasErrors()) {

            LOGGER.error("Category data is invalid");

            throw new BindException(bindingResult);
        }

        Category currentCategory = categoryService.updateCategory(category);

        return new ResponseEntity<>(currentCategory, OK);
    }

}
