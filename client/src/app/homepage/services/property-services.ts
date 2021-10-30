import { Injectable } from '@angular/core';
import { BaseService } from './../../shared/base.service'
import { HttpClient } from '@angular/common/http';
import { Property } from '../../models/property.model';
import { Observable } from 'rxjs';


@Injectable()
export class PropertyService extends BaseService {
    constructor(
        public http: HttpClient
    ) {
        super('property');
    }

    getProperty() {
        return this.http.get(this.url + 'all', this.getOptions());
    }

    getPropertyFiltered(filter) {
        console.log(filter)
        return this.http.get(this.url + 'all' + `?address=${filter.address}&propertyType=${filter.propertyType}&numberOfRooms=${filter.numberOfRooms}&maximum_budget=${filter.maximum_budget}&city=${filter.city}&parking=${filter.parking}`, this.getOptions());


    }

    getPropertyByUser() {
        return this.http.get(this.url + 'user', this.getOptionsWithToken());
    }

    getPropertyById(id) {
        return this.http.get(this.url + 'single/' + id, this.getOptions());
    }

    deleteProperty(id) {
        return this.http.delete(this.url + 'delete/' + id, this.getOptionsWithToken());
    }




    // Add and edit article with file upload XHR 

    uploadProperty(property: Property, files: Array<any>, method) {
        return new Observable((observer) => {

            const xhr = new XMLHttpRequest();
            const formData = new FormData();

            if (files.length) {
                for (let i = 0; i < files.length; i++) {
                    formData.append('images', files[i], files[i].name)
                }

            }

            for (let key in property) {
                formData.append(key, property[key])
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        observer.next(xhr.response)
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            }
            let endUrl;

            if (method == 'PUT') {
                endUrl = this.url + 'edit/' + property._id + '?token=' + localStorage.getItem('token')
            }
            else {
                endUrl = this.url + 'save' + '?token=' + localStorage.getItem('token')

            }
            xhr.open(method, endUrl, true);
            xhr.send(formData)

        })


    }






}




