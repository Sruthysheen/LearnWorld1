import mongoose, { Document, Schema} from 'mongoose';


interface IWallet extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  balance: number;
  transactions: {
    type: 'debit' | 'credit';
    amount: number;
    date: any;
  }[];
  enrollments: {
    courseId: mongoose.Schema.Types.ObjectId;
    date: any;
    refunded: boolean;
  }[];
}

const walletSchema = new Schema<IWallet>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  enrollments: [
    {
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      refunded: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);

export default Wallet;