import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await res.revalidate("/galeria");

    return res.send({ revalidated: true });
};