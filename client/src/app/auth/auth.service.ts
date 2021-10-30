import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { User } from 'src/app/models/user.model';
import { JwtHelperService } from "@auth0/angular-jwt";
// import { NotifyService } from 'src/app/shared/services/notify.service';
import { BaseService } from "../shared/base.service";



@Injectable()

export class AuthService extends BaseService {

    constructor(
        public http: HttpClient,
        // public notifyService: NotifyService
    ) {
        super('user');
    }

    login(data: User) {
        return this.http.post(this.url + 'login', data, this.getOptions())
    }

    verify(data: any) {
        console.log('Data--->', data)
        return this.http.post(this.url + 'verify-email', data, this.getOptions())
    }



    register(data: User) {
        return this.http.post(this.url + 'register', data, this.getOptions())
    }

    changePass(passwords) {
        return this.http.post(this.url + 'change-password', passwords, this.getOptionsWithToken())
    }

    forgotPass(user) {
        return this.http.post(this.url + 'forgot-password', user, this.getOptions())
    }
    resetPass(user) {
        return this.http.post(this.url + 'reset-password', user, this.getOptions())
    }


    isLoggedIn() {

        var token = localStorage.getItem('token');

        if (token) {

            const helper = new JwtHelperService();
            if (!helper.isTokenExpired(token)) {
                console.log(helper.decodeToken(token))
                console.log('Token available');
                return true;
            }
        }

        console.log('Token unavailable');

        // this.notifyService.showInfo('You are not logged in')

        return false;


        // here you can check if user is authenticated or not through his token 

    }









}