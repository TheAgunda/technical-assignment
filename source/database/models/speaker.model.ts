import { Schema, model, Model, Types } from 'mongoose';

export interface ISpeaker {
    name: string;
}

const SpeakerSchema: Schema = new Schema<ISpeaker>(
    {
        name: { type: String, required: true },
    },
    {
        timestamps: true
    }
);
SpeakerSchema.set('toObject', { virtuals: true });
SpeakerSchema.set('toJSON', { virtuals: true });

export interface ISpeakerModel extends Model<ISpeaker> {
}
const Speaker = model<ISpeaker, ISpeakerModel>("Speaker", SpeakerSchema);

export default Speaker;








