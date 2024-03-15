import {
    Configuration,
    EmailsApi,
    EmailMessageData,
    TemplatesApi,
    StatisticsApi,
} from '@elasticemail/elasticemail-client-ts-axios';
import { message } from 'antd';
import { vikinFirebaseService } from './firebase/vikinFirebaseService';

const config = new Configuration({
    apiKey: import.meta.env.VITE_ELASTIC_EMAIL_API_KEY,
});

const emailsApi = new EmailsApi(config);
const templatesApi = new TemplatesApi(config);
const statisticApi = new StatisticsApi(config);

export const emailService = {
    getEmailTemplates: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        templateName: string
    ) => {
        try {
            const template = await templatesApi.templatesByNameGet(
                templateName
            );

            setLoading(false);
            return template.data.Body;
        } catch (error) {
            setLoading(false);

            message.error('Something went wrong while fetching template!');
        }
    },
    sendBulkMail: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        emailMessage: EmailMessageData,
        emailType: string,
        userId: string
    ) => {
        try {
            const emailResponse = await emailsApi.emailsPost(emailMessage);
            setLoading(false);

            await vikinFirebaseService.addEmailTransaction(
                emailResponse.data,
                emailType,
                userId,
                emailMessage.Content?.Subject,
            );
            message.success('Email send successfully');
        } catch (error) {
            setLoading(false);
            message.error('Sending email failed');
        }
    },
    getStats: async (
        setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        from: string,
        to: string | undefined
    ) => {
        try {
            const response = await statisticApi.statisticsGet(from, to);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            message.error('Something went wrong while fetching email stats!');
        }
    },
};
