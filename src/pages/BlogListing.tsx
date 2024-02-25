import { useState, useEffect, useContext } from "react";
import { BlogFilters, BlogListCard, PageHeader } from "..";
import { useLocation, useNavigate } from "react-router-dom";
import { firebaseService } from "../firebase/firebaseService";
import { Empty, Tabs, message, Row, Col } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { LoadingContext } from "../context/LoadingContext";
import { status, tables } from "../utils/constants";
import { useDebounce } from "@uidotdev/usehooks";

const BlogListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);

  const id = location.pathname.split("/")[1];

  const [blogs, setBlogs] = useState<BlogDetails[]>([]);
  const [blogStatusBased, setBlogStatusBased] = useState<BlogDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTagstoFilter, setSelectedTagsToFilter] = useState<string[]>(
    []
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const getBlogs = async () => {
    setLoading(true);
    const data = await firebaseService.getBlogs(id, setLoading);
    if (data && data.length) {
      setBlogs(data);
      setDefaultBlogData(data, status.ACTIVE);
    }
  };

  const fetchTags = async () => {
    const data = await firebaseService.getTags(id);
    setTags(data ? data.tags : []);
  };

  const onTabsChange = (key: string) => {
    setDefaultBlogData(blogs, key);
  };

  const onConfirmDelete = async (uuid: string) => {
    setLoading(true);
    await firebaseService.deleteData(
      tables.blogs,
      id,
      uuid,
      "blog",
      setLoading
    );
    await getBlogs();
    navigate(`/${id}/blog/listing`);
    message.success("Deleted sucessfully");
  };

  const onSearchInputTextChange = (_searchText: string) => {
    setSearchTerm(_searchText);
  };

  const onTagsFilter = (_tag: string, checked: boolean) => {
    setSelectedTagsToFilter((prevState) =>
      checked
        ? [...prevState, _tag]
        : selectedTagstoFilter.filter((x) => x !== _tag)
    );
  };

  const searchBlogsbyTitle = () => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 3) {
      const filteredData = blogStatusBased.filter((blog) =>
        blog.title.includes(searchTerm)
      );
      setBlogStatusBased(filteredData);
    }

    resetFilters();
  };

  const searchBlogByTag = () => {
    if (selectedTagstoFilter.length) {
      const filteredData = blogStatusBased.filter((blog) =>
        blog.tags.some((tag) => selectedTagstoFilter.includes(tag))
      );
      setBlogStatusBased(filteredData);
    }

    resetFilters();
  };

  const resetFilters = (forceReset = false) => {
    if (forceReset) {
      setDefaultBlogData(blogs, status.ACTIVE);
      setSearchTerm("");
      setSelectedTagsToFilter([]);
      return;
    }

    if (!selectedTagstoFilter.length && !debouncedSearchTerm) {
      setDefaultBlogData(blogs, status.ACTIVE);
    }
  };

  const setDefaultBlogData = (data: BlogDetails[], _activeTab: string) => {
    setBlogStatusBased(data.filter((x) => x.status === _activeTab));
  };

  useEffect(() => {
    fetchTags();
    getBlogs();
  }, []);

  useEffect(() => {
    searchBlogsbyTitle();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    searchBlogByTag();
  }, [selectedTagstoFilter]);

  return (
    <>
      <PageHeader
        title={`${id} - Blog Listing`}
        actions={[
          {
            name: "Reset Filters",
            visible: true,
            icon: <ReloadOutlined />,
            onClick: () => resetFilters(true),
          },
        ]}
      />
      <Row gutter={32}>
        {/* filters for mobile screens */}
        <Col xs={24} lg={0} className="mb-12">
          <BlogFilters
            searchInputValue={searchTerm}
            onSearch={onSearchInputTextChange}
            onTagsFilter={onTagsFilter}
            tags={tags}
            selectedTags={selectedTagstoFilter}
          />
        </Col>
        {/* filters for mobile screens */}
        <Col xs={24} lg={16}>
          <Tabs
            className="w-full"
            defaultActiveKey={status.ACTIVE}
            onChange={onTabsChange}
            type="card"
            items={[status.ACTIVE, status.DELETED].map((_status) => ({
              label: _status,
              key: _status,
              tabKey: _status,
              children: (
                <Row gutter={32}>
                  {blogStatusBased?.length ? (
                    blogStatusBased.map((blog) => (
                      <Col xs={24} md={12}>
                        <BlogListCard
                          key={blog.uuid}
                          data={blog}
                          pageId={id}
                          onConfirmDelete={onConfirmDelete}
                        />
                      </Col>
                    ))
                  ) : (
                    <Col xs={24}>
                      <Empty />
                    </Col>
                  )}
                </Row>
              ),
            }))}
          />
        </Col>
        {/* Filters for large screen */}
        <Col xs={0} lg={8}>
          <BlogFilters
            searchInputValue={searchTerm}
            onSearch={onSearchInputTextChange}
            tags={tags}
            onTagsFilter={onTagsFilter}
            selectedTags={selectedTagstoFilter}
          />
        </Col>
        {/* Filters for large screen */}
      </Row>
    </>
  );
};

export default BlogListing;
