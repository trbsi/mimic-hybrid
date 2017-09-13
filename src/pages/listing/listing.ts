import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import 'rxjs/Rx';

import { ListingModel } from './listing.model';
import { ProfilePage } from '../profile/profile';
import { FabContainer } from 'ionic-angular';
import { VgAPI } from 'videogular2/core';
import { VideoPlaylistModel } from '../video-playlist/video-playlist.model';

import { AddMimic } from '../add-mimic/add-mimic';
import { Search } from '../search/search';
import { LoginPage } from '../login/login';

import { AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
//import { enableInlineVideo } from 'iphone-inline-video';
import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';
import { ApiSettings } from '../../components/api-settings/api-settings';
import { ListingService } from '../listing/listing.service';

@Component({
    selector: 'listing-page',
    templateUrl: 'listing.html',
})
export class ListingPage {
    listing:ListingModel = new ListingModel();
    loading:any;
    mainMenuOpened:boolean;
    
    //SLIDES
    firstLoad = true;
    numbersOriginal = [0,1,2]; //used to generate slides https://stackoverflow.com/questions/45506517/ionic-slides-dynamically-add-slides-before-and-after
    numberResponses = [0,1,2]; //used to generate slides https://stackoverflow.com/questions/45506517/ionic-slides-dynamically-add-slides-before-and-after

    //MIMICS
    mimicsList = []; //list of all mimics from the server
    mimicsCount: number; //total number of original mimics
    currentMimicResponse: any; // current responses of one original mimic you are looking at
    currentMimicOriginalIndex = 0; //current index (current original mimic you are looking at)

    //VIDEO
    videoOriginal = []; //original video instances
    videoResponse = []; //response video instances

    @ViewChild('originalMimicSlide') originalMimicSlide:Slides;
    @ViewChild('responseMimicSlide') responseMimicSlide:Slides;

    constructor(public nav:NavController, private alertCtrl:AlertController,
                public loadingCtrl:LoadingController, public facebookLoginService:FacebookLoginService,
                public twitterLoginService:TwitterLoginService,
                public apiSettings:ApiSettings, public listingService:ListingService) 
    {
        this.loading = this.loadingCtrl.create();
        this.mainMenuOpened = false;        
    }

    ngOnInit() {
        
    }

    ionViewDidLoad() {
        this.loading.present();
        this.listingService.getAllMimics().then((data) => {
                this.mimicsList = data.mimics; 
                this.mimicsCount = data.count-1; //because your are counting from index 0 
                this.loading.dismiss();
                this.currentMimicResponse = this.mimicsList[0].mimic_responses;
                console.log(this.currentMimicResponse);
            }); 
    }

    ionViewDidEnter() {
        if(this.mimicsList) {
        //calclate mimic info position
        //document.getElementById('mimic-info-top').style.top = this.calculateMimicInfoPosition('top') - 10 + "px";
        //document.getElementById('mimic-info-bottom').style.bottom = this.calculateMimicInfoPosition('bottom') + 10 + "px";
        }
    }


    /**
     * Dynamically calculate mimic info position
     * @param string type "top" or "bottom"
     */
    private calculateMimicInfoPosition(type) {
        return document.getElementById('split-' + type).clientHeight - document.getElementsByClassName('slide-zoom')[0].clientHeight - document.getElementById('mimic-info-' + type).clientHeight;
    }


    /**
     * Open specific page
     * @param string page Which page to open
     */
    openPage(page:string, fab:FabContainer) {
        this.closeFab(fab);

        switch (page) {
            case "profile":
                this.nav.push(ProfilePage, {
                    //user: item
                });
                break;
            case "refresh":
                this.refresh();
                break;
            case "search":
                this.nav.push(Search);
                break;
            case "add-mimic":
                this.nav.push(AddMimic);
                break;
        }
    }

    /**
     * Close FAB menu
     * @param FabContainer dab
     */
    closeFab(fab:FabContainer) {
        this.mainMenuOpened = false;
        fab.close();
    }


    /**
     * refresh mimic page
     */
    refresh() {
        alert('refresh');
    }

    /**
     * Open user profile
     * @param int id User id
     */
    openUserProfile(id) {
        alert(id);
    }

    /**
     * Upvote mimic
     * @param int id Id of a mimic
     */
    upvote(id) {
        alert(id);
    }

    /**
     * Reply to original mimic
     * @param int id Original mimic id
     */
    replyToMimic(id) {
        this.nav.push(AddMimic, {
            original_mimic_id: id
        });
    }

    logout(fab:FabContainer) {
        this.closeFab(fab);
        //@TODO remove token
        let alert = this.alertCtrl.create({
            title: 'Logout',
            message: 'Do you want to logout?',
            buttons: [
                {
                    text: 'Yes',
                    role: 'cancel',
                    handler: () => {
                        this.apiSettings.storageRemoveLoginData();
                        this.facebookLoginService.doFacebookLogout();
                        this.twitterLoginService.doTwitterLogout();
                        this.nav.setRoot(LoginPage);
                    }
                },
                {
                    text: 'No',
                    handler: () => {
                    }
                }
            ]
        });
        alert.present();

    }

    //SLIDES
    /**
     * When side has been changed
     * @param string type "original" or "response"
     */
    private slideChanged(type, index) {
        switch (type) {
            case "original":
                if (this.videoOriginal[index] != undefined) {
                    this.videoOriginal[index].pause();
                }
                break;
            case "response":
                if (this.videoResponse[index] != undefined) {
                    this.videoResponse[index].pause();
                }
                break;
        }

        this.videoResponse.forEach(eachObj => {
            //(eachObj.getDefaultMedia()).loadMedia();
        });
        
    }

    /**
     * When side has been changed
     * @param string type "original" or "response"
     */
    loadPrev(type) 
    { 
        /*switch (type) {
            case "original":
                var numbers = this.numbersOriginal; 
                break;
            case "response":
                var numbers = this.numberResponses; 
                break;
        }*/

        let newIndex  = this.originalMimicSlide.getActiveIndex();
        //set new current mimic response and reset numbering
        this.currentMimicOriginalIndex = this.numbersOriginal[newIndex];
        this.setCurrentMimicResponses(this.currentMimicOriginalIndex);

        newIndex++;

        //add to the beginning of array
        this.numbersOriginal.unshift(this.numbersOriginal[0] - 1);
        //remove from end of array
        this.numbersOriginal.pop();

        // Workaround to make it work: breaks the animation, but with "loop" on ion-slides fixes it
        this.originalMimicSlide.slideTo(newIndex, 0, false);

        //if first number of array is -1 that means that you are at the beginning of array, disable swipe to left
        if(this.numbersOriginal[0] == -1)  {
            this.originalMimicSlide.lockSwipeToPrev(true);
        }

        //when slide is changed pause previous video
        this.slideChanged(type, this.numbersOriginal[newIndex+1]); 
    }
    
    /**
     * When side has been changed
     * @param string type "original" or "response"
     */
    loadNext(type) 
    {
        let newIndex = this.originalMimicSlide.getActiveIndex();
        //set new current mimic response and reset numbering
        this.currentMimicOriginalIndex = this.numbersOriginal[newIndex];
        this.setCurrentMimicResponses(this.currentMimicOriginalIndex);

        if(this.firstLoad) {
             // Since the initial slide is 1, prevent the first 
            // movement to modify the slides
            this.firstLoad = false;
            this.slideChanged(type, this.numbersOriginal[0]); 
            this.setCurrentMimicResponses(this.currentMimicOriginalIndex);
            return;
        }

        this.originalMimicSlide.lockSwipeToPrev(false);       
        if(this.numbersOriginal[this.numbersOriginal.length - 1] == this.mimicsCount) {
            console.log('nema vise');
            //this.originalMimicSlide.lockSwipeToNext(true);

        }

        newIndex--;
        this.numbersOriginal.push(this.numbersOriginal[this.numbersOriginal.length - 1] + 1); 
        this.numbersOriginal.shift();
        // Workaround to make it work: breaks the animation
        this.originalMimicSlide.slideTo(newIndex, 0, false);   

        //when slide is changed pause previous video
        this.slideChanged(type, this.numbersOriginal[newIndex-1]);


    }

    /**
     * When you change original mimic you have to set new responses to show for that mimic
     */
    private setCurrentMimicResponses(currentMimicOriginalIndex)
    {
        this.currentMimicResponse = this.mimicsList[currentMimicOriginalIndex].mimic_responses;
        this.numberResponses = [0,1,2]; //reset our array
        this.videoResponse = []; //reset our array
        this.responseMimicSlide.slideTo(0, 0, false);  //set slide back to index 0 
    }

    originalSlideWillChange()
    {    
        //reset responses slides to zero so you can to reload of new data
        this.numberResponses = [];
    }
    //SLIDES

    //VIDEOS
    /**
     * When player is ready initalize it
     * @param {VgAPI}  api
     * @param string type "original" or "response"
     */
    onPlayerReady(api:VgAPI, type, n) {
        switch (type) {
            case "original":
                this.videoOriginal[n] = api;
                break;
            case "response":
                this.videoResponse[n] = api;                
                break;
        }
    }

    dismissLoader() {
        // Check if the current instance is usable
        if (this.loading !== undefined) {
            // If it's not usable, then create a new one
            this.loading.dismiss();
        }
    }

    //VIDEOS

}
