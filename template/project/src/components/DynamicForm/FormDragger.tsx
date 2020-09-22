import React, { useState, useEffect } from 'react';
import { Input, Spin, message } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import 'antd/lib/upload/style/index.less'

export interface FormDraggerProps {
  only?: boolean;
  icon?: React.ReactNode;
  text?: string;
  hint?: string;
  initFileList?: any[],
  onChange: (fileList: any[]) => void;
  [key: string]: any;
}

const FormDragger: React.FC<FormDraggerProps> = (props) => {
  const {
    only = true,
    icon,
    text = '将文件拖到此处，或点击上传',
    hint = '只能上传 jpg/png 文件',
    initFileList = [],
    onChange,
    ...otherProps
  } = props

  // 组件是否已经卸载
  let isUnMounted = false
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState(initFileList);

  const draggerProps = {
    name: 'files',
    fileList,
    // listType: 'picture',
    showUploadList: !only,
    action: '/admin/upload/uploadImage',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    },
    onChange: ({ file, fileList }: any) => {
      if (only && fileList.length > 1) {
        fileList = [fileList.pop()];
      }
      fileList = fileList.map((file: any) => {
        if (file.xhr && file.xhr.status === 200) {
          const response = JSON.parse(file.xhr.response);
          file.url = response.data && response.data[0];
        }
        return file;
      });
      !isUnMounted && setFileList(fileList);
      if (file.status === 'uploading' && only) {
        !isUnMounted && setUploading(true);
      }
      if (['done', 'removed'].includes(file.status)) {
        onChange && onChange(fileList);
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
    ...otherProps
  }

  useEffect(() => {
    !isUnMounted && setFileList(initFileList)
    return () => {
      isUnMounted = true
    }
  }, [initFileList])

  return (
    <>
      <Input type="hidden" />
      <Dragger {...draggerProps}>
        <Spin spinning={uploading} tip="上传中...">
        {
          (only && fileList && fileList[0] && fileList[0].url)
          ?
          <img src={fileList[0].url} style={{ width: '100%', objectFit: 'cover' }}></img>
          :
          <>
            <p className="ant-upload-drag-icon">
              {icon ? icon : <InboxOutlined />}
            </p>
            <p className="ant-upload-text">{text}</p>
            <p className="ant-upload-hint">{hint}</p>
          </>
        }
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
  )
}

export default FormDragger;
