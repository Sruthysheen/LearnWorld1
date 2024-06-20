import mongoose ,{Schema,Document,Model,model} from "mongoose";




interface CartItem extends Document {
    course:mongoose.Schema.Types.ObjectId
    student:mongoose.Schema.Types.ObjectId

}

const cartItemSchema = new mongoose.Schema({
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


const CartModel :Model<CartItem>=mongoose.model<CartItem>("cart",cartItemSchema)

export default CartModel