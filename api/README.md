# Social-Cleanr

<img src="https://raw.githubusercontent.com/Foxyf76/Social-Cleanr/master/logo.png" width="400">

My Final Year Project which utilises social media APIs and machine learning to provide a social media profile cleaner.

This web app works by first pulling down the user's posts (text and photos) from either their Twitter or Facebook account. Then,
various classifcation/detection models will be run against these posts to find content that is deemed harmful, offensive or innapropriate.
This flagged content is returned to the user, where they can choose to action it (i.e delete or edit the post). They may also request a 'cleansed' version of their image, where the app blurs regions of the image containing this harmful content.

Made with (so far):
- Tensorflow & TensorflowJS
- FaceAPI.js
- ExpressJS
- Google Cloud Vision (OCR)
- React & Redux
- MongoDB
- JWT
- PassportJS
- CryptoJS

Planned: 
- Docker
- WebdriverIO & Mocha/Chai (for testing)
