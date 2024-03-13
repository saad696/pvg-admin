import {
    Configuration,
    EmailsApi,
    EmailMessageData,
    TemplatesApi,
} from '@elasticemail/elasticemail-client-ts-axios';
import { message } from 'antd';

const config = new Configuration({
    apiKey: import.meta.env.VITE_ELASTIC_EMAIL_API_KEY,
});

const emailsApi = new EmailsApi(config);
const templatesApi = new TemplatesApi(config);

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
        emailMessage: EmailMessageData
    ) => {
        try {
            const emailResponse = await emailsApi.emailsPost(emailMessage);
            setLoading(false);
            console.log(emailResponse.data);
        } catch (error) {
            setLoading(false);
            message.error('Sending email failed');
        }
    },
};
