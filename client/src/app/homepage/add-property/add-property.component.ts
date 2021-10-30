import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Property } from '../../models/property.model'
import { PropertyService } from '../services/property-services';
import { MouseEvent } from "@agm/core";


@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
  property: Property;
  files: File[] = [];
  zoom: number = 8;

  lat: number = 27.7172;
  lng: number = 85.3240;
  marker: any = {}



  mapClicked($event: MouseEvent) {
    this.marker = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,
    };
    console.log(this.marker)
  }




  states = ['Province no 1', 'Province no 2', 'Bagmati Province', 'Gandaki Province', 'Lumbini Province', 'Karnali Province', 'Sudurpashchim']
  constructor(private propertyService: PropertyService, private toastr: ToastrService, private router: Router) {
    this.property = new Property()
  }

  ngOnInit() {
  }

  submit() {
    console.log(this.files)
    if (this.marker.lat && this.marker.lng) {
      this.property.lat = this.marker.lat
      this.property.lng = this.marker.lng
    }

    // console.log(this.property)


    this.propertyService.uploadProperty(this.property, this.files, 'POST').subscribe((response: any) => {
      console.log(response)
      this.toastr.success('The property has been added successfully')
      this.router.navigate(['myListing'])

    }, err => {
      console.log(err)
      this.toastr.error('Property adding failed')
    })

  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

}
