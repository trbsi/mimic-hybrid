import { NgModule } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController, LoadingController } from 'ionic-angular';

@NgModule()

export class ApiSettings {
    public static API_ENDPOINT = 'http://mimic.testapi.website/api/';
    allow_entry:string = 'little:cute:chubby';
    loading: any;

    constructor(public http:Http, private storage:NativeStorage, private alertCtrl:AlertController,
        public loadingCtrl:LoadingController) {

    }


    private createHeaders(headers:Headers) {
        headers.append('AllowEntry', btoa(this.allow_entry));
        headers.append('Content-Type', 'application/json');
    }


    private handleError(error) {
        let alert = this.alertCtrl.create({
            title: 'There was a problem',
            subTitle: error.json().error.message,
            buttons: ['Ok']
        });
        alert.present();

        return Promise.reject(error.json()); 
    }

    private handleSuccess(success) {
        return Promise.resolve(success.json()); 
    }

    /**
     * Post data to sevrer
     * @param any postData Data to post to the server
     * @param string url Url to post to
     */
    post(postData, url) {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        var headers = new Headers();
        return this.storage.getItem('token')
            .then(
            (token) => {
                headers.append('Authorization', 'Bearer ' + token);
                this.loading.dismiss();
                return this.doPost(postData, url, headers);
            },
            //couldn't find token, do normal post
            (error) => {
                this.loading.dismiss();
                return this.doPost(postData, url, headers);
            }
        );
    }

    /**
     * This is where you send request to a server
     * @param any postData Data to post to the server
     * @param string url Url to post to
     * @param Headers headers What headers to include
     */
    private doPost(postData, url, headers) {
        this.createHeaders(headers);
        let options = new RequestOptions({headers: headers});
        return this.http.post(ApiSettings.API_ENDPOINT + url, postData, options)
            .toPromise()
            .then((response) => {
                return this.handleSuccess(response);   
            })
            .catch((error) => {
                return this.handleError(error);   
            });
    }

    /**
     * put login data into a storage
     * @param any loginData Data consists of user_id, token and suername
     */
    storageSetLoginData(loginData) {
        this.storage.setItem('token', loginData.token).then
        (
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
        );

        this.storage.setItem('username', loginData.username).then
        (
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
        );

        this.storage.setItem('user_id', loginData.user_id).then
        (
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
        );

    }

    storageRemoveLoginData() {
        this.storage.remove('token');
        this.storage.remove('username');
        this.storage.remove('user_id');
    }


}