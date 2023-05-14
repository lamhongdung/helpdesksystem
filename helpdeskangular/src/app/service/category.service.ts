import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../payload/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

 
  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of categories per page(default = 5)
  pageSize = environment.pageSize;

  constructor(private http: HttpClient) { }

  // get categories by page and based on the search criteria
  searchCategories(pageNumber: number, searchTerm: string, status: string): Observable<Category[]> {

    // ex: url = http://localhost:8080/category-search?pageNumber=0&pageSize=5&searchTerm=""&status=""
    // console.log(`${this.host}/category-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&status=${status}`)
    return this.http.get<Category[]>(
      `${this.host}/category-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&status=${status}`
    )
  }

  // calculate total of categories for count total pages
  getTotalOfCategories(searchTerm: string, status: string): Observable<number> {

    // ex: http://localhost:8080/total-of-categories?searchTerm=""&status=""
    return this.http.get<number>(
      `${this.host}/total-of-categories?searchTerm=${searchTerm}&status=${status}`
    );

  }

  // create new category
  public createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.host}/category-create`, category);
  }

  // edit existing category
  public editCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.host}/category-edit`, category);
  }

  // find category by id
  findById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.host}/category-list/${id}`);
  }

}