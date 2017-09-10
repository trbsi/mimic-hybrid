import { Component, /*ViewChild, Input*/ } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ListingPage } from '../listing/listing';
import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';
import { PostLoginService } from '../post-login/post-login.service';
import { ApiSettings } from '../../components/api-settings/api-settings';

@Component({
    selector: 'post-login',
    templateUrl: 'post-login.html'
})
export class PostLogin {

    submit_username:FormGroup;
    //@ViewChild('usernameInput') usernameInput;

    constructor(public nav:NavController, 
        private alertCtrl:AlertController,
        public facebookLoginService:FacebookLoginService, 
        public twitterLoginService:TwitterLoginService,
        public postLoginService:PostLoginService,
        public apiSettings: ApiSettings) 
    {
        this.submit_username = new FormGroup({
            username: new FormControl('', Validators.required),
        });

    }

    ionViewDidLoad() {

        /*setTimeout(() => {
            this.usernameInput.setFocus();
        }, 1000);*/

    }

    /**
     * Submit username
     */
    submitUsername() {
        console.log(this.submit_username.value.username); 
        this.postLoginService.setUsername(this.submit_username.value.username)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
             let alert = this.alertCtrl.create({
                title: 'Low battery',
                subTitle: '10% of battery remaining',
                buttons: ['Ok']
              });
              alert.present();
        });
       // this.nav.setRoot(ListingPage);
    }

    /**
     * Logout
     */
    logout() {
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
}
