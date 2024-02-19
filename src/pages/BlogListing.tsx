import React, { useState, useEffect, useContext } from "react";
import { BlogListCard, PageTitle } from "..";
import { useLocation, useNavigate } from "react-router-dom";
import { firebaseService } from "../firebase/firebaseService";
import { Empty, Tabs, message } from "antd";
import { LoadingContext } from "../context/LoadingContext";
import { status, tables } from "../utils/constants";

const BlogListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);

  const [blogs, setBlogs] = useState<BlogDetails[]>([]);
  const [blogStatusBased, setBlogStatusBased] = useState<BlogDetails[]>([]);

  const getBlogs = async () => {
    setLoading(true);
    const data = await firebaseService.getBlogs(
      location.pathname.split("/")[1],
      setLoading
    );
    if (data && data.blog.length) {
      setBlogs(data.blog);
      setBlogStatusBased(data.blog.filter((x) => x.status === status.ACTIVE));
    }
  };

  const onTabsChange = (key: string) => {
    setBlogStatusBased(blogs.filter((x) => x.status === key));
  };

  const onConfirmDelete = async (uuid: string) => {
    setLoading(true);
    await firebaseService.deleteData(
      tables.blogs,
      location.pathname.split("/")[1],
      uuid,
      "blog",
      setLoading
    );
    await getBlogs();
    navigate(`/${location.pathname.split("/")[1]}/blog/listing`);
    message.success("Deleted sucessfully");
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <>
      <PageTitle title={`${location.pathname.split("/")[1]} - Blog Listing`} />
      <Tabs
        className="w-full"
        defaultActiveKey={status.ACTIVE}
        onChange={onTabsChange}
        type="card"
        items={[status.ACTIVE, status.DELETED].map((_status) => ({
          label: _status,
          key: _status,
          tabKey: _status,
          children: blogStatusBased?.length ? (
            blogStatusBased.map((blog) => (
              <BlogListCard
                key={blog.uuid}
                data={blog}
                pageId={location.pathname.split("/")[1]}
                onConfirmDelete={onConfirmDelete}
              />
            ))
          ) : (
            <Empty />
          ),
        }))}
      />
    </>
  );
};

export default BlogListing;
