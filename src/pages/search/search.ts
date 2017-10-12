import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import 'rxjs/Rx';

import { SearchService } from './search.service';
import { ViewChild } from '@angular/core';
import { Searchbar } from 'ionic-angular';
import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';

@Component({
    selector: 'search-page',
    templateUrl: 'search.html'
})
export class Search {

    searchResult = [];
    loading:any;
    searchTerm:string;
    startSearch = false;

    @ViewChild(Searchbar) searchbar:Searchbar;

    constructor(public nav:NavController,
                public searchService:SearchService) {
    }

    ionViewDidLoad() {
        /*setTimeout(() => {
         this.searchbar.setFocus();
         }, 1000);*/
    }

    onCancel() {
        this.searchResult = [];
    }

    /**
     * Search for username or hashtag
     * @param any event Some ion-searchbar event
     */
    search(event) {
        if (this.searchTerm.length >= 4 && this.searchTerm != "@" && this.searchTerm != "#") {
            this.startSearch = true;
            this.searchService.search(this.searchTerm)
                .then(data => {
                    this.searchResult = data;
                    this.startSearch = false;
                });
        }

    }

    /**
     * Either open user's profile or go to listings page and filter mimics by hashtag
     * @param object data Hashtag or User data
     */
    doAction(data) {
        switch (this.searchTerm.charAt(0)) {
            case "#":
                this.nav.setRoot(ListingPage, {
                    hashtag_id: data.id
                });
                break;
            case "@":
                this.nav.push(ProfilePage, {
                    user_id: data.id
                });  
                break;
        }

    }

}
