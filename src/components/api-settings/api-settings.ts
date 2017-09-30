import { NgModule } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController, LoadingController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@NgModule()

export class ApiSettings {
    public static API_ENDPOINT = 'http://mimic.testapi.website/api/'; //@TODO change to live
    public static APP_VERSION = '1.0.0';
    public static GA_TRACKER_ID = 'UA-102917576-1';
    allow_entry:string = 'almasi:slatkasi';
    loading:any;

    constructor(public http:Http, private storage:NativeStorage, private alertCtrl:AlertController,
                public loadingCtrl:LoadingController, private transfer: FileTransfer) 
    {

    }

    /**
     * [createHeaders description]
     * @param {Headers} headers [description]
     * @param string type What type of request to send: get, post
     */
    private createHeaders(headers:Headers, type) 
    {
        headers.append('AllowEntry', btoa(this.allow_entry));
        if(type != 'upload') {
            headers.append('Content-Type', 'application/json');
        }
    }


    private handleError(error) 
    {
        let alert = this.alertCtrl.create({
            title: 'There was a problem',
            subTitle: error.json().error.message,
            buttons: ['Ok']
        }); 
        alert.present();

        return Promise.reject(error.json());
    }

    private handleSuccess(success) 
    {
        return Promise.resolve(success.json());
    }

    /**
     * Post data to sevrer
     * @param any postData Data to post to the server
     * @param string url Url to post to
     * @param string type What type of request to send: get, post
     */
    sendRequest(data, url, type) 
    {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        var headers = new Headers();
        return this.storage.getItem('user')
            .then(
            (data) => {
                this.createHeaders(headers, type);
                headers.append('Authorization', 'Bearer ' + data.token);
                this.loading.dismiss();

                if (type == 'post') {
                    return this.doPost(data, url, headers);
                } else if (type == 'get') {
                    return this.doGet(data, url, headers);
                } else if (type == 'delete') {
                    return this.doDelete(data, url, headers);
                } else if (type == 'upload') {
                    return this.doUpload(data, url, headers);
                }

            },
            //couldn't find user, do normal post
            (error) => {
                this.createHeaders(headers, type);
                //@TODO remove this, this is just for testing
                headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImlzcyI6Imh0dHA6Ly9taW1pYy50ZXN0YXBpLndlYnNpdGUvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE1MDU2ODI2NjAsImV4cCI6MTUwODM4MjY2MCwibmJmIjoxNTA1NjgyNjYwLCJqdGkiOiJ1QWhWNE5oNnlrZ2o0UzF2In0.mAtyFB3ZDt38Rel-o7sXN-8Z7SQq8B4YHAa-HChZba0');
                this.loading.dismiss();

                if (type == 'post') {
                    return this.doPost(data, url, headers);
                } else if (type == 'get') {
                    return this.doGet(data, url, headers);
                } else if (type == 'delete') {
                    return this.doDelete(data, url, headers);
                } else if (type == 'upload') {
                    return this.doUpload(data, url, headers);
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
    private doPost(postData, url, headers) 
    {
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
    private doGet(getData, url, headers) 
    {
        let options = new RequestOptions({params: getData, headers: headers});
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
     * This is where you send request to a server
     * @param any data Data to send to server
     * @param string url Url to post to
     * @param Headers headers What headers to include
     */
    private doDelete(data, url, headers) 
    {
        let options = new RequestOptions({params: data, headers: headers});
        return this.http.delete(ApiSettings.API_ENDPOINT + url, options)
            .toPromise()
            .then((response) => {
                return this.handleSuccess(response);
            })
            .catch((error) => {
                return this.handleError(error);
            });
    }



    /**
     * Upload file to server
     * @param any data Data to send to server
     * @param string url Url to post to
     */
    private doUpload(data, url, headers) 
    {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        const fileTransfer: FileTransferObject = this.transfer.create();

        let options: FileUploadOptions = {
            headers: headers,
            params: data
        }

        return fileTransfer.upload(data.filePath, ApiSettings.API_ENDPOINT + url, options)
        .then((data) => {
            this.loading.dismiss();
            return Promise.resolve(JSON.parse(data.response));
        }, (error) => {
            this.loading.dismiss();

            let alert = this.alertCtrl.create({
                title: 'There was a problem',
                subTitle: JSON.parse(error.body).error.message,
                buttons: ['Ok']
            }); 
            alert.present();

            return Promise.reject(JSON.parse(error.body));
        });
    }


    /**
     * put login data into a storage
     * @param any loginData Data consists of user_id, token and suername
     */
    storageSetLoginData(loginData) 
    {
        return this.storage.setItem('user', {'token': loginData.token, 'username': loginData.username, 'user_id': loginData.user_id})
            .then(() => 
            {
                console.log('User storage set');
            },
            error => console.error('Error storing user storage', error)
        );
    }

    storageRemoveLoginData() 
    {
        this.storage.remove('user');
    }


}