import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginUser } from '../entity/LoginUser';
import { User } from '../entity/User';

@Injectable({
  providedIn: 'root'
})
// the LoginService
export class AuthService {

  // apiUrl = 'http://localhost:8080'
  public host = environment.apiUrl;

  public urlAfterLogin = environment.urlAfterLogin;

  public token: string;

  // the logged in email
  public loggedInEmail: string;


  public loggedInUsername: string;
  public jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  // POST method: /login
  // when user clicks on the "Login" button
  public login(loginUser: LoginUser): Observable<HttpResponse<User>> {

    return this.http.post<User>(`${this.host}/login`, loginUser, { observe: 'response' });

  }

  // clear all data in the local storage and local variable
  public logOut(): void {

    // clear all local variables contain the logged in information
    this.token = null;

    this.loggedInEmail = null;

    // clear all saved data in localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

  }

  // save token into the local storage and local variable
  public saveTokenToLocalStorage(token: string): void {

    this.token = token;

    localStorage.setItem('token', token);

  }

  // add the logged in user into the local strorage
  public saveUserToLocalStorage(user: User): void {

    // save user object with json string format
    localStorage.setItem('user', JSON.stringify(user));

  }

  // get user from local storage
  public getUserFromLocalStorage(): User {

    return JSON.parse(localStorage.getItem('user'));

  }

  // assign token from local storage to attribute
  public loadToken(): void {

    this.token = localStorage.getItem('token');

  }

  // get token from attribute
  public getToken(): string {

    return this.token;

  }

  // check whether user logged in or not?
  // return:
  //    - true: user already logged in
  //    - false: user has not yet logged in
  public isLoggedInUser(): boolean {

    // load token from localStorage to attribute(token)
    this.loadToken();

    // if token is existing in the local storage
    if (this.token != null && this.token !== '') {

      // get value subject in the token(it means the email id).
      // if email is not empty
      // if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null) {

        // if token has not yet expired
        if (!this.jwtHelper.isTokenExpired(this.token)) {

          this.loggedInEmail = this.jwtHelper.decodeToken(this.token).sub;

          return true;

        }
      }
    } else {
      this.logOut();
      return false;
    }

    return false;
    
  }

  // get id of the logged in user
  public getIdFromLocalStorage(): string {

    // if user is existing in the local storage
    if (JSON.parse(localStorage.getItem('user')) != null) {

      return JSON.parse(localStorage.getItem('user')).id;

    }

    return "";
  }

  // get email of the logged in user
  public getEmailFromLocalStorage(): string {

    // if user is existing in the local storage
    if (JSON.parse(localStorage.getItem('user')) != null) {

      return JSON.parse(localStorage.getItem('user')).email;

    }

    return "";
  }

  // get role of the logged in user
  public getRoleFromLocalStorage(): string {

    // if user is existing in the local storage
    if (JSON.parse(localStorage.getItem('user')) != null) {

      return JSON.parse(localStorage.getItem('user')).role;

    }

    return "";

  }

  // get token from local storage
  public getTokenFromLocalStorage(): string {

    return localStorage.getItem("token");

  }

}

