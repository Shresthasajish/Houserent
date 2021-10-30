import { Injectable } from '@angular/core';
import { BaseService } from './../../shared/base.service'
import { HttpClient } from '@angular/common/http';
import { Property } from '../../models/property.model';
import { Observable } from 'rxjs';


@Injectable()
export class FavouritesService extends BaseService {
    constructor(
        public http: HttpClient
    ) {
        super('favorite');
    }


    addToFav(data) {
        return this.http.post(this.url + 'add', data, this.getOptionsWithToken());
    }

    // getFav() {
    //     return this.http.get(this.url + 'all', this.getOptions());
    // }

    getFavByUser() {
        return this.http.get(this.url + 'single', this.getOptionsWithToken());
    }

    getFavById(id) {
        return this.http.get(this.url + 'single/' + id, this.getOptionsWithToken());
    }

    deleteFav(id) {
        return this.http.delete(this.url + id, this.getOptionsWithToken());
    }
}




