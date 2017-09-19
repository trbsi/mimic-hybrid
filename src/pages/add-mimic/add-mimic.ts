import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
    selector: 'add-mimic',
    templateUrl: 'add-mimic.html'
})
export class AddMimic {
    section:string;
    post_form:any;
    selected_image:any;
    record_upload:any;
    title:string;


    constructor(public nav:NavController, public navParams:NavParams,
                public alertCtrl:AlertController,
                public cropService:Crop,
                private camera: Camera) {

        this.section = "event";
        this.record_upload = 'record';

        this.post_form = new FormGroup({
            hashtags: new FormControl('', Validators.required)
        });
        console.log(this.navParams.get('original_mimic_id'));
        if (this.navParams.get('reply_to_mimic') == true) {
            this.title = "Reply to Mimic";
        } else {
            this.title = "Add Mimic";
        }

    }

    onSegmentChanged(segmentButton:SegmentButton) {
        // console.log('Segment changed to', segmentButton.value);
    }

    onSegmentSelected(segmentButton:SegmentButton) {
        // console.log('Segment selected', segmentButton.value);
    }

    createPost() {
        console.log(this.post_form.value);
    }

    openImagePicker() {
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        }

        this.camera.getPicture(options).then((imageData) => {
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
         let base64Image = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
         // Handle error
        });
        
    }

}
