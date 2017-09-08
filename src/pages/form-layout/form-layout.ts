import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

@Component({
    selector: 'form-layout-page',
    templateUrl: 'form-layout.html'
})
export class FormLayoutPage {
    section:string;
    post_form:any;
    selected_image:any;
    record_upload:any;

    constructor(public nav:NavController,
                public alertCtrl:AlertController,
                public cropService:Crop,
                public imagePicker:ImagePicker) {

        this.section = "event";
        this.record_upload = 'record';

        this.post_form = new FormGroup({
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            time: new FormControl('01:30', Validators.required),
            temperature: new FormControl(180)
        });

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
