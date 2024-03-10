import React from 'react';

import { Card, Empty, Input, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { CheckableTag } = Tag;

interface BlogFiltersProp {
    onSearch: (searchText: string) => void;
    onTagsFilter: (tag: string, checked: boolean) => void;
    selectedTags: string[];
    tags: string[];
    searchInputValue: string;
}

const BlogFilters: React.FC<BlogFiltersProp> = ({
    onSearch,
    onTagsFilter,
    selectedTags,
    tags,
    searchInputValue,
}) => {
    return (
        <div className='space-y-8'>
            <Card className='shadow-lg'>
                <h2 className='mb-4 font-bold uppercase text-xl text-gray-500'>
                    Search by title
                </h2>
                <Input
                    placeholder='Start searching...'
                    value={searchInputValue}
                    allowClear
                    suffix={<SearchOutlined />}
                    onChange={(e) => onSearch(e.target.value)}
                />
            </Card>
            <Card className='shadow-lg'>
                <h2 className='mb-4 font-bold uppercase text-xl text-gray-500'>
                    Filter by tags
                </h2>
                {tags && tags.length ? (
                    tags.map((tag) => (
                        <CheckableTag
                            checked={selectedTags.includes(tag)}
                            onChange={(checked) => onTagsFilter(tag, checked)}
                            key={tag}
                            className='cursor-pointer !m-1 !text-base !border-gray-300'
                        >
                            {tag}
                        </CheckableTag>
                    ))
                ) : (
                    <Empty />
                )}
            </Card>
        </div>
    );
};

export default BlogFilters;
