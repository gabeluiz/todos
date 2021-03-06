import List from "../../../models/List";
import '../../../utils/dbConnect';
import jwt from 'next-auth/jwt';

const secret = process.env.JWT_SECRET;

export default async (req, res) => {

    const token = await jwt.getToken({ req, secret });

    if (token) {

        const { method } = req

        let data = req.body;

        switch (method) {
            case "GET":
                try {
                    const lists = await List.find({ createdBy: token.sub }).sort({
                        createdAt: "desc",
                    });

                    return res.status(200).json({
                        success: true,
                        data: lists,
                    });
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                    });
                }
            case "POST":
                
                data.createdBy = token.sub;
                
                try {
                    const lists = await List.create(data);

                    return res.status(201).json({
                        success: true,
                        data: lists,
                    });
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                    });
                }
            default:
                res.setHeaders("Allow", ["GET", "POST"]);
                return res
                    .status(405)
                    .json({ success: false })
                    .end(`Method ${method} Not Allowed`);
        }

        // let db = await connectToDatabase();

        // let data = req.body;

        // switch (method) {
        //     case 'GET':
        //         try {

        //             const lists = await db.collection('lists').find({created_by_id:token.sub}).toArray();

        //             res.status(200).json({
        //                 success: true,
        //                 data: lists
        //             })
        //         } catch (error) {
        //             res.status(400).json({
        //                 success: false
        //             })
        //         }
        //         break
        //     case 'POST':

        //         data = JSON.parse(data);
        //         if (!data._id) {
        //             data.dt_created = new Date();
        //             data.created_by = token.name;
        //             data.created_by_id = token.sub;
        //             data._id = new ObjectID();
        //         } else {
        //             data._id = ObjectID(data._id);
        //             data.dt_altereted = new Date();
        //             data.altereted_by = token.name;
        //             data.altereted_by_id = token.sub;
        //         }

        //         let doc = await db
        //             .collection("lists")
        //             .updateOne({
        //                 _id: data._id
        //             }, {
        //                 $set: data
        //             }, {
        //                 upsert: true
        //             });

        //         res.json({
        //             message: "ok"
        //         });

        //         break
        //     case 'DELETE':
        //         let id = req.body;
        //         id = JSON.parse(id);

        //         let del = await db.collection('lists').deleteOne({ _id: new ObjectID(id) });
        //         res.json({
        //             message: "ok"
        //         });
        //         break
        //     default:
        //         res.status(400).json({
        //             success: false
        //         })
        //         break
        // }

    } else {
        return res.status(401).json({
            message: 'Unauthorized, please login first.'
        });
    }

}