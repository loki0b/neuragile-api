import { prisma } from "../database/prisma.js";

class CardController {
    async cards(req: any, res: any, next: any) {
        try {
            const items = await prisma.collectionItem.findMany({
                where: {
                    collection: {
                        userId: req.userId
                    }
                },
                include: {
                    collection: true
                }
            });

            res.status(200).json(items);
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: err});
        }
    }
}

export default CardController;