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

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {
    listing: ListingModel = new ListingModel();
    loading: any;
    mainMenuOpened: boolean;

    //VIDEO
    start_playing: boolean = false;
    videoOriginal: VgAPI;
    videoResponse: VgAPI;
    video_playlist_model: VideoPlaylistModel = new VideoPlaylistModel();

    @ViewChild(Slides) slides: Slides;

    constructor(
    public nav: NavController,
    public listingService: ListingService,
    public loadingCtrl: LoadingController
    ) 
    {
        this.loading = this.loadingCtrl.create();
        this.mainMenuOpened = false;
    }


    ionViewDidLoad() 
    {
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

    /**
     * Upvote mimic
     * @param int id Id of a mimic
     */
    upvote(id)
    {

    }

    //SLIDES
    /**
     * When side has been changed
     * @param string type "original" or "response"
     */
    slideChanged(type) {
        switch (type) {
            case "original":
                if(this.videoOriginal != undefined) {
                    this.videoOriginal.pause();
                }
                break;
            case "response":
                if(this.videoResponse != undefined) {
                    this.videoResponse.pause();
                }
                break;
        }

        console.log(this.slides.isEnd());
    }


    //VIDEOS
    /**
     * When player is ready initalize it
     * @param {VgAPI}  api 
     * @param string type "original" or "response"
     */
    onPlayerReady(api: VgAPI, type) {
        switch (type) {
            case "original":
                this.videoOriginal = api;
                break;
            case "response":
                this.videoResponse = api;
                break;
        }
        
    }

    dismissLoader()
    {
        // Check if the current instance is usable
        if (this.loading !== undefined){
            // If it's not usable, then create a new one
            this.loading.dismiss();
        }
    }
    //VIDEOS
}
