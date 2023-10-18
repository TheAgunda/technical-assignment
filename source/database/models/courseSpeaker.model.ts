import { Schema, model, Model, Types } from 'mongoose';

export interface ICourseSpeaker {
    courseID: Types.ObjectId | string;
    speakerID: Types.ObjectId | string;
}

const CourseSpeakerSchema: Schema = new Schema<ICourseSpeaker>(
    {
        courseID: { type: Schema.Types.ObjectId, ref: "Course", required: true  },
        speakerID: { type: Schema.Types.ObjectId, ref: "Speaker", required: true  },
    },
    {
        timestamps: true
    }
);

CourseSpeakerSchema.set('toObject', { virtuals: true });
CourseSpeakerSchema.set('toJSON', { virtuals: true });

export interface ICourseSpeakerModel extends Model<ICourseSpeaker> {
}
const CourseSpeaker = model<ICourseSpeaker, ICourseSpeakerModel>("CourseSpeaker", CourseSpeakerSchema);

export default CourseSpeaker;






