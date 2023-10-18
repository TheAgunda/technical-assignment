import { Schema, model, Model, Types } from 'mongoose';

export interface ITopic {
    name: string;

}

const TopicSchema: Schema = new Schema<ITopic>(
    {
        name: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

TopicSchema.set('toObject', { virtuals: true });
TopicSchema.set('toJSON', { virtuals: true });

export interface ITopicModel extends Model<ITopic> {
}
const Topic = model<ITopic, ITopicModel>("Topic", TopicSchema);

export default Topic;









