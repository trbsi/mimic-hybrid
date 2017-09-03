import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import 'rxjs/Rx';

import { SearchModel } from './search.model';
import { SearchService } from './search.service';
import { ViewChild } from '@angular/core';
import { Searchbar } from 'ionic-angular';

@Component({
  selector: 'searcg-page',
  templateUrl: 'search.html'
})
export class Search {
  list2: SearchModel = new SearchModel();
  loading: any;

  @ViewChild(Searchbar) searchbar: Searchbar;

  constructor(
    public nav: NavController,
    public list2Service: SearchService,
    public loadingCtrl: LoadingController
  ) 
  {
    this.loading = this.loadingCtrl.create();
  }

    ionViewDidLoad() {
        setTimeout(() => {
            this.searchbar.setFocus();
        }, 1000);
        this.loading.present();
        this.list2Service
        .getData()
        .then(data => {
            this.list2.items = data.items;
            this.loading.dismiss();
        });
    }

    onCancel()
    {

    }

}
