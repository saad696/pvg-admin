import { DeleteOutlined } from '@ant-design/icons';
import { List, Button, Popconfirm } from 'antd';
import { helperService } from '../utils/helper';
import { dateTimeFormats } from '../utils/constants';

interface AnnouncementsListProps {
    data: Announcement[];
    deleteAnnouncement: (annoucmentId: string) => Promise<void>;
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
    data,
    deleteAnnouncement,
}) => {
    return (
        <>
            <h2>Announcements Made</h2>
            <List
                className='h-[300px] overflow-y-auto'
                dataSource={data}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Popconfirm
                                placement='bottom'
                                title={'Are you sure?'}
                                description={
                                    'This action will result in deleting this content.'
                                }
                                okText='Yes'
                                cancelText='No'
                                onConfirm={() =>
                                    deleteAnnouncement(item.announcement_id)
                                }
                                className='w-full'
                            >
                                <Button icon={<DeleteOutlined />} />
                            </Popconfirm>,
                        ]}
                    >
                        <List.Item.Meta
                            title={item.title}
                            description={
                                <div>
                                    <p>{item.message}</p>
                                    <p className='text-end'>
                                        {helperService.formatTime(
                                            false,
                                            dateTimeFormats.default,
                                            new Date(
                                                JSON.parse(item.announced_at)
                                            )
                                        )}
                                    </p>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </>
    );
};

export default AnnouncementsList;
