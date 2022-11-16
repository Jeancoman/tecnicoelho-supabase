import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await res.revalidate("/");

    const path = req.body?.table === "producto" ? "productos" : "publicaciones";

    if (path === "productos") {
        await res.revalidate("/produtos");
    } else {
        await res.revalidate("/publicaciones");
    }

    const pathToRevalidate = `/${path}/${req.body?.record?.id || req.body?.old_record?.id}`;

    await res.revalidate(pathToRevalidate);

    return res.send({ revalidated: true });
};
