import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PropertyService } from '../services/property-services';


@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.scss']
})
export class MyListingsComponent implements OnInit {
  myPropertyList;
  path;
  Url = "http://localhost:4040/"
  isData: boolean

  constructor(private propertyService: PropertyService, public toastr: ToastrService, private router: Router) {
    this.myPropertyList = []

  }

  open(id) {
    this.router.navigateByUrl(`/property/${id}`)
  }

  delete(id) {
    console.log(id)
    this.propertyService.deleteProperty(id).subscribe((res: any) => {
      this.toastr.error("This Property has been deleted");
      this.ngOnInit()
    })

  }

  ngOnInit() {
    this.propertyService.getPropertyByUser().subscribe((response: any) => {
      this.myPropertyList = response.data
      console.log(response.data)

      if (this.myPropertyList.length == 0) {
        console.log("empty")
        this.isData = false
      }
      else {
        this.isData = true
      }



    }, err => {
      console.log(err)
    })
  }
}
