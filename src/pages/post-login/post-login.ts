import { Component, ViewChild, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ListingPage } from '../listing/listing';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
    selector: 'post-login',
    templateUrl: 'post-login.html'
})
export class PostLogin {

    submit_username:FormGroup;
    //@ViewChild('usernameInput') usernameInput;

    constructor(public nav:NavController, private alertCtrl:AlertController, private storage: NativeStorage) {
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
        this.nav.setRoot(ListingPage);
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
                        this.storage.remove('token');
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
