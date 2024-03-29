import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../payload/CustomHttpResponse';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // download file from server
  download(customFilename: string): Observable<HttpEvent<Blob>> {

    return this.http.get(`${this.host}/download/${customFilename}/`, {
      // reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });

  }


}
