import React, { useContext, useEffect, useState } from "react";
import { firebaseService } from "../firebase/firebaseService";
import { Empty, Tabs, message } from "antd";
import { LoadingContext } from "../context/LoadingContext";
import { ExperienceCard, PageTitle } from "..";
import { status, tables } from "../utils/constants";

const ExperienceListing = () => {
  const { setLoading } = useContext(LoadingContext);
  const [experienceData, setExperienceData] = useState<IExperience[]>([]);
  const [statusBasedExperienceData, setStatusBasedExperienceData] = useState<
    IExperience[]
  >([]);

  const getExperience = async () => {
    setLoading(true);
    const data: IExperience[] = await firebaseService.getExperience(setLoading);
    setExperienceData(data);
    setStatusBasedExperienceData(
      data.filter((x) => x.status === status.ACTIVE)
    );
  };

  const onTabsChange = (key: string) => {
    setStatusBasedExperienceData(
      experienceData.filter((x) => x.status === key)
    );
  };

  const onConfirmDelete = async (uuid: string) => {
    setLoading(true);
    await firebaseService.deleteExperience(uuid, setLoading);
    await getExperience();
  };

  useEffect(() => {
    getExperience();
  }, []);

  return (
    <>
      <PageTitle title="Portfolio - Experience Listing" />
      <Tabs
        className="w-full"
        defaultActiveKey={status.ACTIVE}
        onChange={onTabsChange}
        type="card"
        items={[status.ACTIVE, status.DELETED].map((_status) => ({
          label: _status,
          key: _status,
          tabKey: _status,
          children:
            statusBasedExperienceData && statusBasedExperienceData.length ? (
              statusBasedExperienceData.map((data) => (
                <ExperienceCard {...data} onConfirmDelete={onConfirmDelete} />
              ))
            ) : (
              <Empty />
            ),
        }))}
      />
    </>
  );
};

export default ExperienceListing;
