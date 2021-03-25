import React, { useState, useEffect } from 'react';
import { Input, Spin, message, Modal, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import 'antd/lib/upload/style/index.less';
import request from '@/utils/request';
import { getToken } from '@/access';

const { Dragger } = Upload

export interface FormDraggerProps {
  only?: boolean;
  icon?: React.ReactNode;
  text?: string;
  hint?: string;
  onInit?: (cb: (list: any[]) => void) => void;
  onChange: (fileList: any[]) => void;
  [key: string]: any;
}

const FormDragger: React.FC<FormDraggerProps> = (props) => {
  const {
    only = true,
    icon,
    text = '将文件拖到此处，或点击上传',
    hint = '只能上传 jpg/png 文件',
    onInit,
    onChange,
    ...otherProps
  } = props;

  // 组件是否已经卸载
  let isUnMounted = false;
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);

  const draggerProps = {
    name: 'file',
    fileList: files,
    // listType: 'picture',
    showUploadList: !only,
    action: `${request.baseUrl}/oss/upload-picture`,
    headers: {
      Authorization: getToken(),
    },
    onChange: ({ file, fileList }: any) => {
      if (only && fileList.length > 1) {
        fileList = [fileList.pop()];
      }
      fileList = fileList.map((fe: any) => {
        if (fe.xhr && fe.xhr.status === 200) {
          const response = JSON.parse(fe.xhr.response);
          fe.url = response.data;
        }
        return fe;
      });
      !isUnMounted && setFiles(fileList);
      if (file.status === 'uploading' && only) {
        !isUnMounted && setUploading(true);
      }
      if (['done', 'removed'].includes(file.status)) {
        onChange?.(fileList);
        if (only) {
          !isUnMounted && setUploading(false);
        }
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
    beforeUpload: (file: any) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 jpg/png 文件！');
      }
      // const isLt5M = file.size / 1024 / 1024 < 5;
      // if (!isLt5M) {
      //   message.error('图片大小不能超过 5MB!');
      // }
      return isJpgOrPng;
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

  return (
    <>
      <Input type="hidden" />
      <Dragger {...draggerProps}>
        <Spin spinning={uploading} tip="上传中...">
          {only && files?.[0]?.url ? (
            <img src={files[0].url} style={{ width: '100%', objectFit: 'cover' }}></img>
          ) : (
              <>
                <p className="ant-upload-drag-icon">{icon ? icon : <InboxOutlined />}</p>
                <p className="ant-upload-text">{text}</p>
                <p className="ant-upload-hint">{hint}</p>
              </>
            )}
        </Spin>
      </Dragger>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => {
          !isUnMounted && setPreviewVisible(false);
        }}
      >
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default FormDragger;
