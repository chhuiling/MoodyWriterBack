/**
 * 
 * Notas:
 * - userId se ha de extraer del id del usuario (de momento pasalo por ruta)
 * - hay muchos campos a rellenar con arrays diferentes, el único obligatorio a rellenar es el de mood
 * - 
 */

const { postsModel } = require("../models");
const uploadToPinata = require("../utils/handleUploadIPFS");

const getAllPosts = async (req, res) => {
    try {
        const id = req.params.id;
        const posts = await postsModel.find({_id: id});
        res.send({ posts });
    } catch (error) {
        console.log("Error getting all posts: ", error);
        res.status(500).send("GET_ALL_POSTS_ERROR");
    }
};

const getOnePost = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postsModel.findById(id);

        if (!post) {
            res.status(404).end(`No post with id ${id}`);
            return;
        }
        res.send(post);
    } catch (error) {
        console.log("Error getting post: ", error);
        res.status(500).send("GET_POST_ERROR");
    }
};

// const createPost = async (req, res) => {
//     try {
//         //const userId = req.params.userId;
//         const { body } = req;
//         const post = await postsModel.create(body);
//         res.send(post);
//     } catch (error) {
//         console.log("Error creating post: ", error);
//         res.status(500).send("CREATE_POST_ERROR");
//     }
// };

const createPost = async (req, res) => {
    try {
        const { body } = req;
        const files = req.files || [];

        const images = await uploadImagesToPinata(files);

        body.images = images;

        const post = await postsModel.create(body);
        res.send(post);
    } catch (error) {
        console.log("Error creating post: ", error);
        res.status(500).send("CREATE_POST_ERROR");
    }
};


const updatePost = async (req, res) => {
    try {
        const id = req.params.id;
        const { body } = req;
        const files = req.files || [];

        const newImages = await uploadImagesToPinata(files);

        body.images = [...body.images, ...newImages];

        const postActualizado = await postsModel.findOneAndUpdate({_id: id}, body, {new: true});
        if (!postActualizado) {
            res.status(404).send("El post a actualizar no existe.");
            return;
        }
        res.send(postActualizado);
    } catch (error) {
        console.log("Error updating post: ", error);
        res.status(500).send("UPDATE_POST_ERROR");
    }
};

const uploadImagesToPinata = async (files)=> {
    const uploadedImages = [];

    for (let file of files) {
        const fileBuffer = file.buffer;
        const fileName = file.originalname;

        const pinataResponse = await uploadToPinata(fileBuffer, fileName);
        const ipfsFile = pinataResponse.IpfsHash;
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;

        uploadedImages.push(ipfs);
    }

    return uploadedImages;
};

module.exports = {
    getAllPosts,
    getOnePost,
    createPost,
    updatePost
}