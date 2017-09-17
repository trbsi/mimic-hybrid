import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

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
                public imagePicker:ImagePicker) {

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
        this.imagePicker.hasReadPermission().then(
            (result) => {
                if (result == false) {
                    // no callbacks required as this opens a popup which returns async
                    this.imagePicker.requestReadPermission();
                }
                else if (result == true) {
                    this.imagePicker.getPictures({maximumImagesCount: 1}).then(
                        (results) => {
                            for (var i = 0; i < results.length; i++) {
                                this.cropService.crop(results[i], {quality: 75}).then(
                                        newImage => {
                                        this.selected_image = newImage;
                                    },
                                        error => console.error("Error cropping image", error)
                                );
                            }
                        }, (err) => console.log(err)
                    );
                }
            }
        )
    }

}
