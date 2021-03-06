import { Request, Response } from 'express';

const getNotices = (req: Request, res: Response) => {
  res.json({
    data: [
      // {
      //   id: '000000003',
      //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
      //   title: '这种模板可以区分多种通知类型',
      //   datetime: '2017-08-07',
      //   read: true,
      //   type: 'notification',
      // },
      // {
      //   id: '000000006',
      //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
      //   title: '曲丽丽 评论了你',
      //   description: '描述信息描述信息描述信息',
      //   datetime: '2017-08-07',
      //   type: 'message',
      //   clickClose: true,
      // },
      // {
      //   id: '000000009',
      //   title: '任务名称',
      //   description: '任务需要在 2017-01-12 20:00 前启动',
      //   extra: '未开始',
      //   status: 'todo',
      //   type: 'event',
      // },
    ],
  });
};

export default {
  'GET /api/notices': getNotices,
};
