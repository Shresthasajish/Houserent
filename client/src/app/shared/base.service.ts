import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';


export class BaseService {
    url;
    constructor(PostUrl: String) {
        this.url = environment.BaseUrl + PostUrl + '/';
    }

    getOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
        }
    }

    getOptionsWithToken() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            })
        }
    }

}


