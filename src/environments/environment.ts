// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:1337',
  cp: {
    api_key: '5579980505863a3f6aabd82.89189525',
    site_id: 659913,
    notify_url: 'https://YOUR_NOTIFY_URL',
    currency: 'CFA'
  },
  firebase : {
    apiKey: "AIzaSyAOM49bTRY7y8kgFtxYiA772RwnvGvB0Js",
    authDomain: "the-hunger-point.firebaseapp.com",
    projectId: "the-hunger-point",
    storageBucket: "the-hunger-point.appspot.com",
    messagingSenderId: "362195111262",
    appId: "1:362195111262:web:17c04c5b42309ad0af53cf"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
