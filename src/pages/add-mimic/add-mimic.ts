import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { VgAPI } from 'videogular2/core';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'add-mimic',
    templateUrl: 'add-mimic.html'
})
export class AddMimic {
    section:string;
    post_form:any;
    record_upload:any;
    title:string;
    imageFile:any;
    videoFile:any;

    uploadedImageFile:any;
    uploadedVideoFile:any;

    videoDuration = 15;

    //VIDEO
    videoPlayer: any;

    constructor(public nav:NavController, public navParams:NavParams,
                public alertCtrl:AlertController,
                public cropService:Crop,
                private camera: Camera,
                private mediaCapture: MediaCapture,
                public sanitizer: DomSanitizer) {

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
        console.log("post", this.post_form.value);
    }

    /**
     * Upload image or video from device
     * @param type string Type of media to get: "video" or "image"
     */
    openDeviceGallery(type) 
    {
        var data = {};
        this.imageFile = this.videoFile = null;

        switch (type) {
            case "video":
                data['mediaType'] = this.camera.MediaType.VIDEO;
                break;
            case "image":
                data['mediaType'] = this.camera.MediaType.PICTURE;
                break;
        }

        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL, //@TODO change this to FILE_URI
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: data['mediaType'],
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        }

        this.camera.getPicture(options).then((data) => {
            // data is either a base64 encoded string or a file URI
            // If it's base64:
            switch (type) {
                case "video":
                    this.videoFile = data;
                    break;
                case "image":
                    this.imageFile = 'data:image/jpeg;base64,' + data; //@TODO Remove this base64
                    break;
            }
        }, (err) => {
             // Handle error
        });
    }

    /**
     * Take a picture of record a video
     * @param type string Type of media to get: "video" or "image"
     */
    captureMedia(type) 
    {
        this.uploadedImageFile = this.uploadedVideoFile = null;
        if(type == 'image') {
            let options: CaptureImageOptions = { limit: 1 };
            this.mediaCapture.captureImage(options)
            .then(
                (data: MediaFile[]) => {
                    console.log(data);
                    this.uploadedImageFile = data[0]['localURL']; //@TODO better use fullPath here like: data[0].fullPath
                },
                (err: CaptureError) => console.log(err)
            );
        } else if (type == 'video') {
            let options: CaptureVideoOptions = { limit: 1, duration: this.videoDuration };
            this.mediaCapture.captureVideo(options)
            .then(
                (data: MediaFile[]) => {
                    console.log(data);
                    this.uploadedVideoFile = data[0]['localURL']; //@TODO better use fullPath here like: data[0].fullPath
                    console.log(this.uploadedVideoFile);
                },
                (err: CaptureError) => console.log(err)
            );
        }
        
    }



    //VIDEOS
    /**
     * When player is ready initalize it
     * @param {VgAPI}  api
     */
    onPlayerReady(api:VgAPI) {
        this.videoPlayer = api;
    }

    //VIDEOS
}
