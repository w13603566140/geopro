import { Router, Response } from 'express';

export const paymentRouter = Router();

/**
 * 支付宝支付回调
 */
paymentRouter.post('/alipay/callback', async (req, res: Response) => {
  const { out_trade_no, trade_no, total_amount, trade_status } = req.body;
  console.log(`💰 支付宝回调: 订单${out_trade_no}, 状态${trade_status}`);

  if (trade_status === 'TRADE_SUCCESS') {
    // TODO: 更新订单状态, 增加用户积分
    res.send('success');
  } else {
    res.send('fail');
  }
});

/**
 * 微信支付回调
 */
paymentRouter.post('/wechat/callback', (req, res: Response) => {
  console.log('💚 微信支付回调:', req.body);
  res.json({ code: 'SUCCESS', message: 'OK' });
});

/**
 * 易支付回调
 */
paymentRouter.get('/epay/notify', (req, res: Response) => {
  const { out_trade_no, money, trade_status, sign } = req.query;
  console.log(`🧡 易支付回调: 订单${out_trade_no}, 金额${money}`);
  // TODO: 验签后更新订单
  res.send('success');
});

paymentRouter.post('/epay/notify', (req, res: Response) => {
  const { out_trade_no, money, trade_status } = req.body;
  console.log(`🧡 易支付异步通知: 订单${out_trade_no}`);
  res.send('success');
});
