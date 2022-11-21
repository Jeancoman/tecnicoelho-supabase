import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await res.revalidate("/");

    const path = req.body?.table === "producto" ? "productos" : "publicaciones";

    await res.revalidate(`/${path}`);

    const pathToRevalidate = `/${path}/${req.body?.record?.id || req.body?.old_record?.id}`;

    console.log(pathToRevalidate);
    console.log(path);
    console.log(req.body);

    await res.revalidate(pathToRevalidate);

    return res.send({ revalidated: true });
};
