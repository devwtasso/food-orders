/* eslint-disable lines-between-class-members */
import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// import firebaseConfig from './config';

const firebaseConfig = {
  apiKey: "AIzaSyBlP-7sQpCyuFtQwdKQr9KTMge0aSpVZFQ",
  authDomain: "wtasso-orders-app.firebaseapp.com",
  databaseURL: "https://wtasso-orders-app.firebaseio.com",
  projectId: "wtasso-orders-app",
  storageBucket: "wtasso-orders-app.appspot.com",
  messagingSenderId: "971567094743",
  appId: "1:971567094743:web:ae0aedd0eb63c0a6ed4992",
  measurementId: "G-83J8E8MXWH"
};
class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.storage = app.storage();
    this.db = app.firestore();
    this.auth = app.auth();
  }

  // AUTH ACTIONS ------------
  createAccount = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
  signIn = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  signOut = () => this.auth.signOut();
  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);
  addUser = (id, user) => this.db.collection('users').doc(id).set(user);
  getUser = (id) => this.db.collection('users').doc(id).get();
  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);
  changePassword = (currentPassword, newPassword) => new Promise((resolve, reject) => {
    this.reauthenticate(currentPassword)
      .then(() => {
        const user = this.auth.currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            resolve('Senha atualizada com sucesso!');
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    return user.reauthenticateWithCredential(cred);
  };
  updateEmail = (currentPassword, newEmail) => new Promise((resolve, reject) => {
    this.reauthenticate(currentPassword)
      .then(() => {
        const user = this.auth.currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            resolve('E-mail atualizado com sucesso');
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
  onAuthStateChanged = () => new Promise((resolve, reject) => {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Auth State Changed failed'));
      }
    });
  });
  setAuthPersistence = () => this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);
  addProduct = (id, product) => this.db.collection('products').doc(id).set(product);
  getProducts = (codigoRestaurante) => this.db
    .collection('products')
    .where('restaurantCode', '==', codigoRestaurante)
    .get();
  generateKey = () => this.db.collection('products').doc().id;
  storeImage = async (id, folder, imageFile) => {
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  deleteImage = (id) => this.storage.ref('products').child(id).delete();
  editProduct = (id, updates) => this.db.collection('products').doc(id).update(updates);
  removeProduct = (id) => this.db.collection('products').doc(id).delete();

  addCategory = (id, category) => this.db.collection('categories').doc(id).set(category);
  getCategories = (codigoRestaurante) => this.db
    .collection('categories')
    .where('restaurantCode', '==', codigoRestaurante)
    .get();
  editCategory = (id, updates) => this.db.collection('categories').doc(id).update(updates);
  removeCategory = (id) => this.db.collection('categories').doc(id).delete();
}

const firebaseInstance = new Firebase();

export default firebaseInstance;
