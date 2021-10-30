import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FavouritesService } from '../services/favourites.services';
import { PropertyService } from '../services/property-services';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  allProperties: [object]
  Url = "http://localhost:4040/"
  p: number = 1;
  parkingList

  searchP;

  constructor(private propertyService: PropertyService, public router: Router,
    private favouriteService: FavouritesService, private toastr: ToastrService) {

    this.parkingList = [
      "",
      {
        key: "Available",
        value: true
      },
      {
        key: "Not Available",
        value: false
      }]

    this.searchP = {
      address: "",
      propertyType: "",
      numberOfRooms: "",
      maximum_budget: "",
      city: "",
      parking: ""
    }
  }

  ngOnInit() {
    this.propertyService.getProperty().subscribe((response: any) => {
      this.allProperties = response.data
      // console.log(this.allProperties)
    }, err => {
      console.log(err)
    })
  }

  search() {
    this.propertyService.getPropertyFiltered(this.searchP).subscribe((response: any) => {
      this.allProperties = response.data
      console.log(this.allProperties)
    }, err => {
      console.log(err)
    })
  }



  open(id) {
    this.router.navigateByUrl(`/property/${id}`)
  }

  isLoggedIn() {
    return localStorage.getItem('token') ? true : false
  }



  addToFav(id) {
    const newObject = { property_id: id, status: true };
    this.favouriteService.addToFav(newObject).subscribe((response: any) => {
      console.log(response)
      this.toastr.success("Added to Favourites")

    }, err => {
      console.log(err)
    })

  }


}
