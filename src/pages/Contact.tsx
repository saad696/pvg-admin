import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataTable, PageTitle } from "..";
import { LoadingContext } from "../context/LoadingContext";
import { firebaseService } from "../firebase/firebaseService";

const tableColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    key: "mobile",
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
  },
  {
    title: "Query",
    dataIndex: "query",
    key: "query",
  },
  {
    title: "Recieved At",
    dataIndex: "timestamp",
    key: "timestamp",
  },
];

const Contact = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[1];
  const { loading, setLoading } = useContext(LoadingContext);

  const [lastDoc, setLastDoc] = useState(null);

  const fetchData = async (
    page: number,
    pageSize: number,
  ) => {
    const result = await firebaseService.getContactDetails(
      id,
      setLoading,
      page,
      pageSize,
      lastDoc
    );
    if (result) {
      setLastDoc(result.lastDoc);
      return result.contacts;
    } else {
      // Handle the case when result is undefined
      // For example, you might want to return an empty array
      return [];
    }
  };

  return (
    <>
      <PageTitle title={`${id} - Contact Details`} />

      <DataTable fetchData={fetchData} columns={tableColumns} searchableColumns={['name']} />
    </>
  );
};

export default Contact;
