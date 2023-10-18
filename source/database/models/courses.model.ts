import { Schema, model, Model, Types } from 'mongoose';

export interface ICourse {
    name: string;
    topicID: Types.ObjectId | string;
    priceRange: number;
}

const CourseSchema: Schema = new Schema<ICourse>(
    {
        name: { type: String, required: true },
        topicID: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
        priceRange: { type: Number, default: 0 },
    },
    {
        timestamps: true
    }
);

CourseSchema.set('toObject', { virtuals: true });
CourseSchema.set('toJSON', { virtuals: true });

export interface ICourseModel extends Model<ICourse> {
}
const Course = model<ICourse, ICourseModel>("Course", CourseSchema);

export default Course;
/** Aggregation for lookup */
export function topicLookup() {
    const lookup = {
        '$lookup': {
            'from': 'topics',
            'let': { 'topicID': '$topicID', },
            'pipeline': [
                { '$match': { '$expr': { '$eq': ['$_id', '$$topicID'] } } },
                {
                    '$project': {
                        'createdAt': 0,
                        'updatedAt': 0,
                        '__v': 0,
                    }
                },
            ],
            'as': 'topicsRef'
        }
    }

    const unwind_data = {
        '$unwind': {
            'path': '$topicsRef',
            'preserveNullAndEmptyArrays': false
        }
    }

    return { lookup, unwind_data }
}

export function courseSpeakerLookup() {
    const lookup = {
        '$lookup': {
            'from': 'coursespeakers',
            'let': { 'courseID': '$_id' },
            'pipeline': [
                { '$match': { '$expr': { '$eq': ['$courseID', '$$courseID'] } } },
                {
                    '$lookup': {
                        'from': 'speakers',
                        'let': { 'speakerID': '$speakerID' },
                        'pipeline': [
                            { '$match': { '$expr': { '$eq': ['$_id', '$$speakerID'] } } },
                        ],
                        'as': 'speakerRef'
                    }
                },
                {
                    '$unwind': {
                        'path': '$speakerRef',
                        'preserveNullAndEmptyArrays': true
                    }
                }
            ],
            'as': 'courseSpeakersRef'
        }
    };
    const unwind_data = {
        '$unwind': {
            'path': '$courseSpeakersRef',
            'preserveNullAndEmptyArrays': true
        }
    }
    return { lookup, unwind_data }
}

export function addStateLookupInDesignation() {
    const lookup = {
        '$lookup': {
            'from': 'states',
            'let': { 'stateID': '$state' },
            'pipeline': [
                { '$match': { '$expr': { '$eq': ['$_id', '$$stateID'] } } },
            ],
            'as': 'stateRef'
        }
    };
    const unwind_data = {
        '$unwind': {
            'path': '$stateRef',
            'preserveNullAndEmptyArrays': true
        }
    }

    return { lookup, unwind_data }
}


export function addIncidentLookupInDesignation() {
    const lookup = {
        '$lookup': {
            'from': 'incidents',
            'let': { 'operationID': '$_id' },
            'pipeline': [
                { '$match': { '$expr': { '$eq': ['$operation', '$$operationID'] } } },
            ],
            'as': 'incidentRef'
        }
    };
    const unwind_data = {
        '$unwind': {
            'path': '$incidentRef',
            'preserveNullAndEmptyArrays': true
        }
    }

    return { lookup, unwind_data }
}








