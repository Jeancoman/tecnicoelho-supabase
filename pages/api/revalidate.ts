import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const pathToRevalidate = `/${req.body?.record?.id || req.body?.old_record?.id}`;
    await res.revalidate(pathToRevalidate);

    return res.send({ revalidated: true });
};
