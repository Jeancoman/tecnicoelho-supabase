import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {

    await res.revalidate("/galeria");

    return res.send({ revalidated: true });
};