import { prisma } from "@database/prisma";

class CollectionController {
    async getAllCollections(req: any, res: any) {
        try {
            const collections = await prisma.collection.findMany({
                where: { userId: Number(req.userId) },
                include: { items: true }
            });

            return res.status(200).json(collections);
        } catch (err) {
            console.log(err);
            
            return res.status(500).json({ status: "Server Error" });
        }
    }

    async createCollection(req: any, res: any) {
        const { name } = req.body;

        try {
            const collection = await prisma.collection.create({
                data: {
                    name,
                    userId: Number(req.userId)
                }
            });

            return res.status(201).json({ status: "Collection Successfuly Created" });
        } catch (err) {
            console.log(err);
            
            return res.status(500).json({ status: "Server Error" });
        }
    }

    async addItem(req: any, res:any) {
        const collectionId = Number(req.params.id);
        const { cardId } = req.body;
        
        try {
            const collection = await prisma.collection.findFirst({
                where: {
                    id: collectionId,
                    userId: Number(req.userId)
                }
            });

            if (collection == null) return res.status(403).json({ status: "Forbidden: Not your collection" });
    
            const existingItem = prisma.collectionItem.findUnique({
                where: {
                    collectionId_cardId: {
                        collectionId,
                        cardId: cardId
                    }
                }
            });

            if (existingItem != null) return res.status(400).json({ status: 'This item is already in this collection.' });

            const item = await prisma.collectionItem.create({
                data: {
                    collectionId,
                    cardId
                }
            });


            return res.status(201).json({ status: "Item Added Successfully" });
        } catch (err) {
            console.log(err);
            
            return res.status(500).json({ status: "Server Error" });
        }
    }

    async getAllItems(req: any, res: any) {
        try {
            const userCollections = await prisma.collection.findMany({
                where: { userId: Number(req.userId) },
                select: { id: true }
            });

            const collectionsIds = userCollections.map(c => c.id);
            const items = await prisma.collectionItem.findMany({
                where: {
                    collectionId: { in: collectionsIds }
                },
                include: { collection: true }
            });

            return res.status(200).json(items);
        } catch (err) {
            console.log(err);
            
            return res.status(err).json({ status: "Server Error" });
        }
    }

    async getCollection(req: any, res: any) {
        const collectionId = Number(req.params.id);
        
        try {
            const collection = await prisma.collection.findFirst({
                where: {
                    id: collectionId,
                    userId: Number(req.userId)
                },
                include: { items: true }
            });

            if (collection == null) return res.status(403).json({ status: "Forbidden: Not your collection" });

            return res.status(200).json(collection);
        } catch (err) {
            console.log(err);
            
            return res.status(500).json({ status: "Server Error" });
        }
    }
}

export default CollectionController;