import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { VgAPI } from 'videogular2/core';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture';
import { VideoEditor } from '@ionic-native/video-editor';
import { AddMimicService } from '../add-mimic/add-mimic.service';

@Component({
    selector: 'add-mimic',
    templateUrl: 'add-mimic.html'
})
export class AddMimic {
    post_form:any;
    title:string;
    currentSegment:string;

    imageFile:any;
    videoFile:any;
    currentFile:any; //this is current file user chose to upload
    videoDuration = 15;

    originalMimicId:number;

    //VIDEO
    videoPlayer: any;

    constructor(public nav:NavController, public navParams:NavParams,
                public alertCtrl:AlertController,
                private camera: Camera,
                private mediaCapture: MediaCapture,
                private videoEditor: VideoEditor,
                private addMimicService: AddMimicService) {

        this.currentSegment = 'camera';

        this.post_form = new FormGroup({
            hashtags: new FormControl('', Validators.required)
        });
        
        if(this.navParams.get('original_mimic_id')) {
            this.originalMimicId = this.navParams.get('original_mimic_id');
        }

        if (this.navParams.get('reply_to_mimic') == true) {
            this.title = "Reply to Mimic";
        } else {
            this.title = "Add Mimic";
        }

    }

    onSegmentChanged(segmentButton:SegmentButton) {
        this.resetSubmitForm(false);
        this.currentSegment = segmentButton.value; 
    }

    onSegmentSelected(segmentButton:SegmentButton) {
        // console.log('Segment selected', segmentButton.value);
    }

    /**
     * Post data to server
     */
    submit() {
        //check if image or video has been chosen/taken
        switch (this.currentSegment) {
            case "camera":
                if(!this.videoFile  && !this.imageFile) {
                    this.presentAlert(this.currentSegment);
                    return;
                }
                break;
            case "library":
                if(!this.videoFile  && !this.imageFile) {
                    this.presentAlert(this.currentSegment);
                    return;
                }
                break; 
        }
        var form_data = this.post_form.value; 
        
        var data = {};
        if(!this.originalMimicId) {
            data['hashtags'] = form_data.hashtags;
            data['filePath'] = this.currentFile;

        } else {

            data['original_mimic_id'] = this.originalMimicId;
            data['filePath'] = this.currentFile;
        }

        this.addMimicService.addMimic(data).then((data) => {
            console.log("server response", data);
        });

        
    }

    /**
     * Show alert
     * @param string type "camera" or "library"
     */
    private presentAlert(type) {
        var subTitle;
        switch (type) {
            case "camera":
                subTitle = 'Take a picture or record a video';
                break;
            case "library":
                subTitle = 'Choose a picture or a video';
                break;
        }

        let alert = this.alertCtrl.create({
            title: subTitle,
            buttons: ['OK']
        });
        alert.present();
    }

    /**
     * Upload image or video from device
     * @param type string Type of media to get: "video" or "image"
     */
    openDeviceLibrary(type) 
    {
        var data = {};
        this.currentFile = this.imageFile = this.videoFile = null;

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
          destinationType: this.camera.DestinationType.FILE_URI,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: data['mediaType'],
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        }

        this.camera.getPicture(options).then((data) => 
        {
            // data is either a base64 encoded string or a file URI
            // If it's base64:
            switch (type) 
            {
                case "video":
                    data = "file://"+data; //https://github.com/jbavari/cordova-plugin-video-editor/issues/11
                    this.callVideoEditor(data);
                    break;
                case "image":
                    //this.imageFile = 'data:image/jpeg;base64,' + data; //when testing base64
                    this.callCropper(data, 'library');
                    break;
            }
        }, (err) => {
            console.log(err);
        });
    }

    /**
     * Take a picture of record a video
     * @param type string Type of media to get: "video" or "image"
     */
    captureMedia(type) 
    {
        this.currentFile = this.imageFile = this.videoFile = null;
        if(type == 'image') {
            let options: CaptureImageOptions = { limit: 1 };
            this.mediaCapture.captureImage(options)
            .then(
                (data: MediaFile[]) => {
                    console.log(data);
                    //this.imageFile = data[0]['localURL']; //testing with localURL
                    this.callCropper(data[0]['fullPath'], 'camera');
                },
                (err: CaptureError) => console.log(err)
            );
        } else if (type == 'video') {
            let options: CaptureVideoOptions = { limit: 1, duration: this.videoDuration };
            this.mediaCapture.captureVideo(options)
            .then(
                (data: MediaFile[]) => {
                    console.log(data);
                    //this.videoFile = data[0]['localURL']; //@TODO better use fullPath here like: data[0].fullPath
                    this.callVideoEditor(data[0]['fullPath']);
                },
                (err: CaptureError) => console.log(err)
            );
        }
        
    }

    /**
     * Call video editor
     * @param string videoPath Path to a video
     */
    private callVideoEditor(videoPath)
    {
        this.videoEditor.transcodeVideo({
          fileUri: videoPath,
          outputFileName: 'output',
          outputFileType: this.videoEditor.OutputFileType.MPEG4
        })
        .then((fileUri: string) => console.log('video transcode success', fileUri))
        .catch((error: any) => console.log('video transcode error', error));
    }

    /**
     * Call our cropper
     * @param string imagePath
     * @param string type Current segment: "camera" or "library"
     */
    private callCropper(imagePath, type)
    {
        let self = this;

        var options = {
            url: imagePath,              // required.
            ratio: "16/9",               // required. (here you can define your custom ration) "1/1" for square images
            title: "Crop the image",      // optional. android only. (here you can put title of image cropper activity) default: Image Cropper
            autoZoomEnabled: false      // optional. android only. for iOS its always true (if it is true then cropper will automatically adjust the view) default: true
        }

        //https://stackoverflow.com/questions/38000418/using-windows-plugins-with-ionic-2-typescript
        window['plugins'].k.imagecropper.open(options, function(cropData) {
            // its return an object with the cropped image cached url, cropped width & height, you need to manually delete the image from the application cache.
            if(type == "camera") {
                self.currentFile = self.imageFile = cropData['imgPath'];
                self.currentSegment = type;
            } else if (type == "library") {
                self.currentFile = self.imageFile = cropData['imgPath'];
                self.currentSegment = type;
            }

        }, function(error) {
            console.log(error);
        });
    }

    /**
     * Reset submit form and all values
     */
    resetSubmitForm(resetWholeForm)
    {
        this.currentFile = null;
        this.imageFile = this.videoFile = null;
        if(resetWholeForm) {
            this.post_form.reset();
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
