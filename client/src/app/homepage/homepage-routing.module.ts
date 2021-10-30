import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPropertyComponent } from './add-property/add-property.component';
import { ExploreComponent } from './explore/explore.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { HomepageComponent } from './homepage.component';
import { MyListingsComponent } from './my-listings/my-listings.component';
import { ViewPropertyComponent } from './view-property/view-property.component';


const homepageRoutes: Routes = [

    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'explore',
        component: ExploreComponent
    },
    {
        path: 'myListing',
        component: MyListingsComponent
    },
    {
        path: 'add-property',
        component: AddPropertyComponent
    },
    {
        path: 'property/:id',
        component: ViewPropertyComponent
    },
    {
        path: 'favourites',
        component: FavouritesComponent
    },


];

@NgModule({
    imports: [RouterModule.forChild(homepageRoutes)],
    exports: [RouterModule]
})
export class HomepageRoutingModule { }
