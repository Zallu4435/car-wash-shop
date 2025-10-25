import { authHandlers } from './auth';
import { serviceHandlers } from './services';
import { vehicleHandlers } from './vehicles';
import { couponHandlers } from './coupons';
import { bannerHandlers } from './banners';

export const handlers = [
  ...authHandlers,
  ...serviceHandlers,
  ...vehicleHandlers,
  ...couponHandlers,
  ...bannerHandlers,
];
