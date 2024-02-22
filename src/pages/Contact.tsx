import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataTable, PageTitle } from "..";
import { LoadingContext } from "../context/LoadingContext";
import { firebaseService } from "../firebase/firebaseService";
import moment from "moment";
import { dateTimeFormats } from "../utils/constants";
import { Typography } from "antd";
import { Timestamp } from "firebase/firestore";

const tableColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
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
    hidden: true,
  },
  {
    title: "Query",
    dataIndex: "query",
    key: "query",
    hidden: true,
  },
  {
    title: "Recieved At",
    dataIndex: "timestamp",
    key: "timestamp",
    // render: (text: Timestamp) =>
    //   moment(text.toDate()).format(dateTimeFormats.default),
  },
];

const Contact = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[1];
  const { loading, setLoading } = useContext(LoadingContext);

  const [lastDoc, setLastDoc] = useState(null);

  const fetchData = async (page: number, pageSize: number) => {
    const result = await firebaseService.getContactDetails(
      id,
      setLoading,
      page,
      pageSize,
      lastDoc
    );
    if (result) {
      const updatedData = result.contacts.map((x) => ({
        ...x,
        timestamp: moment((x.timestamp as Timestamp).toDate()).format(
          dateTimeFormats.default
        ),
      }));

      setLastDoc(result.lastDoc);
      return updatedData;
    } else {
      // Handle the case when result is undefined
      // For example, you might want to return an empty array
      return [];
    }
  };

  return (
    <>
      <PageTitle title={`${id} - Contact Details`} />

      <DataTable
        fetchData={fetchData}
        columns={tableColumns}
        searchableColumns={["name"]}
        expandableOptions={{
          expandedRowRender: (record) => (
            <div className="space-y-4">
              <Typography.Text>
                <b className="block">Subject: </b>
                {record.subject}
              </Typography.Text>
              <Typography.Paragraph className="w-[600px]">
                <b className="block">Query: </b>
                {record.query}
              </Typography.Paragraph>
            </div>
          ),
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
        exportOptions={{ show: true, file_name: `${id}-contacts` }}
      />
    </>
  );
};

export default Contact;
