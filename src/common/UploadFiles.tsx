import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, message, Image, Button } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { imageTypes } from "../utils/constants";
import { firebaseService } from "../firebase/firebaseService";
import ImgCrop from "antd-img-crop";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface UploadFileProps {
  onFileChange: (file: File) => void;
  uploadedFile?: IUploadedBlogthumbnail;
  showCropper?: boolean;
  afterImageClear: () => Promise<void>;
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadFiles: React.FC<UploadFileProps> = ({
  onFileChange,
  uploadedFile,
  showCropper = false,
  afterImageClear,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const updatedFile = newFileList;
    if (updatedFile && updatedFile.length) {
      updatedFile[0].status = "done";
    }

    setFileList(updatedFile);
    onFileChange(updatedFile[0].originFileObj as File);
  };

  const deleteFile = async () => {
    if (uploadedFile) {
      await firebaseService.deleteUploadedFile(uploadedFile.name);
      await afterImageClear();
    }
  };

  const validateImage = (file: File) => {
    if (file && !imageTypes.array.includes(file.type)) {
      message.error("Invalid file type!");
      return false;
    } else if (file.size > 500 * 1024) {
      message.error("File size should not exceed 500KB");
      return Upload.LIST_IGNORE;
    } else {
      return true;
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      {uploadedFile && uploadedFile.url ? (
        <>
          <Image src={uploadedFile.url} alt={uploadedFile.name} />
          <Button
            type="primary"
            size="small"
            className="mt-2 w-full !bg-red-500 hover:!bg-red-600"
            onClick={deleteFile}
          >
            Delete
          </Button>
        </>
      ) : showCropper ? (
        <ImgCrop aspect={2 / 1}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            accept={imageTypes.string}
            beforeUpload={validateImage}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      ) : (
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          accept={imageTypes.string}
          beforeUpload={validateImage}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      )}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadFiles;
