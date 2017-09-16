import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import 'rxjs/Rx';

import { SearchService } from './search.service';
import { ViewChild } from '@angular/core';
import { Searchbar } from 'ionic-angular';

@Component({
    selector: 'search-page',
    templateUrl: 'search.html'
})
export class Search {
    searchResult:any;
    loading:any;
    searchTerm:string;

    @ViewChild(Searchbar) searchbar:Searchbar;

    constructor(public nav:NavController,
                public searchService:SearchService,
                public loadingCtrl:LoadingController) {
        //this.loading = this.loadingCtrl.create();
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
        if(this.searchTerm.length > 1 && this.searchTerm != "@" && this.searchTerm != "#") {
            this.searchService.search(this.searchTerm)
            .then(data => {
                console.log(data);
                this.searchResult = data;
            });
        }
        
    }

}
