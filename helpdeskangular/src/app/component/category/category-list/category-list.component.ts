import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/entity/Category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of categories(for pagination)
  totalOfCategories: number;
  // category list(the grid of the category table)
  categories: Category[] = [];
  // number of categories per page(default = 5)
  pageSize: number;

  // form of "Search Category"
  searchCategory = this.formBuilder.group({

    // search term
    searchTerm: [''],
    // status
    status: [''],

  });


  constructor(private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // initial page size(default = 5)
    this.pageSize = this.categoryService.pageSize;

    // initial current page(in the front end)
    this.currentPage = 1;

    // assign categories from database to the this.categories variable, and get totalPages.
    // the first parameter(page) = 0: in MySQL 0 means the first page.
    this.searchCategories(0, this.searchCategory.value.searchTerm, this.searchCategory.value.status);

  } // end of ngOnInit()

  // get categories, total of categories and total pages
  searchCategories(pageNumber: number, searchTerm: string, status: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the CategoryListComponent
    this.subscriptions.push(

      // get categories
      this.categoryService.searchCategories(pageNumber, searchTerm, status)

        .subscribe({
          next: (data: Category[]) => {
            return this.categories = data
          }
        })
    );

    // push to list of subscriptions for easily unsubscribes all subscriptions of the CategoryListComponent
    this.subscriptions.push(

      // get total of categories and total pages
      this.categoryService.getTotalOfCategories(searchTerm, status)

        .subscribe({
          next: (data: number) => {
            // total of categories
            this.totalOfCategories = data;
            // total pages
            this.totalPages = this.calculateTotalPages(this.totalOfCategories, this.pageSize);
          }
        })
    )
  } // end of searchCategories()

  // calculate total pages for pagination
  calculateTotalPages(totalOfCategories: number, pageSize: number): number {

    if ((totalOfCategories % pageSize) != 0) {
      //  Math.floor: rounds down and returns the largest integer less than or equal to a given number
      return (Math.floor(totalOfCategories / pageSize)) + 1;
    }

    return totalOfCategories / pageSize;

  } // end of calculateTotalPages()

  // count index for current page
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - index: running variable(the index variable of "for loop")
  indexBasedPage(currentPage: number, index: number): number {

    // this.pageSize = 5
    return (this.pageSize * (currentPage - 1)) + (index + 1);
  }

  // go to specific page
  goPage() {

    // if (1 <= currentPage <= totalPages) then go to specific page
    if (this.currentPage >= 1 && this.currentPage <= this.totalPages) {

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get categories, total of categories and total of pages
      this.searchCategories(nth_element, this.searchCategory.value.searchTerm, this.searchCategory.value.status);
    }

  }

  // user changes page number in the text box
  changePageNumber(value: number) {
    this.currentPage = value;
  }

  // move to the first page
  moveFirst() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = 1;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get categories, total of categories and total pages
      this.searchCategories(nth_element, this.searchCategory.value.searchTerm, this.searchCategory.value.status);
    }

  }

  // move to the next page
  moveNext() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.currentPage + 1;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get categories, total of categories and total pages
      this.searchCategories(nth_element, this.searchCategory.value.searchTerm, this.searchCategory.value.status);
    }

  }

  // move to the previous page
  movePrevious() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = this.currentPage - 1;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get categories, total of categories and total pages
      this.searchCategories(nth_element, this.searchCategory.value.searchTerm, this.searchCategory.value.status);
    }

  }

  // move to the last page
  moveLast() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.totalPages;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get categories, total of categories and total pages
      this.searchCategories(nth_element, this.searchCategory.value.searchTerm, this.searchCategory.value.status);
    }
  }

  // view specific category by id
  viewCategory(id: number) {
    this.router.navigate(['/category-view', id]);
  }

  // unsubscribe all subscriptions from this component "CategoryListComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
