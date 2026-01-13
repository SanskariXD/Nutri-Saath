import { createApp } from '../label-backend/src/index';

export default async (req: any, res: any) => {
    const app = await createApp();
    return app(req, res);
};
