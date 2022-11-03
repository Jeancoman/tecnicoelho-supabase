import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log(req.body)

    const pathToRevalidate = `/${req.body?.record?.id || req.body?.old_record?.id}`;
    await res.revalidate(pathToRevalidate);

    return res.send({ revalidated: true });
};
