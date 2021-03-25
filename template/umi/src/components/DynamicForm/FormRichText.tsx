import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import request from '@/utils/request';

// 媒体自定义组件
const MediaComponent = ({ block, contentState }: any) => {
  const entity = contentState?.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  const emptyHtml = ' ';

  return (
    <div>
      {emptyHtml}
      {type === 'IMAGE' && <img {...data} />}
      {type === 'EMBEDDED_LINK' && <iframe {...data} />}
    </div>
  );
};

/**
 * 编辑器返回props
 * @param content 编辑器内容
 * @param onChange 编辑器变化事件
 */
export interface RichTextProps {
  content?: string;
  onChange?: (value: any) => void;
}

const RichText: React.FC<RichTextProps> = (props) => {
  // 组件是否已经卸载
  let isUnMounted = false;
  // 编辑器state
  const [editorState, setEditorState] = useState<any>(EditorState.createEmpty());

  // 编辑器props
  const editorProps = {
    editorState,
    toolbarClassName: 'toolbarClassName',
    wrapperClassName: 'demo-wrapper',
    editorClassName: 'demo-editor',
    style: {
      height: 300,
    },
    localization: { locale: 'zh' },
    toolbar: {
      image: {
        urlEnabled: true,
        uploadEndabled: true,
        alignmentEndabled: true,
        previewImage: true,
        uploadCallback: (file: any) => {
          return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append('file', file);
            request('/oss/upload-picture', {
              method: 'POST',
              data,
            }).then(
              (res: any) => {
                resolve({
                  data: {
                    link: res,
                  },
                });
              },
              (err: any) => {
                reject(err);
              },
            );
          });
        },
        alt: { present: true, mandatory: false },
      },
    },
    blockRendererFn: (contentBlock: any) => {
      const type = contentBlock?.getType();

      // 媒体类型转换为媒体自定义组件
      if (type === 'atomic') {
        return {
          component: MediaComponent,
          editable: false,
        };
      }
      return null;
    },
    onEditorStateChange: (editorStates: any) => {
      !isUnMounted && setEditorState(editorStates);
      props?.onChange?.(
        encodeURIComponent(draftToHtml(convertToRaw(editorStates.getCurrentContent()))),
      );
    },
  };

  // 内容回填
  useEffect(() => {
    if (props?.content) {
      const contentBlock = htmlToDraft(decodeURIComponent(props?.content));
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      !isUnMounted && setEditorState(EditorState.createWithContent(contentState));
    } else {
      !isUnMounted && setEditorState(EditorState.createEmpty());
    }
  }, [props?.content]);

  // 初始化加载数据
  useEffect(() => {
    return () => {
      isUnMounted = true;
    };
  }, []);
  return <Editor {...editorProps} />;
};

export default RichText;
