import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const pathToRevalidate = `/${req.body?.type === "producto" ? "products" : "blog"}/${req.body?.record?.id || req.body?.old_record?.id}`;
    await res.revalidate(pathToRevalidate);
    console.log(pathToRevalidate);

    return res.send({ revalidated: true });
};
