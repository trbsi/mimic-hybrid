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
     * @param string type What type of request to send: get, post
     */
    sendRequest(data, url, type) {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        var headers = new Headers();
        return this.storage.getItem('token')
            .then(
            (token) => {
                headers.append('Authorization', 'Bearer ' + token);
                this.loading.dismiss();
                if(type == 'post') {
                    return this.doPost(data, url, headers);
                } else if (type == 'get') {
                    return this.doGet(data, url, headers);
                }
            },
            //couldn't find token, do normal post
            (error) => {
                //@TODO remove this, this is just for testing
                headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjk3LCJpc3MiOiJodHRwOi8vbWltaWMudGVzdGFwaS53ZWJzaXRlL2FwaS9hdXRoL2xvZ2luIiwiaWF0IjoxNTA1MTY2Mjk5LCJleHAiOjE1MDc4NjYyOTksIm5iZiI6MTUwNTE2NjI5OSwianRpIjoiOGtlcUlZSWd2OVR3cHhURiJ9.yPWkSTYgahZWxwA__uyi7k-pCvKXoBm30I4GkHCvJ_g');
                this.loading.dismiss();
                if(type == 'post') {
                    return this.doPost(data, url, headers);
                } else if (type == 'get') {
                    return this.doGet(data, url, headers);
                }
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
     * This is where you send request to a server
     * @param any getData Url parameters
     * @param string url Url to post to
     * @param Headers headers What headers to include
     */
    private doGet(getData, url, headers) {
        this.createHeaders(headers);
        let options = new RequestOptions({params:getData, headers: headers});
        return this.http.get(ApiSettings.API_ENDPOINT + url, options)
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
        return this.storage.setItem('token', loginData.token)
        .then(
            () => {
                console.log('Token set');
                return this.storage.setItem('username', loginData.username)
                .then(
                    () => {
                        console.log('Username set!');
                        return this.storage.setItem('user_id', loginData.user_id)
                        .then(
                            () => {
                                console.log('User ID set!')
                            },
                            error => console.error('Error storing ser ID', error)
                        );
                    },
                    error => console.error('Error storing username', error)
                );
            },
            error => console.error('Error storing token', error)
        );
    }

    storageRemoveLoginData() {
        this.storage.remove('token');
        this.storage.remove('username');
        this.storage.remove('user_id');
    }


}