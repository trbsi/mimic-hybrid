import { Component, ViewChild, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ListingPage } from '../listing/listing';

@Component({
    selector: 'post-login',
    templateUrl: 'post-login.html'
})
export class PostLogin {

    submit_username:FormGroup;
    @ViewChild('usernameInput') usernameInput;

    constructor(public nav:NavController, private alertCtrl:AlertController) {
        this.submit_username = new FormGroup({
            username: new FormControl('', Validators.required),
        });

    }

    ionViewDidLoad() {

        setTimeout(() => {
            this.usernameInput.setFocus();
        }, 1000);

    }

    submitUsername() {
        this.nav.setRoot(ListingPage);
    }

    logout() {
        let alert = this.alertCtrl.create({
            title: 'Logout',
            message: 'Do you want to logout?',
            buttons: [
                {
                    text: 'Yes',
                    role: 'cancel',
                    handler: () => {
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
