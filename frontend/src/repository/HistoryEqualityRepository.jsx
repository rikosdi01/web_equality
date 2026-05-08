
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase";

export default class HistoryEqualityRepository {
    static getHistoryEquality(callback) {
        try {
            // Query Firestore untuk mengurutkan berdasarkan 'name'
            const historyQuery = query(
                collection(db, "HistoryPersamaan"),
                orderBy("createdAt")
            );

            return onSnapshot(historyQuery, (querySnapshot) => {
                const history = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                callback(history);
            });
        } catch (error) {
            console.error("Error listening to history: ", error);
        }
    }

    static getHistoryEqualitiesById(callback, id) {
        try {
            const historyQuery = query(
                collection(db, "HistoryPersamaan"),
                where("equalityId", "==", id),
                orderBy("createdAt", "desc")
            );
    
            return onSnapshot(historyQuery, (querySnapshot) => {
                const history = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                callback(history);
            });
        } catch (error) {
            console.error("Error listening to history: ", error);
        }
    }

    static async createHistoryEquality(historyEquality) {
        try {
            await addDoc(collection(db, "HistoryPersamaan"), historyEquality);
        } catch (error) {
            console.error("Error creating historyEquality: ", error);
            throw error;
        }
    }
}