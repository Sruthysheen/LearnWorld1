import mongoose ,{Schema,Document,Model,model} from "mongoose";


interface WishListItem extends Document {
    course:mongoose.Schema.Types.ObjectId
    student:mongoose.Schema.Types.ObjectId

}

const wishListItemSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        requied:true
    },
    course:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseModel",
        requied:true

    }
],

})

const WishListModel :Model<WishListItem>=mongoose.model<WishListItem>("wishList",wishListItemSchema)

export default WishListModel