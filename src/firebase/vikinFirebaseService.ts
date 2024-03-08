import { auth, db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
  arrayUnion,
  query,
  collection,
  getDocs,
  orderBy,
  startAfter,
  limit,
  where,
  Timestamp,
  increment,
} from "firebase/firestore";
import { message } from "antd";
import { User as FirebaseUser } from "firebase/auth";
import { status, tables } from "../utils/constants";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import moment from "moment";

export const vikinFirebaseService = {
  hostRide: async (
    payload: IHostRide,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.rides, payload.uuid);

    try {
      await setDoc(docRef, { ...payload });
      setLoading(false);
      message.success(`${payload.title} has successfully created!`);
    } catch (error) {
      console.log(error);

      setLoading(false);
      message.error(
        "Something went wrong, cannot create ride. Please try again!"
      );
    }
  },
};
