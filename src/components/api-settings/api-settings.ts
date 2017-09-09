import { NgModule } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule()

export class ApiSettings {
	public static API_ENDPOINT='http://mimic.testapi.website/api/';
    allow_entry: string = 'little:cute:chubby';

    constructor(public http:Http, private storage: NativeStorage) 
    {

    }

	createAuthorizationHeader(headers:Headers) {
		headers.append('Authorization', 'Bearer ' +btoa('a20e6aca-ee83-44bc-8033-b41f3078c2b6:c199f9c8-0548-4be79655-7ef7d7bf9d20')); 
	}
  
	createEntryHeader(headers:Headers) {
		headers.append('AllowEntry', btoa(this.allow_entry)); 
	}
  	

    private handleError(error:any):Promise<any> 
    {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

  	/**
  	 * Post data to sevrer
  	 * @param any postData Data to post to the server
  	 * @param string url Url to post to
  	 */
	post(postData, url)
	{
		var headers = new Headers();
		this.createAuthorizationHeader(headers);
		this.createEntryHeader(headers);
		headers.append('Content-Type', 'application/json');

		return this.http.post(ApiSettings.API_ENDPOINT+url, postData, {
	    	headers: headers
	  	})
	    .toPromise()
	    .then(response => response.json())
	    .catch(this.handleError);
	}

	/**
     * put login data into a storage
     * @param any loginData Data consists of user_id, token and suername 
     */
	storageSetLoginData(loginData)
	{
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

	storageRemoveLoginData()
	{
        this.storage.remove('token');
        this.storage.remove('username');
        this.storage.remove('user_id');
	}


}