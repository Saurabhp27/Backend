import Post from "../models/Post.js";
import User from "../models/User.js";


export const createPost = async (req, res) => {
    try{
        const {userId, description , picturePath} = req.body;
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // console.log('Received data:', { userId, description, picturePath });

        const newPost = new Post({
            userId,
            firstName : user.firstName,
            lastName : user.lastName,
            location : user.location,
            description,
            userPicturePath : user.picturePath,
            picturePath,
            likes : {},
            comments: []
        })

        await newPost.save();

        const post =  await Post.find();
        res.status(201).json(post);

    }catch(err){
      if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Validation Error', details: err.message });
    }
        res.status(409).json({msg : err.message})
    }
}

export const getFeedPosts = async (req, res) => {
    try{
        const post =  await Post.find();
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({msg : err.message})
    }
}

export const getUserPosts = async (req, res) => {
    try{
        const { userId } = req.params;
        const post =  await Post.find({userId});
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({msg : err.message})
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const isLiked = post.likes.get(userId);
  
      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({details : err.message });
    }
  };