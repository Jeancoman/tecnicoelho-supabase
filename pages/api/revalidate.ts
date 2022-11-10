import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const path = req.body?.table === "producto" ? "productos" : "publicaciones";

    console.log(req.body);

    console.log(req.body?.type)

    const pathToRevalidate = `/${path}/${req.body?.record?.id || req.body?.old_record?.id}`;
    await res.revalidate(pathToRevalidate);
    console.log(pathToRevalidate);

    return res.send({ revalidated: true });
};
