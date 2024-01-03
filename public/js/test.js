$(document).ready(function(){
  // REGISTER DOM ELEMENTS
  const $title = $('#title');
  const $doc = $("#doc");

  // INITIALIZE FIREBASE
  firebase.initializeApp({
      apiKey: "AIzaSyBFxXemKEJRW_X7nS1NnrDBZXWye8km0s4",
      authDomain: "cafe-web-e93a9.firebaseapp.com",
      projectId: "cafe-web-e93a9",
      storageBucket: "cafe-web-e93a9.appspot.com",
      messagingSenderId: "755176808542",
      appId: "1:755176808542:web:ca57d4699f0871504294cf"
  });

  let db = firebase.firestore();
  let usersRef = db.collection("users");
  usersRef.add({
  "id" :"test",
    "name": "NTUE",
    "age": 13,
    "tel": {
      "tel1": "111-111",
      "tel2": "222-111"
    }
  });

  let docRef = usersRef.doc("1167");

  docRef.get().then(function(doc){
    $doc.html(`doc 1167 name = ${doc.data().name}`)
  });

  docRef.set({
    "name": "Alex2",
    "age": 27,
    "tel": {
      "tel1": "111-111",
      "tel2": "222-111"
    }
  });

  // docRef.update({
  //   "name": "John Doe"
  // });

  // docRef.onSnapshot(
  //   function(doc){
  //     $title.html(`user name = ${doc.data().name}, user age = ${doc.data().age}`);
  //   }
  // );

});