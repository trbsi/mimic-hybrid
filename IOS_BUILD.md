#Adding iOS platform

I had a problem with adding platform because of facebook: Error: Variable(s) missing: APP_ID, APP_NAME. I just reinstalled facebook4: ionic cordova plugin add…

Then I added a platform: ionic cordova paltform add ios

Then I added Development Team in XCode. Then inside Build Phases > Link Binary With Libraries I added mine “.a” files, if I didn’t add them I would get linker error: clang: error: linker command failed with exit code 1.

I had a problem with Push and Firebase. I did “pod setup” inside ionic folder, then I moved to platforms/ios and did “pod install”.

Sometimes I got an error something like: “diff/ Podfile.lock”. I removed “Pods” folder and Podfile.lock inside platforms/ios and did “pod install”. I even Unchecked and checked “Automatically manage signing” and cleaned project in XCode.

In order to build an app I had to mnually choose profiles
