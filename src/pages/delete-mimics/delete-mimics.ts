import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    selector: 'delete-mimics',
    templateUrl: 'delete-mimics.html'
})
export class DeleteMimics {
	oiginal_responses: any;

    constructor(public navParams:NavParams) {
    	this.oiginal_responses = 'original';
    }

    /**
     * Delete specific mimic
     * @param int id Id of a mimi to dlete
     * @param string type Mimi type: original or response
     */
    delete(id, type)
    {	
    	alert(type);

    }
}
