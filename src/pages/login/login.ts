import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';

import { ListingPage } from '../listing/listing';
import { PostLogin } from '../post-login/post-login';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
//import { GoogleLoginService } from '../google-login/google-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';
import { LoginService } from '../login/login.service';
import { ApiSettings } from '../../components/api-settings/api-settings';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
    selector: 'login-page',
    templateUrl: 'login.html'
})
export class LoginPage {

    constructor(public nav:NavController, public login_service:LoginService,
                public facebookLoginService:FacebookLoginService,
                //public googleLoginService:GoogleLoginService,
                public twitterLoginService:TwitterLoginService,
                public modal:ModalController,
                private storage:NativeStorage,
                public alertCtrl: AlertController,
                public apiSettings:ApiSettings) {
    }


    /**
     * Redirect user to mimics page or post login page
     */
    private redirectUserToTheRightPage() {
        //see if user is loggedin, if he is check if he set username
        this.storage.getItem('user')
            .then((data) => {
                //if he has username you can redirect to main screen
                if (data.username == false || data.username == null) {
                    this.nav.setRoot(PostLogin);
                } else {
                    this.nav.setRoot(ListingPage);
                }
            },
                error => {
                console.log(error);
            }
        );
    }

    //@TODO - not necessary, just for testing
    doLogin() {
        this.nav.setRoot(ListingPage);
    }

    doFacebookLogin() {
        const alert = this.alertCtrl.create({
        title: 'Agree to the terms and conditions',
        message: "By logging in you agree to Mimic's terms of use and privacy policy.",
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: 'I agree',
            handler: () => {
                this.facebookLoginService.doFacebookLogin()
                .then((res) => {
                    //send request to server
                    this.login_service.loginOnServer(res, 'facebook')
                        .then(response => {
                            this.apiSettings.storageSetLoginData(response).then(() => {
                                this.redirectUserToTheRightPage();
                            });
                        })
                        .catch(error => {
                            console.log("FB login error", error);
                        });

                }, (err) => {
                    console.log("Facebook Server Login error", err);
                });
            }
          }
        ]
      });
      alert.present();

    }

    /*doGoogleLogin() {

     // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app

     this.googleLoginService.trySilentLogin()
     .then((data) => {
     // user is previously logged with Google and we have his data we will let him access the app
     this.nav.setRoot();
     }, (error) => {
     //we don't have the user data so we will ask him to log in
     this.googleLoginService.doGoogleLogin()
     .then((res) => {
     this.nav.setRoot();
     }, (err) => {
     console.log("Google Login error", err);
     });
     });
     }*/

    doTwitterLogin() {
        const alert = this.alertCtrl.create({
        title: 'Agree to the terms and conditions',
        message: "By logging in you agree to Mimic's terms of use and privacy policy.",
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: 'I agree',
            handler: () => {
                //we don't have the user data so we will ask him to log in
                this.twitterLoginService.doTwitterLogin()
                    .then((res) => {
                        //send request to server
                        this.login_service.loginOnServer(res, 'twitter')
                            .then((response) => {
                                this.apiSettings.storageSetLoginData(response).then(() => {
                                    this.redirectUserToTheRightPage();
                                });
                            })
                            .catch(error => {
                                console.log("FB login error", error);
                            });
                    }, (err) => {
                        console.log("Twitter Login error", err);
                    });
            }
          }
        ]
      });
      alert.present();

    }


    showTermsModal() {
        let modal = this.modal.create(TermsOfServicePage);
        modal.present();
    }

    showPrivacyModal() {
        let modal = this.modal.create(PrivacyPolicyPage);
        modal.present();
    }

}
