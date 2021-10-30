import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FavouritesService } from '../services/favourites.services';
import { PropertyService } from '../services/property-services';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  allFav: []
  Url = 'http://localhost:4040/'
  constructor(private propertyService: PropertyService, private router: Router,
    private favouriteService: FavouritesService, private toastr: ToastrService) {


  }

  ngOnInit() {

    this.favouriteService.getFavByUser().subscribe((response: any) => {
      this.allFav = response.data.array_of_property
      console.log(this.allFav)
    })
  }
  
  open(id) {
    this.router.navigateByUrl(`/property/${id}`)
  }

  removeFromFav(id) {
    const index = this.allFav.findIndex((el: any) => el._id === id)

    const newObject = { property_id: id, status: false };
    this.favouriteService.addToFav(newObject).subscribe((response: any) => {
      console.log(response)
      this.toastr.success("Removed from Favourites")
      this.allFav.splice(index, 1);
    }, err => {
      console.log(err)
    })
  }


}
