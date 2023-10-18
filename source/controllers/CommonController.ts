import { Request, Response, NextFunction } from "express";
import Topic from "../database/models/topic.model";
import Course, { courseSpeakerLookup, topicLookup } from "../database/models/courses.model";
import Speaker from "../database/models/speaker.model";
import CourseSpeaker from "../database/models/courseSpeaker.model";
const Topics: string[] = ["Analytics", "Aritificial intellegenc", "Big Data"];
const Courses: string[] = ["Analytics Course", "AI Course", "Big Data Course"];
const Prices: number[] = [200.0, 23.9, 23.0];
const Speakers:string[]=["John Doe", "Kiran Badola", "Mohit"];
/** Function to parseQuery Params and set default value if not set */
export function parseQueryParam(value: any, defaultValue: number): number {
    if (value !== undefined && value !== '' && !isNaN(value)) {
        return parseInt(value);
    }
    return defaultValue;
}
export function isArray(data: any): boolean {

    return Array.isArray(data);
}
export function isString(data: any): boolean {
    if (typeof data === 'string' || data instanceof String) {
        return true;
    } else {
        return false;
    }
}

const index = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const topicCount = await Topic.find({}).count();
        if (!topicCount && topicCount === 0) {
            await Promise.all(Topics.map(async (data, index) => {
                const topic = await Topic.create({ name: data });
                const speaker = await Speaker.create({ name:Speakers[index] });
                const course = await Course.create({
                    name: Courses[index],
                    topicID: topic._id,
                    priceRange: Prices[index]
                });
                const coursesSpeakers = CourseSpeaker.create({
                    courseID: course._id,
                    speakerID: speaker._id
                })
            }))
            console.log("no in db");
        }


        let parsedQuerySet: any = request.query;
        let { query, pageNumber, documentLimit, topicIn }: any = parsedQuerySet;
        pageNumber = parseQueryParam(pageNumber, 1);
        documentLimit = parseQueryParam(documentLimit, 20);
        let search: Object = {};
        if (query != undefined) {
            Object.assign(search, {
                $or: [
                    { name: { $regex: new RegExp(query.toLowerCase(), "i") }, isDeleted: false },
                ]
            })
        }
        if (topicIn !== undefined && topicIn !== "") {
            if (isArray(topicIn)) {
                Object.assign(search, { topicID: { $in: topicIn } })
            }
            if (isString(topicIn)) {
                Object.assign(search, { topicID: { $in: [topicIn] } })
            }
        }
        const coursesCount = await Course.find(search).count()
        const courses = await Course.aggregate(
            [
                { $match: search },
                topicLookup().lookup,
                topicLookup().unwind_data,
                courseSpeakerLookup().lookup,
                courseSpeakerLookup().unwind_data,
                {
                    $sort: { createdAt: -1, id: 1 }
                },
                {
                    $skip: pageNumber > 0 ? ((pageNumber - 1) * documentLimit) : 0
                },
                {
                    $limit: documentLimit
                }
            ]
        );
        const total_pages_count = Math.ceil(coursesCount / documentLimit) || 1;
        return response.send({
            status: true,
            status_code: 200,
            message: "Courses fetched.",
            results: courses,
            page_no: pageNumber,
            total_pages: total_pages_count,
            total_resources: coursesCount,
        })
    } catch (error: any) {
        next();
    }
}


const filters = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const topics = await Topic.aggregate(
            [
                { $match: {} },
                {
                    $sort: { createdAt: -1, id: 1 }
                },
                {
                    $limit: 50
                }
            ]
        );
        return response.send({
            status: true,
            status_code: 200,
            message: "Filters fetched.",
            results: {
                topics
            },
        })
    } catch (error: any) {
        next();
    }
}
export default { index, filters }