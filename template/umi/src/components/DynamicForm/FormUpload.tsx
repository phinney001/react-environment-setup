import React, { useState, useEffect } from 'react';
import { Upload, Modal, Button } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import request from '@/utils/request';
import { getToken } from '@/access';

export interface FormUploadProps {
  limit?: number;
  onInit?: (cb: (list: any[]) => void) => void;
  onChange?: (values: any[]) => void;
  [key: string]: any;
}

const FormUpload: React.FC<FormUploadProps> = (props) => {
  const { limit = Infinity, onInit, onChange, ...otherProps } = props;

  // 组件是否已经卸载
  let isUnMounted = false;
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [files, setFiles] = useState<any[]>([]);

  const uploadProps: any = {
    name: 'file',
    fileList: files,
    listType: 'picture-card',
    action: `${request.baseUrl}/oss/upload-picture`,
    headers: {
      Authorization: getToken(),
    },
    onChange: ({ file, fileList }: any) => {
      fileList = fileList.map((fe: any) => {
        if (fe.xhr && fe.xhr.status === 200) {
          const response = JSON.parse(fe.xhr.response);
          fe.url = response.data;
        }
        return fe;
      });
      !isUnMounted && setFiles(fileList);
      if (['done', 'removed'].includes(file.status)) {
        onChange?.(fileList);
      }
    },
    onPreview: async (file: any) => {
      if (!file.url && !file.preview) {
        const preview = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
        if (typeof preview === 'string') {
          file.preview = preview;
        }
      }
      if (!isUnMounted) {
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
      }
    },
    ...otherProps,
  };

  useEffect(() => {
    onInit?.((initFileList: any[]) => {
      !isUnMounted && setFiles(initFileList || []);
    });

    return () => {
      isUnMounted = true;
    };
  }, [onInit]);

  const uploadButton =
    uploadProps?.listType === 'text' ? (
      <Button>
        <UploadOutlined /> {uploadProps?.btnText || '上传'}
      </Button>
    ) : (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">{uploadProps?.btnText || '上传'}</div>
      </div>
    );
  return (
    <div className="clearfix">
      <Upload {...uploadProps}>{files.length >= limit ? null : uploadButton}</Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => !isUnMounted && setPreviewVisible(false)}
      >
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default FormUpload;
