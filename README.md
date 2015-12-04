# hw5: App Prep and Distribution

Team Members: 
  - Kann Chea
  - Megan Ring
  - Tyler Tedeschi
  - Jiangtian Wang
  - **Note:** Xu He used to be in our group, but he told us he dropped the class on Tuesday. 

##### Services Used

1. Rollbar - Error monitoring
2. Mixpanel - Usage monitoring/analytics, notification/email reminders
3. PhoneGap - Phone app Proof of Concept
4. Grunt - Minification

##### Login Credentials

User email: mcring@ucsd.edu
User password: 1234

##### Summary of Issues and Limitations

Packaging:
  - PhoneGap: we can not obtain the package for iOS because in order to build the iOS app, we need to have an iOS developer certificate. It is the same for Windows. We need to have Windows publisher ID to build a Windows app. 
  - Chrome App: We were able to launch and package our app using Chrome extensions. However, Chrome's Content Security Policy (CSP) prevented our inline JavaScript from being executed. We tried to relax the default script security property, and when that did not work we tried rewriting some of our code. Overall, the cost of reformatting and rewriting our code outweighed the benefits so we left our code as is. If we had more time, I think we could go about fixing this by going through our code and eliminating inline JavaScript, and making sure all of our JavaScript functions were in external JS files. For instance, we used the "onclick="(do something)"" attribute throughout our code, when we could get rid of them and use JS eventListeners instead. 
