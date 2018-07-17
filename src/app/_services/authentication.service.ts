import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
import { appConfig } from '../app.config';
 
@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }
 
    login(username: string, password: string, isPanel: boolean) {
        return this.http.post<any>(appConfig.apiUrl + '/users/authenticate', { username: username, password: password, isPanel: isPanel })
            .map(user => {
                // login successful if there's a jwt token in the response
                console.log("-----------------------------------------------------------");
                console.log(user);
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
 
                return user;
            })
    }
 
    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
    }
}