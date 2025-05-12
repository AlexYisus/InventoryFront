import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import CryptoJs from "crypto-js";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private static BASE_URL = 'https://100.125.73.100:8080/api'; 
  //  private static BASE_URL = 'https://218b88ada564ed5514841423133e0a31.serveo.net/api'; //endpoint
  private static ENCRIPTION_KEY = "my-encrytion-key"

  authStatusChanged = new EventEmitter <void>();

  constructor(private http: HttpClient) { }

  encryptAndSaveToStorage(key:string, value:string):void{
    const encryptValue = CryptoJs.AES.encrypt(value,ApiService.ENCRIPTION_KEY).toString()
    localStorage.setItem(key,encryptValue);
  }

  private getFromStorageAndDecrypt(key:string):string | null {
    try{
      const encryptedValue = localStorage.getItem(key);
      if(!encryptedValue) return null
      return CryptoJs.AES.decrypt(encryptedValue, ApiService.ENCRIPTION_KEY).toString(CryptoJs.enc.Utf8)
    } catch (error){
      return null;
    }
  }

  private clearAuth(){
    localStorage.removeItem("token")
    localStorage.removeItem("role")
  }
  private getHeader (): HttpHeaders{
    const token = this.getFromStorageAndDecrypt("token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  }

  //AUTH USERS API METHODS
  registerUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }
  
  loginUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }
  
  getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/current`, {
      headers: this.getHeader(),
    });
  }

    /*** CATEGORY ENDPOINTS ***/
  createCategory(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/categories/add`, body, {
      headers: this.getHeader(),
    });
  }

  getAllCategory(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/all`, {
      headers: this.getHeader(),
    });
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/${id}`, {
      headers: this.getHeader(),
    });
  }

  updateCategory(id: number, body: any): Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/categories/update/${id}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  deleteCategory(id: number): Observable<any>{
      return this.http.delete(`${ApiService.BASE_URL}/categories/delete/${id}`, {
        headers: this.getHeader(),
      }
    )
  }

    /*** SUPPLIER API ***/
  addSupplier(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/suppliers/add`, body, {
      headers: this.getHeader(),
    });
  }

  getAllSuppliers(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/all`, {
      headers: this.getHeader(),
    });
  }

  getSupplierById(id: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/${id}`, {
      headers: this.getHeader(),
    });
  }

  updateSupplier(id:number, body:any):Observable<any>{
    return this.http.put(
      `${ApiService.BASE_URL}/suppliers/update/${id}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  deleteSupplier(id:number):Observable<any>{
    return this.http.delete(`${ApiService.BASE_URL}/suppliers/delete/${id}`,{
      headers: this.getHeader(),
    })
  }

  //PRODUCTS ENDPOINTS
  addProduct(formData: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/products/add`, formData, {
      headers: this.getHeader(),
    });
  }

  updateProduct(formData: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/products/update`, formData, {
      headers: this.getHeader(),
    });
  }

  getAllProducts(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/all`, {
      headers: this.getHeader(),
    });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/${id}`, {
      headers: this.getHeader(),
    });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}`, {
      headers: this.getHeader(),
    });
  }

    /** Transactions Endpoints */

  purchaseProduct(body: any): Observable<any> {
    return this.http.post(
      `${ApiService.BASE_URL}/transactions/purchase`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  sellProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell`, body, {
      headers: this.getHeader(),
    });
  }

  getAllTransactions(searchText: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/all`, {
      params: { searchText: searchText },
      headers: this.getHeader(),
    });
  }

  getTransactionById(id: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`, {
      headers: this.getHeader(),
    });
  }

  updateTransactionStatus(id: number, status: string): Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/transactions/update/${id}`,
      JSON.stringify(status),
      {
        headers: this.getHeader().set("Content-Type", "application/json"),
      }
    );
  }

  getTransactionsByMonthAndYear(month: number, year: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/by-month-year`, {
      headers: this.getHeader(),
      params: {
        month: month,
        year: year,
      },
    });
  }

  //AUTHENTICACION CHECKER
  logout():void{
    this.clearAuth()
  }

  isAuthenticated():boolean{
    const token = this.getFromStorageAndDecrypt("token");
    return !!token;
  }

  isAdmin():boolean{
    const role = this.getFromStorageAndDecrypt("role");
    return role === "ADMIN"
  }


}
