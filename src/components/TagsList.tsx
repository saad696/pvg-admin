import React, { useState } from "react";
import { Tabs, Tag, Empty } from "antd";
import { ConfirmDelete } from "..";

const { CheckableTag } = Tag;

interface TagsListProps {
  tags: string[];
  setTabKey: React.Dispatch<React.SetStateAction<string>>;
  deleteTags: (selectedTagsToDelete: string[]) => Promise<any>;
}

interface TabChildrenProps {
  tag: string;
  selectedTagsToDelete: string[];
  setSelectedTagsToDelete: React.Dispatch<React.SetStateAction<string[]>>;
}

const TabChildren: React.FC<TabChildrenProps> = ({
  tag,
  selectedTagsToDelete,
  setSelectedTagsToDelete,
}) => {
  return (
    <CheckableTag
      checked={selectedTagsToDelete.includes(tag)}
      onChange={(checked) => {
        setSelectedTagsToDelete((prevState) =>
          checked
            ? [...prevState, tag]
            : selectedTagsToDelete.filter((x) => x !== tag)
        );
      }}
      key={tag}
      className="cursor-pointer !m-1 !text-base !border-gray-300"
    >
      {tag}
    </CheckableTag>
  );
};

const TagsList: React.FC<TagsListProps> = ({ tags, setTabKey, deleteTags }) => {
  const [selectedTagsToDelete, setSelectedTagsToDelete] = useState<string[]>(
    []
  );

  return (
    <>
      <Tabs
        onTabClick={(key) => {
          setTabKey(key);
          setSelectedTagsToDelete([]);
        }}
        tabPosition={"top"}
        tabBarExtraContent={
          <ConfirmDelete
            title="Are you sure?"
            description="Selected tags will be deleted"
            onClick={() => {deleteTags(selectedTagsToDelete)}}
            disabled={selectedTagsToDelete.length === 0}
          />
        }
        items={[
          {
            label: "Portfolio",
            key: "portfolio",
            children:
              tags && tags.length ? (
                tags.map((tag) => (
                  <TabChildren
                    tag={tag}
                    selectedTagsToDelete={selectedTagsToDelete}
                    setSelectedTagsToDelete={setSelectedTagsToDelete}
                  />
                ))
              ) : (
                <Empty />
              ),
          },
          {
            label: "Vikin",
            key: "vikin",
            children:
              tags && tags.length ? (
                tags.map((tag) => (
                  <TabChildren
                    tag={tag}
                    selectedTagsToDelete={selectedTagsToDelete}
                    setSelectedTagsToDelete={setSelectedTagsToDelete}
                  />
                ))
              ) : (
                <Empty />
              ),
          },
          {
            label: "Gaphyl",
            key: "Gaphyl",
            children:
              tags && tags.length ? (
                tags.map((tag) => (
                  <TabChildren
                    tag={tag}
                    selectedTagsToDelete={selectedTagsToDelete}
                    setSelectedTagsToDelete={setSelectedTagsToDelete}
                  />
                ))
              ) : (
                <Empty />
              ),
          },
        ]}
      />
    </>
  );
};

export default TagsList;
