import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';

import { ListingModel } from './listing.model';
import { ListingService } from './listing.service';
import { ProfilePage } from '../profile/profile';
import { FabContainer } from 'ionic-angular';
import { VgAPI } from 'videogular2/core';
import { VideoPlaylistModel } from '../video-playlist/video-playlist.model';

@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {
  listing: ListingModel = new ListingModel();
  loading: any;
  mainMenuOpened: boolean;

  start_playing: boolean = false;
  api: VgAPI;
  video_playlist_model: VideoPlaylistModel = new VideoPlaylistModel();

  constructor(
    public nav: NavController,
    public listingService: ListingService,
    public loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create();
    this.mainMenuOpened = false;
  }


    ionViewDidLoad() {
    this.loading.present();
    this.listingService
      .getData()
      .then(data => {
        this.listing.banner_image = data.banner_image;
        this.listing.banner_title = data.banner_title;
        this.listing.populars = data.populars;
        this.listing.categories = data.categories;
        this.loading.dismiss();
      });
    }


    goToFeed(category: any) {
    console.log("Clicked goToFeed", category);
    this.nav.push(FeedPage, { category: category });
    }

    /**
     * Open specific page
     * @param string page Which page to open
     */
    openPage(page: string, fab: FabContainer) {
        this.mainMenuOpened = false;
        fab.close();
        switch (page) {
            case "profile":
                this.nav.push(ProfilePage, {
                  //user: item
                });
                break;
            
            default:
                // code...
                break;
        }
    }

    /**
     * refresh mimic page
     */
    refresh()
    {

    }

    /**
     * Open user profile
     * @param int id User id
     */
    openUserProfile(id)
    {   
        alert(id);
    }


    createLoader(){
        this.loading = this.loadingCtrl.create();
    }

    presentLoader(){
        // Check if the current instance is usable
        if (this.loading === undefined || (this.loading !== undefined && this.loading.instance === null)){
            // If it's not usable, then create a new one
            this.createLoader();
        }

        this.loading.present();
    }

    dismissLoader(){
        // Check if the current instance is usable
        if (this.loading !== undefined){
            // If it's not usable, then create a new one
            this.loading.dismiss();
        }
    }

    playMedia(media) {
    // Check if this media is not the same we are currently playing
    if(media !== this.video_playlist_model.selected_video)
    {
      this.presentLoader();
          // Change sources
          this.video_playlist_model.selected_video = media;
          // When changing sources we wait until the metadata is loaded and then we start playing the video
    }
    }

    onPlayerReady(api: VgAPI) {
    this.api = api;
        this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
    }

  playVideo() {
        if(this.start_playing)
        {
            this.dismissLoader();
        this.api.play();
        }
        else
        {
            this.start_playing = true;
        }
  }
}
