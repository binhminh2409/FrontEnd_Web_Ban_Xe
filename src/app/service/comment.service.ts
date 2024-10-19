import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentModel } from '../models/Comment';
import { Observable } from 'rxjs';
import { GetCommentModel } from '../models/GetCommentModel';

const api = 'https://localhost:5001/api';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  create(comment: CommentModel): Observable<any> {
    const formData = new FormData();
    formData.append('UserId', comment.UserId.toString());
    formData.append('ProductId', comment.ProductId.toString());
    formData.append('Description', comment.Description);

    return this.http.post(`${api}/Comment/Create`, formData);
  }

  getComment(userId: number, productId: number): Observable<{ success: boolean; data: GetCommentModel[] }> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString());

    return this.http.get<{ success: boolean; data: GetCommentModel[] }>(`${api}/Products/GetViewProductType`, { params });
  }
}
