/* 
Ride Statuses: Active, Inactive, Ongoing, Completed, Deleted, all
*/

import { db } from './firebase';
import {
    doc,
    setDoc,
    getDoc,
    query,
    collection,
    getDocs,
    orderBy,
    startAfter,
    limit,
    where,
    updateDoc,
    increment,
} from 'firebase/firestore';
import { message } from 'antd';
import { tables } from '../utils/constants';

export const vikinFirebaseService = {
    hostRide: async (
        payload: IHostRide,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        isUpdate = false
    ) => {
        const docRef = doc(db, tables.rides, payload.uuid);

        try {
            if (isUpdate) {
                await updateDoc(docRef, { ...payload });
            } else {
                await setDoc(docRef, { ...payload });
            }
            setLoading(false);
            message.success(
                `${payload.title} has successfully ${
                    isUpdate ? 'updated' : 'created'
                }!`
            );
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot create ride. Please try again!'
            );
        }
    },
    getRides: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        page: number,
        pageSize: number,
        lastDoc: any,
        status = 'all'
    ): Promise<{ rides: IHostRide[]; lastDoc: IHostRide } | undefined> => {
        const docRef = collection(db, tables.rides);

        try {
            let q = query(docRef, orderBy('title'), limit(pageSize));

            if (status !== 'all') {
                q = query(
                    docRef,
                    where('status', '==', status),
                    orderBy('title'),
                    limit(pageSize)
                );
            }

            // If we have a last document, start after it in the next query
            if (lastDoc && page > 1) {
                q = query(
                    docRef,
                    orderBy('title'),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }

            const snapShot = await getDocs(q);

            // Get data from docs
            const rides = snapShot.docs.map(
                (doc) => ({ ...doc.data(), uuid: doc.id } as IHostRide)
            );

            // Set last document for next query
            lastDoc = snapShot.docs[snapShot.docs.length - 1];
            setLoading(false);
            return { rides, lastDoc };
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot create ride. Please try again!'
            );
        }
    },
    getRideById: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        rideId: string
    ) => {
        const docRef = doc(db, tables.rides, rideId);

        try {
            const data = await getDoc(docRef);

            if (data.exists()) {
                setLoading(false);
                return data.data() as IHostRide;
            } else {
                setLoading(false);
                return null;
            }
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot create ride. Please try again!'
            );
        }
    },
    getUsersByRide: async (
        userIds: string[],
        page: number,
        pageSize: number,
        lastDoc: any,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        const usersCollection = collection(db, 'vikin_users');

        try {
            let q = query(usersCollection, orderBy('name'), limit(pageSize));
            if (lastDoc && page > 1) {
                q = query(
                    usersCollection,
                    where('id', 'in', userIds),
                    orderBy('title'),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map(
                (doc) => doc.data() as IVikinRider
            );
            setLoading(false);
            return { users, lastDoc };
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot create ride. Please try again!'
            );
        }
    },
    getUsers: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        page: number,
        pageSize: number,
        lastDoc: any,
        status = 'all'
    ): Promise<{ users: IVikinRider[]; lastDoc: IVikinRider } | undefined> => {
        const docRef = collection(db, tables.vikinUsers);

        try {
            let q = query(docRef, orderBy('name'), limit(pageSize));

            if (status === 'active') {
                q = query(
                    docRef,
                    where('status', '==', true),
                    orderBy('name'),
                    limit(pageSize)
                );
            } else if (status === 'deactivated') {
                q = query(
                    docRef,
                    where('status', '==', false),
                    orderBy('name'),
                    limit(pageSize)
                );
            }

            // If we have a last document, start after it in the next query
            if (lastDoc && page > 1) {
                q = query(
                    docRef,
                    orderBy('name'),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }

            const snapShot = await getDocs(q);

            // Get data from docs
            const users = snapShot.docs.map(
                (doc) => ({ ...doc.data() } as IVikinRider)
            );

            // Set last document for next query
            lastDoc = snapShot.docs[snapShot.docs.length - 1];
            setLoading(false);
            return { users, lastDoc };
        } catch (error) {
            console.log(error);

            setLoading(false);
            message.error(
                'Something went wrong, cannot create ride. Please try again!'
            );
        }
    },
    updateRidesCount: async (
        collectionName: string,
        currentStatus: RideStatus | null,
        updatedStatus: RideStatus
    ) => {
        const docRef = doc(
            db,
            tables.pageSize,
            collectionName,
            'count',
            'vikin'
        );
        try {
            if (!currentStatus) {
                await updateDoc(docRef, { count: increment(1) });
                await updateDoc(docRef, { active: increment(1) });
            } else {
                await updateDoc(docRef, { [updatedStatus]: increment(1) });
                await updateDoc(docRef, { [currentStatus]: increment(-1) });
            }
        } catch (error) {
            console.log(error);
        }
    },
};
