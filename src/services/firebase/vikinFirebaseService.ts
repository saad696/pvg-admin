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
    deleteDoc,
} from 'firebase/firestore';
import { message } from 'antd';
import { tables, vikinEmailTypes } from '../../utils/constants';
import {
    EmailMessageData,
    EmailSend,
} from '@elasticemail/elasticemail-client-ts-axios';
import { emailService } from '../elasticEmailService';

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
            const template = await emailService.getEmailTemplates(
                setLoading,
                vikinEmailTypes.ride
            );
            const usersEmail = await vikinFirebaseService.getEmails(setLoading);

            if (template?.length && usersEmail?.length) {
                const emailMessageData: EmailMessageData = {
                    Recipients: usersEmail.map((email) => ({ Email: email })),
                    Content: {
                        Body: [
                            {
                                ContentType: 'HTML',
                                Charset: 'utf-8',
                                Content: template[0].Content,
                            },
                        ],
                        EnvelopeFrom: 'Vikin <info@vikin.club>',
                        From: 'Vikin <info@vikin.club>',
                        Subject: 'New Ride Live!',
                    },
                };
                await emailService.sendBulkMail(
                    setLoading,
                    emailMessageData,
                    vikinEmailTypes.ride,
                    payload.createdBy
                );
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
                'Something went wrong, cannot fetch rides. Please try again!'
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
                'Something went wrong, cannot fetch ride. Please try again!'
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
                    orderBy('name'),
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
                'Something went wrong, cannot fetch users by ride. Please try again!'
            );
        }
    },
    getRideByUsers: async (
        rideIds: string[],
        page: number,
        pageSize: number,
        lastDoc: any,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        const usersCollection = collection(db, tables.rides);

        try {
            let q = query(usersCollection, orderBy('title'), limit(pageSize));
            if (lastDoc && page > 1) {
                q = query(
                    usersCollection,
                    where('id', 'in', rideIds),
                    orderBy('title'),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }
            const querySnapshot = await getDocs(q);
            const rides = querySnapshot.docs.map(
                (doc) => doc.data() as IHostRide
            );
            setLoading(false);
            return { rides, lastDoc };
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot fetch ride by users. Please try again!'
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
            setLoading(false);
            message.error(
                'Something went wrong, cannot fetch users. Please try again!'
            );
        }
    },
    getUserById: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        userId: string
    ) => {
        const docRef = doc(db, tables.vikinUsers, userId);

        try {
            const data = await getDoc(docRef);

            if (data.exists()) {
                setLoading(false);
                return data.data() as IVikinRider;
            } else {
                setLoading(false);
                return null;
            }
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot fetch user. Please try again!'
            );
        }
    },
    changeUserStatus: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        userId: string,
        status: boolean
    ) => {
        const docRef = doc(db, tables.vikinUsers, userId);

        try {
            const data = await getDoc(docRef);

            if (data.exists()) {
                const user = data.data() as IVikinRider;
                await updateDoc(docRef, { ...user, status: status });
                await vikinFirebaseService.updateUserStatusCount(
                    'users',
                    status
                );
                message.success(
                    `${user.name} account has been ${
                        status ? 'activated' : 'deactivated'
                    }`
                );
            } else {
                message.error('No such user found!');
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, action failed. Please try again!'
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
            console.error(error);
        }
    },
    updateUserStatusCount: async (collectionName: string, status: boolean) => {
        const docRef = doc(
            db,
            tables.pageSize,
            collectionName,
            'count',
            'vikin'
        );
        try {
            await updateDoc(docRef, {
                active: status ? increment(1) : increment(-1),
            });
            await updateDoc(docRef, {
                deactivated: status ? increment(-1) : increment(1),
            });
        } catch (error) {
            message.error(
                'Something went wrong while updating user status count!'
            );
        }
    },
    postAnnouncement: async (
        payload: Announcement,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        const docRef = doc(db, tables.announcements, payload.announcement_id);

        try {
            await setDoc(docRef, { ...payload });
            const template = await emailService.getEmailTemplates(
                setLoading,
                vikinEmailTypes.announcement
            );
            const usersEmail = await vikinFirebaseService.getEmails(setLoading);

            if (template?.length && usersEmail?.length) {
                const emailMessageData: EmailMessageData = {
                    Recipients: usersEmail.map((email) => ({ Email: email })),
                    Content: {
                        Body: [
                            {
                                ContentType: 'HTML',
                                Charset: 'utf-8',
                                Content: template[0].Content,
                            },
                        ],
                        EnvelopeFrom: 'Vikin <info@vikin.club>',
                        From: 'Vikin <info@vikin.club>',
                        Subject: 'New Announcement!',
                    },
                };
                await emailService.sendBulkMail(
                    setLoading,
                    emailMessageData,
                    vikinEmailTypes.announcement,
                    payload.announcement_by
                );
            }
            message.success('Announced sucessfully');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, while posting announcement. Please try again!'
            );
        }
    },
    getAnnouncementsList: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        try {
            const dataCollection = collection(db, tables.announcements);
            const q = query(dataCollection, orderBy('title'));
            const snapshot = await getDocs(q);

            const data: Announcement[] = snapshot.docs.map(
                (doc) => ({ ...doc.data() } as Announcement)
            );

            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, while fetching announcements. Please try again!'
            );
        }
    },
    deleteAnnouncement: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        announcementId: string
    ) => {
        try {
            const docRef = doc(db, tables.announcements, announcementId);
            await deleteDoc(docRef);
            message.success('Deleted Successfully');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setLoading(false);
            message.error(
                'Something went wrong, while deleting announcement. Please try again!'
            );
        }
    },
    getNewsletterRegistrations: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        page: number,
        pageSize: number,
        lastDoc: any
    ): Promise<
        { users: Newsletter[]; lastDoc: any; totalDocs: number } | undefined
    > => {
        const docRef = collection(db, tables.newsletter);

        try {
            const totalDocs: number = (await getDocs(docRef)).size;
            let q = query(docRef, orderBy('name'), limit(pageSize));

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
                (doc) => ({ ...doc.data() } as Newsletter)
            );

            // Set last document for next query
            lastDoc = snapShot.docs[snapShot.docs.length - 1];
            setLoading(false);
            return { users, lastDoc, totalDocs };
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot fetch users. Please try again!'
            );
        }
    },
    getEmails: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        type = tables.vikinUsers
    ) => {
        try {
            const querySnapshot = await getDocs(collection(db, type));

            const emails = querySnapshot.docs.map(
                (doc) => doc.data().email as string
            );

            setLoading(false);
            return emails;
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot fetch emails. Please try again!'
            );
        }
    },
    addEmailTransaction: async (
        data: EmailSend,
        emailType: string,
        userId: string,
        emailSubject?: string
    ) => {
        try {
            if (data.MessageID && data.TransactionID) {
                const docRef = doc(
                    db,
                    tables.emailTransactions,
                    data.TransactionID
                );
                await setDoc(docRef, {
                    ...data,
                    email_type: emailType,
                    subject: emailSubject || 'N/A',
                    send_at: JSON.stringify(new Date()),
                    send_by: userId,
                });
            }
        } catch (error) {
            console.error(error);
        }
    },
    getEmailTransactions: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        page: number,
        pageSize: number,
        lastDoc: any
    ): Promise<
        | {
              emailTransactions: EmailTransactions[];
              lastDoc: any;
              totalDocs: number;
          }
        | undefined
    > => {
        const docRef = collection(db, tables.emailTransactions);

        try {
            const totalDocs: number = (await getDocs(docRef)).size;
            let q = query(docRef, orderBy('subject'), limit(pageSize));

            // If we have a last document, start after it in the next query
            if (lastDoc && page > 1) {
                q = query(
                    docRef,
                    orderBy('subject'),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }

            const snapShot = await getDocs(q);

            // Get data from docs
            const emailTransactions = snapShot.docs.map(
                (doc) => ({ ...doc.data() } as EmailTransactions)
            );

            // Set last document for next query
            lastDoc = snapShot.docs[snapShot.docs.length - 1];
            setLoading(false);
            return { emailTransactions, lastDoc, totalDocs };
        } catch (error) {
            setLoading(false);
            message.error(
                'Something went wrong, cannot fetch email transactions. Please try again!'
            );
        }
    },
    uploadPostRideImages: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        images: string[],
        rideId: string
    ) => {
        const docRef = doc(db, tables.rides, rideId);

        try {
            await updateDoc(docRef, { images });
            message.success('Images uploaded succesfully');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error('Something went wrong, cannot upload images!');
        }
    },
    getPostRideImages: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        rideId: string
    ) => {
        const docRef = doc(db, tables.rides, rideId);

        try {
            const data = await getDoc(docRef);
            setLoading(false);
            if (data.exists()) {
                return data.data().images as string[];
            } else {
                return [];
            }
        } catch (error) {
            setLoading(false);
            message.error('Something went wrong, cannot fetch images!');
        }
    },
};
